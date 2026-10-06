"use client";

import React, { useState, useEffect, useRef } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { ShieldAlert, TrendingUp, Users, Activity, Eye, Play, Plus, RefreshCw, ZoomIn, ZoomOut, Move } from "lucide-react";
import GlassCard from "../ui/GlassCard";

// Recharts analytical data
const chartData = [
  { name: "00:00", threatLevel: 24, investigations: 5 },
  { name: "04:00", threatLevel: 35, investigations: 6 },
  { name: "08:00", threatLevel: 80, investigations: 12 },
  { name: "12:00", threatLevel: 55, investigations: 14 },
  { name: "16:00", threatLevel: 45, investigations: 10 },
  { name: "20:00", threatLevel: 70, investigations: 15 },
  { name: "24:00", threatLevel: 30, investigations: 8 },
];

interface Node {
  id: string;
  x: number;
  y: number;
  label: string;
  type: "IP" | "ACCOUNT" | "DEVICE" | "HOST" | "LOCATION";
  status: "secure" | "compromised" | "warning";
  radius: number;
}

interface Link {
  source: string;
  target: string;
}

export default function AICommandCenter() {
  const [isClient, setIsClient] = useState(false);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  
  // Interactive network graph states
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  
  // Nodes & Links definition
  const [nodes, setNodes] = useState<Node[]>([
    { id: "1", x: 120, y: 150, label: "ENDPOINT-X1", type: "DEVICE", status: "compromised", radius: 14 },
    { id: "2", x: 300, y: 90, label: "192.168.10.42", type: "IP", status: "warning", radius: 12 },
    { id: "3", x: 260, y: 250, label: "WALLET_APAC_SEC", type: "ACCOUNT", status: "secure", radius: 15 },
    { id: "4", x: 440, y: 180, label: "AWS-NODE-ROOT", type: "HOST", status: "compromised", radius: 18 },
    { id: "5", x: 100, y: 300, label: "SINGAPORE_GATEWAY", type: "LOCATION", status: "warning", radius: 16 },
    { id: "6", x: 480, y: 320, label: "AGENT_TERMINAL", type: "DEVICE", status: "secure", radius: 12 },
    { id: "7", x: 600, y: 220, label: "SWIFT_ROUTER_09", type: "HOST", status: "warning", radius: 14 },
  ]);

  const links: Link[] = [
    { source: "1", target: "2" },
    { source: "2", target: "3" },
    { source: "3", target: "4" },
    { source: "1", target: "5" },
    { source: "3", target: "5" },
    { source: "4", target: "6" },
    { source: "4", target: "7" },
  ];

  // Cases database
  const activeCases = [
    { id: "VS-904", title: "APAC Credit Card Farm", risk: "CRITICAL", date: "10m ago", score: 94 },
    { id: "VS-881", title: "London ATM Multiplexing", risk: "HIGH", date: "45m ago", score: 78 },
    { id: "VS-501", title: "VPN Proxy Tunneling Node B", risk: "MEDIUM", date: "2h ago", score: 52 },
  ];

  // Real-time security events log
  const [logs, setLogs] = useState<string[]>([
    "SYS_INIT: Quantum shield logic authorized.",
    "NETWORK_AUDIT: Scanning external relays...",
    "THREAT_DETECT: Port scan on AWS-NODE-ROOT bypass flagged.",
    "INVESTIGATOR_NET: Field coordinates updated for MERCER.",
  ]);

  useEffect(() => {
    setIsClient(true);
    
    // Periodically inject new mock alerts
    const interval = setInterval(() => {
      const mockAlerts = [
        "ANOMALY_ALARM: Root login attempt from VPN proxy node.",
        "INTEGRITY_SHIELD: Intercepted packet request at SG Gateway.",
        "SWIFT_ANOMALY: Transmit threshold exceeded: SWIFT_ROUTER_09.",
        "CASE_RESOLVE: Case VS-492 resolved: synthetic accounts isolated.",
      ];
      const randomAlert = mockAlerts[Math.floor(Math.random() * mockAlerts.length)];
      setLogs((prev) => [randomAlert, ...prev.slice(0, 5)]);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  // Canvas Drawing Loop
  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw links
    ctx.lineWidth = 1.5;
    links.forEach((link) => {
      const srcNode = nodes.find((n) => n.id === link.source);
      const tgtNode = nodes.find((n) => n.id === link.target);
      if (srcNode && tgtNode) {
        // Line gradient
        const grad = ctx.createLinearGradient(
          srcNode.x * scale + pan.x,
          srcNode.y * scale + pan.y,
          tgtNode.x * scale + pan.x,
          tgtNode.y * scale + pan.y
        );

        if (srcNode.status === "compromised" || tgtNode.status === "compromised") {
          grad.addColorStop(0, "rgba(244, 63, 94, 0.4)");
          grad.addColorStop(1, "rgba(244, 63, 94, 0.1)");
        } else {
          grad.addColorStop(0, "rgba(99, 102, 241, 0.3)");
          grad.addColorStop(1, "rgba(99, 102, 241, 0.1)");
        }

        ctx.strokeStyle = grad;
        ctx.beginPath();
        ctx.moveTo(srcNode.x * scale + pan.x, srcNode.y * scale + pan.y);
        ctx.lineTo(tgtNode.x * scale + pan.x, tgtNode.y * scale + pan.y);
        ctx.stroke();
      }
    });

    // Draw nodes
    nodes.forEach((node) => {
      const cx = node.x * scale + pan.x;
      const cy = node.y * scale + pan.y;
      const r = node.radius * scale;

      // Outer glowing ring for warning/compromised status
      ctx.beginPath();
      ctx.arc(cx, cy, r + 4 * scale, 0, Math.PI * 2);
      if (node.status === "compromised") {
        ctx.strokeStyle = "rgba(244, 63, 94, 0.3)";
        ctx.lineWidth = 2;
        ctx.stroke();
      } else if (node.status === "warning") {
        ctx.strokeStyle = "rgba(251, 191, 36, 0.3)";
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Draw node core
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      
      let nodeColor = "#00f2fe"; // Secure default
      if (node.status === "compromised") nodeColor = "#f43f5e";
      else if (node.status === "warning") nodeColor = "#fbbf24";

      ctx.fillStyle = nodeColor;
      ctx.shadowBlur = 15;
      ctx.shadowColor = nodeColor;
      ctx.fill();
      ctx.shadowBlur = 0; // Reset shadow

      // Circle border reflection
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(255,255,255,0.4)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Node label
      ctx.font = `bold ${Math.max(10, 10 * scale)}px Share Tech Mono`;
      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "center";
      ctx.fillText(node.label, cx, cy - r - 8 * scale);

      // Node type indicator icon shorthand
      ctx.font = `${Math.max(8, 8 * scale)}px Share Tech Mono`;
      ctx.fillStyle = "#030712";
      ctx.fillText(node.type.substring(0, 3), cx, cy + 3 * scale);
    });

    // Highlight selected node with a cyan dotted circle
    if (selectedNode) {
      const cx = selectedNode.x * scale + pan.x;
      const cy = selectedNode.y * scale + pan.y;
      const r = selectedNode.radius * scale;

      ctx.beginPath();
      ctx.arc(cx, cy, r + 8 * scale, 0, Math.PI * 2);
      ctx.strokeStyle = "#00f2fe";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.setLineDash([]); // Reset dash
    }
  }, [nodes, scale, pan, selectedNode]);

  // Network mouse handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    // Check if clicked a node
    const clickedNode = nodes.find((node) => {
      const cx = node.x * scale + pan.x;
      const cy = node.y * scale + pan.y;
      const dist = Math.sqrt((cx - mx) ** 2 + (cy - my) ** 2);
      return dist <= node.radius * scale + 10;
    });

    if (clickedNode) {
      setDraggedNodeId(clickedNode.id);
      setSelectedNode(clickedNode);
    } else {
      // Pan canvas instead
      setIsPanning(true);
      setPanStart({ x: mx - pan.x, y: my - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    if (draggedNodeId) {
      setNodes((prev) =>
        prev.map((node) =>
          node.id === draggedNodeId
            ? { ...node, x: (mx - pan.x) / scale, y: (my - pan.y) / scale }
            : node
        )
      );
    } else if (isPanning) {
      setPan({ x: mx - panStart.x, y: my - panStart.y });
    }
  };

  const handleMouseUpOrLeave = () => {
    setDraggedNodeId(null);
    setIsPanning(false);
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      {/* Top Header Metrics row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <GlassCard title="Active Incidents" subtitle="LIVE FEED" glowColor="blue">
          <div className="flex items-center justify-between mt-2">
            <span className="font-display font-bold text-4xl text-cyan-400">14</span>
            <ShieldAlert className="w-8 h-8 text-cyan-400/40 animate-pulse" />
          </div>
          <p className="text-[10px] font-mono text-slate-400 mt-2">5 IN THREAT STATE CRITICAL</p>
        </GlassCard>

        <GlassCard title="Threat Rate" subtitle="DELTA SEC" glowColor="purple">
          <div className="flex items-center justify-between mt-2">
            <span className="font-display font-bold text-4xl text-purple-400">+12.4%</span>
            <TrendingUp className="w-8 h-8 text-purple-400/40" />
          </div>
          <p className="text-[10px] font-mono text-slate-400 mt-2">PEAK ACTIVITY DETECTED AT 09:00</p>
        </GlassCard>

        <GlassCard title="Active Operators" subtitle="FLEET GEO" glowColor="emerald">
          <div className="flex items-center justify-between mt-2">
            <span className="font-display font-bold text-4xl text-emerald-400">08</span>
            <Users className="w-8 h-8 text-emerald-400/40" />
          </div>
          <p className="text-[10px] font-mono text-slate-400 mt-2">ALL SYSTEMS LINKED & SYNCED</p>
        </GlassCard>

        <GlassCard title="Node Security" subtitle="SYSTEM INTEGRITY" glowColor="indigo">
          <div className="flex items-center justify-between mt-2">
            <span className="font-display font-bold text-4xl text-indigo-400">99.8%</span>
            <Activity className="w-8 h-8 text-indigo-400/40" />
          </div>
          <p className="text-[10px] font-mono text-slate-400 mt-2">SHIELD CAPACITY NOMINAL</p>
        </GlassCard>
      </div>

      {/* Main Split Layout: Map/Network and Right Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Interactive 3D/2D Graph Canvas */}
        <div className="lg:col-span-2 flex flex-col h-[520px] glass-panel rounded-[32px] overflow-hidden border border-indigo-500/15 relative">
          {/* Canvas header controls */}
          <div className="absolute top-4 left-4 z-10 flex gap-2">
            <button
              onClick={() => setScale((s) => Math.min(2, s + 0.1))}
              className="w-8 h-8 rounded-lg bg-slate-950/60 border border-slate-800 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer hover:bg-slate-900 transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => setScale((s) => Math.max(0.5, s - 0.1))}
              className="w-8 h-8 rounded-lg bg-slate-950/60 border border-slate-800 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer hover:bg-slate-900 transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setScale(1);
                setPan({ x: 0, y: 0 });
              }}
              className="w-8 h-8 rounded-lg bg-slate-950/60 border border-slate-800 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer hover:bg-slate-900 transition-colors"
              title="Recenter"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5 px-3 py-1 rounded-full border border-indigo-500/20 bg-indigo-950/40 text-[9px] font-mono text-indigo-400">
            <Move className="w-3 h-3 animate-pulse text-indigo-300" />
            <span>DRAG NODES OR PAN AREA</span>
          </div>

          {/* Interactive HTML5 Canvas */}
          <canvas
            ref={canvasRef}
            width={720}
            height={520}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUpOrLeave}
            onMouseLeave={handleMouseUpOrLeave}
            className="w-full h-full bg-slate-950/30 cursor-grab active:cursor-grabbing"
          />

          {/* Graph node details drawer overlays bottom left */}
          {selectedNode && (
            <div className="absolute bottom-4 left-4 right-4 p-4 glass-panel rounded-2xl border border-cyan-500/20 bg-slate-950/90 flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300 z-10">
              <div className="text-left font-mono">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${
                    selectedNode.status === "compromised" ? "bg-rose-500" : selectedNode.status === "warning" ? "bg-amber-400" : "bg-emerald-400"
                  }`} />
                  <span className="text-xs text-slate-400 uppercase tracking-widest">{selectedNode.type}</span>
                  <span className="text-xs font-semibold text-white">{selectedNode.label}</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">ENTITY ID: {selectedNode.id} | THREAT STATUS: {selectedNode.status.toUpperCase()}</p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setNodes((prev) =>
                      prev.map((n) =>
                        n.id === selectedNode.id ? { ...n, status: "secure" } : n
                      )
                    );
                    setSelectedNode((prev) => prev ? { ...prev, status: "secure" } : null);
                  }}
                  className="h-8 px-4 rounded-xl bg-cyan-400 text-slate-950 hover:bg-cyan-300 font-display font-semibold text-xs transition-all cursor-pointer"
                >
                  Mitigate Node Anomaly
                </button>
                <button
                  onClick={() => setSelectedNode(null)}
                  className="h-8 px-3 rounded-xl border border-slate-800 bg-slate-900 text-slate-400 hover:text-white font-mono text-xs cursor-pointer transition-colors"
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Dashboard Analytics cards */}
        <div className="space-y-6 flex flex-col h-[520px]">
          {/* Active Cases prioritization queue */}
          <GlassCard title="Priority Cases" subtitle="QUEUE STATE" className="flex-1" glowColor="none">
            <div className="space-y-3.5 mt-2">
              {activeCases.map((c) => (
                <div
                  key={c.id}
                  className="p-3.5 rounded-[20px] bg-slate-900/40 border border-slate-800/50 flex items-center justify-between hover:border-slate-700/60 transition-colors"
                >
                  <div className="text-left">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[8px] font-mono tracking-wider font-semibold ${
                        c.risk === "CRITICAL" ? "bg-rose-500/10 text-rose-400 border border-rose-500/20" : c.risk === "HIGH" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" : "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                      }`}>
                        {c.risk}
                      </span>
                      <span className="font-mono text-[9px] text-slate-500">{c.id}</span>
                    </div>
                    <p className="font-display font-semibold text-xs text-white mt-1.5">{c.title}</p>
                  </div>
                  <div className="text-right font-mono">
                    <span className="block text-xs font-bold text-white">{c.score}%</span>
                    <span className="text-[9px] text-indigo-400">{c.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Core Analytics trends */}
          {isClient && (
            <GlassCard title="Threat Velocity" subtitle="CYBER TELEMETRY" className="h-44" glowColor="blue">
              <div className="w-full h-24 mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                    <defs>
                      <linearGradient id="glowColor" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00f2fe" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#00f2fe" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" stroke="#64748b" fontSize={9} tickLine={false} />
                    <YAxis stroke="#64748b" fontSize={9} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        background: "rgba(15, 23, 42, 0.9)",
                        border: "1px solid rgba(0, 242, 254, 0.2)",
                        borderRadius: "12px",
                        fontSize: "10px",
                        color: "#fff",
                        fontFamily: "Share Tech Mono",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="threatLevel"
                      stroke="#00f2fe"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#glowColor)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>
          )}
        </div>
      </div>

      {/* Cyber Security Log System */}
      <GlassCard title="Security Terminal Event Logs" subtitle="CORE PACKET STREAM" glowColor="none">
        <div className="font-mono text-left text-xs bg-slate-950/60 border border-slate-900 p-4 rounded-[22px] h-32 overflow-y-auto space-y-1.5 scrollbar-thin">
          {logs.map((log, i) => (
            <div key={i} className="flex gap-2.5 items-start">
              <span className="text-slate-500 shrink-0 select-none">[{new Date().toLocaleTimeString()}]</span>
              <span className={`leading-relaxed ${
                log.includes("DETECT") || log.includes("ALARM") || log.includes("ANOMALY")
                  ? "text-rose-400"
                  : log.includes("GATEWAY") || log.includes("SHIELD")
                  ? "text-cyan-400"
                  : "text-slate-300"
              }`}>
                {log}
              </span>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
