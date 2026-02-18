import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  CheckCircle2,
  ArrowRight,
  Loader2,
  PartyPopper,
  Sparkles,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getCheckoutSession } from "@/lib/stripeService";

interface SessionDetails {
  customer_email: string;
  payment_status: string;
  subscription_id: string;
  amount_total: number;
  currency: string;
}

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [sessionDetails, setSessionDetails] = useState<SessionDetails | null>(
    null,
  );
  const [loading, setLoading] = useState(!!sessionId);

  useEffect(() => {
    if (sessionId) {
      getCheckoutSession(sessionId)
        .then(setSessionDetails)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [sessionId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50/30 to-teal-50/20 flex items-center justify-center p-4">
      {/* Decorative elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-green-200/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-emerald-200/30 rounded-full blur-3xl" />
      </div>

      <Card className="relative max-w-lg w-full p-8 md:p-12 text-center border-2 border-green-200/60 shadow-xl shadow-green-100/50 overflow-hidden">
        {/* Background shimmer */}
        <div className="absolute inset-0 bg-gradient-to-b from-green-50/50 to-transparent pointer-events-none" />

        <div className="relative z-10">
          {loading ? (
            <div className="flex flex-col items-center gap-4 py-8">
              <Loader2 className="w-12 h-12 text-green-500 animate-spin" />
              <p className="text-muted-foreground">Confirming your payment…</p>
            </div>
          ) : (
            <>
              {/* Success icon */}
              <div className="relative mx-auto w-20 h-20 mb-6">
                <div className="absolute inset-0 bg-green-400/20 rounded-full animate-ping" />
                <div className="relative w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-green-400/30">
                  <CheckCircle2
                    className="w-10 h-10 text-white"
                    strokeWidth={2.5}
                  />
                </div>
              </div>

              {/* Celebration emoji */}
              <div className="flex items-center justify-center gap-2 mb-4">
                <PartyPopper className="w-6 h-6 text-amber-500" />
                <Sparkles className="w-5 h-5 text-violet-500" />
              </div>

              <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-green-700 to-emerald-700 bg-clip-text text-transparent">
                Payment Successful!
              </h1>

              <p className="text-muted-foreground mb-6 leading-relaxed">
                Welcome to your premium learning experience! Your subscription
                is now active and you have full access to all features.
              </p>

              {/* Session details */}
              {sessionDetails && (
                <div className="bg-green-50/80 border border-green-200/50 rounded-xl p-4 mb-6 text-left space-y-2">
                  {sessionDetails.customer_email && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Email</span>
                      <span className="font-medium">
                        {sessionDetails.customer_email}
                      </span>
                    </div>
                  )}
                  {sessionDetails.amount_total != null && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Amount</span>
                      <span className="font-medium">
                        ৳{(sessionDetails.amount_total / 100).toFixed(0)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Status</span>
                    <span className="font-medium text-green-600 capitalize">
                      {sessionDetails.payment_status || "Paid"}
                    </span>
                  </div>
                </div>
              )}

              {/* CTA */}
              <div className="flex flex-col gap-3">
                <Button
                  size="lg"
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg shadow-green-500/25 gap-2"
                  onClick={() => navigate("/dashboard")}
                >
                  Go to Dashboard
                  <ArrowRight className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground"
                  onClick={() => navigate("/lessons")}
                >
                  Start Learning Now
                </Button>
              </div>
            </>
          )}
        </div>
      </Card>
    </div>
  );
};

export default PaymentSuccess;
