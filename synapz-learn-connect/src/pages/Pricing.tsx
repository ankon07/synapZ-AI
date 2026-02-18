import { useState } from "react";
import { Check, Sparkles, Star, Zap, ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import {
  PRICING_PLANS,
  PricingPlan,
  redirectToCheckout,
} from "@/lib/stripeService";

const planIcons: Record<string, React.ReactNode> = {
  free: <Star className="w-6 h-6" />,
  pro: <Zap className="w-6 h-6" />,
  premium: <Sparkles className="w-6 h-6" />,
};

const planGradients: Record<string, string> = {
  free: "from-slate-500/10 to-slate-600/5",
  pro: "from-violet-500/15 to-indigo-500/10",
  premium: "from-amber-500/15 to-orange-500/10",
};

const planBorderColors: Record<string, string> = {
  free: "border-slate-200/50",
  pro: "border-violet-400/60 shadow-violet-500/20 shadow-lg",
  premium: "border-amber-400/50",
};

const planButtonStyles: Record<string, string> = {
  free: "bg-slate-600 hover:bg-slate-700 text-white",
  pro: "bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-lg shadow-violet-500/25",
  premium:
    "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg shadow-amber-500/25",
};

const planIconBg: Record<string, string> = {
  free: "bg-slate-100 text-slate-600",
  pro: "bg-violet-100 text-violet-600",
  premium: "bg-amber-100 text-amber-600",
};

const Pricing = () => {
  const navigate = useNavigate();

  const handleSelectPlan = (plan: PricingPlan) => {
    if (plan.id === "free") {
      navigate("/dashboard");
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

    redirectToCheckout(plan.paymentLink);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50/30">
      {/* Decorative background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-violet-200/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-12">
        {/* Back button */}
        <Button
          variant="ghost"
          className="mb-8 gap-2 text-muted-foreground hover:text-foreground"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>

        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-violet-100/80 text-violet-700 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            Choose Your Learning Plan
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 bg-gradient-to-r from-slate-900 via-violet-900 to-slate-900 bg-clip-text text-transparent">
            Unlock Your Full Potential
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Start free and upgrade when you're ready. Every plan includes
            accessible learning tools designed for learners with disabilities.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-start">
          {PRICING_PLANS.map((plan) => (
            <Card
              key={plan.id}
              className={`
                relative overflow-hidden border-2 transition-all duration-300
                hover:scale-[1.02] hover:-translate-y-1
                ${planBorderColors[plan.id]}
                ${plan.highlighted ? "md:-mt-4 md:mb-0" : ""}
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
                      rounded-none rounded-bl-lg px-3 py-1 text-xs font-semibold
                      ${
                        plan.id === "pro"
                          ? "bg-violet-600 text-white hover:bg-violet-600"
                          : "bg-amber-500 text-white hover:bg-amber-500"
                      }
                    `}
                  >
                    {plan.badge}
                  </Badge>
                </div>
              )}

              <div className="relative p-6 lg:p-8">
                {/* Plan icon & name */}
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center ${planIconBg[plan.id]}`}
                  >
                    {planIcons[plan.id]}
                  </div>
                  <h3 className="text-xl font-bold">{plan.name}</h3>
                </div>

                {/* Price */}
                <div className="mb-2">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold tracking-tight">
                      {plan.currency}
                      {plan.price}
                    </span>
                    {plan.price > 0 && (
                      <span className="text-muted-foreground text-sm">
                        /{plan.interval}
                      </span>
                    )}
                  </div>
                  {plan.price === 0 && (
                    <span className="text-sm text-muted-foreground">
                      Forever free
                    </span>
                  )}
                </div>

                <p className="text-sm text-muted-foreground mb-6">
                  {plan.description}
                </p>

                {/* CTA Button */}
                <Button
                  className={`w-full mb-6 h-11 font-semibold ${planButtonStyles[plan.id]}`}
                  onClick={() => handleSelectPlan(plan)}
                >
                  {plan.price === 0
                    ? "Get Started Free"
                    : `Subscribe to ${plan.name}`}
                </Button>

                {/* Features */}
                <ul className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div
                        className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                          plan.id === "pro"
                            ? "bg-violet-100 text-violet-600"
                            : plan.id === "premium"
                              ? "bg-amber-100 text-amber-600"
                              : "bg-green-100 text-green-600"
                        }`}
                      >
                        <Check className="w-3 h-3" strokeWidth={3} />
                      </div>
                      <span className="text-sm text-foreground/80">
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
        <div className="mt-16 text-center">
          <div className="inline-flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-green-500" /> Cancel anytime
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-green-500" /> Secure payments via
              Stripe
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-green-500" /> No hidden fees
            </span>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            All payments are securely processed by Stripe. Your card details
            never touch our servers.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
