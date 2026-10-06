"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Database,
  ShieldAlert,
  Map,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Cpu,
  Signal,
  Eye,
} from "lucide-react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
}

export default function Sidebar({ activeTab, setActiveTab, onLogout }: SidebarProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const navItems = [
    {
      id: "command-center",
      label: "Command Center",
      subLabel: "SYS CONTROL",
      icon: LayoutDashboard,
      color: "text-cyan-400 border-cyan-400/20 active-glow-cyan",
      glowColor: "rgba(0, 242, 254, 0.4)",
    },
    {
      id: "evidence-vault",
      label: "Evidence Vault",
      subLabel: "DB INTEGRITY",
      icon: Database,
      color: "text-indigo-400 border-indigo-400/20 active-glow-indigo",
      glowColor: "rgba(99, 102, 241, 0.4)",
    },
    {
      id: "fraud-intel",
      label: "Fraud Intelligence",
      subLabel: "THREAT MONITOR",
      icon: ShieldAlert,
      color: "text-rose-400 border-rose-400/20 active-glow-rose",
      glowColor: "rgba(244, 63, 94, 0.4)",
    },
    {
      id: "investigator-tracking",
      label: "Investigator Map",
      subLabel: "GEO TRACKING",
      icon: Map,
      color: "text-emerald-400 border-emerald-400/20 active-glow-emerald",
      glowColor: "rgba(16, 185, 129, 0.4)",
    },
  ];

  return (
    <motion.div
      animate={{ width: isExpanded ? 260 : 88 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="relative z-30 h-[calc(100vh-2rem)] my-4 ml-4 flex flex-col glass-panel rounded-[28px] border-r border-indigo-500/10 bg-slate-950/60 dark:bg-slate-950/70 backdrop-blur-xl shrink-0"
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="absolute -right-3 top-12 w-6 h-6 rounded-full glass-panel border border-indigo-500/20 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
      >
        {isExpanded ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
      </button>

      {/* Brand Header */}
      <div className="flex items-center p-6 border-b border-indigo-500/10 overflow-hidden h-20">
        <div className="flex items-center gap-3 w-full shrink-0">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-950/50 border border-indigo-500/30 text-indigo-400 shadow-[0_0_10px_rgba(99,102,241,0.15)] shrink-0">
            <Cpu className="w-5 h-5 animate-pulse" />
          </div>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="text-left select-none"
            >
              <h2 className="font-display font-bold text-sm tracking-tight text-white">VeriSight AI</h2>
              <span className="font-mono text-[8px] tracking-wider text-indigo-400">V.2.6_OS</span>
            </motion.div>
          )}
        </div>
      </div>

      {/* Navigation list */}
      <div className="flex-1 px-3 py-6 space-y-2 overflow-y-auto overflow-x-hidden">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`relative w-full h-12 rounded-xl flex items-center gap-4 transition-all duration-300 group cursor-pointer ${
                isActive
                  ? "bg-indigo-500/10 border border-indigo-500/25 text-white"
                  : "text-slate-400 border border-transparent hover:bg-slate-900/40 hover:text-slate-200"
              }`}
            >
              {/* Active glow backing */}
              {isActive && (
                <div
                  className="absolute left-1 top-3 bottom-3 w-1 rounded-full"
                  style={{
                    backgroundColor: item.glowColor.replace("0.4", "1"),
                    boxShadow: `0 0 12px ${item.glowColor.replace("0.4", "1")}`,
                  }}
                />
              )}

              {/* Icon */}
              <div
                className={`flex items-center justify-center w-10 h-10 ml-1 rounded-lg transition-all ${
                  isActive ? item.color : "text-slate-400 group-hover:text-slate-200"
                }`}
                style={{
                  boxShadow: isActive ? `0 0 15px ${item.glowColor}` : "none",
                }}
              >
                <Icon className="w-5 h-5" />
              </div>

              {/* Label */}
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-left select-none"
                >
                  <p className="font-display font-medium text-xs tracking-wide">{item.label}</p>
                  <p className="font-mono text-[8px] text-slate-500 tracking-widest">{item.subLabel}</p>
                </motion.div>
              )}

              {/* Tooltip on collapsed state */}
              {!isExpanded && (
                <div className="absolute left-20 scale-0 group-hover:scale-100 px-3 py-1.5 rounded-lg border border-indigo-500/20 bg-slate-950 text-white font-mono text-[10px] tracking-wider transition-all duration-150 z-50 pointer-events-none shadow-xl">
                  {item.label.toUpperCase()}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* System Integrity (Diagnostic Display) */}
      <div className="px-3 border-t border-indigo-500/10 pt-4 overflow-hidden">
        {isExpanded ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-3 rounded-xl bg-slate-900/35 border border-indigo-500/5 font-mono text-[9px] text-left text-slate-400 space-y-1.5"
          >
            <div className="flex items-center justify-between text-slate-300 font-bold border-b border-indigo-500/5 pb-1">
              <span>SYSTEM DIAGNOSTIC</span>
              <Signal className="w-3 h-3 text-emerald-400 animate-pulse" />
            </div>
            <div className="flex justify-between">
              <span>LATENCY:</span>
              <span className="text-emerald-400 font-semibold">12ms</span>
            </div>
            <div className="flex justify-between">
              <span>SHIELD LOGIC:</span>
              <span className="text-cyan-400">99.8%</span>
            </div>
            <div className="flex justify-between">
              <span>INTEGRITY SEC:</span>
              <span className="text-indigo-400">SECURE</span>
            </div>
          </motion.div>
        ) : (
          <div className="flex justify-center py-2 text-emerald-400 animate-pulse">
            <Signal className="w-5 h-5" />
          </div>
        )}
      </div>

      {/* Bottom Profile / Exit Actions */}
      <div className="p-3 border-t border-indigo-500/10 mt-2 space-y-1.5 overflow-hidden">
        {/* Profile */}
        <div className="flex items-center gap-3 p-1 rounded-xl">
          <div className="w-10 h-10 rounded-full border border-indigo-500/20 bg-gradient-to-tr from-cyan-950 to-indigo-950 flex items-center justify-center text-xs font-mono font-bold text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.15)] shrink-0 select-none">
            AV
          </div>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-left shrink-0 select-none"
            >
              <p className="font-display font-semibold text-xs text-white">Agent Valerius</p>
              <span className="font-mono text-[9px] text-indigo-400">LEVEL 5 CLEARANCE</span>
            </motion.div>
          )}
        </div>

        {/* Exit Button */}
        <button
          onClick={onLogout}
          className="w-full h-10 rounded-xl flex items-center gap-4 text-slate-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 hover:text-rose-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-center w-10 h-10 ml-1 rounded-lg shrink-0">
            <LogOut className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
          </div>
          {isExpanded && <span className="font-display font-medium text-xs tracking-wide">Deauthorize</span>}
          {!isExpanded && (
            <div className="absolute left-20 scale-0 group-hover:scale-100 px-3 py-1.5 rounded-lg border border-rose-500/20 bg-slate-950 text-rose-400 font-mono text-[10px] tracking-wider transition-all duration-150 z-50 pointer-events-none shadow-xl">
              DEAUTHORIZE
            </div>
          )}
        </button>
      </div>
    </motion.div>
  );
}
