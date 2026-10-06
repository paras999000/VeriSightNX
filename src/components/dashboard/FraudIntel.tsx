"use client";

import React, { useState, useEffect } from "react";
import { ShieldAlert, Zap, Skull, Radio, Terminal, TrendingUp, AlertTriangle } from "lucide-react";
import GlassCard from "../ui/GlassCard";

interface ThreatLog {
  id: string;
  source: string;
  target: string;
  score: number;
  type: string;
  status: "active" | "mitigated";
}

export default function FraudIntel() {
  const [fraudScore, setFraudScore] = useState(78);
  const [logs, setLogs] = useState<ThreatLog[]>([
    { id: "T-019", source: "192.168.12.92", target: "ROUTER_APAC_09", score: 92, type: "SYN Flood Anomaly", status: "active" },
    { id: "T-022", source: "185.220.101.4", target: "SG_GATEWAY", score: 85, type: "Tor Exit Relay Tunnel", status: "active" },
    { id: "T-023", source: "ENDPOINT_X1", target: "AUTH_ROUTINE", score: 79, type: "Credential Stuffing", status: "active" },
    { id: "T-024", source: "SWIFT_ROUTER_09", target: "OUTBOUND_SG", score: 88, type: "SWIFT Protocol Delta", status: "active" },
  ]);

  // Periodic score fluctuation
  useEffect(() => {
    const interval = setInterval(() => {
      setFraudScore((prev) => {
        const offset = Math.floor(Math.random() * 5) - 2;
        return Math.max(60, Math.min(99, prev + offset));
      });

      // Fluctuate logs
      setLogs((prev) => {
        const newLog: ThreatLog = {
          id: `T-${Math.floor(100 + Math.random() * 899)}`,
          source: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.10.${Math.floor(Math.random() * 255)}`,
          target: "CORE_GATEWAY",
          score: Math.floor(70 + Math.random() * 29),
          type: Math.random() > 0.5 ? "XSS Injection Delta" : "Token Stake Multi-Login",
          status: "active",
        };
        return [newLog, ...prev.slice(0, 4)];
      });
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  const getDialColor = (score: number) => {
    if (score > 85) return "stroke-rose-500 shadow-[0_0_15px_#f43f5e]";
    if (score > 70) return "stroke-amber-500 shadow-[0_0_15px_#fbbf24]";
    return "stroke-cyan-400 shadow-[0_0_15px_#00f2fe]";
  };

  return (
    <div className="flex-1 p-6 overflow-y-auto space-y-6">
      {/* Module Title Header */}
      <div className="flex justify-between items-center pb-4 border-b border-indigo-500/10">
        <div className="text-left">
          <h1 className="font-display font-bold text-2xl tracking-tight text-white">Fraud Intelligence Module</h1>
          <p className="font-mono text-xs text-slate-400">REAL-TIME RISKS & AUTOMATED THREAT CORRELATION</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Score SVG Dial & threat indicator rings */}
        <div className="space-y-6">
          {/* Glowing risk score dial */}
          <GlassCard title="Global Fraud Threat Index" subtitle="PROBABILITY RATING" glowColor="rose">
            <div className="flex flex-col items-center justify-center py-6 relative">
              {/* Circular Gauge */}
              <div className="relative w-48 h-48">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  {/* Background track */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    className="stroke-slate-900 fill-none"
                    strokeWidth="8"
                  />
                  {/* Animated score track */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    className={`fill-none transition-all duration-1000 ${getDialColor(fraudScore)}`}
                    strokeWidth="8"
                    strokeDasharray="251.2"
                    strokeDashoffset={251.2 - (251.2 * fraudScore) / 100}
                    strokeLinecap="round"
                  />
                </svg>
                {/* Center score readout */}
                <div className="absolute inset-0 flex flex-col items-center justify-center font-mono">
                  <span className="text-4xl font-bold text-white tracking-tight">{fraudScore}</span>
                  <span className="text-[10px] text-rose-400 font-semibold uppercase tracking-widest mt-1">HIGH RISK</span>
                </div>
              </div>

              {/* Status indicators */}
              <div className="grid grid-cols-3 gap-6 w-full text-center mt-6 border-t border-slate-900 pt-4">
                <div>
                  <span className="text-slate-500 block text-[9px] font-mono">MITIGATED</span>
                  <span className="text-xs font-semibold text-emerald-400">92.4%</span>
                </div>
                <div className="border-x border-slate-900">
                  <span className="text-slate-500 block text-[9px] font-mono">OUTBREAKS</span>
                  <span className="text-xs font-semibold text-rose-400">03</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[9px] font-mono">ALERT STATE</span>
                  <span className="text-xs font-semibold text-amber-400">CRIT-3</span>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Threat concentric rings display */}
          <GlassCard title="Entity Threat Proximity" subtitle="DEFENSE SECTORS" glowColor="none">
            <div className="relative aspect-square max-w-[240px] mx-auto flex items-center justify-center bg-slate-950/40 rounded-full border border-slate-900 overflow-hidden">
              {/* Pulsing Concentric SVG Rings */}
              <div className="absolute inset-4 rounded-full border border-rose-500/20 animate-pulse" />
              <div className="absolute inset-10 rounded-full border border-amber-500/20 animate-pulse-slow" />
              <div className="absolute inset-16 rounded-full border border-cyan-500/10" />

              {/* Core secure node */}
              <div className="relative z-10 w-12 h-12 rounded-full bg-cyan-950/80 border border-cyan-400 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(0,242,254,0.3)]">
                <Radio className="w-5 h-5 animate-pulse" />
              </div>

              {/* Outer floating threatening node */}
              <div className="absolute top-8 right-10 w-4 h-4 rounded-full bg-rose-500 border border-slate-950 shadow-[0_0_10px_#f43f5e] animate-bounce" />
              <div className="absolute bottom-12 left-10 w-3 h-3 rounded-full bg-amber-400 border border-slate-950 shadow-[0_0_10px_#fbbf24]" />
            </div>
          </GlassCard>
        </div>

        {/* Right Side: Hacker Movie terminal stream & active logs */}
        <div className="lg:col-span-2 space-y-6">
          <GlassCard title="Hacker Command Stream Decryptor" subtitle="RAW INTRUSION LOGS" glowColor="blue">
            <div className="font-mono text-left text-xs bg-slate-950 border border-slate-900 p-5 rounded-[24px] space-y-4 h-[310px] overflow-y-auto leading-relaxed relative overflow-hidden select-none">
              {/* Scanline reflection overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-950/5 to-transparent pointer-events-none" />

              {/* Log items */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-[10px] text-cyan-400 border-b border-slate-900 pb-2">
                  <Terminal className="w-3.5 h-3.5" />
                  <span>DECRYPTING CRYPTO_RELAY PROTOCOLS... SIGNATURE INTEGRITY NOMINAL</span>
                </div>
                
                <div className="text-slate-400">
                  <span className="text-cyan-400 font-semibold">VERISIGHT_CORE~$</span> tail -n 5 /var/log/audit.log
                </div>
                <div className="text-slate-500">
                  [AUDIT_INTEGRITY] Scanning IP routing pools... Tor exit detected at node 185.220.101.4.
                </div>
                <div className="text-rose-400 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>[THREAT_WARNING] Transaction delta mismatch identified on APAC route. IP: 192.168.12.92. Flagging to investigator queue.</span>
                </div>
                <div className="text-emerald-400">
                  [SHIELD_OK] Isolated memory block #09AC4F. SWIFT protocol packets relocated.
                </div>
                <div className="text-slate-400">
                  <span className="text-cyan-400 font-semibold">VERISIGHT_CORE~$</span> check_integrity --node aws_root_9
                </div>
                <div className="text-indigo-400 animate-pulse">
                  &gt; Analyzing hash checksum: SHA256 matches verified state. Threat mitigated on root gateway.
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Active threat list */}
          <GlassCard title="Threat Vectors Matrix" subtitle="ACTIVE RECTIFICATIONS" glowColor="none">
            <div className="space-y-3 font-mono text-xs text-left">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="p-3.5 rounded-xl border border-slate-900 bg-slate-950/40 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${log.score > 85 ? "bg-rose-500/10 text-rose-400 border border-rose-500/20" : "bg-amber-500/10 text-amber-400 border border-amber-500/20"}`}>
                      <Skull className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-[11px]">{log.type}</span>
                        <span className="text-[10px] text-slate-500">{log.id}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1">SOURCE: {log.source} &rarr; TARGET: {log.target}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right">
                      <span className="block text-xs font-bold text-white">{log.score}% threat</span>
                      <span className="text-[9px] text-slate-500">ISOLATION REQUIRED</span>
                    </div>
                    <button
                      onClick={() => {
                        setLogs((prev) => prev.filter((l) => l.id !== log.id));
                      }}
                      className="h-8 px-3 rounded-lg bg-rose-500/10 border border-rose-500/25 hover:bg-rose-500/20 text-rose-400 hover:text-white transition-colors cursor-pointer"
                    >
                      Isolate
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
