import React, { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Float, Html, OrbitControls, Sparkles } from "@react-three/drei";
import * as THREE from "three";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Leaf, Sparkles as SparkleIcon, Droplets, Recycle, CupSoda } from "lucide-react";

const productPillars = [
  {
    icon: Leaf,
    title: "Bản địa hóa nguyên liệu",
    text: "Khai thác sen địa phương để tái định vị trà hương sen truyền thống bằng trải nghiệm sản phẩm mới.",
  },
  {
    icon: CupSoda,
    title: "Trải nghiệm vị giác mới",
    text: "Mở rộng từ trà khô, trà túi lọc sang concept trà sen hiện đại, có thể phát triển thành dòng trà sữa mix sen.",
  },
  {
    icon: Droplets,
    title: "Nghi thức pha trà",
    text: "Gợi ý đóng gói từng phần trà bằng cánh sen, biến một ly trà thành một trải nghiệm cảm quan.",
  },
  {
    icon: Recycle,
    title: "Giá trị môi trường - xã hội",
    text: "Tận dụng nguồn sen sẵn có, giảm lãng phí phụ phẩm và nâng giá trị văn hóa bản địa.",
  },
];

function Petal({ index, total, scrollValue }) {
  const mesh = useRef();
  const angle = (index / total) * Math.PI * 2;
  const baseRadius = 0.68 + (index % 3) * 0.08;
  const layer = Math.floor(index / total * 3);
  const color = useMemo(() => new THREE.Color().setHSL(0.9, 0.58, 0.58 + layer * 0.05), [layer]);

  useFrame(({ clock }) => {
    if (!mesh.current) return;
    const t = clock.getElapsedTime();
    const burst = scrollValue.current;
    const outward = baseRadius + burst * (2.4 + layer * 0.7);
    mesh.current.position.x = Math.cos(angle) * outward;
    mesh.current.position.z = Math.sin(angle) * outward;
    mesh.current.position.y = Math.sin(t * 0.8 + index) * 0.05 + layer * 0.11 + burst * (Math.sin(angle * 3) * 0.9);
    mesh.current.rotation.y = -angle + Math.PI / 2 + burst * Math.sin(index) * 1.1;
    mesh.current.rotation.x = 0.82 + burst * 0.85;
    mesh.current.rotation.z = Math.sin(t * 0.55 + index) * 0.08 + burst * Math.cos(angle) * 0.5;
    mesh.current.scale.setScalar(1 - burst * 0.18);
  });

  return (
    <mesh ref={mesh} castShadow receiveShadow>
      <sphereGeometry args={[0.33, 28, 16]} />
      <meshPhysicalMaterial
        color={color}
        roughness={0.32}
        metalness={0.03}
        transmission={0.15}
        thickness={0.8}
        clearcoat={0.45}
        transparent
        opacity={0.88}
      />
      <mesh scale={[0.72, 0.08, 1.55]} position={[0, 0.09, 0]} rotation={[0, 0, 0]}>
        <sphereGeometry args={[0.42, 28, 16]} />
        <meshBasicMaterial color="#fff1f6" transparent opacity={0.08} />
      </mesh>
    </mesh>
  );
}

function LotusLeaf({ scrollValue }) {
  const group = useRef();
  const veins = useMemo(() => Array.from({ length: 16 }, (_, i) => i), []);

  useFrame(({ clock }) => {
    if (!group.current) return;
    const t = clock.getElapsedTime();
    const burst = scrollValue.current;
    group.current.rotation.y = t * 0.08 + burst * 1.1;
    group.current.position.y = -0.42 - burst * 0.55;
    group.current.scale.setScalar(1 + burst * 0.24);
  });

  return (
    <group ref={group} rotation={[-Math.PI / 2.2, 0, 0]} position={[0, -0.48, 0]}>
      <mesh receiveShadow>
        <circleGeometry args={[1.85, 128]} />
        <meshPhysicalMaterial color="#2c7d5a" roughness={0.55} clearcoat={0.35} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0.18, 0.01, 0]}>
        <circleGeometry args={[0.34, 64, 0.25, Math.PI * 1.72]} />
        <meshBasicMaterial color="#0b1b18" transparent opacity={0.32} side={THREE.DoubleSide} />
      </mesh>
      {veins.map((v) => {
        const a = (v / veins.length) * Math.PI * 2;
        return (
          <mesh key={v} rotation={[0, 0, a]} position={[0, 0.017, 0]}>
            <boxGeometry args={[1.58, 0.011, 0.011]} />
            <meshBasicMaterial color="#93e5bc" transparent opacity={0.33} />
          </mesh>
        );
      })}
    </group>
  );
}

function TeaCore({ scrollValue }) {
  const mesh = useRef();
  useFrame(({ clock }) => {
    if (!mesh.current) return;
    const t = clock.getElapsedTime();
    const burst = scrollValue.current;
    mesh.current.rotation.y = t * 0.35;
    mesh.current.position.y = 0.22 + Math.sin(t * 1.2) * 0.04 + burst * 0.2;
    mesh.current.scale.setScalar(0.75 + Math.sin(t * 2) * 0.025 + burst * 0.18);
  });

  return (
    <mesh ref={mesh} castShadow>
      <icosahedronGeometry args={[0.48, 3]} />
      <meshPhysicalMaterial color="#f6d37a" emissive="#8f5b1a" emissiveIntensity={0.38} roughness={0.22} metalness={0.05} clearcoat={0.5} />
    </mesh>
  );
}

function LotusScene({ scrollProgressRef }) {
  const petals = useMemo(() => Array.from({ length: 34 }, (_, i) => i), []);
  const { camera } = useThree();

  useFrame(() => {
    const burst = scrollProgressRef.current;
    camera.position.z = 5.7 + burst * 1.8;
    camera.position.y = 1.15 + burst * 0.65;
    camera.lookAt(0, 0, 0);
  });

  return (
    <>
      <fog attach="fog" args={["#07110f", 5.5, 13]} />
      <ambientLight intensity={0.55} />
      <pointLight position={[2.7, 2.9, 2.4]} color="#ffd3e5" intensity={22} distance={8} />
      <pointLight position={[-3.4, -1.1, -1.2]} color="#82f7c8" intensity={12} distance={8} />
      <spotLight position={[0, 5, 3]} angle={0.44} penumbra={0.7} intensity={18} castShadow />
      <Sparkles count={120} scale={[7, 5, 7]} size={2.1} speed={0.45} opacity={0.58} color="#fff4c7" />
      <Float speed={1.2} rotationIntensity={0.25} floatIntensity={0.35}>
        <group position={[0, 0.03, 0]}>
          <LotusLeaf scrollValue={scrollProgressRef} />
          {petals.map((p) => (
            <Petal key={p} index={p} total={petals.length} scrollValue={scrollProgressRef} />
          ))}
          <TeaCore scrollValue={scrollProgressRef} />
        </group>
      </Float>
      <Environment preset="night" />
      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.25} maxPolarAngle={Math.PI / 1.8} minPolarAngle={Math.PI / 3} />
    </>
  );
}

function ScrollLinkedLotus() {
  const { scrollYProgress } = useScroll();
  const scrollProgressRef = useRef(0);

  useFrameSync(scrollYProgress, scrollProgressRef);

  return (
    <div className="fixed inset-0 z-0 opacity-95">
      <Canvas
        shadows
        dpr={[1, 1.8]}
        camera={{ position: [0, 1.15, 5.7], fov: 43 }}
        gl={{ alpha: true }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
        }}
      >
        <Suspense fallback={<Html center><span className="text-sm text-white/70">Đang tải mô hình...</span></Html>}>
          <LotusScene scrollProgressRef={scrollProgressRef} />
        </Suspense>
      </Canvas>
    </div>
  );
}

function useFrameSync(scrollYProgress, ref) {
  const Sync = () => {
    useFrame(() => {
      ref.current = THREE.MathUtils.lerp(ref.current, scrollYProgress.get(), 0.08);
    });
    return null;
  };
  return <Sync />;
}

function ScrollModelCanvas() {
  const { scrollYProgress } = useScroll();
  const progressRef = useRef(0);
  const yGlow = useTransform(scrollYProgress, [0, 1], ["0%", "35%"]);

  return (
    <>
      <motion.div style={{ y: yGlow }} className="pointer-events-none fixed left-1/2 top-1/3 z-0 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-pink-300/10 blur-3xl"></motion.div>
      <div className="fixed inset-0 z-0 opacity-95">
        <Canvas
          shadows
          dpr={[1, 1.8]}
          camera={{ position: [0, 1.15, 5.7], fov: 43 }}
          gl={{ alpha: true }}
          onCreated={({ gl }) => {
            gl.setClearColor(0x000000, 0);
          }}
        >
          <ScrollBinder scrollYProgress={scrollYProgress} target={progressRef} />
          <Suspense fallback={<Html center><span className="text-sm text-white/70">Đang tải mô hình...</span></Html>}>
            <LotusScene scrollProgressRef={progressRef} />
          </Suspense>
        </Canvas>
      </div>
    </>
  );
}

function ScrollBinder({ scrollYProgress, target }) {
  useFrame(() => {
    target.current = THREE.MathUtils.lerp(target.current, scrollYProgress.get(), 0.075);
  });
  return null;
}

function Header() {
  return (
    <header className="fixed left-0 right-0 top-0 z-30 border-b border-white/10 bg-[#06100e]/50 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <a href="#top" className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-2xl bg-white/10 ring-1 ring-white/15">
            <Leaf className="h-5 w-5 text-emerald-200" />
          </div>
          <div>
            <p className="text-base font-semibold tracking-[0.22em] text-white">SENOVA</p>
            <p className="text-xs text-emerald-100/60">Sen + Innovation</p>
          </div>
        </a>
        <nav className="hidden items-center gap-8 text-sm text-white/70 md:flex">
          <a className="hover:text-white" href="#concept">Concept</a>
          <a className="hover:text-white" href="#experience">Trải nghiệm</a>
          <a className="hover:text-white" href="#impact">Tác động</a>
        </nav>
        <a href="#cta" className="rounded-full border border-emerald-200/30 bg-emerald-200/10 px-5 py-2 text-sm font-medium text-emerald-50 shadow-[0_0_35px_rgba(110,231,183,0.14)] transition hover:bg-emerald-200/20">
          Khám phá sản phẩm
        </a>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section id="top" className="relative z-10 min-h-screen overflow-hidden px-6 pt-36">
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-3xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/8 px-4 py-2 text-sm text-emerald-100/80 backdrop-blur-xl">
            <SparkleIcon className="h-4 w-4" />
            Trà hương sen được tái thiết kế cho thế hệ trải nghiệm
          </div>
          <h1 className="text-5xl font-semibold leading-[1.02] tracking-[-0.05em] text-white md:text-7xl">
            Một bộ áo mới cho trà sen truyền thống.
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-white/68">
            Senova kết hợp trà, hương sen và thiết kế cảm quan để tạo nên sản phẩm trà bản địa có tính mới: đẹp hơn trong nghi thức, rõ hơn trong câu chuyện văn hóa, linh hoạt hơn trong mô hình kinh doanh.
          </p>
          <div className="mt-9 flex flex-col gap-4 sm:flex-row">
            <a href="#concept" className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 font-medium text-[#07110f] transition hover:bg-emerald-100">
              Xem concept 3D <ArrowRight className="h-4 w-4" />
            </a>
            <a href="#experience" className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/8 px-6 py-3 font-medium text-white backdrop-blur-xl transition hover:bg-white/14">
              Cấu trúc trải nghiệm
            </a>
          </div>
        </motion.div>
        <div className="hidden min-h-[34rem] lg:block" />
      </div>
      <div className="absolute bottom-10 left-1/2 z-20 -translate-x-1/2 text-center text-xs uppercase tracking-[0.28em] text-white/42">
        Scroll để mô hình bung nở
      </div>
    </section>
  );
}

function Concept() {
  return (
    <section id="concept" className="relative z-10 px-6 py-28">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.055] p-8 backdrop-blur-2xl shadow-2xl">
          <p className="text-sm uppercase tracking-[0.28em] text-emerald-200/70">Creative Direction</p>
          <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-white md:text-5xl">Hoa sen không chỉ là biểu tượng. Nó là giao diện sản phẩm.</h2>
          <p className="mt-6 text-base leading-8 text-white/65">
            Landing page dùng mô hình hoa sen 3D làm trung tâm nhận diện. Khi người dùng scroll, cánh sen tách lớp, ánh sáng vàng trà phát ra từ lõi, lá sen mở rộng như một mặt phẳng sinh thái. Đây là cách chuyển ý tưởng "sen + innovation" thành ngôn ngữ thị giác.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {productPillars.map((item) => {
            const Icon = item.icon;
            return (
              <motion.div key={item.title} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.55 }} className="rounded-[1.6rem] border border-white/10 bg-[#0c1f1a]/70 p-6 backdrop-blur-xl">
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-200/10 ring-1 ring-emerald-100/15">
                  <Icon className="h-5 w-5 text-emerald-100" />
                </div>
                <h3 className="mt-5 text-xl font-semibold text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-white/62">{item.text}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ExperienceTimeline() {
  const steps = [
    ["01", "Nhìn", "Bao bì lấy hình thái cánh sen; màu trà, xanh lá và ánh sáng hổ phách tạo cảm giác tự nhiên nhưng hiện đại."],
    ["02", "Mở", "Mỗi phần trà được xem như một đơn vị trải nghiệm, có thể gói bằng cánh sen hoặc vật liệu gợi hình cánh sen."],
    ["03", "Pha", "Lõi trà bung hương; câu chuyện bản địa được kích hoạt bằng QR, hình ảnh vùng sen và quy trình chế biến."],
    ["04", "Chia sẻ", "Sản phẩm có khả năng mở rộng sang quà tặng, trà sữa mix sen, hoặc phiên bản giới hạn theo mùa sen."],
  ];

  return (
    <section id="experience" className="relative z-10 px-6 py-28">
      <div className="mx-auto max-w-5xl">
        <p className="text-center text-sm uppercase tracking-[0.28em] text-pink-100/60">Experience System</p>
        <h2 className="mx-auto mt-4 max-w-3xl text-center text-4xl font-semibold tracking-[-0.04em] text-white md:text-6xl">Từ ly trà thành một chuỗi tương tác cảm quan.</h2>
        <div className="mt-14 grid gap-4">
          {steps.map(([num, title, text]) => (
            <motion.div key={num} initial={{ opacity: 0, x: -18 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="grid gap-5 rounded-[1.6rem] border border-white/10 bg-white/[0.055] p-6 backdrop-blur-2xl md:grid-cols-[0.18fr_0.22fr_1fr] md:items-center">
              <span className="text-2xl font-semibold text-emerald-100/80">{num}</span>
              <h3 className="text-2xl font-semibold text-white">{title}</h3>
              <p className="leading-7 text-white/62">{text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Impact() {
  return (
    <section id="impact" className="relative z-10 px-6 py-28">
      <div className="mx-auto max-w-7xl rounded-[2.2rem] border border-white/10 bg-gradient-to-br from-white/[0.09] to-emerald-300/[0.055] p-8 backdrop-blur-2xl md:p-12">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-emerald-100/70">Market Fit</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-white md:text-5xl">Khác biệt không nằm ở việc thêm hương sen, mà ở cách tổ chức giá trị.</h2>
          </div>
          <p className="text-base leading-8 text-white/66">
            Senova có thể định vị ở giao điểm giữa thực phẩm - văn hóa - quà tặng. Điểm nhấn là tái cấu trúc sản phẩm quen thuộc thành trải nghiệm có khả năng truyền thông, mở rộng SKU và gắn với nguồn lực địa phương.
          </p>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {[
            ["01", "Tính mới", "Thiết kế lại hình thức đóng gói và nghi thức sử dụng trà sen."],
            ["02", "Tính khả thi", "Dựa trên nguồn nguyên liệu sen sẵn có và mô hình trà đã quen thuộc."],
            ["03", "Tính mở rộng", "Có thể phát triển thành trà khô, trà túi lọc, trà sữa mix sen và quà tặng."],
          ].map(([num, title, text]) => (
            <div key={num} className="rounded-[1.5rem] border border-white/10 bg-[#06100e]/50 p-6">
              <p className="text-sm text-emerald-100/50">{num}</p>
              <h3 className="mt-3 text-xl font-semibold text-white">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-white/62">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section id="cta" className="relative z-10 px-6 py-32">
      <div className="mx-auto max-w-4xl text-center">
        <p className="text-sm uppercase tracking-[0.28em] text-pink-100/60">Senova Prototype</p>
        <h2 className="mt-4 text-5xl font-semibold tracking-[-0.05em] text-white md:text-7xl">Trà sen cho một thế hệ thích chạm, nhìn, pha và kể lại.</h2>
        <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-white/62">
          Landing page này được thiết kế để làm nổi bật tinh thần đổi mới: mô hình 3D bung nở theo scroll, ánh sáng hổ phách từ lõi trà, và bố cục nội dung kể rõ giá trị sản phẩm.
        </p>
        <div className="mt-10 flex justify-center">
          <a href="mailto:hello@senova.vn" className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-7 py-4 font-semibold text-[#07110f] shadow-[0_0_55px_rgba(167,243,208,0.24)] transition hover:bg-white">
            Liên hệ thử nghiệm sản phẩm <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}

export default function SenovaLandingPage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#07110f] font-sans text-white selection:bg-emerald-200 selection:text-[#07110f]">
      <ScrollModelCanvas />
      <div className="pointer-events-none fixed inset-0 z-[1] bg-[radial-gradient(circle_at_50%_12%,rgba(244,114,182,0.16),transparent_34%),linear-gradient(to_bottom,rgba(7,17,15,0.05),rgba(7,17,15,0.92)_74%,#07110f)]" />
      <Header />
      <Hero />
      <Concept />
      <ExperienceTimeline />
      <Impact />
      <CTA />
    </main>
  );
}
