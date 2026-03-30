"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";

const BLOCOS_URL =
  process.env.NEXT_PUBLIC_BLOCOS_URL || "https://blocos.byfust.com.br";
const GEOTECH_URL =
  process.env.NEXT_PUBLIC_GEOTECH_URL || "https://geotech.byfust.com.br";

export function BridgeHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const slideRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const progressRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const scrollSpaceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // ═══ RENDERER ═══
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setSize(innerWidth, innerHeight);
    renderer.setClearColor(0x0B0D10);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x0B0D10, 50, 140);
    const camera = new THREE.PerspectiveCamera(30, innerWidth / innerHeight, 0.1, 200);

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.35));
    const dir = new THREE.DirectionalLight(0xffffff, 0.7);
    dir.position.set(8, 15, 10);
    dir.castShadow = true;
    dir.shadow.mapSize.set(1024, 1024);
    dir.shadow.camera.near = 0.5; dir.shadow.camera.far = 80;
    dir.shadow.camera.left = -30; dir.shadow.camera.right = 30;
    dir.shadow.camera.top = 30; dir.shadow.camera.bottom = -30;
    scene.add(dir);
    const rim = new THREE.DirectionalLight(0xFF8A1F, 0.15);
    rim.position.set(-6, 4, -8); scene.add(rim);

    // Materials
    const matW = new THREE.MeshStandardMaterial({ color: 0xd8d8d8, roughness: 0.85 });
    const matG = new THREE.MeshStandardMaterial({ color: 0xb0b0b0, roughness: 0.9 });
    const matO = new THREE.MeshStandardMaterial({ color: 0xFF8A1F, roughness: 0.5, emissive: 0xFF8A1F, emissiveIntensity: 0.12 });
    const matP = new THREE.MeshStandardMaterial({ color: 0xc0c0c0, roughness: 0.9 });
    const matGnd = new THREE.MeshStandardMaterial({ color: 0x0e1014, roughness: 1 });

    // For highlighting
    const matPilarHi = new THREE.MeshStandardMaterial({ color: 0xd8d8d8, roughness: 0.7, emissive: 0xffffff, emissiveIntensity: 0 });
    const matPileHi = new THREE.MeshStandardMaterial({ color: 0xc0c0c0, roughness: 0.8, emissive: 0xffffff, emissiveIntensity: 0 });

    const root = new THREE.Group();
    root.position.x = 3;
    root.rotation.y = -0.35;
    scene.add(root);

    // Ground
    const gnd = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), matGnd);
    gnd.rotation.x = -Math.PI / 2; gnd.position.y = -12; gnd.receiveShadow = true;
    root.add(gnd);

    // ═══ DECK ═══
    const dL = 80, sW = 7.0, sT = 0.15, wH = 1.4, wT = 0.12, bT = 0.12, cW = 1.5, gW = 0.8, dY = 8;
    const dGrp = new THREE.Group();
    dGrp.position.x = -25;

    function addBox(parent: THREE.Group, geo: THREE.BoxGeometry, mat: THREE.Material, x: number, y: number, z: number, shadow: boolean) {
      const m = new THREE.Mesh(geo, mat);
      m.position.set(x, y, z);
      m.castShadow = !!shadow; m.receiveShadow = !!shadow;
      parent.add(m);
      return m;
    }

    // Top slab
    addBox(dGrp, new THREE.BoxGeometry(dL, sT, sW), matW, 0, dY - sT/2, 0, true);

    // Box girders
    const wGeo = new THREE.BoxGeometry(dL, wH, wT);
    const bGeo = new THREE.BoxGeometry(dL, bT, cW + wT*2);
    [-(gW/2+cW/2), (gW/2+cW/2)].forEach(gz => {
      const lwZ = gz-cW/2-wT/2, rwZ = gz+cW/2+wT/2, wy = dY-sT-wH/2;
      addBox(dGrp, wGeo, matW, 0, wy, lwZ, true);
      addBox(dGrp, wGeo, matW, 0, wy, rwZ, true);
      addBox(dGrp, bGeo, matW, 0, dY-sT-wH-bT/2, gz, true);
    });

    // New Jersey barriers
    const njProfile = new THREE.Shape();
    njProfile.moveTo(0, 0);
    njProfile.lineTo(0.35, 0);
    njProfile.lineTo(0.35, 0.08);
    njProfile.lineTo(0.22, 0.34);
    njProfile.lineTo(0.15, 0.81);
    njProfile.lineTo(0, 0.81);
    njProfile.lineTo(0, 0);

    const njExtrudeSettings = { depth: dL, bevelEnabled: false };
    const njGeo = new THREE.ExtrudeGeometry(njProfile, njExtrudeSettings);

    const njProfileR = new THREE.Shape();
    njProfileR.moveTo(0, 0);
    njProfileR.lineTo(-0.35, 0);
    njProfileR.lineTo(-0.35, 0.08);
    njProfileR.lineTo(-0.22, 0.34);
    njProfileR.lineTo(-0.15, 0.81);
    njProfileR.lineTo(0, 0.81);
    njProfileR.lineTo(0, 0);
    const njGeoR = new THREE.ExtrudeGeometry(njProfileR, njExtrudeSettings);

    const njLeft = new THREE.Mesh(njGeoR, matG);
    njLeft.rotation.y = Math.PI / 2;
    njLeft.position.set(-dL/2, dY, -sW/2);
    njLeft.castShadow = true;
    dGrp.add(njLeft);

    const njRight = new THREE.Mesh(njGeo, matG);
    njRight.rotation.y = Math.PI / 2;
    njRight.position.set(-dL/2, dY, sW/2);
    njRight.castShadow = true;
    dGrp.add(njRight);
    root.add(dGrp);

    const dH = sT+wH+bT, dBot = dY-dH;

    // ═══ SUBESTRUTURA ═══
    const pW=1.6, pH=9, pD=1.6, pSp=2.8;
    const tvW=2.5, tvH=1.2, tvD=pSp+pD+1.0;

    // Travessa
    addBox(root, new THREE.BoxGeometry(tvW,tvH,tvD), matW, 0, dBot-tvH/2, 0, true);

    // 2 Pilares (using highlight material)
    const pGeo = new THREE.BoxGeometry(pW,pH,pD);
    [-pSp/2, pSp/2].forEach(pz => {
      const p = new THREE.Mesh(pGeo, matPilarHi);
      p.position.set(0, dBot-tvH-pH/2, pz);
      p.castShadow=true; p.receiveShadow=true;
      root.add(p);
    });
    const pBot = dBot-tvH-pH;

    // ═══ BLOCO ═══
    const blW=4.5, blH=2.0, blD=pSp+pD+3.5;
    const bloco = new THREE.Mesh(new THREE.BoxGeometry(blW,blH,blD), matO);
    bloco.position.y = pBot-blH/2;
    bloco.castShadow=true; bloco.receiveShadow=true;
    root.add(bloco);
    const blEdge = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(blW,blH,blD)), new THREE.LineBasicMaterial({color:0xffa040,transparent:true,opacity:.3}));
    blEdge.position.copy(bloco.position); root.add(blEdge);

    // ═══ ESTACAS ═══
    const plR=.5, plH2=8, plGeo=new THREE.CylinderGeometry(plR,plR,plH2,16);
    const blY=bloco.position.y, plSX=1.5, plSZ=2.6;
    const plPos: [number,number][] = [
      [-plSX,-plSZ],[0,-plSZ],[plSX,-plSZ],
      [-plSX,0],[0,0],[plSX,0],
      [-plSX,plSZ],[0,plSZ],[plSX,plSZ],
    ];
    plPos.forEach(([px,pz])=>{
      const pile=new THREE.Mesh(plGeo, matPileHi);
      pile.position.set(px, blY-blH/2-plH2/2, pz);
      pile.castShadow=true; root.add(pile);
    });

    // ═══ Segundo apoio ═══
    const p2=new THREE.Group(); p2.position.x=-28;
    addBox(p2, new THREE.BoxGeometry(tvW,tvH,tvD), matG, 0, dBot-tvH/2, 0, false);
    [-pSp/2,pSp/2].forEach(pz => addBox(p2, pGeo, matG, 0, dBot-tvH-pH/2, pz, false));
    addBox(p2, new THREE.BoxGeometry(blW*.95,blH*.95,blD*.95), matG, 0, pBot-blH/2, 0, false);
    plPos.forEach(([px,pz])=>{
      const pile2=new THREE.Mesh(plGeo, matG);
      pile2.position.set(px, pBot-blH-plH2/2, pz);
      p2.add(pile2);
    });
    root.add(p2);

    // ═══ Terceiro apoio ═══
    const p3=new THREE.Group(); p3.position.x=-56;
    addBox(p3, new THREE.BoxGeometry(tvW,tvH,tvD), matG, 0, dBot-tvH/2, 0, false);
    [-pSp/2,pSp/2].forEach(pz => addBox(p3, pGeo, matG, 0, dBot-tvH-pH/2, pz, false));
    addBox(p3, new THREE.BoxGeometry(blW*.9,blH*.9,blD*.9), matG, 0, pBot-blH/2, 0, false);
    plPos.forEach(([px,pz])=>{
      const pile3=new THREE.Mesh(plGeo, matG);
      pile3.position.set(px, pBot-blH-plH2/2, pz);
      p3.add(pile3);
    });
    root.add(p3);

    // ═══ CAMERA KEYFRAMES ═══
    const cam = [
      { t: 0.00, pos:[28,14,28], look:[0,2,0] },
      { t: 0.15, pos:[24,11,24], look:[0,2,0] },
      { t: 0.22, pos:[16,6,16],  look:[0,2,0] },
      { t: 0.30, pos:[14,4,14],  look:[0,0,0] },
      { t: 0.42, pos:[12,2,12],  look:[0,-1,0] },
      { t: 0.50, pos:[12,0,12],  look:[0,-3,0] },
      { t: 0.58, pos:[11,-1,11], look:[0,-4,0] },
      { t: 0.72, pos:[10,-2,10], look:[0,-5,0] },
      { t: 0.78, pos:[13,-2,13], look:[0,-6,0] },
      { t: 0.88, pos:[15,-2,15], look:[0,-6,0] },
      { t: 0.94, pos:[16,4,16],  look:[0,0,0] },
      { t: 1.00, pos:[28,14,28], look:[0,2,0] },
    ];

    function getCamera(p: number) {
      let i = 0;
      for (let k = 0; k < cam.length - 1; k++) { if (p >= cam[k].t) i = k; }
      const a = cam[i], b = cam[i+1];
      const lt = (p - a.t) / (b.t - a.t);
      const t = lt < 0.5 ? 2*lt*lt : 1 - Math.pow(-2*lt+2, 2) / 2;
      const pos = a.pos.map((v,j) => v + (b.pos[j]-v) * t);
      const look = a.look.map((v,j) => v + (b.look[j]-v) * t);
      return { pos, look };
    }

    // ═══ SLIDE VISIBILITY ═══
    const slides = [
      { id:'s1', from:0.00, to:0.14 },
      { id:'s2', from:0.16, to:0.28 },
      { id:'s3', from:0.30, to:0.48 },
      { id:'s4', from:0.52, to:0.74 },
      { id:'s5', from:0.76, to:0.90 },
      { id:'s6', from:0.93, to:1.00 },
    ];

    let scrollP = 0;
    const scrollSpace = scrollSpaceRef.current!;
    const totalScroll = scrollSpace.offsetHeight - window.innerHeight;

    // Entrance -- show s1 after 400ms
    requestAnimationFrame(() => setTimeout(() => {
      const s1 = slideRefs.current['s1'];
      if (s1) { s1.classList.add('on'); }
      if (hintRef.current) hintRef.current.classList.add('on');
    }, 400));

    function onScroll() {
      scrollP = Math.min(1, window.scrollY / totalScroll);
      if (progressRef.current) progressRef.current.style.width = (scrollP * 100) + '%';
      if (hintRef.current) hintRef.current.style.opacity = scrollP > 0.03 ? '0' : '1';

      slides.forEach(s => {
        const el = slideRefs.current[s.id];
        if (!el) return;
        const visible = scrollP >= s.from && scrollP <= s.to;
        el.classList.toggle('on', visible);
      });

      // Hide canvas after scroll section
      if (canvasRef.current) {
        canvasRef.current.style.display = scrollP >= 1 ? 'none' : 'block';
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });

    // Resize
    function onResize() {
      camera.aspect = innerWidth / innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(innerWidth, innerHeight);
    }
    window.addEventListener('resize', onResize);

    // ═══ ANIMATE ═══
    const colOrange = new THREE.Color(0xFF8A1F);
    const colWhite = new THREE.Color(0xd8d8d8);
    const colGray = new THREE.Color(0xc0c0c0);

    let rafId = 0;

    function animate() {
      rafId = requestAnimationFrame(animate);
      if (scrollP >= 1) return; // skip render when past scroll section

      const { pos, look } = getCamera(scrollP);
      camera.position.set(pos[0], pos[1], pos[2]);
      camera.lookAt(look[0], look[1], look[2]);

      const sp = 0.04;
      const t = Date.now();

      const inPilar = scrollP > 0.28 && scrollP < 0.50;
      const inBlocos = scrollP > 0.50 && scrollP < 0.76;
      const inGeotech = scrollP > 0.74 && scrollP < 0.92;

      // PILARES
      matPilarHi.color.lerp(inPilar ? colOrange : colWhite, sp);
      matPilarHi.emissive.lerp(inPilar ? colOrange : new THREE.Color(0x000000), sp);
      matPilarHi.emissiveIntensity += ((inPilar ? 0.2 : 0) - matPilarHi.emissiveIntensity) * sp;

      // BLOCO
      const blocoTarget = (inPilar || inGeotech) ? colWhite : colOrange;
      matO.color.lerp(blocoTarget, sp);
      matO.emissive.lerp(blocoTarget, sp);
      matO.emissiveIntensity += (((inBlocos || (!inPilar && !inGeotech)) ? 0.15 + Math.sin(t * 0.003) * 0.05 : 0) - matO.emissiveIntensity) * sp;

      // ESTACAS
      matPileHi.color.lerp(inGeotech ? colOrange : colGray, sp);
      matPileHi.emissive.lerp(inGeotech ? colOrange : new THREE.Color(0x000000), sp);
      matPileHi.emissiveIntensity += ((inGeotech ? 0.2 : 0) - matPileHi.emissiveIntensity) * sp;

      renderer.render(scene, camera);
    }

    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
    };
  }, []);

  return (
    <>
      <style>{`
        .bh-slide{position:fixed;z-index:10;pointer-events:none;opacity:0;transition:opacity .7s ease, transform .7s cubic-bezier(.4,0,.2,1);transform:translateY(24px) scale(.97)}
        .bh-slide.on{opacity:1;transform:translateY(0) scale(1);pointer-events:auto}

        .bh-s-hero{inset:0;display:flex;align-items:center;justify-content:center;text-align:center}
        .bh-s-hero-inner{max-width:700px;padding:44px 52px}
        .bh-s-hero .bh-tag{font-family:var(--font-mono), monospace;font-size:12px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:#FF8A1F;margin-bottom:24px;display:flex;align-items:center;justify-content:center;gap:10px;text-shadow:0 2px 20px rgba(0,0,0,.9)}
        .bh-s-hero .bh-tag::before,.bh-s-hero .bh-tag::after{content:'';width:28px;height:1px;background:#FF8A1F}
        .bh-s-hero h1{font-family:var(--font-syne), sans-serif;font-size:clamp(52px,8vw,100px);font-weight:800;line-height:.88;letter-spacing:-.04em;margin-bottom:28px;text-shadow:0 4px 40px rgba(0,0,0,.9),0 0 80px rgba(0,0,0,.7)}
        .bh-s-hero h1 em{font-family:var(--font-bebas), sans-serif;font-style:normal;color:#FF8A1F;letter-spacing:.04em;font-size:1.1em;display:block;margin-top:8px}
        .bh-s-hero .bh-stats{display:flex;justify-content:center;gap:32px;margin-bottom:28px;padding:16px 32px;background:rgba(11,13,16,.7);border-radius:8px}
        .bh-s-hero .bh-stat{font-family:var(--font-mono), monospace;font-size:16px;font-weight:700;color:#fff;letter-spacing:.02em}
        .bh-s-hero .bh-stat span{color:#FF8A1F}
        .bh-s-hero p{font-family:var(--font-mono), monospace;font-size:18px;font-weight:500;color:#fff;line-height:1.6;max-width:540px;margin:0 auto;text-shadow:0 2px 30px rgba(0,0,0,1),0 0 60px rgba(0,0,0,.8)}

        .bh-s-mod{left:50%;top:50%;transform:translate(-50%,-50%) translateY(24px) scale(.97);max-width:620px;width:92%;background:rgba(11,13,16,.88);backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);border:1px solid rgba(255,255,255,.06);border-radius:14px;padding:40px 48px;text-align:center;border-top:3px solid #FF8A1F;overflow:hidden}
        .bh-s-mod.on{transform:translate(-50%,-50%) translateY(0) scale(1)}
        .bh-s-mod .bh-mod-tag{font-family:var(--font-mono), monospace;font-size:11px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:#FF8A1F;margin-bottom:14px;display:flex;align-items:center;justify-content:center;gap:8px}
        .bh-s-mod .bh-mod-tag::before{content:'';width:7px;height:7px;border-radius:50%;background:#22C55E;box-shadow:0 0 8px rgba(34,197,94,.4)}
        .bh-s-mod .bh-mod-tag.bh-soon{color:#666}.bh-s-mod .bh-mod-tag.bh-soon::before{background:#45454f;box-shadow:none}
        .bh-s-mod .bh-mod-name{font-family:var(--font-syne), sans-serif;font-size:clamp(36px,4.5vw,52px);font-weight:800;letter-spacing:-.03em;line-height:.95;margin-bottom:18px;color:#fff}
        .bh-s-mod .bh-mod-desc{font-family:var(--font-mono), monospace;font-size:15px;color:#e0e0e6;line-height:1.65;margin-bottom:24px}
        .bh-s-mod .bh-mod-features{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:28px;justify-content:center}
        .bh-s-mod .bh-mod-feat{font-family:var(--font-mono), monospace;font-size:12px;font-weight:500;padding:6px 14px;border-radius:6px;border:1px solid rgba(255,138,31,.2);color:#fff;background:rgba(255,138,31,.06)}
        .bh-s-mod .bh-mod-cta{font-family:var(--font-syne), sans-serif;font-size:14px;font-weight:700;color:#0B0D10;background:#FF8A1F;padding:10px 24px;border-radius:7px;display:inline-flex;align-items:center;gap:8px;text-decoration:none;transition:all .2s}.bh-s-mod .bh-mod-cta:hover{background:#ff9b2e;gap:12px;box-shadow:0 4px 20px rgba(255,138,31,.3)}
        .bh-s-mod .bh-mod-cta.bh-disabled{background:transparent;border:1px solid #333;color:#666;pointer-events:none;box-shadow:none}

        .bh-s-trans{left:50%;top:50%;transform:translate(-50%,-50%) translateY(24px) scale(.95);text-align:center;max-width:700px;padding:48px 56px;background:rgba(11,13,16,.82);backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);border:1px solid rgba(255,255,255,.06);border-radius:16px}
        .bh-s-trans.on{transform:translate(-50%,-50%) translateY(0) scale(1)}
        .bh-s-trans p{font-family:var(--font-syne), sans-serif;font-size:clamp(30px,4vw,52px);font-weight:800;line-height:1.1;letter-spacing:-.03em}
        .bh-s-trans p mark{background:none;color:#FF8A1F;position:relative}
        .bh-s-trans p .bh-mark-underline{position:absolute;bottom:-4px;left:0;right:0;height:3px;background:#FF8A1F;border-radius:2px;opacity:.6}

        .bh-s-cta{left:50%;top:50%;transform:translate(-50%,-50%) translateY(24px) scale(.95);text-align:center;background:rgba(11,13,16,.85);backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);border:1px solid rgba(255,255,255,.06);border-radius:16px;padding:56px 64px}
        .bh-s-cta.on{transform:translate(-50%,-50%) translateY(0) scale(1)}
        .bh-s-cta h2{font-family:var(--font-syne), sans-serif;font-size:clamp(36px,5vw,64px);font-weight:800;letter-spacing:-.04em;line-height:.92;margin-bottom:12px;color:#fff}
        .bh-s-cta h2 em{font-family:var(--font-bebas), sans-serif;font-style:normal;display:block;margin-top:6px;color:#FF8A1F;letter-spacing:.04em;font-size:1.05em;opacity:.7}
        .bh-s-cta p{font-family:var(--font-mono), monospace;font-size:14px;color:#888;margin-bottom:32px;max-width:380px;margin-left:auto;margin-right:auto;line-height:1.6}
        .bh-s-cta .bh-cta-btn{font-family:var(--font-syne), sans-serif;background:#FF8A1F;color:#0B0D10;padding:16px 44px;border-radius:9px;font-weight:700;font-size:16px;border:none;cursor:pointer;display:inline-flex;align-items:center;gap:8px;transition:all .2s;pointer-events:auto;text-decoration:none}.bh-s-cta .bh-cta-btn:hover{background:#ff9b2e;transform:translateY(-2px);box-shadow:0 8px 32px rgba(255,138,31,.3)}

        .bh-scroll-hint{position:fixed;bottom:24px;right:36px;z-index:20;display:flex;flex-direction:column;align-items:center;gap:5px;opacity:0;transition:opacity .5s}
        .bh-scroll-hint.on{opacity:1}
        .bh-scroll-hint span{font-family:var(--font-mono), monospace;font-size:9px;letter-spacing:.14em;color:#3a3a42}
        .bh-scroll-hint .bh-line{width:1px;height:24px;background:linear-gradient(to bottom,#3a3a42,transparent);animation:bh-sp 2s ease infinite}
        @keyframes bh-sp{0%,100%{opacity:.3;transform:scaleY(.5)}50%{opacity:.7;transform:scaleY(1)}}

        .bh-progress{position:fixed;top:0;left:0;height:2px;background:#FF8A1F;z-index:200;transition:width .1s}
      `}</style>

      <div ref={scrollSpaceRef} style={{ height: "700vh", position: "relative", zIndex: 0 }}>
        <canvas ref={canvasRef} style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", zIndex: 1 }} />
        <div ref={progressRef} className="bh-progress" style={{ width: "0%" }} />
      </div>

      {/* SLIDE 1: Hero */}
      <div ref={el => { slideRefs.current['s1'] = el; }} className="bh-slide bh-s-hero">
        <div className="bh-s-hero-inner">
          <div className="bh-tag">Estrutural &middot; Geotecnia</div>
          <h1>Do solo<em>&Agrave; ESTRUTURA.</em></h1>
          <div className="bh-stats">
            <div className="bh-stat"><span>100%</span> na nuvem</div>
            <div className="bh-stat"><span>NBR</span> 6118</div>
            <div className="bh-stat"><span>PDF</span> autom&aacute;tico</div>
          </div>
          <p>Calcule blocos, estacas e pilares direto no navegador. Sem instala&ccedil;&atilde;o, sem planilha.</p>
        </div>
      </div>

      {/* SLIDE 2: Transition */}
      <div ref={el => { slideRefs.current['s2'] = el; }} className="bh-slide bh-s-trans">
        <p>Abandone planilhas.<br />Um m&oacute;dulo por disciplina.<br /><mark>Use s&oacute; o que precisar.<span className="bh-mark-underline" /></mark></p>
      </div>

      {/* SLIDE 3: BY.PILAR */}
      <div ref={el => { slideRefs.current['s3'] = el; }} className="bh-slide bh-s-mod">
        <div className="bh-mod-tag bh-soon">Em breve</div>
        <div className="bh-mod-name">BY.PILAR</div>
        <div className="bh-mod-desc">Dimensionamento de pilares de concreto armado. Flex&atilde;o composta obl&iacute;qua, envolt&oacute;ria resistente, esbeltez e efeitos de 2&ordf; ordem.</div>
        <div className="bh-mod-features">
          <span className="bh-mod-feat">Flex&atilde;o obl&iacute;qua</span>
          <span className="bh-mod-feat">Envolt&oacute;ria</span>
          <span className="bh-mod-feat">2&ordf; ordem</span>
          <span className="bh-mod-feat">NBR 6118</span>
        </div>
        <span className="bh-mod-cta bh-disabled">Dispon&iacute;vel em breve</span>
      </div>

      {/* SLIDE 4: BY.BLOCOS */}
      <div ref={el => { slideRefs.current['s4'] = el; }} className="bh-slide bh-s-mod">
        <div className="bh-mod-tag">Ativo</div>
        <div className="bh-mod-name">BY.BLOCOS</div>
        <div className="bh-mod-desc">Dimensionamento de blocos de coroamento sobre estacas por bielas e tirantes. Modelo 3D com iso&aacute;rea ponderada que adapta as bielas ao carregamento.</div>
        <div className="bh-mod-features">
          <span className="bh-mod-feat">13 tipologias</span>
          <span className="bh-mod-feat">Modelagem livre</span>
          <span className="bh-mod-feat">M&uacute;ltiplos pilares</span>
          <span className="bh-mod-feat">Bielas e tirantes avan&ccedil;ados</span>
          <span className="bh-mod-feat">Se&ccedil;&otilde;es diversas</span>
          <span className="bh-mod-feat">Rigidez das estacas</span>
          <span className="bh-mod-feat">Intera&ccedil;&atilde;o solo-estrutura</span>
          <span className="bh-mod-feat">Relat&oacute;rio PDF</span>
        </div>
        <a href={BLOCOS_URL} target="_blank" rel="noreferrer" className="bh-mod-cta">Acessar BY.BLOCOS &rarr;</a>
        <a href="/blocos" className="bh-mod-cta" style={{ background: "transparent", border: "1px solid rgba(255,138,31,.3)", color: "#FF8A1F", marginLeft: 8 }}>Saiba mais</a>
      </div>

      {/* SLIDE 5: BY.GEOTECH */}
      <div ref={el => { slideRefs.current['s5'] = el; }} className="bh-slide bh-s-mod">
        <div className="bh-mod-tag">Ativo</div>
        <div className="bh-mod-name">BY.GEOTECH</div>
        <div className="bh-mod-desc">Capacidade de carga vertical e horizontal de estacas isoladas. Dois m&eacute;todos consagrados em paralelo com envolt&oacute;ria autom&aacute;tica.</div>
        <div className="bh-mod-features">
          <span className="bh-mod-feat">Aoki-Velloso</span>
          <span className="bh-mod-feat">D&eacute;court-Quaresma</span>
          <span className="bh-mod-feat">P-Y (Reese/Matlock)</span>
          <span className="bh-mod-feat">12 tipos de estaca</span>
          <span className="bh-mod-feat">Relat&oacute;rio PDF</span>
        </div>
        <a href={GEOTECH_URL} target="_blank" rel="noreferrer" className="bh-mod-cta">Acessar BY.GEOTECH &rarr;</a>
        <a href="/geotech" className="bh-mod-cta" style={{ background: "transparent", border: "1px solid rgba(255,138,31,.3)", color: "#FF8A1F", marginLeft: 8 }}>Saiba mais</a>
      </div>

      {/* SLIDE 6: CTA */}
      <div ref={el => { slideRefs.current['s6'] = el; }} className="bh-slide bh-s-cta">
        <h2>Seu pr&oacute;ximo projeto<em>come&ccedil;a aqui.</em></h2>
        <p>Acesse a plataforma e calcule seu primeiro bloco agora. Sem instala&ccedil;&atilde;o, sem planilha, direto no navegador.</p>
        <a href="/painel" className="bh-cta-btn">Acessar plataforma &rarr;</a>
      </div>

      {/* Scroll hint */}
      <div ref={hintRef} className="bh-scroll-hint">
        <span>SCROLL</span>
        <div className="bh-line" />
      </div>
    </>
  );
}
