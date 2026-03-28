"use client";

import { useEffect, useRef, useCallback } from "react";

/* ------------------------------------------------------------------ */
/*  Depth-diagram functions (normalised 0 = top, 1 = tip)             */
/* ------------------------------------------------------------------ */

const N = 60;
function depthPoints(): number[] {
  const pts: number[] = [];
  for (let i = 0; i <= N; i++) pts.push(i / N);
  return pts;
}

function displacement(z: number): number {
  if (z < 0.65) return Math.cos(z * Math.PI * 0.77) * (1 - z * 0.4);
  const t = (z - 0.65) / 0.35;
  return -0.08 * Math.sin(t * Math.PI);
}

function shear(z: number): number {
  return (
    (1 - 3.2 * z + 2.5 * z * z) * Math.exp(-1.8 * z) * 1.0 -
    0.15 * Math.sin(z * Math.PI * 2.2) * Math.exp(-2 * z)
  );
}

function moment(z: number): number {
  return z * (1 - z) * (1 - 0.3 * z) * 4.2 * Math.exp(-0.5 * z);
}

interface Diagram {
  title: string;
  unit: string;
  fn: (z: number) => number;
  color: string;
  fillColor: string;
  maxLabel: string;
}

const diagrams: Diagram[] = [
  {
    title: "Deslocamento",
    unit: "mm",
    fn: displacement,
    color: "#f5820d",
    fillColor: "rgba(245,130,13,0.18)",
    maxLabel: "8.4",
  },
  {
    title: "Cortante",
    unit: "kN",
    fn: shear,
    color: "#60a5fa",
    fillColor: "rgba(96,165,250,0.18)",
    maxLabel: "42.0",
  },
  {
    title: "Momento",
    unit: "kN·m",
    fn: moment,
    color: "#22c55e",
    fillColor: "rgba(34,197,94,0.18)",
    maxLabel: "62.3",
  },
];

/* ------------------------------------------------------------------ */
/*  P-Y layer data                                                     */
/* ------------------------------------------------------------------ */

interface PyLayer {
  pMax: number;
  yRef: number;
  color: string;
  label: string;
}

const pyLayers: PyLayer[] = [
  { pMax: 180, yRef: 8, color: "#f5820d", label: "Argila mole" },
  { pMax: 140, yRef: 5, color: "#60a5fa", label: "Areia" },
  { pMax: 100, yRef: 12, color: "#22c55e", label: "Argila rija" },
];

function pyValue(y: number, pMax: number, yRef: number): number {
  return pMax * Math.tanh(y / yRef);
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function GeotechVisual() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);

  const draw = useCallback(() => {
    const cv = canvasRef.current;
    const container = containerRef.current;
    if (!cv || !container) return;
    const maybeCtx = cv.getContext("2d");
    if (!maybeCtx) return;
    const ctx: CanvasRenderingContext2D = maybeCtx;

    /* Resize for DPR */
    const w = container.clientWidth;
    const h = container.clientHeight;
    const dpr = Math.min(window.devicePixelRatio, 2);
    cv.width = w * dpr;
    cv.height = h * dpr;
    cv.style.width = w + "px";
    cv.style.height = h + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const size = { w, h };

    /* ----- drawDepth ----- */
    function drawDepth(ctx: CanvasRenderingContext2D, t: number, alpha: number) {
      const pad = { top: 36, bottom: 30, left: 12, right: 12 };
      const gap = 16;
      const cols = 3;
      const colW = (size.w - pad.left - pad.right - gap * (cols - 1)) / cols;
      const chartH = size.h - pad.top - pad.bottom;
      const progress = Math.min(1, (t % 8) / 2.5);
      const eased = 1 - Math.pow(1 - progress, 3);
      const depths = depthPoints();

      ctx.globalAlpha = alpha;

      diagrams.forEach((diag, di) => {
        const x0 = pad.left + di * (colW + gap);
        const y0 = pad.top;
        const centerX = x0 + colW / 2;

        ctx.font = '700 13px "Syne", sans-serif';
        ctx.fillStyle = "rgba(255,255,255,0.7)";
        ctx.textAlign = "center";
        ctx.fillText(diag.title, centerX, y0 - 12);

        ctx.strokeStyle = "rgba(255,255,255,0.12)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(centerX, y0);
        ctx.lineTo(centerX, y0 + chartH);
        ctx.stroke();

        ctx.strokeStyle = "rgba(255,255,255,0.05)";
        for (let i = 1; i < 5; i++) {
          const dy = y0 + chartH * (i / 5);
          ctx.beginPath();
          ctx.moveTo(x0 + 4, dy);
          ctx.lineTo(x0 + colW - 4, dy);
          ctx.stroke();
        }

        ctx.font = '600 10px "IBM Plex Mono", monospace';
        ctx.fillStyle = "rgba(255,255,255,0.3)";
        ctx.textAlign = "left";
        for (let i = 0; i <= 4; i++) {
          const dy = y0 + chartH * (i / 4);
          ctx.fillText((i / 4 * 16).toFixed(0) + "m", x0 + 2, dy + 3);
        }

        const vals = depths.map((z) => diag.fn(z));
        const maxAbs = Math.max(...vals.map(Math.abs)) || 1;
        const halfW = colW * 0.42;
        const delay = di * 0.08;
        const p = Math.max(0, Math.min(1, (eased - delay) / (1 - delay)));
        const drawN = Math.floor(depths.length * p);
        if (drawN < 2) return;

        ctx.beginPath();
        ctx.moveTo(centerX, y0);
        for (let i = 0; i < drawN; i++)
          ctx.lineTo(
            centerX + (vals[i] / maxAbs) * halfW,
            y0 + depths[i] * chartH
          );
        ctx.lineTo(centerX, y0 + depths[drawN - 1] * chartH);
        ctx.closePath();
        ctx.fillStyle = diag.fillColor;
        ctx.fill();

        ctx.beginPath();
        ctx.strokeStyle = diag.color;
        ctx.lineWidth = 2.5;
        for (let i = 0; i < drawN; i++) {
          const px = centerX + (vals[i] / maxAbs) * halfW;
          const py = y0 + depths[i] * chartH;
          i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
        }
        ctx.stroke();

        if (p > 0.8) {
          let peakIdx = 0;
          let peakVal = 0;
          for (let i = 0; i < drawN; i++) {
            if (Math.abs(vals[i]) > peakVal) {
              peakVal = Math.abs(vals[i]);
              peakIdx = i;
            }
          }
          const ppx = centerX + (vals[peakIdx] / maxAbs) * halfW;
          const ppy = y0 + depths[peakIdx] * chartH;
          ctx.beginPath();
          ctx.arc(ppx, ppy, 4, 0, Math.PI * 2);
          ctx.fillStyle = diag.color;
          ctx.fill();
          const labelText = diag.maxLabel + " " + diag.unit;
          ctx.font = '700 11px "IBM Plex Mono", monospace';
          const tw = ctx.measureText(labelText).width;
          const lx = vals[peakIdx] > 0 ? ppx + 8 : ppx - tw - 14;
          ctx.fillStyle = "rgba(10,10,11,0.9)";
          ctx.fillRect(lx - 5, ppy - 10, tw + 10, 20);
          ctx.strokeStyle = diag.color;
          ctx.lineWidth = 1;
          ctx.strokeRect(lx - 5, ppy - 10, tw + 10, 20);
          ctx.fillStyle = diag.color;
          ctx.textAlign = "left";
          ctx.fillText(labelText, lx, ppy + 4);
        }

        ctx.font = '600 10px "IBM Plex Mono", monospace';
        ctx.fillStyle = "rgba(255,255,255,0.3)";
        ctx.textAlign = "center";
        ctx.fillText(diag.unit, centerX, y0 + chartH + 16);
      });

      ctx.font = '700 12px "IBM Plex Mono", monospace';
      ctx.fillStyle = "rgba(255,255,255,0.25)";
      ctx.textAlign = "center";
      ctx.fillText(
        "DIAGRAMAS AO LONGO DA PROFUNDIDADE",
        size.w / 2,
        size.h - 4
      );
      ctx.globalAlpha = 1;
    }

    /* ----- drawPY ----- */
    function drawPY(ctx: CanvasRenderingContext2D, t: number, alpha: number) {
      const pad = { left: 70, right: 30, top: 40, bottom: 55 };
      const gw = size.w - pad.left - pad.right;
      const gh = size.h - pad.top - pad.bottom;

      ctx.globalAlpha = alpha;

      ctx.strokeStyle = "rgba(255,255,255,0.12)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(pad.left, pad.top);
      ctx.lineTo(pad.left, pad.top + gh);
      ctx.lineTo(pad.left + gw, pad.top + gh);
      ctx.stroke();

      ctx.strokeStyle = "rgba(255,255,255,0.04)";
      for (let i = 1; i <= 4; i++) {
        const gy = pad.top + gh * (i / 5);
        ctx.beginPath();
        ctx.moveTo(pad.left, gy);
        ctx.lineTo(pad.left + gw, gy);
        ctx.stroke();
        const gx = pad.left + gw * (i / 5);
        ctx.beginPath();
        ctx.moveTo(gx, pad.top);
        ctx.lineTo(gx, pad.top + gh);
        ctx.stroke();
      }

      ctx.font = '600 11px "Syne", sans-serif';
      ctx.fillStyle = "rgba(255,255,255,0.35)";
      ctx.textAlign = "center";
      ctx.fillText("y (mm)", pad.left + gw / 2, size.h - 10);
      ctx.save();
      ctx.translate(18, pad.top + gh / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.fillText("p (kN/m)", 0, 0);
      ctx.restore();

      ctx.font = '400 10px "IBM Plex Mono", monospace';
      ctx.fillStyle = "rgba(255,255,255,0.25)";
      ctx.textAlign = "center";
      for (let i = 0; i <= 5; i++)
        ctx.fillText(
          String(i * 10),
          pad.left + gw * (i / 5),
          pad.top + gh + 18
        );
      ctx.textAlign = "right";
      for (let i = 0; i <= 4; i++)
        ctx.fillText(
          String((4 - i) * 50),
          pad.left - 10,
          pad.top + gh * (i / 4) + 4
        );

      const progress = Math.min(1, (t % 8) / 2.5);
      const eased = 1 - Math.pow(1 - progress, 3);
      const maxY = 50;
      const steps = 80;

      pyLayers.forEach((layer, li) => {
        const delay = li * 0.12;
        const p = Math.max(0, Math.min(1, (eased - delay) / (1 - delay)));
        const drawSteps = Math.floor(steps * p);
        if (drawSteps < 2) return;

        ctx.beginPath();
        ctx.moveTo(pad.left, pad.top + gh);
        for (let i = 0; i <= drawSteps; i++) {
          const y = (i / steps) * maxY;
          ctx.lineTo(
            pad.left + (y / maxY) * gw,
            pad.top + gh - (pyValue(y, layer.pMax, layer.yRef) / 200) * gh
          );
        }
        const lastY = (drawSteps / steps) * maxY;
        ctx.lineTo(pad.left + (lastY / maxY) * gw, pad.top + gh);
        ctx.closePath();
        ctx.fillStyle =
          layer.color === "#f5820d"
            ? "rgba(245,130,13,0.08)"
            : layer.color === "#60a5fa"
              ? "rgba(96,165,250,0.08)"
              : "rgba(34,197,94,0.08)";
        ctx.fill();

        ctx.beginPath();
        ctx.strokeStyle = layer.color;
        ctx.lineWidth = 2.5;
        for (let i = 0; i <= drawSteps; i++) {
          const y = (i / steps) * maxY;
          const sx = pad.left + (y / maxY) * gw;
          const sy =
            pad.top + gh - (pyValue(y, layer.pMax, layer.yRef) / 200) * gh;
          i === 0 ? ctx.moveTo(sx, sy) : ctx.lineTo(sx, sy);
        }
        ctx.stroke();

        if (drawSteps > 0) {
          const lp = pyValue(lastY, layer.pMax, layer.yRef);
          const dx = pad.left + (lastY / maxY) * gw;
          const dy = pad.top + gh - (lp / 200) * gh;
          ctx.beginPath();
          ctx.arc(dx, dy, 4, 0, Math.PI * 2);
          ctx.fillStyle = layer.color;
          ctx.fill();
        }
      });

      ctx.font = '600 12px "Syne", sans-serif';
      pyLayers.forEach((layer, i) => {
        const lx = pad.left + 8;
        const ly = pad.top + 20 + i * 24;
        ctx.beginPath();
        ctx.arc(lx, ly - 3, 4, 0, Math.PI * 2);
        ctx.fillStyle = layer.color;
        ctx.fill();
        ctx.fillStyle = "rgba(255,255,255,0.5)";
        ctx.textAlign = "left";
        ctx.fillText(layer.label, lx + 12, ly);
      });

      ctx.font = '700 12px "IBM Plex Mono", monospace';
      ctx.fillStyle = "rgba(255,255,255,0.25)";
      ctx.textAlign = "center";
      ctx.fillText("CURVAS P-Y", size.w / 2, pad.top - 14);
      ctx.globalAlpha = 1;
    }

    /* ----- animation loop ----- */
    const cycleDuration = 10;
    const fadeDuration = 1;
    let start: number | null = null;

    function animate(ts: number) {
      if (!start) start = ts;
      if (!cv || !container) return;
      const t = (ts - start) / 1000;

      const cw = container.clientWidth;
      const ch = container.clientHeight;
      const d = Math.min(window.devicePixelRatio, 2);
      cv.width = cw * d;
      cv.height = ch * d;
      cv.style.width = cw + "px";
      cv.style.height = ch + "px";
      ctx.setTransform(d, 0, 0, d, 0, 0);
      size.w = cw;
      size.h = ch;

      ctx.clearRect(0, 0, cw, ch);

      const totalCycle = cycleDuration * 2;
      const phase = t % totalCycle;

      if (phase < cycleDuration - fadeDuration) {
        drawDepth(ctx, t, 1);
      } else if (phase < cycleDuration) {
        const p = (phase - (cycleDuration - fadeDuration)) / fadeDuration;
        drawDepth(ctx, t, 1 - p);
        drawPY(ctx, t, p);
      } else if (phase < totalCycle - fadeDuration) {
        drawPY(ctx, t, 1);
      } else {
        const p = (phase - (totalCycle - fadeDuration)) / fadeDuration;
        drawPY(ctx, t, 1 - p);
        drawDepth(ctx, t, p);
      }

      rafRef.current = requestAnimationFrame(animate);
    }

    rafRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    draw();
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [draw]);

  return (
    <div
      ref={containerRef}
      className="hero-visual-container"
      style={{
        position: "absolute",
        right: 48,
        top: "45%",
        transform: "translateY(-55%)",
        width: "50%",
        maxWidth: 620,
        aspectRatio: "1.3",
        zIndex: 1,
      }}
    >
      <canvas
        ref={canvasRef}
        style={{ width: "100%", height: "100%", display: "block" }}
      />
    </div>
  );
}
