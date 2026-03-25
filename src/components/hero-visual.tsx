"use client";

import { useEffect, useRef } from "react";

export function HeroVisual() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cv = canvasRef.current;
    const container = containerRef.current;
    if (!cv || !container) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;

    let S: number;

    function resize() {
      const s = Math.min(container!.clientWidth, container!.clientHeight);
      const dpr = Math.min(window.devicePixelRatio, 2);
      cv!.width = s * dpr;
      cv!.height = s * dpr;
      cv!.style.width = s + "px";
      cv!.style.height = s + "px";
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      return s;
    }
    S = resize();

    const cxFn = () => S * 0.5;
    const cyFn = () => S * 0.5;
    const pilarW = () => S * 0.2;
    const pilarH = () => S * 0.2;
    const estacaOff = () => S * 0.28;

    function getEstacas() {
      const c = cxFn(),
        cc = cyFn(),
        off = estacaOff();
      return [
        { x: c - off, y: cc - off, label: "E1" },
        { x: c + off, y: cc - off, label: "E2" },
        { x: c + off, y: cc + off, label: "E3" },
        { x: c - off, y: cc + off, label: "E4" },
      ];
    }

    const cellColors = [
      { r: 245, g: 130, b: 13 },
      { r: 96, g: 165, b: 250 },
      { r: 34, g: 197, b: 94 },
      { r: 200, g: 120, b: 240 },
    ];

    const STEP = 3;

    function computeVoronoi(weights: number[]) {
      const c = cxFn(),
        cc = cyFn();
      const pw = pilarW(),
        ph = pilarH();
      const px0 = c - pw / 2,
        py0 = cc - ph / 2;
      const px1 = c + pw / 2,
        py1 = cc + ph / 2;
      const estacas = getEstacas();

      const sumX = [0, 0, 0, 0];
      const sumY = [0, 0, 0, 0];
      const count = [0, 0, 0, 0];
      const cells: { x: number; y: number; idx: number }[] = [];

      for (let y = py0; y < py1; y += STEP) {
        for (let x = px0; x < px1; x += STEP) {
          let minDist = Infinity;
          let minIdx = 0;
          for (let i = 0; i < 4; i++) {
            const dx = x - estacas[i].x;
            const dy = y - estacas[i].y;
            const d = (dx * dx + dy * dy) / (weights[i] * weights[i]);
            if (d < minDist) {
              minDist = d;
              minIdx = i;
            }
          }
          cells.push({ x, y, idx: minIdx });
          sumX[minIdx] += x;
          sumY[minIdx] += y;
          count[minIdx]++;
        }
      }

      const centroids = estacas.map((_, i) => ({
        x: count[i] > 0 ? sumX[i] / count[i] : estacas[i].x,
        y: count[i] > 0 ? sumY[i] / count[i] : estacas[i].y,
      }));

      return { cells, centroids };
    }

    function draw(t: number) {
      S = resize();
      ctx!.clearRect(0, 0, S, S);

      const c = cxFn(),
        cc = cyFn();
      const pw = pilarW(),
        ph = pilarH();
      const estacas = getEstacas();

      // Animate weights based on moment cycle
      const cycle = 10;
      const phase = (t % cycle) / cycle;
      const weights = [1, 1, 1, 1];

      if (phase < 0.12) {
        // centered (hold)
      } else if (phase < 0.35) {
        const p = Math.sin(((phase - 0.12) / 0.23) * Math.PI);
        weights[0] = 1 + 0.12 * p;
        weights[3] = 1 + 0.12 * p;
        weights[1] = 1 - 0.08 * p;
        weights[2] = 1 - 0.08 * p;
      } else if (phase < 0.47) {
        // centered (hold)
      } else if (phase < 0.7) {
        const p = Math.sin(((phase - 0.47) / 0.23) * Math.PI);
        weights[0] = 1 + 0.12 * p;
        weights[1] = 1 + 0.12 * p;
        weights[2] = 1 - 0.08 * p;
        weights[3] = 1 - 0.08 * p;
      } else if (phase < 0.82) {
        // centered (hold)
      } else {
        const p = Math.sin(((phase - 0.82) / 0.18) * Math.PI);
        weights[0] = 1 + 0.15 * p;
        weights[1] = 1 + 0.03 * p;
        weights[2] = 1 - 0.1 * p;
        weights[3] = 1 + 0.03 * p;
      }

      const { cells, centroids } = computeVoronoi(weights);

      // Block outline
      const blockOff = estacaOff() + S * 0.06;
      ctx!.strokeStyle = "rgba(245,130,13,0.2)";
      ctx!.lineWidth = 1.5;
      ctx!.strokeRect(
        c - blockOff,
        cc - blockOff,
        blockOff * 2,
        blockOff * 2
      );

      // Draw Voronoi cells on pilar
      cells.forEach(({ x, y, idx }) => {
        const col = cellColors[idx];
        ctx!.fillStyle = `rgba(${col.r},${col.g},${col.b},0.18)`;
        ctx!.fillRect(x - STEP / 2, y - STEP / 2, STEP, STEP);
      });

      // Pilar outline
      ctx!.strokeStyle = "rgba(245,130,13,0.7)";
      ctx!.lineWidth = 2;
      ctx!.strokeRect(c - pw / 2, cc - ph / 2, pw, ph);

      // Cell boundary lines
      ctx!.fillStyle = "rgba(255,255,255,0.35)";
      const cols = Math.floor(pw / STEP);
      for (let i = 0; i < cells.length; i++) {
        const ci = cells[i];
        const rightIdx = i + 1;
        if (
          rightIdx < cells.length &&
          cells[rightIdx].y === ci.y &&
          cells[rightIdx].idx !== ci.idx
        ) {
          ctx!.fillRect(ci.x + STEP / 2 - 0.5, ci.y - STEP / 2, 1, STEP);
        }
        const belowIdx = i + cols;
        if (belowIdx < cells.length && cells[belowIdx].idx !== ci.idx) {
          ctx!.fillRect(ci.x - STEP / 2, ci.y + STEP / 2 - 0.5, STEP, 1);
        }
      }

      // Tirantes (blue lines connecting estacas)
      ctx!.strokeStyle = "rgba(96,165,250,0.5)";
      ctx!.lineWidth = 2;
      ctx!.beginPath();
      for (let i = 0; i < 4; i++) {
        const a = estacas[i],
          b = estacas[(i + 1) % 4];
        ctx!.moveTo(a.x, a.y);
        ctx!.lineTo(b.x, b.y);
      }
      ctx!.stroke();

      // Biela lines: centroid -> estaca
      centroids.forEach((cen, i) => {
        const e = estacas[i];
        ctx!.strokeStyle = `rgba(${cellColors[i].r},${cellColors[i].g},${cellColors[i].b},0.5)`;
        ctx!.lineWidth = 1.5;
        ctx!.setLineDash([6, 4]);
        ctx!.beginPath();
        ctx!.moveTo(cen.x, cen.y);
        ctx!.lineTo(e.x, e.y);
        ctx!.stroke();
        ctx!.setLineDash([]);
      });

      // Centroid dots
      centroids.forEach((cen, i) => {
        const col = cellColors[i];
        ctx!.beginPath();
        ctx!.arc(cen.x, cen.y, 4, 0, Math.PI * 2);
        ctx!.fillStyle = `rgb(${col.r},${col.g},${col.b})`;
        ctx!.fill();
        ctx!.strokeStyle = "rgba(255,255,255,0.6)";
        ctx!.lineWidth = 1;
        ctx!.stroke();
      });

      // Estaca circles
      estacas.forEach((e, i) => {
        ctx!.beginPath();
        ctx!.arc(e.x, e.y, S * 0.04, 0, Math.PI * 2);
        ctx!.strokeStyle = "rgba(255,255,255,0.3)";
        ctx!.lineWidth = 1.5;
        ctx!.stroke();
        ctx!.beginPath();
        ctx!.arc(e.x, e.y, 2.5, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(${cellColors[i].r},${cellColors[i].g},${cellColors[i].b},0.7)`;
        ctx!.fill();
      });

      // Estaca labels
      ctx!.font = "600 " + S * 0.02 + 'px "IBM Plex Mono", monospace';
      ctx!.textAlign = "center";
      estacas.forEach((e) => {
        ctx!.fillStyle = "rgba(255,255,255,0.35)";
        ctx!.fillText(e.label, e.x, e.y + S * 0.065);
      });

      // Pilar label
      ctx!.font = "600 " + S * 0.022 + 'px "IBM Plex Mono", monospace';
      ctx!.fillStyle = "rgba(245,130,13,0.5)";
      ctx!.fillText("PILAR", c, cc - ph / 2 - S * 0.02);

      // Moment indicator with explanation
      let momentText = "N centrado";
      let momentDesc = "Carga axial sem momento";
      let momentColor = "rgba(255,255,255,0.3)";
      if (phase >= 0.15 && phase < 0.35) {
        momentText = "Mx aplicado →";
        momentDesc = "Áreas E1/E4 absorvem mais carga";
        momentColor = "rgba(245,130,13,0.7)";
      } else if (phase >= 0.5 && phase < 0.7) {
        momentText = "My aplicado ↑";
        momentDesc = "Áreas E1/E2 absorvem mais carga";
        momentColor = "rgba(245,130,13,0.7)";
      } else if (phase >= 0.85) {
        momentText = "Mx + My ↗";
        momentDesc = "E1 recebe carga máxima";
        momentColor = "rgba(245,130,13,0.9)";
      }

      // Top-right: moment label
      ctx!.font = "700 " + S * 0.022 + 'px "IBM Plex Mono", monospace';
      ctx!.fillStyle = momentColor;
      ctx!.textAlign = "right";
      ctx!.fillText(momentText, S * 0.94, S * 0.06);

      // Explanation below
      ctx!.font = "400 " + S * 0.014 + 'px "IBM Plex Mono", monospace';
      ctx!.fillStyle = "rgba(255,255,255,0.3)";
      ctx!.fillText(momentDesc, S * 0.94, S * 0.085);

      // Small subtitle
      ctx!.font = "400 " + S * 0.013 + 'px "IBM Plex Mono", monospace';
      ctx!.fillStyle = "rgba(255,255,255,0.15)";
      ctx!.fillText(
        "Voronoi ponderado \u2014 topo do pilar",
        S * 0.94,
        S * 0.11
      );

      // PLANTA label
      ctx!.textAlign = "center";
      ctx!.font = "600 " + S * 0.018 + 'px "IBM Plex Mono", monospace';
      ctx!.fillStyle = "rgba(255,255,255,0.15)";
      ctx!.fillText("PLANTA", c, S * 0.96);
    }

    let plantaStart: number | null = null;
    let animFrameId: number;

    function animatePlanta(ts: number) {
      if (!plantaStart) plantaStart = ts;
      const t = (ts - plantaStart) / 1000;
      draw(t);
      animFrameId = requestAnimationFrame(animatePlanta);
    }
    animFrameId = requestAnimationFrame(animatePlanta);

    const handleResize = () => {
      S = resize();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="hero-visual-container hidden lg:block"
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block"
      />
    </div>
  );
}
