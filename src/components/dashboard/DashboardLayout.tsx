"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "./Sidebar";
import AICopilot from "./AICopilot";
import AICommandCenter from "./AICommandCenter";
import EvidenceVault from "./EvidenceVault";
import FraudIntel from "./FraudIntel";
import InvestigatorMap from "./InvestigatorMap";
import { ShieldAlert, Server, Network } from "lucide-react";

interface DashboardLayoutProps {
  onLogout: () => void;
}

export default function DashboardLayout({ onLogout }: DashboardLayoutProps) {
  const [activeTab, setActiveTab] = useState("command-center");
  const [currentTime, setCurrentTime] = useState("");

  // Live client-side clock updates
  useEffect(() => {
    setCurrentTime(new Date().toLocaleString());
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const renderActiveView = () => {
    switch (activeTab) {
      case "command-center":
        return <AICommandCenter />;
      case "evidence-vault":
        return <EvidenceVault />;
      case "fraud-intel":
        return <FraudIntel />;
      case "investigator-tracking":
        return <InvestigatorMap />;
      default:
        return <AICommandCenter />;
    }
  };

  return (
    <div className="flex h-screen w-screen bg-slate-950 text-slate-100 overflow-hidden relative font-sans select-none">
      {/* Absolute Dynamic Aura light backdrops */}
      <div className="aurora-bg top-[-20%] left-[-20%] bg-indigo-950/20 animate-aurora" />
      <div className="aurora-bg bottom-[-20%] right-[-20%] bg-cyan-950/20 animate-aurora" style={{ animationDelay: "-8s" }} />

      {/* Cyber Grid Overlay */}
      <div className="cyber-grid" />

      {/* Futuristic Scanlines */}
      <div className="scanlines" />

      {/* Left Dock Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={onLogout} />

      {/* Right Core Workspace Panel */}
      <div className="flex-1 flex flex-col h-full overflow-hidden my-4 mr-4">
        {/* Top Intelligence Header Bar */}
        <header className="h-20 px-6 glass-panel rounded-[24px] border border-indigo-500/10 bg-slate-950/60 dark:bg-slate-950/70 backdrop-blur-xl flex items-center justify-between shrink-0 mb-4 mx-4">
          <div className="text-left font-mono">
            <span className="text-[9px] text-slate-500 block">WORKSPACE SECTOR</span>
            <span className="text-xs text-white font-bold tracking-wider">
              VERISIGHT_AI://{activeTab.toUpperCase().replace("-", "_")}
            </span>
          </div>

          {/* Center visual logs alerts ticker */}
          <div className="hidden md:flex items-center gap-6 text-[10px] font-mono text-slate-400">
            <div className="flex items-center gap-1.5 border-r border-slate-900 pr-4">
              <ShieldAlert className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>THREAT LEVEL: <span className="text-cyan-400 font-bold">NORMAL</span></span>
            </div>

            <div className="flex items-center gap-1.5 border-r border-slate-900 pr-4">
              <Server className="w-3.5 h-3.5 text-indigo-400" />
              <span>NODE CLUSTERS: <span className="text-indigo-400 font-bold">3/3 SYNCED</span></span>
            </div>

            <div className="flex items-center gap-1.5">
              <Network className="w-3.5 h-3.5 text-emerald-400" />
              <span>LOGICAL FIREWALL: <span className="text-emerald-400 font-bold">ACTIVE</span></span>
            </div>
          </div>

          <div className="text-right font-mono text-xs">
            <span className="text-[9px] text-slate-500 block">SYSTEM TIME</span>
            <span className="text-slate-300 font-semibold">{currentTime || "INITIALIZING..."}</span>
          </div>
        </header>

        {/* Viewport Main Container */}
        <div className="flex-1 overflow-hidden relative mx-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="absolute inset-0 flex flex-col"
            >
              {renderActiveView()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Floating AI Jarvis Orb Copilot */}
      <AICopilot />
    </div>
  );
}
