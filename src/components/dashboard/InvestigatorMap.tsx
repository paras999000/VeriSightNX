"use client";

import React, { useState, useEffect, useRef } from "react";
import { Radio, Users, Crosshair, Navigation, HelpCircle, Activity } from "lucide-react";
import GlassCard from "../ui/GlassCard";

interface Agent {
  id: string;
  name: string;
  status: "active" | "transit" | "standby";
  vitals: string;
  coords: { x: number; y: number }[];
  currentCoordIndex: number;
  color: string;
  tag: string;
}

export default function InvestigatorMap() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Custom interactive agents moving along preset paths
  const [agents, setAgents] = useState<Agent[]>([
    {
      id: "A-01",
      name: "Alex Mercer",
      status: "transit",
      vitals: "NORMAL (82 BPM)",
      coords: [
        { x: 120, y: 150 },
        { x: 180, y: 170 },
        { x: 260, y: 140 },
        { x: 340, y: 200 },
        { x: 420, y: 180 },
        { x: 500, y: 240 },
        { x: 400, y: 280 },
        { x: 300, y: 240 },
        { x: 180, y: 220 },
      ],
      currentCoordIndex: 0,
      color: "#00f2fe", // Cyber Blue
      tag: "UNIT-ALPHA",
    },
    {
      id: "A-02",
      name: "Sarah Kendall",
      status: "active",
      vitals: "ELEVATED (104 BPM)",
      coords: [
        { x: 450, y: 100 },
        { x: 520, y: 120 },
        { x: 580, y: 180 },
        { x: 550, y: 260 },
        { x: 480, y: 310 },
        { x: 440, y: 220 },
      ],
      currentCoordIndex: 0,
      color: "#fbbf24", // Warning Amber
      tag: "UNIT-OMEGA",
    },
  ]);

  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  // Update agent paths for live movement
  useEffect(() => {
    const interval = setInterval(() => {
      setAgents((prev) =>
        prev.map((agent) => {
          let nextIdx = agent.currentCoordIndex + 1;
          if (nextIdx >= agent.coords.length) {
            nextIdx = 0; // Wrap back to path start
          }
          return { ...agent, currentCoordIndex: nextIdx };
        })
      );
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  // Canvas Drawing Loop
  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Cybernetic Grid Lines
    ctx.strokeStyle = "rgba(99, 102, 241, 0.04)";
    ctx.lineWidth = 1;
    const gridSize = 40;
    for (let x = pan.x % gridSize; x < canvas.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = pan.y % gridSize; y < canvas.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Draw Cyber Streets / Vector Lines Map
    ctx.strokeStyle = "rgba(99, 102, 241, 0.08)";
    ctx.lineWidth = 1.5;
    
    // Draw horizontal grid lines resembling streets
    const streetPaths = [
      [{ x: 50, y: 80 }, { x: 650, y: 80 }],
      [{ x: 80, y: 200 }, { x: 580, y: 200 }],
      [{ x: 100, y: 320 }, { x: 620, y: 320 }],
      [{ x: 50, y: 80 }, { x: 100, y: 320 }],
      [{ x: 300, y: 50 }, { x: 300, y: 350 }],
      [{ x: 650, y: 80 }, { x: 620, y: 320 }],
    ];

    streetPaths.forEach((path) => {
      ctx.beginPath();
      ctx.moveTo(path[0].x + pan.x, path[0].y + pan.y);
      ctx.lineTo(path[1].x + pan.x, path[1].y + pan.y);
      ctx.stroke();
    });

    // Draw Bounding Geofences
    ctx.strokeStyle = "rgba(0, 242, 254, 0.25)";
    ctx.fillStyle = "rgba(0, 242, 254, 0.02)";
    ctx.lineWidth = 1.5;
    
    // Geofence Alpha
    const geoX = 80 + pan.x;
    const geoY = 60 + pan.y;
    const geoW = 280;
    const geoH = 180;
    ctx.beginPath();
    ctx.rect(geoX, geoY, geoW, geoH);
    ctx.fill();
    ctx.stroke();

    // Geofence Label
    ctx.font = "bold 9px Share Tech Mono";
    ctx.fillStyle = "rgba(0, 242, 254, 0.6)";
    ctx.fillText("GEOFENCE SEC-ALPHA [MONITORED]", geoX + 8, geoY + 14);

    // Draw Risk Heat Zones (Glow gradients)
    const heatPoints = [
      { x: 520, y: 180, r: 80, opacity: 0.15, color: "244, 63, 94" }, // Rose
      { x: 200, y: 220, r: 60, opacity: 0.12, color: "251, 191, 36" }, // Amber
    ];

    heatPoints.forEach((hp) => {
      const cx = hp.x + pan.x;
      const cy = hp.y + pan.y;
      
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, hp.r);
      grad.addColorStop(0, `rgba(${hp.color}, ${hp.opacity})`);
      grad.addColorStop(0.5, `rgba(${hp.color}, ${hp.opacity * 0.4})`);
      grad.addColorStop(1, `rgba(${hp.color}, 0)`);

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, hp.r, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw Investigators, their paths, trails, and diagnostics
    agents.forEach((agent) => {
      const currentPos = agent.coords[agent.currentCoordIndex];
      const cx = currentPos.x + pan.x;
      const cy = currentPos.y + pan.y;

      // Draw Path Segments
      ctx.strokeStyle = `${agent.color}1c`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      agent.coords.forEach((coord, i) => {
        if (i === 0) ctx.moveTo(coord.x + pan.x, coord.y + pan.y);
        else ctx.lineTo(coord.x + pan.x, coord.y + pan.y);
      });
      ctx.closePath();
      ctx.stroke();

      // Pulsing outer glow ring for investigator
      ctx.beginPath();
      ctx.arc(cx, cy, 10, 0, Math.PI * 2);
      ctx.strokeStyle = `${agent.color}44`;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Core Marker
      ctx.beginPath();
      ctx.arc(cx, cy, 4, 0, Math.PI * 2);
      ctx.fillStyle = agent.color;
      ctx.shadowBlur = 10;
      ctx.shadowColor = agent.color;
      ctx.fill();
      ctx.shadowBlur = 0; // Reset

      // Telemetry detail label
      ctx.font = "bold 9px Share Tech Mono";
      ctx.fillStyle = "#ffffff";
      ctx.fillText(agent.name.toUpperCase(), cx + 14, cy - 2);

      ctx.font = "8px Share Tech Mono";
      ctx.fillStyle = agent.color;
      ctx.fillText(`${agent.tag} | ${agent.status.toUpperCase()}`, cx + 14, cy + 8);
    });
  }, [agents, pan]);

  // Pan Map Mouse Handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    setIsPanning(true);
    setPanStart({ x: mx - pan.x, y: my - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    if (isPanning) {
      setPan({ x: mx - panStart.x, y: my - panStart.y });
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  return (
    <div className="flex-1 p-6 overflow-y-auto space-y-6">
      {/* Module Title Header */}
      <div className="flex justify-between items-center pb-4 border-b border-indigo-500/10">
        <div className="text-left">
          <h1 className="font-display font-bold text-2xl tracking-tight text-white">Investigator Tactical Tracking</h1>
          <p className="font-mono text-xs text-slate-400">REAL-TIME GPS TELEMETRY & GEOFENCING LOGICS</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Map Display */}
        <div className="lg:col-span-3 h-[500px] glass-panel rounded-[32px] overflow-hidden border border-indigo-500/15 relative">
          <div className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3 py-1.5 rounded-full border border-indigo-500/20 bg-indigo-950/60 font-mono text-[9px] text-indigo-400">
            <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>RADAR STATUS: SYNCING COOPERATIVE LINK</span>
          </div>

          <div className="absolute top-4 right-4 z-10 flex items-center gap-1 text-[9px] font-mono text-slate-400">
            <span>DRAG MAP TO PAN OPERATIONAL COORDS</span>
          </div>

          <canvas
            ref={canvasRef}
            width={800}
            height={500}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className="w-full h-full bg-slate-950/20 cursor-grab active:cursor-grabbing"
          />
        </div>

        {/* Right Info panels */}
        <div className="space-y-6">
          <GlassCard title="Active Units" subtitle="GPS TELEMETRY" glowColor="blue">
            <div className="space-y-4 text-left font-mono text-xs mt-2">
              {agents.map((agent) => (
                <div
                  key={agent.id}
                  className="p-3.5 rounded-xl border border-slate-900 bg-slate-950/40 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-[12px]">{agent.name}</span>
                    <span
                      className="w-2.5 h-2.5 rounded-full animate-pulse"
                      style={{ backgroundColor: agent.color }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>CALLSIGN:</span>
                    <span className="text-white">{agent.tag}</span>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>VITALS:</span>
                    <span className="text-white flex items-center gap-1">
                      <Activity className="w-3 h-3 text-emerald-400 inline" />
                      {agent.vitals}
                    </span>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>STATUS:</span>
                    <span
                      className="font-bold uppercase"
                      style={{ color: agent.color }}
                    >
                      {agent.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard title="Geofence Protocols" subtitle="RADIUS RULES" glowColor="none">
            <div className="space-y-3.5 text-left font-mono text-[11px]">
              <div className="flex items-center gap-2 text-cyan-400 font-bold border-b border-slate-900 pb-2">
                <Crosshair className="w-4 h-4" />
                <span>ACTIVE POLICIES</span>
              </div>
              <div className="space-y-1">
                <span className="text-slate-500 text-[9px] block">BOUNDS ALPHA</span>
                <p className="text-slate-300">London Sector, ATM District. Automatic notification sent if agent exits coordinate matrix.</p>
              </div>
              <div className="space-y-1">
                <span className="text-slate-500 text-[9px] block">BOUNDS OMEGA</span>
                <p className="text-slate-300">APAC Finance Cluster. Elevated vitals telemetry checks enabled dynamically.</p>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
