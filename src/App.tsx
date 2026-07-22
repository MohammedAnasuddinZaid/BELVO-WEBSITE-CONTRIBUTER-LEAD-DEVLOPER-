import { Switch, Route, Redirect, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/contexts/ThemeContext";
import LoadingScreen from "@/components/LoadingScreen";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Careers from "@/pages/Careers";
import Blogs from "@/pages/Blogs";
import About from "@/sections/About";
import ComingSoon from "@/pages/ComingSoon";
import EventRegistration from "@/pages/EventRegistration";
import Works from "@/pages/works";
import Tools from "@/pages/Tools";
import ToolRegister from "@/pages/ToolRegister";
import AdminLogin from "@/pages/admin/Login";
import AdminDashboard from "@/pages/admin/Dashboard";
import { isAuthenticated } from "@/lib/admin-api";
import Navbar from "@/components/Navbar";
import ScrollToTop from "@/components/ScrollToTop";
import ChatBot from "@/components/ChatBot";
import CursorFollower from "@/components/CursorFollower";
import GrainOverlay from "@/components/GrainOverlay";
import React, { useState } from "react";
import DemoOne from "@/pages/DemoOne";
import NotesPDFs from "@/pages/NotesPDFs";

const queryClient = new QueryClient();

const pageVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] as const } },
  exit: { opacity: 0, y: -6, transition: { duration: 0.22, ease: "easeIn" as const } },
};

function AnimatedPage({ children }: { children: React.ReactNode }) {
  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      {children}
    </motion.div>
  );
}

function Router() {
  const [location] = useLocation();

  if (location.startsWith("/admin")) {
    return (
      <div
        style={{ background: "var(--belvo-bg)", minHeight: "100dvh", color: "var(--belvo-text-1)" }}
      >
        <Switch>
          <Route path="/admin/login" component={AdminLogin} />
          <Route path="/admin">
            {isAuthenticated() ? <AdminDashboard /> : <Redirect to="/admin/login" />}
          </Route>
        </Switch>
      </div>
    );
  }

  return (
    <div
      className="min-h-[100dvh] flex flex-col"
      style={{ color: "#1a1a1a" }}
    >
      <Navbar />
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <AnimatedPage key={location}>
            <Switch>
              <Route path="/" component={Home} />
              <Route path="/about" component={About} />
              <Route path="/careers" component={Careers} />
              <Route path="/blogs" component={Blogs} />
              <Route path="/works" component={Works} />
              <Route path="/tools" component={Tools} />
              <Route path="/tools/register" component={ToolRegister} />
              <Route path="/event-register/:id" component={EventRegistration} />
              <Route path="/contact">
                <ComingSoon title="Contact Us" />
              </Route>
              <Route path="/demo" component={DemoOne} />
              <Route path="/notes-pdfs" component={NotesPDFs} />
              <Route component={NotFound} />
            </Switch>
          </AnimatedPage>
        </AnimatePresence>
      </main>
    </div>
  );
}

function App() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <ThemeProvider>
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
              <Router />
            </WouterRouter>
            <ScrollToTop />
            <ChatBot />
            <CursorFollower />
            <GrainOverlay opacity={0.02} blend="overlay" />
            <Toaster />
          </ThemeProvider>
        </TooltipProvider>
      </QueryClientProvider>
      <AnimatePresence>
        {showSplash && (
          <LoadingScreen key="splash" onComplete={() => setShowSplash(false)} />
        )}
      </AnimatePresence>
    </>
  );
}

export default App;
