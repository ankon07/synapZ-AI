import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/use-toast";
import { registerWithEmail, loginWithGoogle } from "@/lib/firebase";
import { Loader2, Mail, User, Eye, EyeOff } from "lucide-react";

const Register = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/dashboard";
  const planFromUrl = searchParams.get("plan");

  const { setSelectedPlan } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "learner" as "learner" | "parent",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handlePostAuth = () => {
    const plan = planFromUrl || localStorage.getItem("selectedPlan");
    if (plan && plan !== "free") {
      navigate("/pricing?checkout=" + plan);
    } else {
      navigate(redirectTo);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure both passwords are the same.",
        variant: "destructive",
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      await registerWithEmail(formData.email, formData.password, formData.name);
      toast({
        title: "Account created!",
        description: "Welcome to SynapZ AI.",
      });
      handlePostAuth();
    } catch (error: any) {
      const message =
        error.code === "auth/email-already-in-use"
          ? "An account with this email already exists"
          : error.code === "auth/weak-password"
            ? "Password is too weak. Use at least 6 characters."
            : "Registration failed. Please try again.";
      toast({
        title: "Registration Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setGoogleLoading(true);
    try {
      await loginWithGoogle();
      toast({ title: "Welcome!", description: "Signed in with Google." });
      handlePostAuth();
    } catch (error: any) {
      if (error.code !== "auth/popup-closed-by-user") {
        toast({
          title: "Google Sign-In Failed",
          description: "Could not sign in with Google. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-violet-50/30 to-slate-50 p-4">
      {/* Decorative blurs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -right-32 w-80 h-80 bg-violet-200/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-indigo-200/20 rounded-full blur-3xl" />
      </div>

      <Card className="relative z-10 w-full max-w-md p-6 sm:p-8 border-2 border-slate-200/60 shadow-xl">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold mb-1">
            SynapZ{" "}
            <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
              AI
            </span>
          </h1>
          <p className="text-sm text-muted-foreground">Create your account</p>
          {planFromUrl && (
            <p className="mt-2 text-xs text-violet-600 bg-violet-50 py-1 px-3 rounded-full inline-block">
              Sign up to get the{" "}
              {planFromUrl.charAt(0).toUpperCase() + planFromUrl.slice(1)} plan
            </p>
          )}
        </div>

        {/* Google Sign-Up */}
        <Button
          variant="outline"
          className="w-full h-11 gap-3 text-sm font-medium mb-4"
          onClick={handleGoogleSignUp}
          disabled={googleLoading || loading}
        >
          {googleLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
          )}
          Continue with Google
        </Button>

        {/* Divider */}
        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              or sign up with email
            </span>
          </div>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-sm">
              Full Name
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="name"
                type="text"
                placeholder="Your full name"
                className="pl-10 h-11"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-sm">
              Email
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="pl-10 h-11"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-sm">
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="At least 6 characters"
                className="pr-10 h-11"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="confirmPassword" className="text-sm">
              Confirm Password
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              className="h-11"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              required
            />
          </div>

          {/* Role */}
          <div className="space-y-1.5">
            <Label className="text-sm">I am a</Label>
            <div className="flex gap-3">
              <Button
                type="button"
                variant={formData.role === "learner" ? "default" : "outline"}
                className="flex-1 h-10"
                onClick={() => setFormData({ ...formData, role: "learner" })}
              >
                Learner
              </Button>
              <Button
                type="button"
                variant={formData.role === "parent" ? "default" : "outline"}
                className="flex-1 h-10"
                onClick={() => setFormData({ ...formData, role: "parent" })}
              >
                Parent/Guardian
              </Button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full h-11 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-semibold"
            size="lg"
            disabled={loading || googleLoading}
          >
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            Create Account
          </Button>
        </form>

        {/* Sign In link */}
        <div className="mt-5 text-center text-sm">
          <span className="text-muted-foreground">
            Already have an account?{" "}
          </span>
          <Button
            type="button"
            variant="link"
            className="p-0 h-auto font-semibold"
            onClick={() => {
              const params = new URLSearchParams();
              if (planFromUrl) params.set("plan", planFromUrl);
              if (redirectTo !== "/dashboard")
                params.set("redirect", redirectTo);
              const qs = params.toString();
              navigate(`/login${qs ? "?" + qs : ""}`);
            }}
          >
            Sign In
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Register;
