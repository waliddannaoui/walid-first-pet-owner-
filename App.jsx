import React, { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  ContactShadows,
  Environment,
  Float,
  Html,
  OrbitControls,
} from "@react-three/drei";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import {
  ChevronDown,
  PhoneCall,
  ShieldCheck,
  TimerReset,
  Truck,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

function Button({ children, className = "", variant = "default", size = "md", ...props }) {
  return (
    <button className={`button button-${variant} button-${size} ${className}`} {...props}>
      {children}
    </button>
  );
}

function useScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const nextProgress = total > 0 ? window.scrollY / total : 0;
      setProgress(Math.max(0, Math.min(1, nextProgress)));
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return progress;
}

function ExcavatorModel({ progress = 0 }) {
  const group = useRef();
  const cab = useRef();
  const arm1 = useRef();
  const arm2 = useRef();
  const bucket = useRef();
  const leftTrack = useRef();
  const rightTrack = useRef();

  const boomRotation = useMemo(() => -0.15 - progress * 0.65, [progress]);
  const stickRotation = useMemo(() => 0.35 + progress * 0.25, [progress]);
  const bucketRotation = useMemo(() => -0.25 + progress * 0.55, [progress]);

  useFrame((state) => {
    if (!group.current) return;

    const time = state.clock.getElapsedTime();
    group.current.rotation.y = -0.45 + progress * Math.PI * 1.1 + Math.sin(time * 0.4) * 0.04;
    group.current.position.y = Math.sin(time * 0.8) * 0.03;

    if (cab.current) cab.current.rotation.y = Math.sin(time * 0.35) * 0.02;
    if (arm1.current) arm1.current.rotation.z = boomRotation;
    if (arm2.current) arm2.current.rotation.z = stickRotation;
    if (bucket.current) bucket.current.rotation.z = bucketRotation;
    if (leftTrack.current) leftTrack.current.rotation.x = time * 0.9;
    if (rightTrack.current) rightTrack.current.rotation.x = time * 0.9;
  });

  return (
    <Float speed={1.2} rotationIntensity={0.08} floatIntensity={0.25}>
      <group ref={group} position={[0, 0.2, 0]} scale={1.15}>
        <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.4, 0.42, 1.35]} />
          <meshStandardMaterial color="#f6c343" metalness={0.55} roughness={0.38} />
        </mesh>

        <group position={[0, 0.12, 0]}>
          <mesh position={[0, 0, 0.72]} castShadow receiveShadow>
            <boxGeometry args={[2.85, 0.42, 0.38]} />
            <meshStandardMaterial color="#1b1b1d" metalness={0.85} roughness={0.35} />
          </mesh>
          <mesh position={[0, 0, -0.72]} castShadow receiveShadow>
            <boxGeometry args={[2.85, 0.42, 0.38]} />
            <meshStandardMaterial color="#1b1b1d" metalness={0.85} roughness={0.35} />
          </mesh>

          {[-1.05, -0.45, 0.15, 0.75, 1.2].map((x, index) => (
            <group key={x}>
              <mesh ref={index === 1 ? leftTrack : undefined} position={[x, 0, 0.72]} castShadow>
                <cylinderGeometry args={[0.14, 0.14, 0.42, 24]} />
                <meshStandardMaterial color="#2d2f34" metalness={0.95} roughness={0.22} />
              </mesh>
              <mesh ref={index === 3 ? rightTrack : undefined} position={[x, 0, -0.72]} castShadow>
                <cylinderGeometry args={[0.14, 0.14, 0.42, 24]} />
                <meshStandardMaterial color="#2d2f34" metalness={0.95} roughness={0.22} />
              </mesh>
            </group>
          ))}
        </group>

        <group ref={cab} position={[-0.1, 0.95, 0]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[1.2, 0.65, 1.05]} />
            <meshStandardMaterial color="#f6c343" metalness={0.55} roughness={0.32} />
          </mesh>

          <mesh position={[0.2, 0.12, 0.28]} castShadow>
            <boxGeometry args={[0.75, 0.48, 0.05]} />
            <meshPhysicalMaterial color="#b7d7ff" transmission={0.15} roughness={0.1} metalness={0.1} />
          </mesh>

          <mesh position={[0.5, 0.42, 0]} castShadow>
            <cylinderGeometry args={[0.08, 0.08, 0.35, 20]} />
            <meshStandardMaterial color="#f6c343" metalness={0.5} roughness={0.35} />
          </mesh>
        </group>

        <group position={[0.45, 1.15, 0]}>
          <group ref={arm1} position={[0, 0, 0]}>
            <mesh position={[0.62, 0.08, 0]} rotation={[0, 0, 0.08]} castShadow>
              <boxGeometry args={[1.35, 0.18, 0.24]} />
              <meshStandardMaterial color="#f6c343" metalness={0.58} roughness={0.3} />
            </mesh>

            <group ref={arm2} position={[1.2, 0.12, 0]}>
              <mesh position={[0.65, 0, 0]} rotation={[0, 0, -0.2]} castShadow>
                <boxGeometry args={[1.25, 0.16, 0.22]} />
                <meshStandardMaterial color="#f6c343" metalness={0.58} roughness={0.3} />
              </mesh>

              <group ref={bucket} position={[1.15, -0.12, 0]}>
                <mesh rotation={[0, 0, 0.25]} castShadow>
                  <boxGeometry args={[0.42, 0.3, 0.32]} />
                  <meshStandardMaterial color="#26282b" metalness={0.9} roughness={0.28} />
                </mesh>
                {[-0.12, 0, 0.12].map((z) => (
                  <mesh key={z} position={[0.2, -0.18, z]} rotation={[0, 0, 0.45]} castShadow>
                    <boxGeometry args={[0.12, 0.03, 0.03]} />
                    <meshStandardMaterial color="#17181a" metalness={0.95} roughness={0.18} />
                  </mesh>
                ))}
              </group>
            </group>
          </group>
        </group>
      </group>
    </Float>
  );
}

function Scene({ progress }) {
  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight
        position={[5, 6, 5]}
        intensity={2.2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <spotLight position={[-4, 6, 3]} intensity={1.8} angle={0.35} penumbra={1} />

      <Suspense
        fallback={
          <Html center>
            <div className="loading-pill">Loading 3D scene...</div>
          </Html>
        }
      >
        <ExcavatorModel progress={progress} />
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.35, 0]} receiveShadow>
          <planeGeometry args={[30, 30]} />
          <shadowMaterial transparent opacity={0.24} />
        </mesh>
        <ContactShadows position={[0, -0.34, 0]} opacity={0.45} blur={2.5} scale={10} far={2.5} />
        <Environment preset="city" />
      </Suspense>

      <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
    </>
  );
}

function StatCard({ icon: Icon, title, text }) {
  return (
    <article className="stat-card">
      <div className="stat-icon">
        <Icon aria-hidden="true" />
      </div>
      <h3>{title}</h3>
      <p>{text}</p>
    </article>
  );
}

export default function App() {
  const progress = useScrollProgress();
  const heroRef = useRef(null);
  const copyRef = useRef(null);
  const specsRef = useRef(null);
  const ctaRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".hero-kicker", {
        y: 28,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      });

      gsap.from(".hero-title-line", {
        y: 42,
        opacity: 0,
        duration: 1,
        stagger: 0.08,
        delay: 0.1,
        ease: "power4.out",
      });

      gsap.from(".hero-sub", {
        y: 26,
        opacity: 0,
        duration: 0.9,
        delay: 0.35,
        ease: "power3.out",
      });

      gsap.from(".hero-actions", {
        y: 20,
        opacity: 0,
        duration: 0.7,
        delay: 0.5,
        ease: "power3.out",
      });

      gsap.to(copyRef.current, {
        opacity: 0.18,
        y: -80,
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.from(".spec-card", {
        y: 34,
        opacity: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: specsRef.current,
          start: "top 72%",
        },
      });

      gsap.from(".cta-panel", {
        y: 44,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ctaRef.current,
          start: "top 78%",
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="site-shell">
      <header className="site-header">
        <div className="header-inner">
          <a href="#top" className="brand" aria-label="Excavator Studio home">
            <span className="brand-mark" aria-hidden="true" />
            <span>
              <span className="eyebrow">Heavy Motion</span>
              <span className="brand-name">Excavator Studio</span>
            </span>
          </a>
          <nav className="main-nav" aria-label="Primary navigation">
            <a href="#story">Story</a>
            <a href="#specs">Specs</a>
            <a href="#contact">Book</a>
          </nav>
          <Button>Get Quote</Button>
        </div>
      </header>

      <main id="top">
        <section ref={heroRef} className="hero-section" aria-label="Excavator hire introduction">
          <div className="hero-sticky">
            <div className="scene-layer" aria-hidden="true">
              <Canvas camera={{ position: [0, 1.4, 6.8], fov: 38 }} shadows dpr={[1, 2]}>
                <Scene progress={progress} />
              </Canvas>
            </div>

            <div ref={copyRef} className="hero-copy-layer">
              <div className="hero-grid">
                <div className="hero-copy">
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    className="hero-kicker"
                  >
                    Precision earthmoving
                  </motion.div>

                  <h1 className="hero-title">
                    <span className="hero-title-line">Built for</span>
                    <span className="hero-title-line hero-title-muted">civil work.</span>
                    <span className="hero-title-line hero-title-accent">Presented with control.</span>
                  </h1>

                  <p className="hero-sub">
                    Excavator hire for tight schedules, demanding sites, and teams that need reliable machinery ready before the first cut.
                  </p>

                  <div className="hero-actions">
                    <Button size="lg" className="button-accent">
                      View Fleet
                    </Button>
                    <Button size="lg" variant="outline">
                      Book Inspection
                    </Button>
                  </div>
                </div>

                <aside className="scroll-signal">
                  <span>Availability</span>
                  <strong>Machines and operators for Sydney civil projects</strong>
                </aside>
              </div>
            </div>

            <div className="scroll-cue" aria-hidden="true">
              <ChevronDown />
              <span>Scroll</span>
            </div>
          </div>
        </section>

        <section id="story" className="story-section">
          <div className="story-grid">
            <div>
              <div className="section-kicker">Field ready</div>
              <h2>Premium presentation starts with dependable work.</h2>
            </div>
            <div className="story-copy">
              <p>
                Every job depends on timing, communication, and machines that arrive prepared. We pair modern excavation gear with operators who understand access, staging, and site safety.
              </p>
              <p>
                From trenching and detailed digs to bulk earthworks, the booking path stays direct: choose the machine, confirm the site, and lock in the crew.
              </p>
            </div>
          </div>
        </section>

        <section id="specs" ref={specsRef} className="specs-section">
          <div className="section-heading">
            <div>
              <div className="section-kicker">Core strengths</div>
              <h2>Equipment that earns its place on site.</h2>
            </div>
          </div>

          <div className="spec-grid">
            <div className="spec-card">
              <StatCard icon={Truck} title="Fleet Coverage" text="Compact, mid-size, and heavy machines available for civil, residential, and commercial work." />
            </div>
            <div className="spec-card">
              <StatCard icon={TimerReset} title="Fast Scheduling" text="Clear booking windows, operator coordination, and practical lead times for urgent jobs." />
            </div>
            <div className="spec-card">
              <StatCard icon={ShieldCheck} title="Site Compliance" text="Insurance, safety requirements, and access constraints handled before arrival." />
            </div>
            <div className="spec-card">
              <StatCard icon={PhoneCall} title="Direct Contact" text="Quote requests move straight to the team that can confirm machine fit and availability." />
            </div>
          </div>
        </section>

        <section className="process-section" aria-label="Booking steps">
          <div className="process-grid">
            {[
              ["01", "Choose the machine", "Match tonnage, attachment needs, access limits, and transport requirements."],
              ["02", "Confirm the site", "Share address, ground conditions, timings, and any documents the crew needs."],
              ["03", "Start the work", "Operator and machine arrive aligned to the scope, schedule, and safety plan."],
            ].map(([num, title, text]) => (
              <motion.article
                key={num}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6 }}
                className="process-card"
              >
                <div className="process-number">{num}</div>
                <h3>{title}</h3>
                <p>{text}</p>
              </motion.article>
            ))}
          </div>
        </section>

        <section id="contact" ref={ctaRef} className="contact-section">
          <div className="cta-panel">
            <div>
              <div className="section-kicker">Next booking</div>
              <h2>Tell us the site, the scope, and the machine you need.</h2>
              <p>
                We will confirm availability, recommend the right excavator size, and line up the next practical window for your project.
              </p>
            </div>
            <div className="cta-actions">
              <Button size="lg" className="button-accent">
                Start Quote
              </Button>
              <Button size="lg" variant="outline">
                Call the Team
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
