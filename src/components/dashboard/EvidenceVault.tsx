"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Image,
  Video,
  ShieldCheck,
  Upload,
  Calendar,
  AlertTriangle,
  FileCheck,
  Tag,
  Hash,
  Sparkles,
} from "lucide-react";
import GlassCard from "../ui/GlassCard";

interface EvidenceFile {
  id: string;
  name: string;
  type: "document" | "image" | "video";
  date: string;
  size: string;
  hash: string;
  status: "verified" | "flagged";
  aiSummary: string;
  tags: string[];
  imagePreview?: string;
}

export default function EvidenceVault() {
  const [evidenceList, setEvidenceList] = useState<EvidenceFile[]>([
    {
      id: "EV-402",
      name: "ledger_leak_singapore.pdf",
      type: "document",
      date: "2026-06-18 14:23",
      size: "4.8 MB",
      hash: "SHA256: 4e9a8f...39b",
      status: "verified",
      aiSummary: "Singapore routing entity ledger containing transaction mismatch signatures. Identified 12 unauthorized routing loops spanning offshore accounts.",
      tags: ["Ledger", "APAC", "Mismatches"],
      imagePreview: "/evidence/ledger_leak_singapore.jpg",
    },
    {
      id: "EV-391",
      name: "surveillance_cam_lnd.mp4",
      type: "video",
      date: "2026-06-17 09:12",
      size: "82.4 MB",
      hash: "SHA256: d8f29c...1a2",
      status: "flagged",
      aiSummary: "CCTV footage outside central ATM lobby. Computer vision flagged suspect profile matching anomaly watchlist 881-A. Confidence level: 89%.",
      tags: ["London", "CCTV", "ATM"],
      imagePreview: "/evidence/surveillance_cam_lnd.jpg",
    },
    {
      id: "EV-210",
      name: "agent_mercer_capture.png",
      type: "image",
      date: "2026-06-18 23:44",
      size: "1.2 MB",
      hash: "SHA256: a8c92b...e3c",
      status: "verified",
      aiSummary: "Field camera capture confirming suspects meeting at coordinated rendezvous point. Dynamic facial matching matches target records.",
      tags: ["Mercer", "Rendezvous", "Visual"],
      imagePreview: "/evidence/agent_mercer_capture.jpg",
    },
    {
      id: "EV-104",
      name: "packet_dump_relay.bin",
      type: "document",
      date: "2026-06-15 18:04",
      size: "14.2 MB",
      hash: "SHA256: f8b71d...92e",
      status: "flagged",
      aiSummary: "Binary logs captured from relay server during connection spike. Decoded protocol metadata exposes spoofed MAC addresses.",
      tags: ["Packets", "Relay", "Binary"],
      imagePreview: "/evidence/packet_dump_relay.jpg",
    },
  ]);

  const [activeFile, setActiveFile] = useState<EvidenceFile | null>(evidenceList[0]);
  const [dragActive, setDragActive] = useState(false);
  
  // File upload simulation states
  const [isUploading, setIsUploading] = useState(false);
  const [uploadPercent, setUploadPercent] = useState(0);
  const [uploadState, setUploadState] = useState("");

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      simulateUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      simulateUpload(e.target.files[0]);
    }
  };

  const simulateUpload = (file: File) => {
    setIsUploading(true);
    setUploadPercent(0);
    setUploadState("Connecting to vault cluster...");

    const fileType = file.type.includes("image")
      ? "image"
      : file.type.includes("video")
      ? "video"
      : "document";

    // Timing state simulation
    const steps = [
      { p: 15, msg: "Allocating encrypted memory block..." },
      { p: 40, msg: "Streaming packet binary payload..." },
      { p: 65, msg: "Running deep antivirus audit scan..." },
      { p: 85, msg: "Calculating SHA256 checksum hash..." },
      { p: 98, msg: "AI generating intelligence synthesis..." },
      { p: 100, msg: "Decoded node synced!" },
    ];

    let currentStepIdx = 0;
    const interval = setInterval(() => {
      if (currentStepIdx < steps.length) {
        const step = steps[currentStepIdx];
        setUploadPercent(step.p);
        setUploadState(step.msg);
        currentStepIdx++;
      } else {
        clearInterval(interval);
        
        // Add new file to state
        const newEvidence: EvidenceFile = {
          id: `EV-${Math.floor(100 + Math.random() * 899)}`,
          name: file.name.toLowerCase().replace(/\s+/g, "_"),
          type: fileType,
          date: new Date().toISOString().replace("T", " ").substring(0, 16),
          size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
          hash: `SHA256: ${Math.random().toString(36).substring(2, 8)}...${Math.random().toString(36).substring(2, 5)}`,
          status: Math.random() > 0.4 ? "verified" : "flagged",
          aiSummary: `Uploaded binary file audit complete. Metadata analysis identifies file signature match for ${file.name}. Secure logs compiled.`,
          tags: ["Uploaded", fileType.toUpperCase()],
        };

        setEvidenceList((prev) => [newEvidence, ...prev]);
        setActiveFile(newEvidence);
        setIsUploading(false);
      }
    }, 800);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "image":
        return <Image className="w-5 h-5 text-cyan-400" />;
      case "video":
        return <Video className="w-5 h-5 text-purple-400" />;
      default:
        return <FileText className="w-5 h-5 text-indigo-400" />;
    }
  };

  // Timeline events list
  const timelineEvents = [
    { time: "09:12", title: "ATM Camera Capture", desc: "CCTV flags face signature outside bank.", type: "system" },
    { time: "11:45", title: "Token Route Leak", desc: "APAC ledger audit catches transfer delta.", type: "audit" },
    { time: "14:23", title: "Evidence Ingested", desc: "Singapore ledger stored in vault database.", type: "action" },
    { time: "23:44", title: "Rendezvous Confirmation", desc: "Agent Mercer uploads facial verification confirmation.", type: "agent" },
  ];

  return (
    <div className="flex-1 p-6 overflow-y-auto space-y-6">
      {/* Page Title Header */}
      <div className="flex justify-between items-center pb-4 border-b border-indigo-500/10">
        <div className="text-left">
          <h1 className="font-display font-bold text-2xl tracking-tight text-white">Classified Evidence Vault</h1>
          <p className="font-mono text-xs text-slate-400">ENCRYPTED COLD STORAGE INTEGRITY PORTAL</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Drag & Drop upload and Masonry file list */}
        <div className="lg:col-span-2 space-y-6">
          {/* Drag & Drop uploader area */}
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            className={`relative p-8 rounded-[28px] border-2 border-dashed glass-panel flex flex-col items-center justify-center text-center transition-all ${
              dragActive
                ? "border-cyan-400 bg-cyan-950/20 shadow-[0_0_25px_rgba(6,182,212,0.15)]"
                : "border-indigo-500/15 bg-slate-950/20 hover:border-indigo-500/30"
            }`}
          >
            <AnimatePresence>
              {isUploading ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full max-w-sm space-y-4 py-4"
                >
                  <div className="flex justify-between font-mono text-xs text-cyan-400">
                    <span>{uploadState}</span>
                    <span>{uploadPercent}%</span>
                  </div>
                  
                  {/* Glowing progress slider track */}
                  <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-cyan-500/10">
                    <motion.div
                      className="h-full bg-gradient-to-r from-cyan-400 to-indigo-500 shadow-[0_0_8px_#00f2fe]"
                      animate={{ width: `${uploadPercent}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center"
                >
                  <Upload className="w-10 h-10 text-indigo-400 animate-bounce mb-3" />
                  <p className="font-display font-medium text-sm text-slate-200">
                    Drag & Drop Case Files here or{" "}
                    <label className="text-cyan-400 hover:text-cyan-300 cursor-pointer transition-colors underline">
                      browse folders
                      <input
                        type="file"
                        className="hidden"
                        onChange={handleFileChange}
                        accept="image/*,video/*,.pdf,.doc,.docx,.bin"
                      />
                    </label>
                  </p>
                  <p className="font-mono text-[10px] text-slate-500 uppercase tracking-widest mt-1">
                    MAX INTEGRITY METADATA INGEST LIMIT: 100MB
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Masonry files list */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {evidenceList.map((file) => (
              <div
                key={file.id}
                onClick={() => setActiveFile(file)}
                className={`p-5 rounded-[26px] glass-panel border text-left cursor-pointer flex flex-col justify-between transition-all ${
                  activeFile?.id === file.id
                    ? "border-cyan-500/40 bg-cyan-950/15 shadow-[0_0_20px_rgba(6,182,212,0.1)]"
                    : "border-indigo-500/10 bg-slate-950/40 hover:border-indigo-500/20"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800/80 shrink-0 overflow-hidden relative flex items-center justify-center">
                        {file.imagePreview ? (
                          <img
                            src={file.imagePreview}
                            alt={file.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          getIcon(file.type)
                        )}
                      </div>
                      <div>
                        <h4 className="font-display font-semibold text-sm text-white max-w-[150px] truncate">
                          {file.name}
                        </h4>
                        <span className="font-mono text-[9px] text-slate-500">{file.id}</span>
                      </div>
                    </div>
                    
                    <span className={`px-2 py-0.5 rounded text-[8px] font-mono font-semibold tracking-wider ${
                      file.status === "verified"
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/25"
                        : "bg-rose-500/10 text-rose-400 border border-rose-500/25"
                    }`}>
                      {file.status.toUpperCase()}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                    {file.aiSummary}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-3 border-t border-slate-900">
                  {file.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded bg-slate-900 text-[8px] font-mono text-indigo-400 border border-indigo-500/5"
                    >
                      #{tag.toUpperCase()}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Preview & Info details panel & timeline */}
        <div className="space-y-6">
          <AnimatePresence mode="wait">
            {activeFile ? (
              <motion.div
                key={activeFile.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <GlassCard title="Evidence Intelligence Core" subtitle="FILE PREVIEW" glowColor="blue">
                  {/* File abstract preview card */}
                  <div className="aspect-video w-full rounded-[20px] bg-slate-950 border border-slate-800/80 flex flex-col items-center justify-center relative overflow-hidden mb-5 group">
                    {activeFile.imagePreview ? (
                      <>
                        {/* Real Forensic Evidence Image */}
                        <img
                          src={activeFile.imagePreview}
                          alt={activeFile.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        {/* High-tech Hologram & HUD Scanlines Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent pointer-events-none" />
                        
                        {/* Forensic Target Crosshairs HUD */}
                        <div className="absolute top-3 left-3 flex items-center gap-2 px-2.5 py-1 rounded-md bg-slate-950/80 backdrop-blur-md border border-cyan-500/30 font-mono text-[9px] text-cyan-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                          <span>FORENSIC_OPTICAL_FEED://HD</span>
                        </div>
                        <div className="absolute top-3 right-3 px-2 py-0.5 rounded bg-slate-950/80 backdrop-blur-md border border-indigo-500/30 font-mono text-[8px] text-indigo-300">
                          {activeFile.size}
                        </div>
                        
                        {/* Bottom file label */}
                        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between font-mono text-xs">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded bg-cyan-500/20 border border-cyan-500/40 text-[9px] text-cyan-300 uppercase font-bold">
                              {activeFile.id}
                            </span>
                            <span className="text-[11px] text-slate-200 font-semibold truncate max-w-[180px] drop-shadow-md">
                              {activeFile.name}
                            </span>
                          </div>
                          <span className="text-[9px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30 font-bold">
                            SEALED 100%
                          </span>
                        </div>
                      </>
                    ) : (
                      <>
                        {/* Simulated hologram overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-cyan-950/20 via-transparent to-transparent z-10" />
                        
                        <div className="z-10 flex flex-col items-center gap-2">
                          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-cyan-400">
                            {activeFile.type === "image" ? (
                              <Image className="w-8 h-8 animate-pulse" />
                            ) : activeFile.type === "video" ? (
                              <Video className="w-8 h-8 animate-pulse" />
                            ) : (
                              <FileText className="w-8 h-8" />
                            )}
                          </div>
                          <span className="font-mono text-xs text-slate-300">{activeFile.name}</span>
                          <span className="font-mono text-[9px] text-indigo-400">{activeFile.size}</span>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Metadata tags */}
                  <div className="space-y-4 text-left font-mono text-xs">
                    {/* AI Digest Card */}
                    <div className="p-4 rounded-xl border border-cyan-500/20 bg-cyan-950/15">
                      <div className="flex items-center gap-1.5 text-cyan-400 font-bold mb-2">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>AI CORE SYNTHESIS</span>
                      </div>
                      <p className="text-slate-300 leading-relaxed text-[11px] font-sans">
                        {activeFile.aiSummary}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 border-t border-slate-900 pt-4">
                      <div className="space-y-1">
                        <span className="text-slate-500 block text-[9px]">CHECKSUM DATA</span>
                        <div className="flex items-center gap-1 text-slate-300">
                          <Hash className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                          <span className="text-[10px] truncate">{activeFile.hash}</span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <span className="text-slate-500 block text-[9px]">INGEST TIMESTAMP</span>
                        <div className="flex items-center gap-1 text-slate-300">
                          <Calendar className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                          <span className="text-[10px]">{activeFile.date}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ) : (
              <GlassCard title="Evidence Intelligence" subtitle="SELECTION NEEDED">
                <div className="py-12 text-center text-slate-500 font-mono text-xs">
                  <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                  Select an audit record to view case analysis.
                </div>
              </GlassCard>
            )}
          </AnimatePresence>

          {/* Timeline Audit Logs */}
          <GlassCard title="Case Discovery Timeline" subtitle="MILESTONES DETECTED" glowColor="none">
            <div className="relative pl-6 border-l border-indigo-500/20 space-y-5 text-left py-2">
              {timelineEvents.map((ev, i) => (
                <div key={i} className="relative font-mono text-xs">
                  {/* Timeline dot */}
                  <div className="absolute -left-[30px] top-1 w-2 h-2 rounded-full bg-indigo-500 border border-slate-950 shadow-[0_0_8px_#6366f1]" />
                  
                  <div className="flex items-center justify-between text-indigo-400 font-bold mb-1">
                    <span>{ev.title}</span>
                    <span className="text-[10px] text-slate-500">{ev.time}</span>
                  </div>
                  <p className="text-slate-400 text-[11px] font-sans leading-relaxed">{ev.desc}</p>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
