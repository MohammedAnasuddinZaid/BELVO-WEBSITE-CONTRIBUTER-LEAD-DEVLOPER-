```typescriptreact
import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/contexts/ThemeContext";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Careers from "@/pages/Careers";
import Blogs from "@/pages/Blogs";
import Services from "@/pages/Services";
import About from "@/sections/About";
import ComingSoon from "@/pages/ComingSoon";
import Works from "@/pages/Works";
import Navbar from "@/components/Navbar";
import ScrollToTop from "@/components/ScrollToTop";
import ChatBot from "@/components/ChatBot";

const queryClient = new QueryClient();

const pageVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] as const } },
  exit:    { opacity: 0, y: -6, transition: { duration: 0.22, ease: "easeIn" as const } },
};

function AnimatedPage({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {children}
    </motion.div>
  );
}

function Router() {
  const [location] = useLocation();
  return (
    <div
      className="min-h-[100dvh] flex flex-col"
      style={{ background: "var(--belvo-bg)", color: "var(--belvo-text-1)" }}
    >
      <Navbar />
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <AnimatedPage key={location}>
            <Switch>
              <Route path="/" component={Home} />
              <Route path="/about" component={About} />
              <Route path="/services" component={Services} />
              <Route path="/works" component={Works} />
              <Route path="/careers" component={Careers} />
              <Route path="/blogs" component={Blogs} />
              <Route path="/contact">
                <ComingSoon title="Contact Us" />
              </Route>
              <Route component={NotFound} />
            </Switch>
          </AnimatedPage>
        </AnimatePresence>
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <ScrollToTop />
          <ChatBot />
          <Toaster />
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
```
