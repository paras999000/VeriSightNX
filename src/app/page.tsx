"use client";

import React, { useState } from "react";
import { AnimatePresence as FramerAnimatePresence, motion as framerMotion } from "framer-motion";
import ThreeLoginVisual from "@/components/login/ThreeLoginVisual";
import LoginPanel from "@/components/login/LoginPanel";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleLoginSuccess = () => {
    setIsTransitioning(true);
    
    // Smooth transition buffer to render the full dashboard
    setTimeout(() => {
      setIsLoggedIn(true);
      setIsTransitioning(false);
    }, 1000);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <main className="w-screen h-screen overflow-hidden bg-slate-950 relative">
      <FramerAnimatePresence mode="wait">
        {!isLoggedIn ? (
          <framerMotion.div
            key="login-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full h-full flex flex-col lg:flex-row relative"
          >
            {/* Left Side: Massive 3D Interactive Canvas */}
            <div className="relative flex-1 h-1/2 lg:h-full overflow-hidden">
              <ThreeLoginVisual />
              
              {/* Floating Headline Overlay */}
              <div className="absolute bottom-12 left-12 z-20 text-left pointer-events-none select-none max-w-md hidden md:block">
                <framerMotion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                  className="space-y-3"
                >
                  <span className="px-3 py-1 rounded-full border border-cyan-400/25 bg-cyan-950/40 text-[10px] font-mono tracking-widest text-cyan-400 uppercase">
                    Quantum Data Link Alpha
                  </span>
                  <h1 className="font-display font-extrabold text-3xl tracking-tight text-white leading-tight">
                    Securing the global entity ecosystem.
                  </h1>
                  <p className="text-xs text-slate-400 leading-relaxed font-mono">
                    Real-time automated transaction mapping, risk scoring models, and field coordinates telemetry.
                  </p>
                </framerMotion.div>
              </div>
            </div>

            {/* Right Side: Floating credentials glass container */}
            <div className="w-full lg:w-[600px] h-1/2 lg:h-full flex items-center justify-center p-6 bg-slate-950/20 lg:border-l lg:border-indigo-500/10 relative z-10">
              <LoginPanel onLoginSuccess={handleLoginSuccess} />
            </div>

            {/* Cinematic Cyber Flash Scanline Wipe Overlay during transition */}
            {isTransitioning && (
              <framerMotion.div
                initial={{ scaleY: 0 }}
                animate={{ scaleY: [0, 1, 1, 0] }}
                transition={{ duration: 1, times: [0, 0.4, 0.6, 1] }}
                className="absolute inset-0 bg-cyan-400 origin-bottom z-[99999] flex items-center justify-center shadow-[0_0_100px_#00f2fe]"
              >
                <div className="font-mono text-slate-950 font-bold text-lg tracking-widest animate-pulse uppercase">
                  DECRYPTING SHIELD LOGIC INDEX...
                </div>
              </framerMotion.div>
            )}
          </framerMotion.div>
        ) : (
          <framerMotion.div
            key="dashboard-view"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full"
          >
            <DashboardLayout onLogout={handleLogout} />
          </framerMotion.div>
        )}
      </FramerAnimatePresence>
    </main>
  );
}
