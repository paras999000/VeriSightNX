"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Send, X, Mic, RefreshCw, Sparkles, Terminal } from "lucide-react";

interface Message {
  sender: "user" | "jarvis";
  text: string;
  time: string;
}

export default function AICopilot() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "jarvis",
      text: "VeriSight AI Assistant online. Systems initialized at 100%. State query: active.",
      time: "00:01",
    },
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    // Add User Message
    const userMsg: Message = {
      sender: "user",
      text,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsThinking(true);

    // Simulate JARVIS thinking and responding
    setTimeout(() => {
      let reply = "";
      const lower = text.toLowerCase();

      if (lower.includes("summar") || lower.includes("case") || lower.includes("vault")) {
        reply = "Vault Database Audit Complete. I have identified 3 unresolved anomalies. Case VS-9204 (Synthetic Fraud Ring) remains our highest critical threshold. Primary threat signature involves credit staking inside APAC transaction routes.";
      } else if (lower.includes("risk") || lower.includes("fraud") || lower.includes("score")) {
        reply = "Analyzing risk vectors. Machine learning models indicate a 91.2% probability threat spike on Node-B8. I recommend immediately isolating transaction logs from the Singapore regional server.";
      } else if (lower.includes("agent") || lower.includes("track") || lower.includes("map")) {
        reply = "Field coordinates update: Agent Alex Mercer is currently transiting within Geofence Alpha, London Sector. Telemetry suggests standard patrol speed (45 km/h). No elevated vitals detected.";
      } else {
        reply = "Acknowledged. Cross-referencing neural models... Integrity check passed. I am monitoring active streams. Let me know if you require automated packet analysis or entity correlation.";
      }

      setMessages((prev) => [
        ...prev,
        {
          sender: "jarvis",
          text: reply,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
      setIsThinking(false);
    }, 1500);
  };

  const handleVoiceMode = () => {
    setIsVoiceActive(!isVoiceActive);
    if (!isVoiceActive) {
      setIsThinking(true);
      setTimeout(() => {
        setIsThinking(false);
        setMessages((prev) => [
          ...prev,
          {
            sender: "jarvis",
            text: "Audio communication interface ready. Standard monitoring enabled.",
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
      }, 1000);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {/* Chat Console Panel */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            className="w-80 md:w-96 h-[500px] mb-4 glass-panel rounded-[28px] border border-cyan-500/20 bg-slate-950/80 backdrop-blur-2xl shadow-[0_20px_50px_rgba(6,182,212,0.25)] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-indigo-500/10 bg-gradient-to-r from-slate-950 to-indigo-950/40">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 absolute inset-0 animate-ping opacity-75" />
                  <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 border border-slate-950" />
                </div>
                <div>
                  <h3 className="font-display text-sm font-semibold text-white tracking-wide">JARVIS AI CO-PILOT</h3>
                  <p className="font-mono text-[8px] text-cyan-400 tracking-widest">DECISION NODE v0.4</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-900/60 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages Thread */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 font-sans text-xs">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl p-3 border ${
                      msg.sender === "user"
                        ? "bg-indigo-600/20 border-indigo-500/35 text-slate-100 rounded-tr-none"
                        : "bg-slate-900/50 border-cyan-500/15 text-slate-200 rounded-tl-none font-mono"
                    }`}
                  >
                    <p className="leading-relaxed whitespace-pre-line">{msg.text}</p>
                    <span className="block text-[8px] text-slate-500 mt-1 text-right">{msg.time}</span>
                  </div>
                </div>
              ))}

              {isThinking && (
                <div className="flex justify-start">
                  <div className="bg-slate-900/50 border border-cyan-500/15 rounded-2xl rounded-tl-none p-3 flex items-center gap-2">
                    {/* Animated Micro Orb */}
                    <div className="flex space-x-1">
                      <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                    <span className="font-mono text-[10px] text-cyan-400">Processing Node...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Interactive Query Chips */}
            <div className="px-4 py-2 border-t border-indigo-500/5 bg-slate-950/40 flex gap-2 overflow-x-auto select-none no-scrollbar">
              <button
                onClick={() => handleSend("Summarize current database alerts")}
                className="px-2.5 py-1 rounded-full border border-indigo-500/20 bg-indigo-950/20 text-[9px] font-mono text-indigo-300 hover:bg-indigo-950/50 hover:text-white shrink-0 cursor-pointer transition-all"
              >
                <Sparkles className="w-2.5 h-2.5 inline mr-1" /> Cases Summary
              </button>
              <button
                onClick={() => handleSend("Assess Singapore risk indices")}
                className="px-2.5 py-1 rounded-full border border-rose-500/20 bg-rose-950/20 text-[9px] font-mono text-rose-300 hover:bg-rose-950/50 hover:text-white shrink-0 cursor-pointer transition-all"
              >
                <Terminal className="w-2.5 h-2.5 inline mr-1" /> Risk Analysis
              </button>
              <button
                onClick={() => handleSend("Where is Agent Alex Mercer?")}
                className="px-2.5 py-1 rounded-full border border-emerald-500/20 bg-emerald-950/20 text-[9px] font-mono text-emerald-300 hover:bg-emerald-950/50 hover:text-white shrink-0 cursor-pointer transition-all"
              >
                <Bot className="w-2.5 h-2.5 inline mr-1" /> Track Mercer
              </button>
            </div>

            {/* Input Console */}
            <div className="p-3 border-t border-indigo-500/10 bg-slate-950 flex gap-2 items-center">
              <button
                onClick={handleVoiceMode}
                className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-center shrink-0 ${
                  isVoiceActive
                    ? "bg-rose-500/20 border-rose-500 text-rose-400 animate-pulse"
                    : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200"
                }`}
                title="Toggle vocal connection"
              >
                <Mic className="w-4 h-4" />
              </button>

              <div className="relative flex-1">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend(inputText)}
                  placeholder={isVoiceActive ? "Listening for speech input..." : "Query cyber integrity core..."}
                  disabled={isVoiceActive}
                  className="w-full h-10 px-3 rounded-xl border border-indigo-500/15 bg-slate-900/60 text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-400/60 transition-all disabled:opacity-50"
                />
              </div>

              <button
                onClick={() => handleSend(inputText)}
                className="p-2.5 rounded-xl bg-cyan-400 text-slate-950 hover:bg-cyan-300 transition-colors flex items-center justify-center cursor-pointer shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>

            {/* Voice Mode Waveform Overlay */}
            {isVoiceActive && (
              <div className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center z-40">
                <p className="font-mono text-xs text-rose-400 animate-pulse mb-6">INTELLIGENCE VOICE TUNNEL ONLINE</p>
                {/* Dynamic CSS Waveforms */}
                <div className="flex items-center gap-1.5 h-16 mb-8">
                  {[...Array(9)].map((_, i) => (
                    <div
                      key={i}
                      className="w-1.5 bg-rose-400 rounded-full animate-bounce"
                      style={{
                        animationDuration: `${0.6 + i * 0.15}s`,
                        height: `${20 + Math.random() * 40}px`,
                      }}
                    />
                  ))}
                </div>
                <button
                  onClick={() => setIsVoiceActive(false)}
                  className="h-9 px-4 rounded-xl border border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white font-mono text-xs cursor-pointer transition-colors"
                >
                  DISCONNECT CHANNEL
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Orb trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative group w-16 h-16 rounded-full flex items-center justify-center cursor-pointer overflow-visible"
        aria-label="Toggle Copilot AI console"
      >
        {/* Multiple Glowing Concentric Rings */}
        <div className="absolute inset-0 rounded-full bg-cyan-500/20 blur-md group-hover:bg-cyan-500/30 transition-all animate-pulse-slow" />
        <div className="absolute inset-[-4px] rounded-full border border-cyan-500/25 animate-ping opacity-60 pointer-events-none" />
        <div className="absolute inset-[-8px] rounded-full border border-indigo-500/10 animate-pulse pointer-events-none" />

        {/* Outer Circular border with rotating gradient mask */}
        <div className="absolute inset-0 rounded-full p-[1px] bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-500 animate-spin" style={{ animationDuration: "12s" }} />

        {/* Inner core orb */}
        <div className="absolute inset-[2px] rounded-full bg-gradient-to-br from-slate-950 to-slate-900 flex items-center justify-center overflow-hidden">
          {/* Internal Glowing Aurora Particles */}
          <div className="absolute w-12 h-12 rounded-full bg-cyan-400/20 blur-sm animate-pulse" />
          <div className="absolute w-8 h-8 rounded-full bg-indigo-500/30 blur-md translate-x-2 -translate-y-2 animate-bounce" style={{ animationDuration: "6s" }} />

          <Bot className="w-7 h-7 text-cyan-400 relative z-10 transition-transform group-hover:scale-110" />
        </div>
      </button>
    </div>
  );
}
