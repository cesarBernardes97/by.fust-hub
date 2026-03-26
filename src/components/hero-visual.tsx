"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export function HeroVisual() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasPlantaRef = useRef<HTMLCanvasElement>(null);
  const svgCorteRef = useRef<SVGSVGElement>(null);
  const canvas3DRef = useRef<HTMLCanvasElement>(null);

  // ── PHASE 1: Voronoi Planta ──
  useEffect(() => {
    const cv = canvasPlantaRef.current;
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
      const c = cxFn(), cc = cyFn(), off = estacaOff();
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
      const c = cxFn(), cc = cyFn();
      const pw = pilarW(), ph = pilarH();
      const px0 = c - pw / 2, py0 = cc - ph / 2;
      const px1 = c + pw / 2, py1 = cc + ph / 2;
      const estacas = getEstacas();
      const sumX = [0, 0, 0, 0], sumY = [0, 0, 0, 0], count = [0, 0, 0, 0];
      const cells: { x: number; y: number; idx: number }[] = [];

      for (let y = py0; y < py1; y += STEP) {
        for (let x = px0; x < px1; x += STEP) {
          let minDist = Infinity, minIdx = 0;
          for (let i = 0; i < 4; i++) {
            const dx = x - estacas[i].x, dy = y - estacas[i].y;
            const d = (dx * dx + dy * dy) / (weights[i] * weights[i]);
            if (d < minDist) { minDist = d; minIdx = i; }
          }
          cells.push({ x, y, idx: minIdx });
          sumX[minIdx] += x; sumY[minIdx] += y; count[minIdx]++;
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
      const c = cxFn(), cc = cyFn();
      const pw = pilarW(), ph = pilarH();
      const estacas = getEstacas();

      const cycle = 10;
      const phase = (t % cycle) / cycle;
      const weights = [1, 1, 1, 1];

      if (phase < 0.12) { /* centered */ }
      else if (phase < 0.35) {
        const p = Math.sin(((phase - 0.12) / 0.23) * Math.PI);
        weights[0] = 1 + 0.12 * p; weights[3] = 1 + 0.12 * p;
        weights[1] = 1 - 0.08 * p; weights[2] = 1 - 0.08 * p;
      } else if (phase < 0.47) { /* centered */ }
      else if (phase < 0.7) {
        const p = Math.sin(((phase - 0.47) / 0.23) * Math.PI);
        weights[0] = 1 + 0.12 * p; weights[1] = 1 + 0.12 * p;
        weights[2] = 1 - 0.08 * p; weights[3] = 1 - 0.08 * p;
      } else if (phase < 0.82) { /* centered */ }
      else {
        const p = Math.sin(((phase - 0.82) / 0.18) * Math.PI);
        weights[0] = 1 + 0.15 * p; weights[1] = 1 + 0.03 * p;
        weights[2] = 1 - 0.1 * p; weights[3] = 1 + 0.03 * p;
      }

      const { cells, centroids } = computeVoronoi(weights);

      // Block outline
      const blockOff = estacaOff() + S * 0.06;
      ctx!.strokeStyle = "rgba(245,130,13,0.2)";
      ctx!.lineWidth = 1.5;
      ctx!.strokeRect(c - blockOff, cc - blockOff, blockOff * 2, blockOff * 2);

      // Voronoi cells
      cells.forEach(({ x, y, idx }) => {
        const col = cellColors[idx];
        ctx!.fillStyle = `rgba(${col.r},${col.g},${col.b},0.18)`;
        ctx!.fillRect(x - STEP / 2, y - STEP / 2, STEP, STEP);
      });

      // Pilar outline
      ctx!.strokeStyle = "rgba(245,130,13,0.7)";
      ctx!.lineWidth = 2;
      ctx!.strokeRect(c - pw / 2, cc - ph / 2, pw, ph);

      // Cell boundaries
      ctx!.fillStyle = "rgba(255,255,255,0.35)";
      const cols = Math.floor(pw / STEP);
      for (let i = 0; i < cells.length; i++) {
        const ci = cells[i];
        const rightIdx = i + 1;
        if (rightIdx < cells.length && cells[rightIdx].y === ci.y && cells[rightIdx].idx !== ci.idx) {
          ctx!.fillRect(ci.x + STEP / 2 - 0.5, ci.y - STEP / 2, 1, STEP);
        }
        const belowIdx = i + cols;
        if (belowIdx < cells.length && cells[belowIdx].idx !== ci.idx) {
          ctx!.fillRect(ci.x - STEP / 2, ci.y + STEP / 2 - 0.5, STEP, 1);
        }
      }

      // Tirantes
      ctx!.strokeStyle = "rgba(96,165,250,0.5)";
      ctx!.lineWidth = 2;
      ctx!.beginPath();
      for (let i = 0; i < 4; i++) {
        const a = estacas[i], b = estacas[(i + 1) % 4];
        ctx!.moveTo(a.x, a.y); ctx!.lineTo(b.x, b.y);
      }
      ctx!.stroke();

      // Bielas
      centroids.forEach((cen, i) => {
        const e = estacas[i];
        ctx!.strokeStyle = `rgba(${cellColors[i].r},${cellColors[i].g},${cellColors[i].b},0.5)`;
        ctx!.lineWidth = 1.5;
        ctx!.setLineDash([6, 4]);
        ctx!.beginPath(); ctx!.moveTo(cen.x, cen.y); ctx!.lineTo(e.x, e.y); ctx!.stroke();
        ctx!.setLineDash([]);
      });

      // Centroids
      centroids.forEach((cen, i) => {
        const col = cellColors[i];
        ctx!.beginPath(); ctx!.arc(cen.x, cen.y, 4, 0, Math.PI * 2);
        ctx!.fillStyle = `rgb(${col.r},${col.g},${col.b})`; ctx!.fill();
        ctx!.strokeStyle = "rgba(255,255,255,0.6)"; ctx!.lineWidth = 1; ctx!.stroke();
      });

      // Estacas
      estacas.forEach((e, i) => {
        ctx!.beginPath(); ctx!.arc(e.x, e.y, S * 0.04, 0, Math.PI * 2);
        ctx!.strokeStyle = "rgba(255,255,255,0.3)"; ctx!.lineWidth = 1.5; ctx!.stroke();
        ctx!.beginPath(); ctx!.arc(e.x, e.y, 2.5, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(${cellColors[i].r},${cellColors[i].g},${cellColors[i].b},0.7)`; ctx!.fill();
      });

      // Labels
      ctx!.font = "600 " + S * 0.02 + 'px "IBM Plex Mono", monospace';
      ctx!.textAlign = "center";
      estacas.forEach((e) => {
        ctx!.fillStyle = "rgba(255,255,255,0.35)";
        ctx!.fillText(e.label, e.x, e.y + S * 0.065);
      });
      ctx!.font = "600 " + S * 0.022 + 'px "IBM Plex Mono", monospace';
      ctx!.fillStyle = "rgba(245,130,13,0.5)";
      ctx!.fillText("PILAR", c, cc - ph / 2 - S * 0.02);

      // Moment indicator
      let momentText = "N centrado";
      let momentDesc = "Carga axial sem momento";
      let momentColor = "rgba(255,255,255,0.3)";
      if (phase >= 0.15 && phase < 0.35) {
        momentText = "Mx aplicado →"; momentDesc = "Áreas E1/E4 absorvem mais carga"; momentColor = "rgba(245,130,13,0.7)";
      } else if (phase >= 0.5 && phase < 0.7) {
        momentText = "My aplicado ↑"; momentDesc = "Áreas E1/E2 absorvem mais carga"; momentColor = "rgba(245,130,13,0.7)";
      } else if (phase >= 0.85) {
        momentText = "Mx + My ↗"; momentDesc = "E1 recebe carga máxima"; momentColor = "rgba(245,130,13,0.9)";
      }
      ctx!.font = "700 " + S * 0.022 + 'px "IBM Plex Mono", monospace';
      ctx!.fillStyle = momentColor; ctx!.textAlign = "right";
      ctx!.fillText(momentText, S * 0.94, S * 0.06);
      ctx!.font = "400 " + S * 0.014 + 'px "IBM Plex Mono", monospace';
      ctx!.fillStyle = "rgba(255,255,255,0.3)";
      ctx!.fillText(momentDesc, S * 0.94, S * 0.085);
      ctx!.font = "400 " + S * 0.013 + 'px "IBM Plex Mono", monospace';
      ctx!.fillStyle = "rgba(255,255,255,0.15)";
      ctx!.fillText("Voronoi ponderado — topo do pilar", S * 0.94, S * 0.11);
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
      if (cv!.style.opacity !== "0") draw(t);
      animFrameId = requestAnimationFrame(animatePlanta);
    }
    animFrameId = requestAnimationFrame(animatePlanta);
    window.addEventListener("resize", () => { S = resize(); });

    return () => { cancelAnimationFrame(animFrameId); };
  }, []);

  // ── PHASE 2+3: Cross-fade controller + Three.js 3D ──
  useEffect(() => {
    const canvas = canvas3DRef.current;
    const svgPlanta = canvasPlantaRef.current;
    const svgCorte = svgCorteRef.current;
    const container = containerRef.current;
    if (!canvas || !svgPlanta || !svgCorte || !container) return;

    const pl = svgPlanta as HTMLCanvasElement;
    const co = svgCorte as unknown as HTMLElement;
    const cv3 = canvas;

    let W = container.clientWidth;
    let H = container.clientHeight;

    // Three.js setup
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, W / H, 0.1, 100);
    camera.position.set(6, 4.5, 7);
    camera.lookAt(0, 0.3, 0);

    // Lighting
    scene.add(new THREE.AmbientLight(0xffffff, 0.4));
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.7);
    dirLight.position.set(5, 8, 6);
    scene.add(dirLight);
    const rimLight = new THREE.DirectionalLight(0xf5820d, 0.25);
    rimLight.position.set(-4, 2, -3);
    scene.add(rimLight);

    // Materials
    const matOrange = new THREE.MeshStandardMaterial({ color: 0xf5820d, roughness: 0.4, metalness: 0.1 });
    const matOrangeEmit = new THREE.MeshStandardMaterial({ color: 0xf5820d, emissive: 0xf5820d, emissiveIntensity: 0.3, roughness: 0.3, metalness: 0.1 });
    const matBlue = new THREE.MeshStandardMaterial({ color: 0x60a5fa, emissive: 0x60a5fa, emissiveIntensity: 0.2, roughness: 0.3, metalness: 0.1 });
    const matConcrete = new THREE.MeshStandardMaterial({ color: 0x3a4555, roughness: 0.9, metalness: 0.0, transparent: true, opacity: 0.1, side: THREE.DoubleSide });
    const matConcreteEdge = new THREE.LineBasicMaterial({ color: 0xf5820d, transparent: true, opacity: 0.2 });
    const matPilar = new THREE.MeshStandardMaterial({ color: 0xf5820d, roughness: 0.5, metalness: 0.1, transparent: true, opacity: 0.15 });
    const matPilarEdge = new THREE.LineBasicMaterial({ color: 0xf5820d, transparent: true, opacity: 0.6 });
    const matEstaca = new THREE.MeshStandardMaterial({ color: 0x555560, roughness: 0.8, metalness: 0.0, transparent: true, opacity: 0.2 });
    const matEstacaEdge = new THREE.LineBasicMaterial({ color: 0x666670, transparent: true, opacity: 0.4 });

    const root = new THREE.Group();
    scene.add(root);

    // Geometry
    const blockW = 3.2, blockD = 3.2, blockH = 2.0;
    const pilarWw = 0.8, pilarHh = 1.2;
    const estacaR = 0.22, estacaH = 1.6, spacing = 1.2;

    // Block
    const blockGeo = new THREE.BoxGeometry(blockW, blockH, blockD);
    const blockMesh = new THREE.Mesh(blockGeo, matConcrete);
    blockMesh.position.y = blockH / 2; root.add(blockMesh);
    const blockLines = new THREE.LineSegments(new THREE.EdgesGeometry(blockGeo), matConcreteEdge);
    blockLines.position.y = blockH / 2; root.add(blockLines);

    // Pilar
    const pilarGeo = new THREE.BoxGeometry(pilarWw, pilarHh, pilarWw);
    const pilarMesh = new THREE.Mesh(pilarGeo, matPilar);
    pilarMesh.position.y = blockH + pilarHh / 2; root.add(pilarMesh);
    const pilarLines = new THREE.LineSegments(new THREE.EdgesGeometry(pilarGeo), matPilarEdge);
    pilarLines.position.y = blockH + pilarHh / 2; root.add(pilarLines);

    // Base plate
    const plateGeo = new THREE.BoxGeometry(pilarWw * 1.1, 0.06, pilarWw * 1.1);
    const plateMat = new THREE.MeshStandardMaterial({ color: 0xf5820d, emissive: 0xf5820d, emissiveIntensity: 0.15, roughness: 0.4, transparent: true, opacity: 0.35 });
    const plateMesh = new THREE.Mesh(plateGeo, plateMat);
    plateMesh.position.y = blockH; root.add(plateMesh);
    root.add(new THREE.LineSegments(new THREE.EdgesGeometry(plateGeo), new THREE.LineBasicMaterial({ color: 0xf5820d, transparent: true, opacity: 0.5 })));

    // Estacas
    const estacaPositions = [[-spacing, -spacing], [spacing, -spacing], [spacing, spacing], [-spacing, spacing]];
    const estacaGeo = new THREE.CylinderGeometry(estacaR, estacaR, estacaH, 16);
    estacaPositions.forEach(([ex, ez]) => {
      const pile = new THREE.Mesh(estacaGeo, matEstaca);
      pile.position.set(ex, -estacaH / 2, ez); root.add(pile);
      const pileEdge = new THREE.LineSegments(new THREE.EdgesGeometry(estacaGeo), matEstacaEdge);
      pileEdge.position.set(ex, -estacaH / 2, ez); root.add(pileEdge);
    });

    // Strut helper
    function createStrut(p1: THREE.Vector3, p2: THREE.Vector3, radius: number, material: THREE.Material) {
      const dir = new THREE.Vector3().subVectors(p2, p1);
      const len = dir.length();
      const geo = new THREE.CylinderGeometry(radius, radius, len, 8);
      const mesh = new THREE.Mesh(geo, material);
      mesh.position.addVectors(p1, p2).multiplyScalar(0.5);
      mesh.setRotationFromQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize()));
      return mesh;
    }

    // CCC + CCT nodes
    const pilarOffset = pilarWw / 4;
    const cccPositions = [
      new THREE.Vector3(-pilarOffset, blockH, -pilarOffset),
      new THREE.Vector3(pilarOffset, blockH, -pilarOffset),
      new THREE.Vector3(pilarOffset, blockH, pilarOffset),
      new THREE.Vector3(-pilarOffset, blockH, pilarOffset),
    ];
    const tiranteY = 0.15;
    const cctPositions = estacaPositions.map(([ex, ez]) => new THREE.Vector3(ex, tiranteY, ez));

    // Bielas
    for (let i = 0; i < 4; i++) root.add(createStrut(cccPositions[i], cctPositions[i], 0.07, matOrangeEmit));

    // Tirantes
    for (let i = 0; i < 4; i++) root.add(createStrut(cctPositions[i], cctPositions[(i + 1) % 4], 0.055, matBlue));

    // Nodes
    cccPositions.forEach(pos => { const n = new THREE.Mesh(new THREE.SphereGeometry(0.07, 16, 16), matOrangeEmit); n.position.copy(pos); root.add(n); });
    cctPositions.forEach(pos => { const n = new THREE.Mesh(new THREE.SphereGeometry(0.11, 16, 16), matBlue); n.position.copy(pos); root.add(n); });

    // Load arrow
    const arrowGeo = new THREE.CylinderGeometry(0.03, 0.03, 1.0, 8);
    const arrowMesh = new THREE.Mesh(arrowGeo, matOrange);
    arrowMesh.position.set(0, blockH + pilarHh + 0.5, 0); root.add(arrowMesh);
    const coneMesh = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.25, 8), matOrange);
    coneMesh.position.set(0, blockH + pilarHh + 0.12, 0); coneMesh.rotation.x = Math.PI; root.add(coneMesh);

    // Ground grid
    const gridMat = new THREE.LineBasicMaterial({ color: 0xf5820d, transparent: true, opacity: 0.06 });
    for (let i = 0; i <= 12; i++) {
      const t = (i / 12 - 0.5) * 6;
      root.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(t, -estacaH, -3), new THREE.Vector3(t, -estacaH, 3)]), gridMat));
      root.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-3, -estacaH, t), new THREE.Vector3(3, -estacaH, t)]), gridMat));
    }

    root.position.y = -0.5;

    // ── PHASE ANIMATION ──
    const phases = {
      plantaShow: 10.0, plantaFadeOut: 0.8,
      corteShow: 10.0, corteFadeOut: 0.8,
      orbitShow: 10.0, orbitFadeOut: 0.8,
    };
    const loopDuration = phases.plantaShow + phases.plantaFadeOut + phases.corteShow + phases.corteFadeOut + phases.orbitShow + phases.orbitFadeOut;

    let startTime: number | null = null;
    let canvasRevealed = false;
    let autoAngle = Math.atan2(6, 7);
    let userAngleX = 0, userAngleY = 0;
    let targetUserAngleX = 0, targetUserAngleY = 0;
    let isDragging = false, prevX = 0, prevY = 0;

    const onPointerDown = (e: PointerEvent) => { isDragging = true; prevX = e.clientX; prevY = e.clientY; cv3.style.cursor = "grabbing"; };
    const onPointerUp = () => { isDragging = false; cv3.style.cursor = "grab"; };
    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      targetUserAngleX += (e.clientX - prevX) * 0.005;
      targetUserAngleY = Math.max(-0.5, Math.min(0.5, targetUserAngleY + (e.clientY - prevY) * 0.003));
      prevX = e.clientX; prevY = e.clientY;
    };
    canvas.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointermove", onPointerMove);

    let animId: number;
    function animate(timestamp: number) {
      animId = requestAnimationFrame(animate);
      if (!startTime) startTime = timestamp;
      const elapsed = (timestamp - startTime) / 1000;
      const t = elapsed % loopDuration;

      const t1 = phases.plantaShow;
      const t2 = t1 + phases.plantaFadeOut;
      const t3 = t2 + phases.corteShow;
      const t4 = t3 + phases.corteFadeOut;
      const t5 = t4 + phases.orbitShow;
      const t6 = t5 + phases.orbitFadeOut;

      if (t < t1) {
        pl.style.opacity = "1"; co.style.opacity = "0"; cv3.style.opacity = "0"; canvasRevealed = false;
      } else if (t < t2) {
        const p = (t - t1) / phases.plantaFadeOut;
        pl.style.opacity = String(1 - p); co.style.opacity = String(p); cv3.style.opacity = "0"; canvasRevealed = false;
      } else if (t < t3) {
        pl.style.opacity = "0"; co.style.opacity = "1"; cv3.style.opacity = "0"; canvasRevealed = false;
      } else if (t < t4) {
        const p = (t - t3) / phases.corteFadeOut;
        co.style.opacity = String(1 - p); cv3.style.opacity = String(p); canvasRevealed = true;
      } else if (t < t5) {
        pl.style.opacity = "0"; co.style.opacity = "0"; cv3.style.opacity = "1"; canvasRevealed = true;
      } else {
        const p = (t - t5) / phases.orbitFadeOut;
        cv3.style.opacity = String(1 - p); pl.style.opacity = String(p); co.style.opacity = "0"; canvasRevealed = false;
      }

      if (canvasRevealed) {
        autoAngle += 0.003;
        userAngleX += (targetUserAngleX - userAngleX) * 0.08;
        userAngleY += (targetUserAngleY - userAngleY) * 0.08;
        const totalAngle = autoAngle + userAngleX;
        const radius = 9;
        camera.position.x = Math.sin(totalAngle) * radius;
        camera.position.z = Math.cos(totalAngle) * radius;
        camera.position.y = 4.5 + userAngleY * 5;
        camera.lookAt(0, 0.3, 0);
      }

      renderer.render(scene, camera);
    }
    animId = requestAnimationFrame(animate);

    function onResize() {
      if (!container) return;
      W = container.clientWidth; H = container.clientHeight;
      renderer.setSize(W, H);
      camera.aspect = W / H;
      camera.updateProjectionMatrix();
    }
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(animId);
      canvas.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
    };
  }, []);

  return (
    <div ref={containerRef} className="hero-visual-container hidden lg:block">
      {/* Phase 1: Voronoi Planta */}
      <canvas ref={canvasPlantaRef} className="absolute inset-0 w-full h-full block" style={{ transition: "opacity 0.8s ease" }} />

      {/* Phase 2: Corte SVG */}
      <svg ref={svgCorteRef} className="absolute inset-0 w-full h-full" viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg" style={{ opacity: 0, transition: "opacity 0.8s ease", padding: "5%", pointerEvents: "none" }}>
        <rect x="60" y="120" width="380" height="250" rx="3" fill="none" stroke="#f5820d" strokeWidth="1.5" opacity="0.25" strokeDasharray="6 3" />
        <rect x="210" y="40" width="80" height="80" rx="2" fill="rgba(245,130,13,0.1)" stroke="#f5820d" strokeWidth="1.5" />
        <text x="250" y="85" fontFamily="IBM Plex Mono" fontSize="11" fill="#f5820d" textAnchor="middle" fontWeight="600">P1</text>
        <line x1="250" y1="5" x2="250" y2="32" stroke="#f5820d" strokeWidth="2" />
        <polygon points="244,32 250,42 256,32" fill="#f5820d" />
        <text x="266" y="16" fontFamily="IBM Plex Mono" fontSize="12" fill="#f5820d" fontWeight="700">Nd</text>
        <rect x="95" y="370" width="40" height="90" rx="2" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
        <text x="115" y="420" fontFamily="IBM Plex Mono" fontSize="9" fill="rgba(255,255,255,0.25)" textAnchor="middle">E1</text>
        <rect x="365" y="370" width="40" height="90" rx="2" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
        <text x="385" y="420" fontFamily="IBM Plex Mono" fontSize="9" fill="rgba(255,255,255,0.25)" textAnchor="middle">E4</text>
        <line x1="230" y1="120" x2="115" y2="350" stroke="#f5820d" strokeWidth="2.5" strokeDasharray="10 5" />
        <line x1="270" y1="120" x2="385" y2="350" stroke="#f5820d" strokeWidth="2.5" strokeDasharray="10 5" />
        <text x="155" y="220" fontFamily="IBM Plex Mono" fontSize="10" fill="#f5820d" transform="rotate(-63, 155, 220)">BIELA</text>
        <text x="345" y="220" fontFamily="IBM Plex Mono" fontSize="10" fill="#f5820d" transform="rotate(63, 345, 220)">BIELA</text>
        <line x1="115" y1="350" x2="385" y2="350" stroke="#60a5fa" strokeWidth="2.5" />
        <text x="250" y="342" fontFamily="IBM Plex Mono" fontSize="9" fill="#60a5fa" textAnchor="middle">TIRANTE (As)</text>
        <circle cx="230" cy="120" r="5" fill="none" stroke="#f5820d" strokeWidth="2" />
        <circle cx="270" cy="120" r="5" fill="none" stroke="#f5820d" strokeWidth="2" />
        <text x="250" y="145" fontFamily="IBM Plex Mono" fontSize="9" fill="rgba(255,255,255,0.35)" textAnchor="middle">CCC</text>
        <circle cx="115" cy="350" r="5" fill="none" stroke="#60a5fa" strokeWidth="2" />
        <circle cx="385" cy="350" r="5" fill="none" stroke="#60a5fa" strokeWidth="2" />
        <text x="80" y="355" fontFamily="IBM Plex Mono" fontSize="9" fill="rgba(255,255,255,0.35)" textAnchor="middle">CCT</text>
        <text x="420" y="355" fontFamily="IBM Plex Mono" fontSize="9" fill="rgba(255,255,255,0.35)" textAnchor="middle">CCT</text>
        <path d="M 148,350 A 33,33 0 0,0 132,322" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1" />
        <text x="158" y="328" fontFamily="IBM Plex Mono" fontSize="12" fill="rgba(255,255,255,0.45)" fontWeight="600">θ</text>
        <line x1="455" y1="120" x2="455" y2="350" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
        <line x1="449" y1="120" x2="461" y2="120" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
        <line x1="449" y1="350" x2="461" y2="350" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
        <text x="470" y="240" fontFamily="IBM Plex Mono" fontSize="10" fill="rgba(255,255,255,0.25)" textAnchor="middle">d</text>
        <line x1="115" y1="475" x2="385" y2="475" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
        <line x1="115" y1="470" x2="115" y2="480" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
        <line x1="385" y1="470" x2="385" y2="480" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
        <text x="250" y="492" fontFamily="IBM Plex Mono" fontSize="10" fill="rgba(255,255,255,0.25)" textAnchor="middle">ℓ = 2.40 m</text>
        <text x="30" y="22" fontFamily="IBM Plex Mono" fontSize="11" fill="rgba(255,255,255,0.2)" letterSpacing="0.15em">CORTE A-A</text>
      </svg>

      {/* Phase 3: Three.js 3D */}
      <canvas ref={canvas3DRef} className="absolute inset-0 w-full h-full block" style={{ opacity: 0, transition: "opacity 0.8s ease", cursor: "grab" }} />
    </div>
  );
}
