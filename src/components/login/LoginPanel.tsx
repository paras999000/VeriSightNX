"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Eye, EyeOff, Terminal, Cpu, Fingerprint, Lock } from "lucide-react";
import ThemeToggle from "../ui/ThemeToggle";
import confetti from "canvas-confetti";

interface LoginPanelProps {
  onLoginSuccess: () => void;
}

export default function LoginPanel({ onLoginSuccess }: LoginPanelProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mfa, setMfa] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  
  const [showPassword, setShowPassword] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStatus, setScanStatus] = useState<"idle" | "scanning" | "success" | "failed">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleQuickAccess = () => {
    setEmail("admin@verisight.ai");
    setPassword("jarvis2026");
    setMfa("849204");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!email || !password) {
      setErrorMsg("Security clearance requires email & authorization token.");
      return;
    }

    // Check mock credentials
    if (email === "admin@verisight.ai" && password === "jarvis2026") {
      // Trigger bio clearance check
      setIsScanning(true);
      setScanStatus("scanning");
      
      setTimeout(() => {
        setScanStatus("success");
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#00f2fe", "#6366f1", "#c084fc"],
        });
        
        setTimeout(() => {
          onLoginSuccess();
        }, 1200);
      }, 1800);
    } else {
      setIsScanning(true);
      setScanStatus("scanning");
      
      setTimeout(() => {
        setScanStatus("failed");
        setErrorMsg("Access Denied: Invalid security signature key.");
        setIsScanning(false);
      }, 1500);
    }
  };

  return (
    <div className="relative z-10 w-full max-w-xl p-8 md:p-10 glass-panel rounded-[36px] overflow-hidden border border-indigo-500/25 bg-slate-950/60 dark:bg-slate-950/65 backdrop-blur-2xl shadow-[0_20px_50px_rgba(99,102,241,0.2)]">
      {/* Absolute Glow Backgrounds inside Card */}
      <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-cyan-500/10 blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-indigo-500/10 blur-2xl pointer-events-none" />

      {/* Header with Title and Theme Switcher */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-400 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.4)]">
            <ShieldCheck className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="font-display font-bold text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-300 dark:from-white dark:via-slate-100 dark:to-indigo-300 bg-clip-text text-transparent light:text-slate-800">
              VeriSight AI
            </h2>
            <p className="text-[10px] font-mono tracking-widest text-indigo-400 uppercase">
              Investigation Intelligence OS
            </p>
          </div>
        </div>
        <ThemeToggle />
      </div>

      <AnimatePresence mode="wait">
        {scanStatus === "scanning" || scanStatus === "success" ? (
          <motion.div
            key="biometric"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col items-center justify-center py-16 text-center"
          >
            <div className="relative mb-6">
              {/* Outer Pulsing Glow */}
              <div className={`absolute inset-[-12px] rounded-full blur-xl opacity-40 animate-ping ${
                scanStatus === "success" ? "bg-emerald-500" : "bg-cyan-500"
              }`} />
              
              <div className={`w-28 h-28 rounded-full border-2 flex items-center justify-center glass-panel relative overflow-hidden ${
                scanStatus === "success" ? "border-emerald-500/50" : "border-cyan-500/50"
              }`}>
                {/* Visual scanner bar */}
                <motion.div
                  initial={{ y: "-100%" }}
                  animate={{ y: "100%" }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                  className={`absolute left-0 right-0 h-0.5 z-20 ${
                    scanStatus === "success" ? "bg-emerald-400 shadow-[0_0_10px_#10b981]" : "bg-cyan-400 shadow-[0_0_10px_#00f2fe]"
                  }`}
                />
                
                <Fingerprint className={`w-16 h-16 ${
                  scanStatus === "success"
                    ? "text-emerald-400 animate-pulse"
                    : "text-cyan-400 animate-pulse"
                }`} />
              </div>
            </div>

            <h3 className="font-display text-lg font-semibold text-slate-100 uppercase tracking-wider">
              {scanStatus === "success" ? "Clearance Confirmed" : "Scanning Cybernetic Signature"}
            </h3>
            <p className="font-mono text-xs text-indigo-400 mt-2 animate-pulse">
              {scanStatus === "success" ? "Accessing Core Node System..." : "Verifying Multi-Factor Key Integrity..."}
            </p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <div className="space-y-1 text-left">
              <h1 className="font-display text-2xl font-bold tracking-tight text-slate-100">
                System Access Portal
              </h1>
              <p className="text-xs text-slate-400">
                Provide classified operational authorization below to log in.
              </p>
            </div>

            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-xl border border-rose-500/20 bg-rose-500/10 text-rose-400 text-xs font-mono flex items-center gap-2"
              >
                <Lock className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </motion.div>
            )}

            {/* Email Input */}
            <div className="space-y-2 text-left">
              <label className="text-[11px] font-mono tracking-widest text-indigo-400 uppercase">
                Operator Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@agency.gov"
                  className="w-full h-12 px-4 rounded-xl border border-indigo-500/15 bg-slate-900/40 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400/60 focus:ring-1 focus:ring-cyan-400/30 transition-all"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2 text-left">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-mono tracking-widest text-indigo-400 uppercase">
                  Access Key Signature
                </label>
                <a href="#" className="text-xs text-indigo-400 hover:text-cyan-400 transition-colors">
                  Reset Key?
                </a>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full h-12 pl-4 pr-10 rounded-xl border border-indigo-500/15 bg-slate-900/40 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400/60 focus:ring-1 focus:ring-cyan-400/30 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* MFA Verification */}
            <div className="space-y-2 text-left">
              <label className="text-[11px] font-mono tracking-widest text-indigo-400 uppercase">
                MFA Authenticator Code (Optional for Demo)
              </label>
              <div className="relative">
                <input
                  type="text"
                  maxLength={6}
                  value={mfa}
                  onChange={(e) => setMfa(e.target.value)}
                  placeholder="000000"
                  className="w-full h-12 px-4 rounded-xl border border-indigo-500/15 bg-slate-900/40 text-slate-100 placeholder-slate-500 text-center tracking-widest font-mono text-sm focus:outline-none focus:border-cyan-400/60 focus:ring-1 focus:ring-cyan-400/30 transition-all"
                />
              </div>
            </div>

            {/* Remember & Consent */}
            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-slate-400 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-900/60 text-indigo-600 focus:ring-indigo-500/30"
                />
                Keep Terminal Logged In
              </label>
              <span className="text-[10px] font-mono text-slate-500 uppercase">Secured by AES-256</span>
            </div>

            {/* Submit Action Button */}
            <button
              type="submit"
              className="w-full h-12 rounded-xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-cyan-500 hover:from-indigo-400 hover:to-cyan-400 text-slate-950 font-display font-semibold tracking-wide shadow-[0_4px_20px_rgba(99,102,241,0.3)] hover:shadow-[0_4px_25px_rgba(99,102,241,0.5)] transition-all flex items-center justify-center gap-2 cursor-pointer group"
            >
              <Cpu className="w-4 h-4 transition-transform group-hover:rotate-45" />
              Authorize Credentials
            </button>

            {/* Quick Demo Access Trigger */}
            <div className="pt-4 border-t border-slate-800/40 flex flex-col gap-2">
              <button
                type="button"
                onClick={handleQuickAccess}
                className="w-full h-9 rounded-lg border border-cyan-500/25 bg-cyan-950/20 hover:bg-cyan-950/40 text-cyan-400 hover:text-cyan-300 font-mono text-xs tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Terminal className="w-3.5 h-3.5" />
                Inject Classified Security Tokens (Quick Demo)
              </button>
              <div className="text-[10px] font-mono text-slate-500 text-center uppercase tracking-wide mt-1">
                Admin Creds: <span className="text-slate-400">admin@verisight.ai</span> | Pass: <span className="text-slate-400">jarvis2026</span>
              </div>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
