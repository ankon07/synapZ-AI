import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { SettingsProvider } from "@/contexts/SettingsContext";
import FloatingAIAvatar from "@/components/FloatingAIAvatar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import ModuleSelector from "./pages/ModuleSelector";
import Lessons from "./pages/Lessons";
import Quiz from "./pages/Quiz";
import Settings from "./pages/Settings";
import Activity from "./pages/Activity";
import ADHDLearning from "./pages/ADHDLearning";
import VoiceTutor from "./pages/VoiceTutor";
import BdslTranslator from "./pages/BdslTranslator";
import SkillsAssessment from "./pages/SkillsAssessment";
import JobMatching from "./pages/JobMatching";
import CareerPath from "./pages/CareerPath";
import VisualSchedulePage from "./pages/VisualSchedule";
import LerneeHistory from "./pages/LerneeHistory";
import ParentDashboard from "./pages/ParentDashboard";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ProtectedRoute = ({ 
  children, 
  allowedRoles 
}: { 
  children: React.ReactNode; 
  allowedRoles: ('learner' | 'parent')[];
}) => {
  const { userRole } = useAuth();
  
  if (!userRole) {
    return <Navigate to="/" replace />;
  }
  
  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/modules" element={<ModuleSelector />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/lessons" element={<Lessons />} />
      <Route path="/quiz" element={<Quiz />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/activity" element={<Activity />} />
      <Route path="/adhd-learning" element={<ADHDLearning />} />
      <Route path="/voice-tutor" element={<VoiceTutor />} />
      <Route path="/bdsl-translator" element={<BdslTranslator />} />
      <Route path="/skills" element={<SkillsAssessment />} />
      <Route path="/jobs" element={<JobMatching />} />
      <Route path="/career" element={<CareerPath />} />
      <Route path="/schedule" element={<VisualSchedulePage />} />
      <Route path="/lernee-history" element={<LerneeHistory />} />
      <Route path="/parent" element={<ParentDashboard />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <SettingsProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppRoutes />
            <FloatingAIAvatar />
          </BrowserRouter>
        </TooltipProvider>
      </SettingsProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
