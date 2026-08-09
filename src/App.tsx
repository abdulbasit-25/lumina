import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ProductionsProvider } from "@/contexts/ProductionsContext";
import { SearchProvider } from "@/contexts/SearchContext";
import { AppLayout } from "@/components/layout/AppLayout";
import Landing from "./pages/Landing";
import Pricing from "./pages/Pricing";
import Features from "./pages/Features";
import Workflow from "./pages/Workflow";
import Enterprise from "./pages/Enterprise";
import About from "./pages/About";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Movies from "./pages/Movies";
import Cast from "./pages/Cast";
import Crew from "./pages/Crew";
import Schedule from "./pages/Schedule";
import Budget from "./pages/Budget";
import Model from "./pages/Model";
import WelcomeScreen from "./components/WelcomeScreen";
import ScrollToTop from "./components/ScrollToTop";

import AICommandCenter from "./pages/AICommandCenter";
import AICommandCenter_style_refrence from "./pages/AICommandCenter- style refrence";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AppContent() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ScrollToTop />
      <Routes>
        <Route
  path="/"
  element={user ? <Navigate to="/welcome" replace /> : <Landing />}
/>
 
            <Route
  path="/about"
  element={user ? <Navigate to="/welcome" replace /> : <About />}
/>
<Route
  path="/pricing"
  element={user ? <Navigate to="/welcome" replace /> : <Pricing />}
/>  <Route
  path="/workflow"
  element={user ? <Navigate to="/welcome" replace /> : <Workflow />}
/>  <Route
  path="/enterprise"
  element={user ? <Navigate to="/welcome" replace /> : <Enterprise />}
/>  <Route
  path="/features"
  element={user ? <Navigate to="/welcome" replace /> : <Features />}
/>


            <Route
  path="/login"
  element={user ? <Navigate to="/welcome" replace /> : <Login />}
/>
            <Route
              path="/welcome"
              element={user ? <WelcomeScreen /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/dashboard"
              element={user ? <AppLayout><Dashboard /></AppLayout> : <Navigate to="/login" replace />}
            />
            <Route
              path="/movies"
              element={user ? <AppLayout><Movies /></AppLayout> : <Navigate to="/login" replace />}
            />
            <Route
              path="/cast"
              element={user ? <AppLayout><Cast /></AppLayout> : <Navigate to="/login" replace />}
            />
            <Route
              path="/crew"
              element={user ? <AppLayout><Crew /></AppLayout> : <Navigate to="/login" replace />}
            />
            <Route
              path="/schedule"
              element={user ? <AppLayout><Schedule /></AppLayout> : <Navigate to="/login" replace />}
            />
            <Route
              path="/budget"
              element={user ? <AppLayout><Budget /></AppLayout> : <Navigate to="/login" replace />}
            />
            <Route
              path="/model"
              element={user ? <AppLayout><Model /></AppLayout> : <Navigate to="/login" replace />}
            />
            <Route
              path="/ai-command"
              element={user ? <AppLayout><AICommandCenter /></AppLayout> : <Navigate to="/login" replace />}
            />
            <Route path="*" element={<NotFound />} />
            <Route
              path="/ai-command-style-refrence"
              element={user ? <AppLayout><AICommandCenter_style_refrence /></AppLayout> : <Navigate to="/login" replace />}
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AppContent />
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
