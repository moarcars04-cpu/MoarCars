import React, { useEffect, useRef, useState, useMemo } from "react";
import * as THREE from "three";
import {
  ShieldCheck,
  Zap,
  Sparkles,
  MapPin,
  ChevronDown,
  ArrowRight,
  Gauge,
  Compass,
  CheckCircle2,
  Phone,
  Flame,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import heroCarPng from "@/assets/hero.png";
import { HeroSearch } from "./HeroSearch";

interface Cinematic3DHeroProps {
  onSearch: (params: any) => void;
  categories?: any[];
  onExploreFleet?: () => void;
}

export const Cinematic3DHero: React.FC<Cinematic3DHeroProps> = ({
  onSearch,
  categories = [],
  onExploreFleet,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeCarName, setActiveCarName] = useState("Toyota Innova Crysta ZX Flagship");
  const [activeCarSpec, setActiveCarSpec] = useState({
    power: "150 PS • 360 Nm",
    terrain: "Tirumala Ghat Certified",
    deposit: "₹0 Security Deposit",
    speed: "Automatic 6-Speed",
  });

  // Three.js interactive canvas scene
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let animationFrameId: number;
    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;

    // 1. Scene, Camera & Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x060b17, 0.045);

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 1.2, 7.2);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;

    // Clear previous children
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(renderer.domElement);

    // 2. Lighting Rig (Luxury Automotive Studio)
    // Ambient fill
    const ambientLight = new THREE.AmbientLight(0x101b33, 1.8);
    scene.add(ambientLight);

    // Overhead key softbox (white-blue specular)
    const topLight = new THREE.DirectionalLight(0xffffff, 3.2);
    topLight.position.set(0, 6, 2);
    scene.add(topLight);

    // Golden side rim light (brand gold accent)
    const rimGoldLight = new THREE.DirectionalLight(0xd49b29, 4.0);
    rimGoldLight.position.set(5, 2, -2);
    scene.add(rimGoldLight);

    // Subtle cyan-blue fill from opposite side
    const fillLight = new THREE.DirectionalLight(0x38bdf8, 1.6);
    fillLight.position.set(-6, 2, 2);
    scene.add(fillLight);

    // 3. Studio Ground Reflections & Grid
    // Floor plane
    const floorGeo = new THREE.PlaneGeometry(30, 30);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x070e1c,
      roughness: 0.25,
      metalness: 0.85,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -1.15;
    scene.add(floor);

    // Perspective floor grid lines
    const gridHelper = new THREE.GridHelper(26, 26, 0xc88d18, 0x1e293b);
    gridHelper.position.y = -1.14;
    scene.add(gridHelper);

    // Soft Contact Shadow Plane under vehicle
    const shadowCanvas = document.createElement("canvas");
    shadowCanvas.width = 512;
    shadowCanvas.height = 256;
    const sCtx = shadowCanvas.getContext("2d");
    if (sCtx) {
      const grad = sCtx.createRadialGradient(256, 128, 10, 256, 128, 220);
      grad.addColorStop(0, "rgba(0, 0, 0, 0.95)");
      grad.addColorStop(0.4, "rgba(0, 0, 0, 0.65)");
      grad.addColorStop(0.8, "rgba(200, 141, 24, 0.12)");
      grad.addColorStop(1, "rgba(0, 0, 0, 0)");
      sCtx.fillStyle = grad;
      sCtx.fillRect(0, 0, 512, 256);
    }
    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const shadowGeo = new THREE.PlaneGeometry(6.4, 2.8);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      opacity: 0.9,
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.set(0.6, -1.13, 0);
    scene.add(shadowMesh);

    // 4. Floating Luxury Bokeh Particles
    const particleCount = 65;
    const particleGeo = new THREE.BufferGeometry();
    const posArray = new Float32Array(particleCount * 3);
    const scaleArray = new Float32Array(particleCount);

    for (let i = 0; i < particleCount * 3; i += 3) {
      posArray[i] = (Math.random() - 0.5) * 14;
      posArray[i + 1] = Math.random() * 4 - 0.8;
      posArray[i + 2] = (Math.random() - 0.5) * 8;
      scaleArray[i / 3] = Math.random() * 0.06 + 0.02;
    }
    particleGeo.setAttribute("position", new THREE.BufferAttribute(posArray, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0xf5c055,
      size: 0.055,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 5. High-Definition 3D Car Quad & Headlight Projection
    const textureLoader = new THREE.TextureLoader();
    const carGroup = new THREE.Group();
    scene.add(carGroup);

    textureLoader.load(heroCarPng, (carTexture) => {
      carTexture.colorSpace = THREE.SRGBColorSpace;
      carTexture.minFilter = THREE.LinearMipmapLinearFilter;
      carTexture.magFilter = THREE.LinearFilter;

      // Aspect ratio of the hero car image (2072 / 759 ≈ 2.73)
      const carAspect = 2072 / 759;
      const carHeight = 2.15;
      const carWidth = carHeight * carAspect;

      const carGeo = new THREE.PlaneGeometry(carWidth, carHeight);
      const carMat = new THREE.MeshStandardMaterial({
        map: carTexture,
        transparent: true,
        roughness: 0.15,
        metalness: 0.65,
        side: THREE.DoubleSide,
      });

      const carMesh = new THREE.Mesh(carGeo, carMat);
      carMesh.position.set(0.6, -0.05, 0);
      carGroup.add(carMesh);

      // Subtle underglow beam
      const underglowGeo = new THREE.PlaneGeometry(4.2, 0.4);
      const underglowMat = new THREE.MeshBasicMaterial({
        color: 0xd49b29,
        transparent: true,
        opacity: 0.25,
      });
      const underglow = new THREE.Mesh(underglowGeo, underglowMat);
      underglow.position.set(0.6, -1.05, 0.05);
      carGroup.add(underglow);

      setIsLoaded(true);
    });

    // 6. Interaction & Motion Physics
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;
    let scrollY = 0;
    let clock = new THREE.Clock();

    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      targetMouseX = (e.clientX / innerWidth - 0.5) * 2;
      targetMouseY = (e.clientY / innerHeight - 0.5) * 2;
    };

    const handleScroll = () => {
      scrollY = window.scrollY || window.pageYOffset;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });

    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener("resize", handleResize);

    // Initial entrance glide variables
    let entranceProgress = 0;

    // 7. Render Loop
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Entrance easing
      if (entranceProgress < 1) {
        entranceProgress = Math.min(1, entranceProgress + delta * 0.9);
      }
      const easeProgress = 1 - Math.pow(1 - entranceProgress, 3);

      // Mouse smooth interpolation
      currentMouseX += (targetMouseX - currentMouseX) * 0.045;
      currentMouseY += (targetMouseY - currentMouseY) * 0.045;

      // Scroll-based parallax & perspective transition
      const scrollFactor = Math.min(scrollY / 800, 1);

      // Car position: start off-right, smoothly glide in
      const entranceXOffset = (1 - easeProgress) * 2.8;
      const suspensionBob = Math.sin(elapsed * 1.8) * 0.015;

      carGroup.position.x = 0.5 + entranceXOffset + currentMouseX * 0.22 - scrollFactor * 0.8;
      carGroup.position.y = suspensionBob - scrollFactor * 0.5;
      carGroup.position.z = -scrollFactor * 1.5;

      // Subtle 3D perspective steering angle
      carGroup.rotation.y = (currentMouseX * 0.08) - (scrollFactor * 0.12);
      carGroup.rotation.z = -currentMouseY * 0.02;

      // Camera responds with luxury inertia
      camera.position.x = currentMouseX * 0.35;
      camera.position.y = 1.15 - currentMouseY * 0.25 + scrollFactor * 0.8;
      camera.lookAt(carGroup.position.x * 0.4, -0.1, 0);

      // Ambient particle drift
      const positions = particleGeo.attributes.position.array as Float32Array;
      for (let i = 1; i < particleCount * 3; i += 3) {
        positions[i] += Math.sin(elapsed + i) * 0.002;
      }
      particleGeo.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      floorGeo.dispose();
      floorMat.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <section
      id="top"
      className="relative min-h-[92vh] lg:min-h-screen w-full bg-[#070e1c] text-white overflow-hidden flex flex-col justify-between pt-2 pb-8 sm:pb-12"
    >
      {/* 1. Interactive 3D WebGL Showroom Canvas */}
      <div
        ref={mountRef}
        className="absolute inset-0 z-0 pointer-events-none w-full h-full"
        style={{ touchAction: "none" }}
      />

      {/* 2. Atmospheric Ambient Light Gradients & Spotlights */}
      <div className="absolute inset-0 z-1 pointer-events-none overflow-hidden">
        {/* Overhead soft spotlight */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[380px] bg-gradient-to-b from-[#d49b29]/15 via-[#070e1c]/0 to-transparent blur-3xl" />
        
        {/* Left readable text shadow overlay */}
        <div className="absolute inset-y-0 left-0 w-full lg:w-[58%] bg-gradient-to-r from-[#070e1c] via-[#070e1c]/90 to-transparent pointer-events-none" />

        {/* Bottom subtle transition gradient connecting to Fleet Showroom */}
        <div className="absolute bottom-0 inset-x-0 h-36 bg-gradient-to-t from-[#070e1c] via-[#070e1c]/80 to-transparent pointer-events-none" />
      </div>

      {/* 3. Main Hero Content Container */}
      <div className="relative z-10 w-full max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 flex-1 flex flex-col justify-between pt-4 sm:pt-6">
        {/* Top Editorial Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-2">
          {/* Left Column: Refined Luxury Typography & Badges */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-5 animate-car-glide">
            {/* Small Eyebrow Label */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.06] border border-[#c88d18]/30 backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-[#f59e0b] animate-ping" />
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.25em] text-[#fce588]">
                FLAGSHIP AUTOMOTIVE MOBILITY • TIRUPATI & TIRUMALA
              </span>
            </div>

            {/* Editorial Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.08] font-sans">
              DRIVE LUXURY.
              <br />
              DRIVE <span className="luxury-gold-text">MOAR.</span>
            </h1>

            {/* Supporting Text */}
            <p className="text-xs sm:text-sm lg:text-base text-slate-300 font-normal leading-relaxed max-w-xl">
              Tirupati’s premier self-drive & chauffeur car rental. Experience Tirumala Ghat road certified flagship SUVs, executive sedans, and luxury 7-seaters delivered in 60 seconds with zero security deposit.
            </p>

            {/* Automotive Specs Quick HUD */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 pt-1 max-w-xl">
              <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10 backdrop-blur-sm">
                <div className="text-[10px] uppercase font-bold tracking-wider text-[#d49b29]">Ghat Clearance</div>
                <div className="text-xs sm:text-sm font-black text-white mt-0.5">TTD Certified</div>
              </div>
              <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10 backdrop-blur-sm">
                <div className="text-[10px] uppercase font-bold tracking-wider text-[#d49b29]">Deposit</div>
                <div className="text-xs sm:text-sm font-black text-white mt-0.5">₹0 Policy</div>
              </div>
              <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10 backdrop-blur-sm">
                <div className="text-[10px] uppercase font-bold tracking-wider text-[#d49b29]">Delivery</div>
                <div className="text-xs sm:text-sm font-black text-white mt-0.5">Airport & Hub</div>
              </div>
              <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10 backdrop-blur-sm">
                <div className="text-[10px] uppercase font-bold tracking-wider text-[#d49b29]">Kilometres</div>
                <div className="text-xs sm:text-sm font-black text-white mt-0.5">Unlimited</div>
              </div>
            </div>
          </div>

          {/* Right Column: Floating Telemetry Spec Widget (Desktop) */}
          <div className="hidden lg:flex lg:col-span-5 flex-col items-end space-y-3 pt-2">
            <div className="p-4 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-xl max-w-xs w-full shadow-2xl space-y-2.5 transform hover:scale-[1.02] transition-transform">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400">STUDIO TELEMETRY</span>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  <CheckCircle2 className="h-3 w-3" /> Live Dispatch
                </span>
              </div>
              <div className="text-sm font-bold text-white tracking-wide">
                {activeCarName}
              </div>
              <div className="space-y-1.5 text-[11px] font-mono text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">Powertrain:</span>
                  <span className="text-amber-300 font-semibold">{activeCarSpec.power}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Ghat Compliance:</span>
                  <span className="text-emerald-300 font-semibold">{activeCarSpec.terrain}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Security Escrow:</span>
                  <span className="text-white font-semibold">{activeCarSpec.deposit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Transmission:</span>
                  <span className="text-slate-200">{activeCarSpec.speed}</span>
                </div>
              </div>

              {onExploreFleet && (
                <button
                  type="button"
                  onClick={onExploreFleet}
                  className="w-full mt-2 py-2 rounded-xl bg-white/[0.08] hover:bg-[#c88d18] hover:text-[#070e1c] text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5"
                >
                  <span>Explore 360° Fleet</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Floating Booking Console (HeroSearch Integrated) */}
        <div className="w-full mt-6 sm:mt-8 pt-2">
          <div className="luxury-glass-panel rounded-3xl p-3 sm:p-5 shadow-2xl">
            <HeroSearch onSearch={onSearch} categories={categories} />
          </div>
        </div>
      </div>

      {/* 4. Cinematic Floor Transition into Section 2 */}
      <div className="relative z-10 w-full mt-4 flex items-center justify-center">
        <button
          type="button"
          onClick={() => {
            document.getElementById("collections")?.scrollIntoView({ behavior: "smooth" });
          }}
          className="group flex flex-col items-center gap-1 text-[10px] font-bold uppercase tracking-[0.25em] text-[#d49b29] hover:text-white transition-colors"
          aria-label="Scroll to fleet collection"
        >
          <span>SCROLL TO EXPLORE LUXURY FLEET</span>
          <div className="h-6 w-4 rounded-full border border-[#d49b29]/60 flex items-start justify-center p-1">
            <span className="h-1.5 w-1 rounded-full bg-[#d49b29] animate-bounce" />
          </div>
        </button>
      </div>
    </section>
  );
};
