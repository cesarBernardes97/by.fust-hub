"use client";

import { useEffect, useRef, useCallback } from "react";

/* ------------------------------------------------------------------ */
/*  Config                                                             */
/* ------------------------------------------------------------------ */

const GRID = 70; // cell size px
const NODE_RADIUS = 2;
const LINE_ALPHA = 0.06;
const NODE_ALPHA_BASE = 0.12;
const STRESS_COUNT = 8; // active stress nodes
const PULSE_SPEED = 0.0008; // slow breathing
const FORCE_PATH_SPEED = 0.0004;
const MOUSE_INFLUENCE = 40; // px radius of mouse distortion
const PARALLAX_FACTOR = 0.015;

interface Node {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  col: number;
  row: number;
}

interface StressNode {
  idx: number;
  phase: number;
  intensity: number;
}

interface ForcePath {
  nodes: number[];
  progress: number;
  speed: number;
  phase: number;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const frameRef = useRef(0);

  const draw = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number, t: number, nodes: Node[], stressNodes: StressNode[], forcePaths: ForcePath[]) => {
    ctx.clearRect(0, 0, w, h);

    const mx = mouseRef.current.x;
    const my = mouseRef.current.y;
    const cols = Math.ceil(w / GRID) + 2;
    const rows = Math.ceil(h / GRID) + 2;

    // Update node positions with mouse distortion + parallax
    for (const node of nodes) {
      const dx = mx - node.baseX;
      const dy = my - node.baseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const influence = Math.max(0, 1 - dist / (MOUSE_INFLUENCE * 4));
      const pushX = influence * dx * PARALLAX_FACTOR;
      const pushY = influence * dy * PARALLAX_FACTOR;

      node.x = node.baseX + pushX;
      node.y = node.baseY + pushY;
    }

    const getNode = (col: number, row: number): Node | undefined => {
      const idx = row * cols + col;
      return nodes[idx];
    };

    // Draw grid lines
    ctx.lineWidth = 0.5;
    for (const node of nodes) {
      const right = getNode(node.col + 1, node.row);
      const down = getNode(node.col, node.row + 1);
      const diagDR = getNode(node.col + 1, node.row + 1);

      ctx.strokeStyle = `rgba(255,255,255,${LINE_ALPHA})`;

      if (right) {
        ctx.beginPath();
        ctx.moveTo(node.x, node.y);
        ctx.lineTo(right.x, right.y);
        ctx.stroke();
      }
      if (down) {
        ctx.beginPath();
        ctx.moveTo(node.x, node.y);
        ctx.lineTo(down.x, down.y);
        ctx.stroke();
      }
      // diagonal bracing — structural feel (every other cell)
      if (diagDR && (node.col + node.row) % 3 === 0) {
        ctx.strokeStyle = `rgba(255,255,255,${LINE_ALPHA * 0.5})`;
        ctx.beginPath();
        ctx.moveTo(node.x, node.y);
        ctx.lineTo(diagDR.x, diagDR.y);
        ctx.stroke();
      }
    }

    // Draw force paths (animated load trajectories)
    for (const fp of forcePaths) {
      fp.progress = (fp.progress + fp.speed) % 1;
      const pathLen = fp.nodes.length;
      if (pathLen < 2) continue;

      const seg = fp.progress * (pathLen - 1);
      const segIdx = Math.floor(seg);
      const segFrac = seg - segIdx;

      // Trail
      for (let i = 0; i < pathLen - 1; i++) {
        const n1 = nodes[fp.nodes[i]];
        const n2 = nodes[fp.nodes[i + 1]];
        if (!n1 || !n2) continue;

        const distFromHead = Math.abs(i - segIdx);
        const trailAlpha = Math.max(0, 0.25 - distFromHead * 0.04);

        ctx.strokeStyle = `rgba(255,138,31,${trailAlpha})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(n1.x, n1.y);
        ctx.lineTo(n2.x, n2.y);
        ctx.stroke();
      }

      // Moving dot
      if (segIdx < pathLen - 1) {
        const n1 = nodes[fp.nodes[segIdx]];
        const n2 = nodes[fp.nodes[segIdx + 1]];
        if (n1 && n2) {
          const dotX = n1.x + (n2.x - n1.x) * segFrac;
          const dotY = n1.y + (n2.y - n1.y) * segFrac;

          ctx.beginPath();
          ctx.arc(dotX, dotY, 3, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(255,138,31,0.6)";
          ctx.fill();

          // Glow
          const grad = ctx.createRadialGradient(dotX, dotY, 0, dotX, dotY, 12);
          grad.addColorStop(0, "rgba(255,138,31,0.15)");
          grad.addColorStop(1, "rgba(255,138,31,0)");
          ctx.fillStyle = grad;
          ctx.fillRect(dotX - 12, dotY - 12, 24, 24);
        }
      }
    }
    ctx.lineWidth = 0.5;

    // Draw regular nodes
    for (const node of nodes) {
      ctx.beginPath();
      ctx.arc(node.x, node.y, NODE_RADIUS, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${NODE_ALPHA_BASE})`;
      ctx.fill();
    }

    // Draw stress nodes (pulsing orange)
    for (const sn of stressNodes) {
      const node = nodes[sn.idx];
      if (!node) continue;

      const pulse = 0.3 + 0.7 * Math.sin(t * PULSE_SPEED + sn.phase) ** 2;
      const alpha = pulse * sn.intensity;
      const radius = NODE_RADIUS + pulse * 3;

      // Outer glow
      const grad = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, radius * 4);
      grad.addColorStop(0, `rgba(255,138,31,${alpha * 0.3})`);
      grad.addColorStop(1, "rgba(255,138,31,0)");
      ctx.fillStyle = grad;
      ctx.fillRect(node.x - radius * 4, node.y - radius * 4, radius * 8, radius * 8);

      // Core
      ctx.beginPath();
      ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,138,31,${alpha})`;
      ctx.fill();
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let nodes: Node[] = [];
    let stressNodes: StressNode[] = [];
    let forcePaths: ForcePath[] = [];

    const setup = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.parentElement?.getBoundingClientRect();
      w = rect?.width || window.innerWidth;
      h = rect?.height || window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.scale(dpr, dpr);

      // Build grid nodes
      const cols = Math.ceil(w / GRID) + 2;
      const rows = Math.ceil(h / GRID) + 2;
      const offsetX = -GRID / 2;
      const offsetY = -GRID / 2;

      nodes = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = offsetX + c * GRID;
          const y = offsetY + r * GRID;
          nodes.push({ x, y, baseX: x, baseY: y, col: c, row: r });
        }
      }

      // Pick stress nodes (concentrated in center-right area for visual weight)
      stressNodes = [];
      const centerCol = Math.floor(cols * 0.6);
      const centerRow = Math.floor(rows * 0.45);
      for (let i = 0; i < STRESS_COUNT; i++) {
        const col = centerCol + Math.floor((Math.random() - 0.3) * 6);
        const row = centerRow + Math.floor((Math.random() - 0.5) * 5);
        const idx = Math.max(0, Math.min(nodes.length - 1, row * cols + col));
        stressNodes.push({
          idx,
          phase: Math.random() * Math.PI * 2,
          intensity: 0.4 + Math.random() * 0.5,
        });
      }

      // Build force paths (load trajectories through structure)
      forcePaths = [];
      for (let p = 0; p < 3; p++) {
        const startCol = Math.floor(cols * 0.3) + Math.floor(Math.random() * 4);
        const startRow = 2 + Math.floor(Math.random() * 3);
        const pathNodes: number[] = [];

        let c = startCol;
        let r = startRow;
        for (let step = 0; step < 8 + Math.floor(Math.random() * 5); step++) {
          const idx = r * cols + c;
          if (idx >= 0 && idx < nodes.length) pathNodes.push(idx);
          // Tendency: move down-right (like a load path)
          const dir = Math.random();
          if (dir < 0.45) r++;
          else if (dir < 0.75) { r++; c++; }
          else c++;
          if (c >= cols || r >= rows) break;
        }

        forcePaths.push({
          nodes: pathNodes,
          progress: Math.random(),
          speed: FORCE_PATH_SPEED * (0.7 + Math.random() * 0.6),
          phase: Math.random() * Math.PI * 2,
        });
      }
    };

    setup();

    const handleResize = () => {
      setup();
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };

    window.addEventListener("resize", handleResize);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    let running = true;
    const loop = (t: number) => {
      if (!running) return;
      draw(ctx, w, h, t, nodes, stressNodes, forcePaths);
      frameRef.current = requestAnimationFrame(loop);
    };
    frameRef.current = requestAnimationFrame(loop);

    return () => {
      running = false;
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [draw]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 -z-10 pointer-events-auto"
      aria-hidden="true"
    />
  );
}
