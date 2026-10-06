"use client";

import React, { ReactNode } from "react";
import { motion } from "framer-motion";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: "blue" | "purple" | "emerald" | "rose" | "indigo" | "none";
  title?: string;
  subtitle?: string;
  headerActions?: ReactNode;
  onClick?: () => void;
}

export default function GlassCard({
  children,
  className = "",
  glowColor = "indigo",
  title,
  subtitle,
  headerActions,
  onClick,
}: GlassCardProps) {
  const glowClasses = {
    blue: "glass-border-blue hover:shadow-[0_0_30px_rgba(0,242,254,0.15)]",
    purple: "glass-border-purple hover:shadow-[0_0_30px_rgba(192,132,252,0.15)]",
    emerald: "glass-border-emerald hover:shadow-[0_0_30px_rgba(16,185,129,0.15)]",
    rose: "border-rose-500/20 hover:border-rose-500/40 hover:shadow-[0_0_30px_rgba(244,63,94,0.15)]",
    indigo: "glass-panel hover:shadow-[0_0_35px_rgba(99,102,241,0.2)]",
    none: "bg-slate-950/45 dark:bg-slate-900/30 border border-slate-800/40",
  };

  const isClickable = !!onClick;

  return (
    <motion.div
      whileHover={isClickable ? { y: -4, scale: 1.01 } : { y: -2 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      onClick={onClick}
      className={`glass-panel rounded-[28px] p-6 overflow-hidden ${glowClasses[glowColor]} ${
        isClickable ? "cursor-pointer" : ""
      } ${className}`}
    >
      {/* Glossy sheen effect overlay */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-transparent via-white/5 to-white/10 opacity-30 mix-blend-overlay" />

      {/* Optional Card Header */}
      {(title || subtitle || headerActions) && (
        <div className="flex items-start justify-between mb-5 border-b border-indigo-500/10 pb-4 relative z-10">
          <div>
            {title && (
              <h3 className="font-display text-lg font-semibold tracking-wide bg-gradient-to-r from-white to-slate-300 dark:from-white dark:to-slate-300 bg-clip-text text-transparent light:text-slate-800">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="font-mono text-xs text-indigo-400 dark:text-indigo-400/80 mt-1 uppercase tracking-wider">
                {subtitle}
              </p>
            )}
          </div>
          {headerActions && <div className="flex items-center gap-2">{headerActions}</div>}
        </div>
      )}

      {/* Card Content */}
      <div className="relative z-10 w-full h-full">{children}</div>
    </motion.div>
  );
}
