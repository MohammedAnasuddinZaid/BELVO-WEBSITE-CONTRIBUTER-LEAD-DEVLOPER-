import React from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";

export default function ComingSoon({ title }: { title: string }) {
  return (
    <div className="min-h-screen pt-24 pb-12 flex flex-col items-center justify-center bg-background px-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-2xl"
      >
        <h1 className="font-serif text-5xl md:text-7xl mb-6 text-white">{title}</h1>
        <p className="text-white/60 text-lg md:text-xl font-light mb-12">
          This section is currently being crafted. We are preparing something extraordinary.
        </p>
        <Link 
          href="/"
          className="inline-flex px-8 py-4 border border-white/20 text-white hover:border-primary hover:text-primary transition-colors tracking-widest uppercase text-sm font-semibold"
        >
          Return to Home
        </Link>
      </motion.div>
    </div>
  );
}
