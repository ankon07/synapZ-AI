import {
  Mic,
  Hand,
  BarChart3,
  MessageSquare,
  TrendingUp,
  Settings,
  Lock,
  Briefcase,
  BookOpen,
  Brain,
  LayoutDashboard,
  CreditCard,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

const AppSidebar = () => {
  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: Mic, label: "Voice Tutor", path: "/voice-tutor" },
    { icon: Hand, label: "Sign Language Converter", path: "/schedule" },
    {
      icon: Brain,
      label: "Neurodiverse Focus Learning",
      path: "/adhd-learning",
    },
    { icon: Briefcase, label: "AI Skill Coach", path: "/jobs" },
    { icon: BookOpen, label: "Learning History", path: "/lernee-history" },
    { icon: TrendingUp, label: "Activity", path: "/activity" },
    { icon: Lock, label: "Parents Dashboard", path: "/parent" },
    { icon: CreditCard, label: "Pricing & Plans", path: "/pricing" },
    { icon: Settings, label: "Security", path: "/settings" },
  ];

  return (
    <aside className="w-64 border-r bg-card h-full flex flex-col">
      {/* Student Info */}
      <div className="p-6 border-b">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
            <span className="text-lg font-semibold">R</span>
          </div>
          <div>
            <p className="text-sm font-semibold">Student: Rohan M</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "text-foreground hover:bg-muted hover:text-foreground",
              )
            }
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* AI Tutor Guide */}
      <div className="p-4 border-t">
        <div className="bg-secondary/10 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold">AI Tutor Guide</p>
              <p className="text-xs text-muted-foreground">
                Meet your companion
              </p>
            </div>
          </div>
          <button className="w-full mt-2 px-4 py-2 rounded-lg bg-secondary text-white text-sm font-medium hover:bg-secondary/90 transition-colors">
            Hear Guide
          </button>
        </div>
      </div>
    </aside>
  );
};

export default AppSidebar;
