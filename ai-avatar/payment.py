"""
Stripe Payment Gateway Integration for SYNAPZ AI
Handles checkout sessions, webhooks, and subscription status
"""

from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
import stripe
import os
import logging

logger = logging.getLogger(__name__)

router = APIRouter()

# Initialize Stripe with secret key
stripe.api_key = os.environ.get("STRIPE_SECRET_KEY")
STRIPE_WEBHOOK_SECRET = os.environ.get("STRIPE_WEBHOOK_SECRET")
FRONTEND_URL = os.environ.get("FRONTEND_URL", "http://localhost:3081")

# Price IDs from Stripe Dashboard
PRICE_IDS = {
    "pro": os.environ.get("STRIPE_PRICE_ID_PRO"),
    "premium": os.environ.get("STRIPE_PRICE_ID_PREMIUM"),
}


class CheckoutRequest(BaseModel):
    price_id: str
    user_email: str | None = None


class SubscriptionStatusRequest(BaseModel):
    email: str


@router.post("/api/create-checkout-session")
async def create_checkout_session(request: CheckoutRequest):
    """
    Create a Stripe Checkout Session and return the checkout URL.
    The frontend will redirect the user to this URL.
    """
    try:
        if not stripe.api_key:
            raise HTTPException(
                status_code=500,
                detail="Stripe is not configured. Please set STRIPE_SECRET_KEY."
            )

        # Build checkout session parameters
        session_params = {
            "payment_method_types": ["card"],
            "line_items": [
                {
                    "price": request.price_id,
                    "quantity": 1,
                },
            ],
            "mode": "subscription",
            "success_url": f"{FRONTEND_URL}/payment-success?session_id={{CHECKOUT_SESSION_ID}}",
            "cancel_url": f"{FRONTEND_URL}/payment-cancel",
            "metadata": {
                "platform": "synapz-ai",
            },
        }

        # Add customer email if provided
        if request.user_email:
            session_params["customer_email"] = request.user_email

        session = stripe.checkout.Session.create(**session_params)

        logger.info(f"Checkout session created: {session.id}")
        return {"url": session.url, "session_id": session.id}

    except stripe.error.StripeError as e:
        logger.error(f"Stripe error: {e}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Error creating checkout session: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/api/webhook")
async def stripe_webhook(request: Request):
    """
    Handle Stripe webhook events.
    Verifies the webhook signature and processes relevant events.
    """
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")

    try:
        if STRIPE_WEBHOOK_SECRET:
            event = stripe.Webhook.construct_event(
                payload, sig_header, STRIPE_WEBHOOK_SECRET
            )
        else:
            # In development without webhook secret, parse the event directly
            import json
            event = stripe.Event.construct_from(
                json.loads(payload), stripe.api_key
            )
    except ValueError:
        logger.error("Invalid webhook payload")
        raise HTTPException(status_code=400, detail="Invalid payload")
    except stripe.error.SignatureVerificationError:
        logger.error("Invalid webhook signature")
        raise HTTPException(status_code=400, detail="Invalid signature")

    # Handle the event
    event_type = event["type"]
    logger.info(f"Received Stripe event: {event_type}")

    if event_type == "checkout.session.completed":
        session = event["data"]["object"]
        customer_email = session.get("customer_email") or session.get("customer_details", {}).get("email")
        subscription_id = session.get("subscription")
        logger.info(
            f"Payment successful! Email: {customer_email}, "
            f"Subscription: {subscription_id}"
        )
        # In a production app with a database, you would:
        # 1. Find the user by email
        # 2. Update their subscription status
        # 3. Store the subscription_id for future reference

    elif event_type == "customer.subscription.updated":
        subscription = event["data"]["object"]
        logger.info(f"Subscription updated: {subscription['id']} → {subscription['status']}")

    elif event_type == "customer.subscription.deleted":
        subscription = event["data"]["object"]
        logger.info(f"Subscription cancelled: {subscription['id']}")

    elif event_type == "invoice.payment_failed":
        invoice = event["data"]["object"]
        logger.warning(f"Payment failed for invoice: {invoice['id']}")

    return {"status": "success"}


@router.get("/api/subscription-status")
async def get_subscription_status(email: str):
    """
    Check if a customer has an active subscription by their email.
    Returns the subscription plan details if active.
    """
    try:
        if not stripe.api_key:
            raise HTTPException(
                status_code=500,
                detail="Stripe is not configured."
            )

        # Search for customer by email
        customers = stripe.Customer.list(email=email, limit=1)

        if not customers.data:
            return {
                "has_subscription": False,
                "plan": "free",
                "status": "no_customer",
            }

        customer = customers.data[0]

        # Get active subscriptions for this customer
        subscriptions = stripe.Subscription.list(
            customer=customer.id,
            status="active",
            limit=1,
        )

        if not subscriptions.data:
            return {
                "has_subscription": False,
                "plan": "free",
                "status": "no_active_subscription",
            }

        subscription = subscriptions.data[0]
        price_id = subscription["items"]["data"][0]["price"]["id"]

        # Determine plan name from price ID
        plan = "unknown"
        for plan_name, pid in PRICE_IDS.items():
            if pid == price_id:
                plan = plan_name
                break

        return {
            "has_subscription": True,
            "plan": plan,
            "status": subscription["status"],
            "current_period_end": subscription["current_period_end"],
            "cancel_at_period_end": subscription["cancel_at_period_end"],
        }

    except stripe.error.StripeError as e:
        logger.error(f"Stripe error checking subscription: {e}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Error checking subscription status: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/api/checkout-session/{session_id}")
async def get_checkout_session(session_id: str):
    """
    Retrieve checkout session details (used by success page to show confirmation).
    """
    try:
        session = stripe.checkout.Session.retrieve(
            session_id,
            expand=["subscription", "customer"],
        )
        return {
            "customer_email": session.get("customer_email")
                or session.get("customer_details", {}).get("email"),
            "payment_status": session.get("payment_status"),
            "subscription_id": session.get("subscription", {}).get("id")
                if isinstance(session.get("subscription"), dict) else session.get("subscription"),
            "amount_total": session.get("amount_total"),
            "currency": session.get("currency"),
        }
    except stripe.error.StripeError as e:
        logger.error(f"Error retrieving session: {e}")
        raise HTTPException(status_code=400, detail=str(e))
