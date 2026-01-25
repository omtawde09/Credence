import { Suspense, useRef, memo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Float,
  Html,
  Environment,
  ContactShadows,
  PresentationControls,
  Text3D,
  Center,
} from "@react-three/drei";

// Bitcoin 3D Model Component
const BitcoinModel = memo(() => {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
    }
  });

  return (
    <group ref={meshRef}>
      {/* Main Bitcoin Coin */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[3, 3, 0.5, 32]} />
        <meshStandardMaterial 
          color="#A16207" 
          metalness={0.8} 
          roughness={0.2}
        />
      </mesh>
      
      {/* Bitcoin Symbol */}
      <Center>
        <Text3D
          font="/fonts/helvetiker_regular.typeface.json"
          size={1.5}
          height={0.1}
          position={[0, 0, 0.3]}
        >
          ₿
          <meshStandardMaterial 
            color="#FEF3C7" 
            metalness={0.9}
            roughness={0.1}
          />
        </Text3D>
      </Center>
      
      {/* Rim highlight */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[3.1, 3.1, 0.1, 32]} />
        <meshStandardMaterial 
          color="#D97706" 
          metalness={0.9} 
          roughness={0.1}
        />
      </mesh>
    </group>
  );
});

const Scene = () => {
  return (
    <group scale={0.8} position={[0, 0, 0]}>
      <Float speed={1.2} rotationIntensity={0.3} floatIntensity={0.6}>
        <BitcoinModel />

        {/* UI CARD 1: TOP LEFT */}
        <Html
          position={[-15, -8, 0]}
          distanceFactor={12}
          center
          style={{ pointerEvents: "none" }}
        >
          <div className="w-48 p-4 rounded-2xl bg-orange-500/10 backdrop-blur-2xl border border-orange-300/20 shadow-2xl transition-all">
            <div className="flex items-center gap-2 mb-3 text-orange-700">
              <div className="w-2 h-2 rounded-full bg-orange-600 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest">
                Crypto Guardian
              </span>
            </div>
            <div className="space-y-1">
              <p className="text-slate-600 text-[9px] uppercase font-bold">
                Blockchain Hash
              </p>
              <p className="text-slate-700 font-mono text-[10px] truncate">
                btc_auth_8829x_secure
              </p>
            </div>
          </div>
        </Html>

        {/* UI CARD 2: BOTTOM RIGHT */}
        <Html
          position={[15, -12, 0]}
          distanceFactor={10}
          center
          style={{ pointerEvents: "none" }}
        >
          <div className="w-64 p-5 rounded-[24px] bg-green-800/90 backdrop-blur-3xl border border-green-700/30 shadow-2xl">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-green-50 font-bold text-xs uppercase tracking-tighter opacity-90">
                Portfolio Value
              </h3>
              <span className="text-[9px] bg-orange-600/20 text-orange-300 px-2 py-0.5 rounded-md font-bold uppercase">
                Bullish
              </span>
            </div>
            <div className="flex items-end gap-2 text-green-50">
              <span className="text-3xl font-light leading-none">₿0.75</span>
              <span className="text-orange-300 text-[10px] font-bold pb-1">
                +24.7%
              </span>
            </div>
            <div className="mt-4 h-1 w-full bg-green-50/10 rounded-full overflow-hidden">
              <div className="h-full w-3/4 bg-orange-500" />
            </div>
          </div>
        </Html>
      </Float>
    </group>
  );
};

const CredenceLandingPage = () => {
  const navigate = useNavigate();
  const container = useRef();
  const [index, setIndex] = useState(0);
  const words = ["anticipates", "protects", "secures", "optimizes"];

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main ref={container} className="relative min-h-screen w-full flex flex-col items-center pt-32">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-orange-50/20 rounded-full blur-[120px] -z-10" />

      {/* HERO SECTION 1: Finance that... */}
      <div className="max-w-7xl mx-auto text-center relative z-20 mb-12 px-6">
        <span className="inline-block px-4 py-1.5 mb-6 text-[11px] font-bold tracking-widest uppercase bg-orange-50 text-orange-900 rounded-full border border-orange-200">
          Agentic Finance for Gig-Earners
        </span>

        <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight leading-[0.9] mb-8">
          Finance that <br />
          <div className="relative inline-block h-[1.1em] overflow-hidden align-bottom">
            {words.map((word, i) => (
              <span
                key={word}
                className={`absolute left-0 w-full text-gray-300 italic font-light transition-all duration-700 ease-in-out ${i === index
                  ? "translate-y-0 opacity-100"
                  : i < index
                    ? "-translate-y-full opacity-0"
                    : "translate-y-full opacity-0"
                  }`}
                style={{ whiteSpace: "nowrap" }}
              >
                {word}.
              </span>
            ))}
            {/* Invisible spacer to maintain height */}
            <span className="opacity-0 italic font-light">anticipates.</span>
          </div>
        </h1>

        <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-600 leading-relaxed">
          Credence is an AI financial co-pilot that forecasts cashflow storms
          and{" "}
          <span className="text-green-800 font-semibold">
            autonomously acts
          </span>{" "}
          to prevent credit damage.
        </p>
      </div>

      {/* HERO SECTION 2: Agentic Capital + 3D */}
      <div className="relative flex-grow w-full flex flex-col items-center justify-center">
        {/* TEXT CONTENT */}
        <div className="relative z-30 text-center pointer-events-none px-6 mb-8 mt-12">
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.85] mb-6">
            Agentic <br />
            <span className="text-slate-400 italic font-light">Capital</span>.
          </h1>
          <p className="max-w-md mx-auto text-sm md:text-base text-slate-600 font-medium">
            The first AI co-pilot that doesn't just show you charts, but{" "}
            <span className="text-green-800">autonomously secures</span> your
            solvency.
          </p>

          <div className="mt-8 flex gap-3 justify-center pointer-events-auto">
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-green-800 text-white px-8 py-4 rounded-2xl font-bold text-sm shadow-2xl active:scale-95 transition-all hover:bg-green-700"
            >
              Launch Live Demo
            </button>
          </div>
        </div>

        {/* 3D MODEL CONTAINER */}
        <div className="absolute inset-0 z-10 w-full h-full flex items-center justify-center pointer-events-none">
          <div className="w-full h-[90vh] pointer-events-auto">
            <Canvas
              eventSource={container}
              camera={{ position: [0, 0, 15], fov: 35, near: 0.1, far: 1000 }}
              dpr={[1, 2]}
              gl={{ antialias: true, alpha: true }}
            >
              <ambientLight intensity={0.8} />
              <pointLight position={[10, 10, 10]} intensity={1.5} />

              <Suspense fallback={null}>
                <PresentationControls
                  enabled={true}
                  global={false}
                  cursor={true}
                  snap={true}
                  speed={2}
                  zoom={1}
                  rotation={[0, 0, 0]}
                  polar={[-Math.PI / 4, Math.PI / 4]}
                  azimuth={[-Math.PI / 3, Math.PI / 3]}
                >
                  <Scene />
                </PresentationControls>
                <ContactShadows
                  position={[0, -5, 0]}
                  opacity={0.2}
                  scale={20}
                  blur={3}
                  far={10}
                />
                <Environment preset="city" />
              </Suspense>
            </Canvas>
          </div>
        </div>
      </div>

      <section className="max-w-7xl mx-auto px-6 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white border border-orange-200 rounded-[32px] p-10 flex flex-col justify-between hover:shadow-xl hover:shadow-green-900/5 transition-all">
            <div className="max-w-md">
              <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-2xl mb-6">
                ⛅
              </div>
              <h3 className="text-3xl font-bold mb-4">Money Weather™</h3>
              <p className="text-slate-600 leading-relaxed">
                Our proprietary ML model simulates 10,000+ cashflow scenarios to
                predict your "Financial Storms." It detects liquidity gaps
                before your bank does.
              </p>
            </div>
            <div className="mt-10 h-32 w-full bg-orange-50/30 rounded-2xl border border-dashed border-orange-200 flex items-center justify-center text-[10px] uppercase tracking-widest text-slate-500">
              [ Probabilistic Forecast Visual ]
            </div>
          </div>

          <div className="bg-green-800 text-green-50 rounded-[32px] p-10 flex flex-col justify-between">
            <h3 className="text-2xl font-bold leading-tight">
              Autonomous Agentic Actions
            </h3>
            <p className="opacity-90 text-sm mt-4">
              With your consent, Credence locks safety buffers and pauses
              subscriptions when the risk of an EMI bounce exceeds 85%.
            </p>
            <div className="mt-8 pt-6 border-t border-green-50/20 flex items-center gap-4">
              <div className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
              <span className="text-[10px] font-mono opacity-80">
                MONITORING LIVE STREAMS
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* BOTTOM METRICS */}
      <div className="w-full max-w-6xl px-10 pb-12 flex justify-between items-center z-20 pointer-events-none opacity-40">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-orange-700 uppercase tracking-widest">
            System Status
          </span>
          <span className="text-xl font-mono font-bold italic">ENCRYPTED</span>
        </div>
        <div className="flex flex-col text-right">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            Uptime
          </span>
          <span className="text-xl font-mono font-bold">99.9%</span>
        </div>
      </div>
    </main>
  );
};

export default CredenceLandingPage;
