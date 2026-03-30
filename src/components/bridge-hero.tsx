"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";

const BLOCOS_URL =
  process.env.NEXT_PUBLIC_BLOCOS_URL || "https://blocos.byfust.com.br";
const GEOTECH_URL =
  process.env.NEXT_PUBLIC_GEOTECH_URL || "https://geotech.byfust.com.br";

// ---------------------------------------------------------------------------
// Camera keyframes
// ---------------------------------------------------------------------------
const CAM_KF = [
  { t: 0.0,  pos: [28, 14, 28] as [number, number, number], look: [0,  2, 0] as [number, number, number] },
  { t: 0.15, pos: [24, 11, 24] as [number, number, number], look: [0,  2, 0] as [number, number, number] },
  { t: 0.22, pos: [16,  6, 16] as [number, number, number], look: [0,  2, 0] as [number, number, number] },
  { t: 0.30, pos: [14,  4, 14] as [number, number, number], look: [0,  0, 0] as [number, number, number] },
  { t: 0.42, pos: [12,  2, 12] as [number, number, number], look: [0, -1, 0] as [number, number, number] },
  { t: 0.50, pos: [12,  0, 12] as [number, number, number], look: [0, -3, 0] as [number, number, number] },
  { t: 0.58, pos: [11, -1, 11] as [number, number, number], look: [0, -4, 0] as [number, number, number] },
  { t: 0.72, pos: [10, -2, 10] as [number, number, number], look: [0, -5, 0] as [number, number, number] },
  { t: 0.78, pos: [13, -2, 13] as [number, number, number], look: [0, -6, 0] as [number, number, number] },
  { t: 0.88, pos: [15, -2, 15] as [number, number, number], look: [0, -6, 0] as [number, number, number] },
  { t: 0.94, pos: [16,  4, 16] as [number, number, number], look: [0,  0, 0] as [number, number, number] },
  { t: 1.0,  pos: [28, 14, 28] as [number, number, number], look: [0,  2, 0] as [number, number, number] },
];

function easeInOut(t: number) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

function lerpCam(scrollP: number) {
  let i = 0;
  for (let k = 0; k < CAM_KF.length - 1; k++) {
    if (scrollP >= CAM_KF[k].t && scrollP <= CAM_KF[k + 1].t) {
      i = k;
      break;
    }
  }
  const a = CAM_KF[i];
  const b = CAM_KF[i + 1];
  const span = b.t - a.t;
  const raw = span === 0 ? 0 : (scrollP - a.t) / span;
  const t = easeInOut(Math.max(0, Math.min(1, raw)));
  const pos: [number, number, number] = [
    a.pos[0] + (b.pos[0] - a.pos[0]) * t,
    a.pos[1] + (b.pos[1] - a.pos[1]) * t,
    a.pos[2] + (b.pos[2] - a.pos[2]) * t,
  ];
  const look: [number, number, number] = [
    a.look[0] + (b.look[0] - a.look[0]) * t,
    a.look[1] + (b.look[1] - a.look[1]) * t,
    a.look[2] + (b.look[2] - a.look[2]) * t,
  ];
  return { pos, look };
}

// ---------------------------------------------------------------------------
// Slide ranges
// ---------------------------------------------------------------------------
const SLIDES = [
  { id: "s1", from: 0.0,  to: 0.14 },
  { id: "s2", from: 0.16, to: 0.28 },
  { id: "s3", from: 0.30, to: 0.48 },
  { id: "s4", from: 0.52, to: 0.74 },
  { id: "s5", from: 0.76, to: 0.90 },
  { id: "s6", from: 0.93, to: 1.0  },
];

function getActiveSlide(p: number) {
  for (const s of SLIDES) {
    if (p >= s.from && p <= s.to) return s.id;
  }
  return "";
}

// ---------------------------------------------------------------------------
// Slide opacity helper (lerp in/out over 0.015 window)
// ---------------------------------------------------------------------------
function slideOpacity(id: string, p: number) {
  const s = SLIDES.find((x) => x.id === id);
  if (!s) return 0;
  const fade = 0.015;
  if (p < s.from - fade || p > s.to + fade) return 0;
  if (p < s.from) return (p - (s.from - fade)) / fade;
  if (p > s.to)   return 1 - (p - s.to) / fade;
  return 1;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export function BridgeHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scrollRef = useRef(0);
  // DOM refs for each slide — updated directly in rAF (no re-renders)
  const slideRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const progressRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // -----------------------------------------------------------------------
    // Renderer
    // -----------------------------------------------------------------------
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setClearColor(0x0b0d10, 1);

    // -----------------------------------------------------------------------
    // Scene
    // -----------------------------------------------------------------------
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x0b0d10, 50, 140);

    // Camera
    const camera = new THREE.PerspectiveCamera(
      30,
      window.innerWidth / window.innerHeight,
      0.1,
      200
    );
    camera.position.set(28, 14, 28);
    camera.lookAt(0, 2, 0);

    // Lights
    const ambient = new THREE.AmbientLight(0xffffff, 0.35);
    scene.add(ambient);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.7);
    dirLight.position.set(8, 15, 10);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.set(1024, 1024);
    dirLight.shadow.camera.near   =  0.5;
    dirLight.shadow.camera.far    = 80;
    dirLight.shadow.camera.left   = -30;
    dirLight.shadow.camera.right  =  30;
    dirLight.shadow.camera.top    =  30;
    dirLight.shadow.camera.bottom = -30;
    scene.add(dirLight);

    const rimLight = new THREE.DirectionalLight(0xff8a1f, 0.15);
    rimLight.position.set(-6, 4, -8);
    scene.add(rimLight);

    // -----------------------------------------------------------------------
    // Materials
    // -----------------------------------------------------------------------
    const matW = new THREE.MeshStandardMaterial({ color: 0xd8d8d8, roughness: 0.85 });
    const matG = new THREE.MeshStandardMaterial({ color: 0xb0b0b0, roughness: 0.9 });
    const matO = new THREE.MeshStandardMaterial({
      color: 0xff8a1f, roughness: 0.5,
      emissive: new THREE.Color(0xff8a1f),
      emissiveIntensity: 0.12,
    });
    const matP = new THREE.MeshStandardMaterial({ color: 0xc0c0c0, roughness: 0.9 });
    const matGnd = new THREE.MeshStandardMaterial({ color: 0x0e1014, roughness: 1 });

    // Highlight materials (mutable)
    const matPilarHi = new THREE.MeshStandardMaterial({ color: 0xd8d8d8, roughness: 0.7, emissive: new THREE.Color(0xffffff), emissiveIntensity: 0 });
    const matPileHi  = new THREE.MeshStandardMaterial({ color: 0xc0c0c0, roughness: 0.8, emissive: new THREE.Color(0xffffff), emissiveIntensity: 0 });

    // -----------------------------------------------------------------------
    // Scene root group
    // -----------------------------------------------------------------------
    const root = new THREE.Group();
    root.position.x = 3;
    root.rotation.y = -0.35;
    scene.add(root);

    // -----------------------------------------------------------------------
    // Ground
    // -----------------------------------------------------------------------
    const gndMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(200, 200),
      matGnd
    );
    gndMesh.rotation.x = -Math.PI / 2;
    gndMesh.position.y = -12;
    gndMesh.receiveShadow = true;
    root.add(gndMesh);

    // -----------------------------------------------------------------------
    // DECK
    // -----------------------------------------------------------------------
    const dGrp = new THREE.Group();
    dGrp.position.x = -25;
    root.add(dGrp);

    const dL  = 80;
    const sW  = 7.0;
    const sT  = 0.15;
    const wH  = 1.4;
    const wT  = 0.12;
    const bT  = 0.12;
    const cW  = 1.5;
    const gW  = 0.8;
    const dY  = 8;

    // Top slab
    const slabMesh = new THREE.Mesh(
      new THREE.BoxGeometry(dL, sT, sW),
      matW
    );
    slabMesh.position.set(0, dY - sT / 2, 0);
    slabMesh.castShadow = true;
    dGrp.add(slabMesh);

    // Box girders — two, at gz = -(gW/2 + cW/2) and +(gW/2 + cW/2)
    const gzVals = [-(gW / 2 + cW / 2), +(gW / 2 + cW / 2)];
    for (const gz of gzVals) {
      // Left web
      const lwMesh = new THREE.Mesh(
        new THREE.BoxGeometry(dL, wH, wT),
        matG
      );
      lwMesh.position.set(0, dY - sT - wH / 2, gz - cW / 2 - wT / 2);
      lwMesh.castShadow = true;
      dGrp.add(lwMesh);

      // Right web
      const rwMesh = new THREE.Mesh(
        new THREE.BoxGeometry(dL, wH, wT),
        matG
      );
      rwMesh.position.set(0, dY - sT - wH / 2, gz + cW / 2 + wT / 2);
      rwMesh.castShadow = true;
      dGrp.add(rwMesh);

      // Bottom flange
      const bfMesh = new THREE.Mesh(
        new THREE.BoxGeometry(dL, bT, cW + wT * 2),
        matG
      );
      bfMesh.position.set(0, dY - sT - wH - bT / 2, gz);
      bfMesh.castShadow = true;
      dGrp.add(bfMesh);
    }

    // New Jersey barriers (extruded profile)
    function makeNJBarrier(side: "left" | "right") {
      const shape = new THREE.Shape();
      if (side === "left") {
        shape.moveTo(0, 0);
        shape.lineTo(-0.35, 0);
        shape.lineTo(-0.35, 0.08);
        shape.lineTo(-0.22, 0.34);
        shape.lineTo(-0.15, 0.81);
        shape.lineTo(0, 0.81);
        shape.lineTo(0, 0);
      } else {
        shape.moveTo(0, 0);
        shape.lineTo(0.35, 0);
        shape.lineTo(0.35, 0.08);
        shape.lineTo(0.22, 0.34);
        shape.lineTo(0.15, 0.81);
        shape.lineTo(0, 0.81);
        shape.lineTo(0, 0);
      }
      const extSettings: THREE.ExtrudeGeometryOptions = {
        depth: dL,
        bevelEnabled: false,
      };
      const geo = new THREE.ExtrudeGeometry(shape, extSettings);
      const mesh = new THREE.Mesh(geo, matG);
      mesh.rotation.y = Math.PI / 2;
      if (side === "left") {
        mesh.position.set(-dL / 2, dY, -sW / 2);
      } else {
        mesh.position.set(-dL / 2, dY, sW / 2);
      }
      mesh.castShadow = true;
      dGrp.add(mesh);
    }
    makeNJBarrier("left");
    makeNJBarrier("right");

    const dH   = sT + wH + bT;
    const dBot = dY - dH;

    // -----------------------------------------------------------------------
    // Helper: build a support (pier + cap + pile cap + piles)
    // -----------------------------------------------------------------------
    function buildSupport(
      parentGroup: THREE.Group,
      opts: {
        pilarMat: THREE.MeshStandardMaterial;
        blocMat:  THREE.MeshStandardMaterial;
        pileMat:  THREE.MeshStandardMaterial;
        blScale:  number; // scale for bloco dims
      }
    ) {
      const { pilarMat, blocMat, pileMat, blScale } = opts;

      // Pier params
      const pW  = 1.6;
      const pH  = 9;
      const pD  = 1.6;
      const pSp = 2.8;
      const tvW = 2.5;
      const tvH = 1.2;
      const tvD = pSp + pD + 1.0;

      // Cap beam (travessa)
      const tvMesh = new THREE.Mesh(
        new THREE.BoxGeometry(tvW, tvH, tvD),
        matW
      );
      tvMesh.position.set(0, dBot - tvH / 2, 0);
      tvMesh.castShadow = true;
      tvMesh.receiveShadow = true;
      parentGroup.add(tvMesh);

      // Two columns (pilares)
      for (const pz of [-pSp / 2, pSp / 2]) {
        const pilMesh = new THREE.Mesh(
          new THREE.BoxGeometry(pW, pH, pD),
          pilarMat
        );
        pilMesh.position.set(0, dBot - tvH - pH / 2, pz);
        pilMesh.castShadow = true;
        pilMesh.receiveShadow = true;
        parentGroup.add(pilMesh);
      }

      const pBot = dBot - tvH - pH;

      // Pile cap (bloco)
      const blW = 4.5 * blScale;
      const blH = 2.0 * blScale;
      const blD = (pSp + pD + 3.5) * blScale;

      const blocoMesh = new THREE.Mesh(
        new THREE.BoxGeometry(blW, blH, blD),
        blocMat
      );
      blocoMesh.position.set(0, pBot - blH / 2, 0);
      blocoMesh.castShadow = true;
      blocoMesh.receiveShadow = true;
      parentGroup.add(blocoMesh);

      // Wireframe edges for bloco
      const edgesGeo = new THREE.EdgesGeometry(
        new THREE.BoxGeometry(blW, blH, blD)
      );
      const edgesMat = new THREE.LineBasicMaterial({
        color: 0xffa040,
        transparent: true,
        opacity: 0.3,
      });
      const edgesMesh = new THREE.LineSegments(edgesGeo, edgesMat);
      edgesMesh.position.copy(blocoMesh.position);
      parentGroup.add(edgesMesh);

      // Piles (9 estacas)
      const plR  = 0.5;
      const plH  = 8;
      const plSX = 1.5;
      const plSZ = 2.6;
      const pilePositions: [number, number][] = [
        [-plSX, -plSZ], [0, -plSZ], [plSX, -plSZ],
        [-plSX,  0],    [0,  0],    [plSX,  0],
        [-plSX,  plSZ], [0,  plSZ], [plSX,  plSZ],
      ];
      const pileY = blocoMesh.position.y - blH / 2 - plH / 2;
      for (const [px, pz] of pilePositions) {
        const pileMesh = new THREE.Mesh(
          new THREE.CylinderGeometry(plR, plR, plH, 16),
          pileMat
        );
        pileMesh.position.set(px, pileY, pz);
        pileMesh.castShadow = true;
        pileMesh.receiveShadow = true;
        parentGroup.add(pileMesh);
      }
    }

    // -----------------------------------------------------------------------
    // Pier 1 — main highlighted support
    // -----------------------------------------------------------------------
    const p1Grp = new THREE.Group();
    p1Grp.position.x = 0; // relative to root (no offset — this is the hero pier)
    root.add(p1Grp);

    buildSupport(p1Grp, {
      pilarMat: matPilarHi,
      blocMat:  matO,
      pileMat:  matPileHi,
      blScale:  1.0,
    });

    // -----------------------------------------------------------------------
    // Pier 2 — secondary support
    // -----------------------------------------------------------------------
    const p2Grp = new THREE.Group();
    p2Grp.position.x = -28;
    root.add(p2Grp);

    buildSupport(p2Grp, {
      pilarMat: matG,
      blocMat:  matG,
      pileMat:  matG,
      blScale:  0.95,
    });

    // -----------------------------------------------------------------------
    // Pier 3 — tertiary support
    // -----------------------------------------------------------------------
    const p3Grp = new THREE.Group();
    p3Grp.position.x = -56;
    root.add(p3Grp);

    buildSupport(p3Grp, {
      pilarMat: matG,
      blocMat:  matG,
      pileMat:  matG,
      blScale:  0.9,
    });

    // -----------------------------------------------------------------------
    // Target colors for lerp
    // -----------------------------------------------------------------------
    const colWhite  = new THREE.Color(0xd8d8d8);
    const colGray   = new THREE.Color(0xc0c0c0);
    const colOrange = new THREE.Color(0xff8a1f);
    const colBlack  = new THREE.Color(0x000000);

    // -----------------------------------------------------------------------
    // Scroll listener
    // -----------------------------------------------------------------------
    const SCROLL_HEIGHT_VH = 700;

    function getScrollP() {
      const totalScrollable =
        (SCROLL_HEIGHT_VH / 100) * window.innerHeight - window.innerHeight;
      return Math.min(1, Math.max(0, window.scrollY / totalScrollable));
    }

    function onScroll() {
      scrollRef.current = getScrollP();
    }

    window.addEventListener("scroll", onScroll, { passive: true });

    // -----------------------------------------------------------------------
    // Resize
    // -----------------------------------------------------------------------
    function onResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }
    window.addEventListener("resize", onResize);

    // -----------------------------------------------------------------------
    // Animation loop
    // -----------------------------------------------------------------------
    let rafId = 0;
    let time  = 0;
    const LERP_SPEED = 0.04;

    function animate() {
      rafId = requestAnimationFrame(animate);
      time += 0.016;

      const p = scrollRef.current;

      // Zone detection
      const inPilar   = p > 0.28 && p < 0.50;
      const inBlocos  = p > 0.50 && p < 0.76;
      const inGeotech = p > 0.74 && p < 0.92;

      // Pilar color + emissive (lerp, like HTML)
      matPilarHi.color.lerp(inPilar ? colOrange : colWhite, LERP_SPEED);
      matPilarHi.emissive.lerp(inPilar ? colOrange : colBlack, LERP_SPEED);
      matPilarHi.emissiveIntensity += ((inPilar ? 0.2 : 0) - matPilarHi.emissiveIntensity) * LERP_SPEED;

      // Bloco color + emissive (orange default, white when pilar/geotech active)
      const blocoTarget = (inPilar || inGeotech) ? colWhite : colOrange;
      matO.color.lerp(blocoTarget, LERP_SPEED);
      matO.emissive.lerp(blocoTarget, LERP_SPEED);
      const blocoEI = (!inPilar && !inGeotech) ? 0.15 + Math.sin(time * 3) * 0.05 : 0;
      matO.emissiveIntensity += (blocoEI - matO.emissiveIntensity) * LERP_SPEED;

      // Pile color + emissive (lerp, like HTML)
      matPileHi.color.lerp(inGeotech ? colOrange : colGray, LERP_SPEED);
      matPileHi.emissive.lerp(inGeotech ? colOrange : colBlack, LERP_SPEED);
      matPileHi.emissiveIntensity += ((inGeotech ? 0.2 : 0) - matPileHi.emissiveIntensity) * LERP_SPEED;

      // Camera
      const { pos, look } = lerpCam(p);
      camera.position.set(pos[0], pos[1], pos[2]);
      camera.lookAt(look[0], look[1], look[2]);

      // Update slide opacities directly in DOM (no re-render)
      for (const s of SLIDES) {
        const el = slideRefs.current[s.id];
        if (!el) continue;
        const op = slideOpacity(s.id, p);
        el.style.opacity = String(op);
        el.style.transform = op > 0 ? "translateY(0)" : "translateY(18px)";
        el.style.pointerEvents = op > 0.5 ? "auto" : "none";
      }
      // Progress bar
      if (progressRef.current) progressRef.current.style.width = `${p * 100}%`;
      // Scroll hint
      if (hintRef.current) hintRef.current.style.opacity = p > 0.02 ? "0" : "1";

      renderer.render(scene, camera);
    }

    animate();

    // -----------------------------------------------------------------------
    // Cleanup
    // -----------------------------------------------------------------------
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
    };
  }, []);

  // -------------------------------------------------------------------------
  // Slide base style (DOM ref handles opacity/transform in rAF)
  // -------------------------------------------------------------------------
  const slideBaseStyle: React.CSSProperties = {
    position:      "fixed",
    opacity:       0,
    transform:     "translateY(18px)",
    pointerEvents: "none",
    zIndex:        50,
  };

  // -------------------------------------------------------------------------
  // Shared style tokens
  // -------------------------------------------------------------------------
  const accent    = "#FF8A1F";
  const textMain  = "#e0e0e6";
  const textDim   = "#9da0a8";
  const bgGlass   = "rgba(11,13,16,0.88)";
  const borderTop = `3px solid ${accent}`;
  const panelStyle: React.CSSProperties = {
    background:    bgGlass,
    backdropFilter: "blur(24px)",
    WebkitBackdropFilter: "blur(24px)",
    border:        "1px solid rgba(255,255,255,0.06)",
    borderRadius:  14,
    borderTop,
    padding:       "32px 36px",
    maxWidth:      540,
    width:         "calc(100% - 48px)",
  };
  const centeredFixed: React.CSSProperties = {
    inset:          0,
    display:        "flex",
    alignItems:     "center",
    justifyContent: "center",
  };
  const tagStyle: React.CSSProperties = {
    fontFamily:    "'IBM Plex Mono', monospace",
    fontSize:       11,
    letterSpacing:  "0.12em",
    textTransform: "uppercase" as const,
    color:          textDim,
    marginBottom:   12,
    display:        "flex",
    alignItems:     "center",
    gap:            6,
  };
  const featureList: React.CSSProperties = {
    display:       "flex",
    flexWrap:      "wrap" as const,
    gap:           8,
    margin:        "16px 0",
    padding:       0,
    listStyle:     "none",
  };
  const featureItem: React.CSSProperties = {
    fontFamily:    "'IBM Plex Mono', monospace",
    fontSize:       12,
    background:    "rgba(255,255,255,0.05)",
    border:        "1px solid rgba(255,255,255,0.09)",
    borderRadius:   6,
    padding:       "4px 10px",
    color:          textDim,
  };
  const btnStyle: React.CSSProperties = {
    display:        "inline-block",
    marginTop:      20,
    padding:        "11px 26px",
    background:     accent,
    color:          "#0b0d10",
    borderRadius:   8,
    fontFamily:     "'Syne', sans-serif",
    fontWeight:     700,
    fontSize:       14,
    textDecoration: "none",
    cursor:         "pointer",
    border:         "none",
  };
  const btnDisabledStyle: React.CSSProperties = {
    ...btnStyle,
    background: "rgba(255,255,255,0.08)",
    color:      "#666",
    cursor:     "not-allowed",
  };

  return (
    <>
      {/* 700vh scroll space */}
      <div style={{ height: "700vh", position: "relative" }}>

        {/* Fixed Three.js canvas */}
        <canvas
          ref={canvasRef}
          style={{
            position: "fixed",
            top:      0,
            left:     0,
            width:    "100%",
            height:   "100%",
            zIndex:   1,
          }}
        />

        {/* Progress bar */}
        <div
          ref={progressRef}
          style={{
            position:   "fixed",
            top:        0,
            left:       0,
            height:     2,
            background: accent,
            width:      "0%",
            zIndex:     200,
          }}
        />

        {/* ------------------------------------------------------------------ */}
        {/* SLIDE s1 — Hero */}
        {/* ------------------------------------------------------------------ */}
        <div ref={(el) => { slideRefs.current["s1"] = el; }} style={{ ...slideBaseStyle, opacity: 1, transform: "translateY(0)", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ textAlign: "center", padding: "0 24px" }}>
            <p
              style={{
                fontFamily:    "'IBM Plex Mono', monospace",
                fontSize:       13,
                letterSpacing: "0.14em",
                textTransform: "uppercase" as const,
                color:          accent,
                marginBottom:   18,
              }}
            >
              Estrutural · Geotecnia
            </p>
            <h1
              style={{
                fontFamily:   "'Bebas Neue', sans-serif",
                fontSize:     "clamp(56px, 10vw, 110px)",
                lineHeight:   1.0,
                color:        "#ffffff",
                margin:       0,
                letterSpacing: "0.01em",
              }}
            >
              Do solo{" "}
              <em style={{ color: accent, fontStyle: "normal" }}>À ESTRUTURA.</em>
            </h1>

            {/* Stats row */}
            <div
              style={{
                display:       "flex",
                justifyContent:"center",
                gap:           32,
                margin:        "24px 0",
                flexWrap:      "wrap",
              }}
            >
              {[
                { val: "100%",     label: "na nuvem" },
                { val: "NBR 6118", label: "norma" },
                { val: "PDF",      label: "automático" },
              ].map(({ val, label }) => (
                <div key={val} style={{ textAlign: "center" }}>
                  <div
                    style={{
                      fontFamily:   "'Bebas Neue', sans-serif",
                      fontSize:      28,
                      color:         "#ffffff",
                      letterSpacing: "0.04em",
                    }}
                  >
                    {val}
                  </div>
                  <div
                    style={{
                      fontFamily: "'IBM Plex Mono', monospace",
                      fontSize:    11,
                      color:       textDim,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase" as const,
                    }}
                  >
                    {label}
                  </div>
                </div>
              ))}
            </div>

            <p
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize:    17,
                color:       textDim,
                maxWidth:    480,
                margin:      "0 auto",
                lineHeight:  1.6,
              }}
            >
              Calcule blocos, estacas e pilares direto no navegador.
              Sem instalação, sem planilha.
            </p>
          </div>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* SLIDE s2 — Transition */}
        {/* ------------------------------------------------------------------ */}
        <div ref={(el) => { slideRefs.current["s2"] = el; }} style={{ ...slideBaseStyle, ...centeredFixed }}>
          <div style={panelStyle}>
            <p
              style={{
                fontFamily:  "'Syne', sans-serif",
                fontSize:    "clamp(22px, 3vw, 32px)",
                fontWeight:   700,
                color:        textMain,
                lineHeight:   1.5,
                margin:       0,
              }}
            >
              Abandone planilhas.
              <br />
              Um módulo por disciplina.
              <br />
              <mark
                style={{
                  background:   "transparent",
                  color:         accent,
                  fontStyle:    "normal",
                }}
              >
                Use só o que precisar.
              </mark>
            </p>
          </div>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* SLIDE s3 — BY.PILAR */}
        {/* ------------------------------------------------------------------ */}
        <div ref={(el) => { slideRefs.current["s3"] = el; }} style={{ ...slideBaseStyle, ...centeredFixed }}>
          <div style={panelStyle}>
            <div style={tagStyle}>
              <span
                style={{
                  width:        7,
                  height:       7,
                  borderRadius: "50%",
                  background:   "#666",
                  display:      "inline-block",
                }}
              />
              Em breve
            </div>
            <div
              style={{
                fontFamily:   "'Bebas Neue', sans-serif",
                fontSize:      42,
                color:         "#ffffff",
                letterSpacing: "0.04em",
                marginBottom:  10,
              }}
            >
              BY.PILAR
            </div>
            <p
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize:    15,
                color:       textDim,
                lineHeight:  1.6,
                margin:      "0 0 4px",
              }}
            >
              Dimensionamento de pilares de concreto armado. Flexão composta
              oblíqua, envoltória resistente, esbeltez e efeitos de 2ª ordem.
            </p>
            <ul style={featureList}>
              {[
                "Flexão oblíqua",
                "Envoltória",
                "2ª ordem",
                "NBR 6118",
              ].map((f) => (
                <li key={f} style={featureItem}>
                  {f}
                </li>
              ))}
            </ul>
            <button disabled style={btnDisabledStyle}>
              Disponível em breve
            </button>
          </div>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* SLIDE s4 — BY.BLOCOS */}
        {/* ------------------------------------------------------------------ */}
        <div ref={(el) => { slideRefs.current["s4"] = el; }} style={{ ...slideBaseStyle, ...centeredFixed }}>
          <div style={panelStyle}>
            <div style={tagStyle}>
              <span
                style={{
                  width:        7,
                  height:       7,
                  borderRadius: "50%",
                  background:   "#22c55e",
                  display:      "inline-block",
                }}
              />
              Ativo
            </div>
            <div
              style={{
                fontFamily:   "'Bebas Neue', sans-serif",
                fontSize:      42,
                color:         "#ffffff",
                letterSpacing: "0.04em",
                marginBottom:  10,
              }}
            >
              BY.BLOCOS
            </div>
            <p
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize:    15,
                color:       textDim,
                lineHeight:  1.6,
                margin:      "0 0 4px",
              }}
            >
              Dimensionamento de blocos de coroamento sobre estacas por bielas e
              tirantes. Modele layouts livres com múltiplos pilares e tipologias
              variadas.
            </p>
            <ul style={featureList}>
              {[
                "13 tipologias",
                "Modelagem livre",
                "Múltiplos pilares",
                "Bielas e tirantes avançados",
                "Seções diversas",
                "Rigidez das estacas",
                "Interação solo-estrutura",
                "Relatório PDF",
              ].map((f) => (
                <li key={f} style={featureItem}>
                  {f}
                </li>
              ))}
            </ul>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" as const, marginTop: 20 }}>
              <a href={BLOCOS_URL} style={btnStyle}>
                Acessar BY.BLOCOS →
              </a>
              <a href="/blocos" style={{ ...btnStyle, background: "transparent", border: `1px solid rgba(255,138,31,0.35)`, color: "#FF8A1F" }}>
                Saiba mais
              </a>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* SLIDE s5 — BY.GEOTECH */}
        {/* ------------------------------------------------------------------ */}
        <div ref={(el) => { slideRefs.current["s5"] = el; }} style={{ ...slideBaseStyle, ...centeredFixed }}>
          <div style={panelStyle}>
            <div style={tagStyle}>
              <span
                style={{
                  width:        7,
                  height:       7,
                  borderRadius: "50%",
                  background:   "#22c55e",
                  display:      "inline-block",
                }}
              />
              Ativo
            </div>
            <div
              style={{
                fontFamily:   "'Bebas Neue', sans-serif",
                fontSize:      42,
                color:         "#ffffff",
                letterSpacing: "0.04em",
                marginBottom:  10,
              }}
            >
              BY.GEOTECH
            </div>
            <p
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize:    15,
                color:       textDim,
                lineHeight:  1.6,
                margin:      "0 0 4px",
              }}
            >
              Capacidade de carga vertical e horizontal de estacas. Métodos
              semiempíricos e curvas p-y para análise de carregamento lateral.
            </p>
            <ul style={featureList}>
              {[
                "Aoki-Velloso",
                "Décourt-Quaresma",
                "P-Y (Reese/Matlock)",
                "12 tipos de estaca",
                "Relatório PDF",
              ].map((f) => (
                <li key={f} style={featureItem}>
                  {f}
                </li>
              ))}
            </ul>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" as const, marginTop: 20 }}>
              <a href={GEOTECH_URL} style={btnStyle}>
                Acessar BY.GEOTECH →
              </a>
              <a href="/geotech" style={{ ...btnStyle, background: "transparent", border: `1px solid rgba(255,138,31,0.35)`, color: "#FF8A1F" }}>
                Saiba mais
              </a>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* SLIDE s6 — CTA */}
        {/* ------------------------------------------------------------------ */}
        <div ref={(el) => { slideRefs.current["s6"] = el; }} style={{ ...slideBaseStyle, ...centeredFixed }}>
          <div style={{ ...panelStyle, textAlign: "center", maxWidth: 480 }}>
            <h2
              style={{
                fontFamily:   "'Bebas Neue', sans-serif",
                fontSize:     "clamp(38px, 6vw, 58px)",
                color:         "#ffffff",
                letterSpacing: "0.02em",
                margin:        "0 0 16px",
                lineHeight:    1.1,
              }}
            >
              Seu próximo projeto{" "}
              <em style={{ color: accent, fontStyle: "normal" }}>
                começa aqui.
              </em>
            </h2>
            <p
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize:    15,
                color:       textDim,
                lineHeight:  1.6,
                margin:      "0 0 8px",
              }}
            >
              Acesse a plataforma e calcule seu primeiro bloco agora. Sem
              instalação, sem planilha, direto no navegador.
            </p>
            <a href={BLOCOS_URL} style={{ ...btnStyle, fontSize: 16, padding: "13px 32px" }}>
              Acessar plataforma →
            </a>
          </div>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* Scroll hint */}
        {/* ------------------------------------------------------------------ */}
        <div
          ref={hintRef}
          style={{
            position:       "fixed",
            bottom:          32,
            left:           "50%",
            transform:      "translateX(-50%)",
            zIndex:          100,
            display:        "flex",
            flexDirection:  "column",
            alignItems:     "center",
            gap:             8,
            opacity:         1,
            transition:     "opacity 0.4s",
            pointerEvents:  "none",
          }}
        >
            <span
              style={{
                fontFamily:    "'IBM Plex Mono', monospace",
                fontSize:       11,
                letterSpacing: "0.14em",
                textTransform: "uppercase" as const,
                color:          textDim,
              }}
            >
              scroll
            </span>
            {/* Animated chevron */}
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              style={{
                animation: "scrollBounce 1.4s ease-in-out infinite",
              }}
            >
              <path
                d="M5 7l5 5 5-5"
                stroke={accent}
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <style>{`
              @keyframes scrollBounce {
                0%,100% { transform: translateY(0); }
                50%      { transform: translateY(5px); }
              }
            `}</style>
        </div>
      </div>
    </>
  );
}
