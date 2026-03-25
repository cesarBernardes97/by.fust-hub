"use client";

import { useEffect, useRef } from "react";

/**
 * Animated STM 3D wireframe visualization — inspired by BY.BLOCOS real viewer.
 * Shows a block on 4 piles (2x2) with:
 *  - Block wireframe in subtle white
 *  - Strut paths (bielas) in cyan-blue, drawn on
 *  - Tie paths (tirantes) in orange-red, dashed
 *  - Pillar on top
 *  - Nodes pulsing at intersections
 *  - Load arrow from top
 *
 * Mimics the isometric 3D "Técnico" view of the real app.
 */
export function StressDiagram() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (el) {
      const timer = setTimeout(() => el.classList.add("stm-active"), 100);
      return () => clearTimeout(timer);
    }
  }, []);

  // Isometric-ish coordinates for a 4-pile block viewed from above-right
  // All coordinates in viewBox 0 0 420 480

  return (
    <div ref={containerRef} className="stm-diagram relative w-full max-w-[420px]">
      <svg
        viewBox="0 0 420 480"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <defs>
          <filter id="g-orange" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="g-cyan" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.5" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <marker id="arr-d" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
            <path d="M1.5 1 L4 6.5 L6.5 1" stroke="#FF8A1F" strokeWidth="1.2" fill="none" />
          </marker>
        </defs>

        {/* ── Block wireframe ─────────────────────────── */}
        {/* Bottom face */}
        <polygon
          points="60,320 210,370 360,320 210,270"
          className="stm-block-face"
          fill="rgba(255,255,255,0.015)"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="0.8"
        />
        {/* Top face */}
        <polygon
          points="60,260 210,310 360,260 210,210"
          className="stm-block-face"
          fill="rgba(255,255,255,0.025)"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="0.8"
        />
        {/* Vertical edges */}
        <line x1="60" y1="260" x2="60" y2="320" stroke="rgba(255,255,255,0.08)" strokeWidth="0.8" className="stm-block-edge" />
        <line x1="210" y1="210" x2="210" y2="270" stroke="rgba(255,255,255,0.08)" strokeWidth="0.8" className="stm-block-edge" />
        <line x1="360" y1="260" x2="360" y2="320" stroke="rgba(255,255,255,0.08)" strokeWidth="0.8" className="stm-block-edge" />
        <line x1="210" y1="310" x2="210" y2="370" stroke="rgba(255,255,255,0.06)" strokeWidth="0.8" className="stm-block-edge" />

        {/* ── Piles (estacas) — 4 vertical lines below block ─ */}
        {/* Front-left */}
        <line x1="120" y1="340" x2="120" y2="430" stroke="rgba(255,255,255,0.06)" strokeWidth="3" className="stm-pile" />
        <line x1="120" y1="340" x2="120" y2="430" stroke="rgba(255,255,255,0.12)" strokeWidth="1" className="stm-pile" />
        {/* Front-right */}
        <line x1="300" y1="340" x2="300" y2="430" stroke="rgba(255,255,255,0.06)" strokeWidth="3" className="stm-pile" />
        <line x1="300" y1="340" x2="300" y2="430" stroke="rgba(255,255,255,0.12)" strokeWidth="1" className="stm-pile" />
        {/* Back-left */}
        <line x1="120" y1="280" x2="120" y2="370" stroke="rgba(255,255,255,0.04)" strokeWidth="3" className="stm-pile" />
        <line x1="120" y1="280" x2="120" y2="370" stroke="rgba(255,255,255,0.08)" strokeWidth="1" className="stm-pile" />
        {/* Back-right */}
        <line x1="300" y1="280" x2="300" y2="370" stroke="rgba(255,255,255,0.04)" strokeWidth="3" className="stm-pile" />
        <line x1="300" y1="280" x2="300" y2="370" stroke="rgba(255,255,255,0.08)" strokeWidth="1" className="stm-pile" />

        {/* ── Pillar (pilar) on top ──────────────────── */}
        {/* Simple rectangular prism */}
        <polygon
          points="185,160 210,148 235,160 210,172"
          fill="rgba(255,138,31,0.06)"
          stroke="rgba(255,138,31,0.2)"
          strokeWidth="0.8"
          className="stm-pillar"
        />
        <polygon
          points="185,160 210,148 235,160 210,172"
          fill="none"
          stroke="rgba(255,138,31,0.15)"
          strokeWidth="0.5"
          className="stm-pillar"
        />
        <rect x="185" y="160" width="50" height="55" rx="1"
          fill="rgba(255,138,31,0.03)"
          stroke="rgba(255,138,31,0.15)"
          strokeWidth="0.8"
          className="stm-pillar"
        />

        {/* ── Load arrow ──────────────────────────────── */}
        <line x1="210" y1="60" x2="210" y2="145"
          stroke="#FF8A1F" strokeWidth="1.5" markerEnd="url(#arr-d)"
          className="stm-load"
        />
        <text x="222" y="95" className="stm-load-label" fill="#FF8A1F" fontSize="12" fontFamily="monospace" fontWeight="600">
          Nd
        </text>

        {/* ── Strut paths (bielas) — cyan/blue compression ── */}
        {/* From pillar base to 4 pile heads */}
        {/* Front-left */}
        <line x1="200" y1="215" x2="120" y2="340"
          className="stm-strut stm-s1"
          stroke="rgba(80,200,255,0.5)" strokeWidth="1.8" strokeLinecap="round"
          strokeDasharray="100" strokeDashoffset="100"
        />
        {/* Front-right */}
        <line x1="220" y1="215" x2="300" y2="340"
          className="stm-strut stm-s2"
          stroke="rgba(80,200,255,0.5)" strokeWidth="1.8" strokeLinecap="round"
          strokeDasharray="100" strokeDashoffset="100"
        />
        {/* Back-left */}
        <line x1="200" y1="215" x2="120" y2="280"
          className="stm-strut stm-s3"
          stroke="rgba(80,200,255,0.35)" strokeWidth="1.2" strokeLinecap="round"
          strokeDasharray="80" strokeDashoffset="80"
        />
        {/* Back-right */}
        <line x1="220" y1="215" x2="300" y2="280"
          className="stm-strut stm-s4"
          stroke="rgba(80,200,255,0.35)" strokeWidth="1.2" strokeLinecap="round"
          strokeDasharray="80" strokeDashoffset="80"
        />

        {/* ── Ties (tirantes) — orange/red tension ─────── */}
        {/* Front tie */}
        <line x1="120" y1="340" x2="300" y2="340"
          className="stm-tie stm-t1"
          stroke="#FF8A1F" strokeWidth="1.2" strokeLinecap="round"
          strokeDasharray="5 3"
        />
        {/* Back tie */}
        <line x1="120" y1="280" x2="300" y2="280"
          className="stm-tie stm-t2"
          stroke="rgba(255,138,31,0.5)" strokeWidth="1" strokeLinecap="round"
          strokeDasharray="4 3"
        />
        {/* Left side tie */}
        <line x1="120" y1="280" x2="120" y2="340"
          className="stm-tie stm-t3"
          stroke="rgba(255,138,31,0.4)" strokeWidth="1" strokeLinecap="round"
          strokeDasharray="4 3"
        />
        {/* Right side tie */}
        <line x1="300" y1="280" x2="300" y2="340"
          className="stm-tie stm-t4"
          stroke="rgba(255,138,31,0.4)" strokeWidth="1" strokeLinecap="round"
          strokeDasharray="4 3"
        />

        {/* ── Nodes — stress concentration points ────── */}
        {/* CCC node at pillar base */}
        <circle cx="210" cy="215" r="4" className="stm-node stm-n-ccc" fill="#FF8A1F" filter="url(#g-orange)" />
        {/* CCT nodes at pile heads */}
        <circle cx="120" cy="340" r="3.5" className="stm-node stm-n-cct1" fill="#FF8A1F" filter="url(#g-orange)" />
        <circle cx="300" cy="340" r="3.5" className="stm-node stm-n-cct2" fill="#FF8A1F" filter="url(#g-orange)" />
        <circle cx="120" cy="280" r="3" className="stm-node stm-n-cct3" fill="rgba(255,138,31,0.6)" filter="url(#g-orange)" />
        <circle cx="300" cy="280" r="3" className="stm-node stm-n-cct4" fill="rgba(255,138,31,0.6)" filter="url(#g-orange)" />

        {/* ── Labels ─────────────────────────────────── */}
        <text x="218" y="208" className="stm-label stm-lbl-1" fill="rgba(255,255,255,0.45)" fontSize="9" fontFamily="monospace">CCC</text>
        <text x="80" y="338" className="stm-label stm-lbl-2" fill="rgba(255,255,255,0.35)" fontSize="8" fontFamily="monospace">CCT</text>
        <text x="310" y="338" className="stm-label stm-lbl-3" fill="rgba(255,255,255,0.35)" fontSize="8" fontFamily="monospace">CCT</text>

        {/* Tie force label */}
        <text x="170" y="358" className="stm-label stm-lbl-tie" fill="rgba(255,138,31,0.6)" fontSize="9" fontFamily="monospace">
          Rst
        </text>

        {/* ── Pile labels ────────────────────────────── */}
        <text x="108" y="445" className="stm-label stm-lbl-pile" fill="rgba(255,255,255,0.2)" fontSize="8" fontFamily="monospace">E1</text>
        <text x="293" y="445" className="stm-label stm-lbl-pile" fill="rgba(255,255,255,0.2)" fontSize="8" fontFamily="monospace">E2</text>

        {/* ── Ambient glow ───────────────────────────── */}
        <circle cx="210" cy="290" r="80" fill="rgba(255,138,31,0.015)" filter="url(#g-cyan)" className="stm-glow" />
      </svg>
    </div>
  );
}
