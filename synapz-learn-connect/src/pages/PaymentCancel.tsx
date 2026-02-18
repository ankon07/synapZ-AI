import { useNavigate } from "react-router-dom";
import { XCircle, ArrowLeft, CreditCard } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const PaymentCancel = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-rose-50/20 to-slate-50 flex items-center justify-center p-4">
      {/* Decorative elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-rose-200/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-slate-200/30 rounded-full blur-3xl" />
      </div>

      <Card className="relative max-w-lg w-full p-8 md:p-12 text-center border-2 border-slate-200/60 shadow-xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-rose-50/30 to-transparent pointer-events-none" />

        <div className="relative z-10">
          {/* Cancel icon */}
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-slate-300 to-slate-400 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-slate-300/30">
            <XCircle className="w-10 h-10 text-white" strokeWidth={2} />
          </div>

          <h1 className="text-3xl font-bold mb-2 text-slate-800">
            Payment Cancelled
          </h1>

          <p className="text-muted-foreground mb-8 leading-relaxed">
            No worries! Your payment was not processed and you were not charged.
            You can continue using the free plan or try again whenever you're
            ready.
          </p>

          <div className="flex flex-col gap-3">
            <Button
              size="lg"
              className="w-full gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-lg shadow-violet-500/25"
              onClick={() => navigate("/pricing")}
            >
              <CreditCard className="w-4 h-4" />
              View Plans Again
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full gap-2"
              onClick={() => navigate("/dashboard")}
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Button>
          </div>

          <p className="mt-6 text-xs text-muted-foreground">
            Need help? Contact us at support@synapz.ai
          </p>
        </div>
      </Card>
    </div>
  );
};

export default PaymentCancel;
