import { useEffect } from "react";
import { Check, Sparkles, Star, Zap, ArrowLeft, Crown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import {
  PRICING_PLANS,
  PricingPlan,
  redirectToCheckout,
} from "@/lib/stripeService";
import { updateUserPlan } from "@/lib/firebase";

const planIcons: Record<string, React.ReactNode> = {
  free: <Star className="w-5 h-5 sm:w-6 sm:h-6" />,
  pro: <Zap className="w-5 h-5 sm:w-6 sm:h-6" />,
  premium: <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />,
  master: <Crown className="w-5 h-5 sm:w-6 sm:h-6" />,
};

const planGradients: Record<string, string> = {
  free: "from-slate-500/10 to-slate-600/5",
  pro: "from-violet-500/15 to-indigo-500/10",
  premium: "from-amber-500/15 to-orange-500/10",
  master: "from-rose-500/15 to-pink-500/10",
};

const planBorderColors: Record<string, string> = {
  free: "border-slate-200/50",
  pro: "border-violet-400/60 shadow-violet-500/20 shadow-lg",
  premium: "border-amber-400/50",
  master: "border-rose-400/60 shadow-rose-500/20 shadow-lg",
};

const planButtonStyles: Record<string, string> = {
  free: "bg-slate-600 hover:bg-slate-700 text-white",
  pro: "bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-lg shadow-violet-500/25",
  premium:
    "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg shadow-amber-500/25",
  master:
    "bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white shadow-lg shadow-rose-500/25",
};

const planIconBg: Record<string, string> = {
  free: "bg-slate-100 text-slate-600",
  pro: "bg-violet-100 text-violet-600",
  premium: "bg-amber-100 text-amber-600",
  master: "bg-rose-100 text-rose-600",
};

const planCheckBg: Record<string, string> = {
  free: "bg-green-100 text-green-600",
  pro: "bg-violet-100 text-violet-600",
  premium: "bg-amber-100 text-amber-600",
  master: "bg-rose-100 text-rose-600",
};

const planBadgeStyles: Record<string, string> = {
  pro: "bg-violet-600 text-white hover:bg-violet-600",
  premium: "bg-amber-500 text-white hover:bg-amber-500",
  master:
    "bg-gradient-to-r from-rose-600 to-pink-600 text-white hover:from-rose-600 hover:to-pink-600",
};

const Pricing = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const checkoutPlan = searchParams.get("checkout");
  const { user, setSelectedPlan } = useAuth();

  // Auto-redirect to payment if user came back after auth with a plan selected
  useEffect(() => {
    if (checkoutPlan && user) {
      const plan = PRICING_PLANS.find((p) => p.id === checkoutPlan);
      if (plan?.paymentLink) {
        // Save plan selection to Firebase
        updateUserPlan(user.uid, plan.id).catch(console.error);
        setSelectedPlan(plan.id);
        redirectToCheckout(plan.paymentLink);
      }
    }
  }, [checkoutPlan, user, setSelectedPlan]);

  const handleSelectPlan = (plan: PricingPlan) => {
    if (plan.id === "free") {
      if (user) {
        // Logged in — go to dashboard
        updateUserPlan(user.uid, "free").catch(console.error);
        navigate("/dashboard");
      } else {
        // Not logged in — go to register
        navigate("/register");
      }
      return;
    }

    if (!plan.paymentLink) {
      toast({
        title: "Not Available",
        description: "This plan is not yet configured.",
        variant: "destructive",
      });
      return;
    }

    // Save selected plan
    setSelectedPlan(plan.id);

    if (!user) {
      // Not logged in → go to register/login first, then come back
      navigate(`/login?plan=${plan.id}`);
      return;
    }

    // Logged in → go directly to Stripe payment
    updateUserPlan(user.uid, plan.id).catch(console.error);
    redirectToCheckout(plan.paymentLink);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50/30">
      {/* Decorative background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-64 sm:w-96 h-64 sm:h-96 bg-violet-200/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-64 sm:w-96 h-64 sm:h-96 bg-amber-200/20 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-48 sm:w-72 h-48 sm:h-72 bg-rose-200/15 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8 sm:py-12">
        {/* Back button — only show if user is logged in (i.e., not landing page) */}
        {user && (
          <Button
            variant="ghost"
            className="mb-6 sm:mb-8 gap-2 text-muted-foreground hover:text-foreground"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        )}

        {/* Header */}
        <div className="text-center mb-10 sm:mb-16">
          {/* Brand */}
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">
            SynapZ{" "}
            <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
              AI
            </span>
          </h2>
          <div className="inline-flex items-center gap-2 bg-violet-100/80 text-violet-700 px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6">
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            Choose Your Learning Plan
          </div>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-3 sm:mb-4 bg-gradient-to-r from-slate-900 via-violet-900 to-slate-900 bg-clip-text text-transparent">
            Unlock Your Full Potential
          </h1>
          <p className="text-sm sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed px-2">
            Start free and upgrade when you're ready. Every plan includes
            accessible learning tools designed for learners with disabilities.
          </p>
        </div>

        {/* Pricing Cards — responsive grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 items-start">
          {PRICING_PLANS.map((plan) => (
            <Card
              key={plan.id}
              className={`
                relative overflow-hidden border-2 transition-all duration-300
                hover:scale-[1.02] hover:-translate-y-1
                ${planBorderColors[plan.id]}
                ${plan.highlighted ? "sm:-mt-2 lg:-mt-3" : ""}
              `}
            >
              {/* Background gradient */}
              <div
                className={`absolute inset-0 bg-gradient-to-b ${planGradients[plan.id]} pointer-events-none`}
              />

              {/* Badge */}
              {plan.badge && (
                <div className="absolute top-0 right-0">
                  <Badge
                    className={`
                      rounded-none rounded-bl-lg px-2.5 sm:px-3 py-1 text-[10px] sm:text-xs font-semibold
                      ${planBadgeStyles[plan.id] || "bg-slate-600 text-white"}
                    `}
                  >
                    {plan.badge}
                  </Badge>
                </div>
              )}

              <div className="relative p-4 sm:p-5 lg:p-6">
                {/* Plan icon & name */}
                <div className="flex items-center gap-2.5 sm:gap-3 mb-3 sm:mb-4">
                  <div
                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center ${planIconBg[plan.id]}`}
                  >
                    {planIcons[plan.id]}
                  </div>
                  <h3 className="text-base sm:text-lg font-bold">
                    {plan.name}
                  </h3>
                </div>

                {/* Price */}
                <div className="mb-2">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                      {plan.currency}
                      {plan.price}
                    </span>
                    {plan.price > 0 && (
                      <span className="text-muted-foreground text-xs sm:text-sm">
                        /{plan.interval}
                      </span>
                    )}
                  </div>
                  {plan.price === 0 && (
                    <span className="text-xs sm:text-sm text-muted-foreground">
                      Forever free
                    </span>
                  )}
                </div>

                <p className="text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-5">
                  {plan.description}
                </p>

                {/* CTA Button */}
                <Button
                  className={`w-full mb-4 sm:mb-5 h-9 sm:h-10 font-semibold text-xs sm:text-sm ${planButtonStyles[plan.id]}`}
                  onClick={() => handleSelectPlan(plan)}
                >
                  {plan.price === 0
                    ? "Get Started Free"
                    : `Subscribe to ${plan.name}`}
                </Button>

                {/* Features */}
                <ul className="space-y-2 sm:space-y-2.5">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <div
                        className={`mt-0.5 w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${planCheckBg[plan.id]}`}
                      >
                        <Check className="w-2.5 h-2.5" strokeWidth={3} />
                      </div>
                      <span className="text-[11px] sm:text-xs text-foreground/80 leading-relaxed">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          ))}
        </div>

        {/* Trust badges */}
        <div className="mt-10 sm:mt-16 text-center">
          <div className="inline-flex flex-wrap justify-center gap-x-4 sm:gap-x-6 gap-y-2 text-xs sm:text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500" />{" "}
              Cancel anytime
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500" />{" "}
              Secure payments
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500" /> No
              hidden fees
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500" />{" "}
              Money-back guarantee
            </span>
          </div>
          <p className="mt-3 sm:mt-4 text-[10px] sm:text-xs text-muted-foreground px-4">
            All payments are securely processed by Stripe. Your card details
            never touch our servers.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
