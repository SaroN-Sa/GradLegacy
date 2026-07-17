"use client";
import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import Link from "next/link";

import {
  GraduationCap,
  BookOpen,
  HeartHandshake,
  Trophy,
  Rocket,
  Quote,
  School,
  Camera,
  Video,
  Mic,
  Clock3,
  Globe,
  UserPlus,
  Share2,
  MessageSquareHeart,
  Sparkles,
  ArrowRight,
} from "lucide-react";

/* ---------- content ---------- */

type TimelineEntry = { icon: React.ReactNode; year: string; title: string; body: string; fold: number };
type Feature = { icon: React.ReactNode; title: string; description: string };
type Step = { icon: React.ReactNode; title: string; description: string };
type Wish = { num: string; line: string; from: string };

const HERO_IMG =
  "https://images.unsplash.com/photo-1775623606576-3e049f72b8e7?auto=format&fit=crop&w=2000&q=80";
const GALLERY_IMGS = [
  "https://images.unsplash.com/photo-1695425173758-37e9c23b962a?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1770208524687-9ed3dfa80c7c?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1761781342506-821be95168c5?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1775623606576-3e049f72b8e7?auto=format&fit=crop&w=900&q=80",
];

const TIMELINE: TimelineEntry[] = [
  { icon: <School size={18} />, year: "2011 — Age 5", title: "First Day of School", body: "A backpack bigger than they were, and a wave goodbye that took three tries to actually let go of.", fold: -10 },
  { icon: <BookOpen size={18} />, year: "2016 — Age 10", title: "Fell in Love With a Subject", body: "The library card got more use than any toy that year. Curiosity became a habit.", fold: 10 },
  { icon: <HeartHandshake size={18} />, year: "2020 — Age 14", title: "The Hard Year", body: "Learned what it means to keep going when nothing is easy. It mattered more than any grade.", fold: -10 },
  { icon: <Trophy size={18} />, year: "2023 — Age 17", title: "Captain, Leader, Late-Nighter", body: "Led the team. Aced the exam after failing the first one. Started to believe.", fold: 10 },
  { icon: <Rocket size={18} />, year: "2025 — Senior Year", title: "The Final Push", body: "Applications, all-nighters, and a growing stack of acceptance letters on the wall.", fold: -10 },
  { icon: <GraduationCap size={18} />, year: "2026 — Today", title: "The Cap Goes Up", body: "Every early morning, every doubt talked through — all of it lands here, on this stage.", fold: 10 },
];

const FEATURES: Feature[] = [
  { icon: <Camera size={22} />, title: "Photo Memories", description: "Upload and organize photos from every chapter of your journey." },
  { icon: <Video size={22} />, title: "Video Wishes", description: "Let friends and family leave heartfelt video messages." },
  { icon: <Mic size={22} />, title: "Voice Messages", description: "Capture the warmth of a spoken congratulations." },
  { icon: <Clock3 size={22} />, title: "Time Capsule", description: "Lock away messages to be revealed on a future date." },
  { icon: <BookOpen size={22} />, title: "Memory Book", description: "Compile your favorite moments into a shareable keepsake." },
  { icon: <Globe size={22} />, title: "Multi Language", description: "Collect wishes from anyone, in any language." },
];

const STEPS: Step[] = [
  { icon: <UserPlus size={16} />, title: "Create Your Profile", description: "Set the stage with photos, a headline, and your story so far." },
  { icon: <Share2 size={16} />, title: "Share Your Link", description: "Send it to family and friends — no app or account required." },
  { icon: <MessageSquareHeart size={16} />, title: "Collect Wishes", description: "Photos, videos, and voice notes land in one place automatically." },
  { icon: <Sparkles size={16} />, title: "Preserve Memories Forever", description: "Your page, and everything on it, stays yours to revisit anytime." },
];

const WISHES: Wish[] = [
  { num: "01", line: "Congratulations — we are so, so proud of you.", from: "Text from Mom & Dad" },
  { num: "02", line: "Knew you'd do it. Never doubted you for a second.", from: "Voice message from Grandma" },
  { num: "03", line: "So many late nights led to this exact moment.", from: "Video wish from your roommate" },
  { num: "04", line: "Best study partner anyone could ask for.", from: "Photo + note from your lab group" },
  { num: "05", line: "Cheers to the next chapter — you've earned it.", from: "Video wish from your mentor" },
];

const EVENT_DATE = new Date("2026-06-06T16:00:00");

/* ---------- hooks ---------- */

function useCountdown(target: Date) {
  const [remaining, setRemaining] = useState(() => target.getTime() - Date.now());
  useEffect(() => {
    const id = setInterval(() => setRemaining(target.getTime() - Date.now()), 1000);
    return () => clearInterval(id);
  }, [target]);
  const clamped = Math.max(remaining, 0);
  return {
    days: Math.floor(clamped / (1000 * 60 * 60 * 24)),
    hours: Math.floor((clamped / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((clamped / (1000 * 60)) % 60),
    seconds: Math.floor((clamped / 1000) % 60),
    arrived: clamped <= 0,
  };
}

type Spark = { left: number; bottom: number; duration: number; delay: number; size: number };
function useSparks(count: number): Spark[] {
  return useMemo(
    () =>
      Array.from({ length: count }, () => ({
        left: Math.random() * 100,
        bottom: -10 - Math.random() * 20,
        duration: 10 + Math.random() * 14,
        delay: Math.random() * 14,
        size: 1.5 + Math.random() * 2.5,
      })),
    [count]
  );
}

type ConfettiPiece = { id: number; x: number; y: number; angle: number; distance: number; rotation: number; hue: "gold" | "pale" };

/* ---------- small components ---------- */

function Countdown({ target }: { target: Date }) {
  const { days, hours, minutes, seconds, arrived } = useCountdown(target);
  if (arrived) return <div className="countdown-arrived">The capsule unlocks today.</div>;
  const units: [string, number][] = [["Days", days], ["Hours", hours], ["Min", minutes], ["Sec", seconds]];
  return (
    <div className="countdown">
      {units.map(([label, value]) => (
        <div className="countdown-unit" key={label}>
          <div className="countdown-digit">{String(value).padStart(2, "0")}</div>
          <div className="countdown-label">{label}</div>
        </div>
      ))}
    </div>
  );
}

function useReveal(threshold = 0.2) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => entries.forEach((e) => e.isIntersecting && setVisible(true)), { threshold });
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return { ref, visible };
}

function Reveal({
  children,
  fold = 0,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  fold?: number;
  delay?: number;
  className?: string;
}) {
  const { ref, visible } = useReveal(0.15);
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "rotateY(0deg) translateY(0)" : `rotateY(${fold}deg) translateY(22px)`,
        transformStyle: "preserve-3d",
        transformOrigin: fold >= 0 ? "left center" : "right center",
        transition: `opacity .7s ease ${delay}s, transform .8s cubic-bezier(.2,.8,.2,1) ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

function TimelineCard({ entry, index }: { entry: TimelineEntry; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => entries.forEach((e) => e.isIntersecting && setVisible(true)), { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const odd = index % 2 === 0;
  return (
    <div
      ref={ref}
      className={`tl-item ${odd ? "odd" : "even"}`}
      style={{ "--fold-deg": `${entry.fold}deg`, opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(24px)", transition: "opacity .8s ease, transform .8s ease" } as React.CSSProperties}
    >
      <div className="tl-dot" />
      <div className="fold-card">
        <div className="fold-icon">{entry.icon}</div>
        <div className="yr">{entry.year}</div>
        <h4>{entry.title}</h4>
        <p>{entry.body}</p>
      </div>
    </div>
  );
}

function FeatureCard({ feature }: { feature: Feature }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setTilt({ x: (e.clientX - r.left) / r.width - 0.5, y: (e.clientY - r.top) / r.height - 0.5 });
  };
  return (
    <div
      className="feature-card"
      onMouseMove={onMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      style={{ transform: `perspective(900px) rotateX(${-tilt.y * 6}deg) rotateY(${tilt.x * 6}deg)` }}
    >
      <div className="feature-icon">{feature.icon}</div>
      <h3>{feature.title}</h3>
      <p>{feature.description}</p>
    </div>
  );
}

/* ---------- main ---------- */

export default function GraduationPage() {
  const sparks = useSparks(34);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [scrollProgress, setScrollProgress] = useState(0);
  const [spineFill, setSpineFill] = useState(0);
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);
  const timelineRef = useRef<HTMLDivElement>(null);
  const confettiId = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const total = doc.scrollHeight - doc.clientHeight;
      setScrollProgress(total > 0 ? (window.scrollY / total) * 100 : 0);
      const el = timelineRef.current;
      if (el) {
        const rect = el.getBoundingClientRect();
        const progressed = window.innerHeight * 0.5 - rect.top;
        setSpineFill(Math.min(100, Math.max(0, (progressed / rect.height) * 100)));
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleTiltMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setTilt({ x: (e.clientX - r.left) / r.width - 0.5, y: (e.clientY - r.top) / r.height - 0.5 });
  }, []);
  const handleTiltLeave = useCallback(() => setTilt({ x: 0, y: 0 }), []);

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  const burstConfetti = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const x = r.left + r.width / 2;
    const y = r.top + r.height / 2;
    const pieces: ConfettiPiece[] = Array.from({ length: 26 }, () => {
      const id = confettiId.current++;
      return { id, x, y, angle: Math.random() * Math.PI * 2, distance: 60 + Math.random() * 110, rotation: Math.random() * 720 - 360, hue: Math.random() > 0.4 ? "gold" : "pale" };
    });
    setConfetti((prev) => [...prev, ...pieces]);
    window.setTimeout(() => {
      const ids = new Set(pieces.map((p) => p.id));
      setConfetti((prev) => prev.filter((p) => !ids.has(p.id)));
    }, 1100);
  }, []);

  return (
    <div className="gp-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap');

        .gp-root{
          --ink:#0a0e16; --slate:#121a27; --slate-2:#1b2536; --slate-3:#26324a;
          --gold:#FFD700; --gold-deep:#c9a227; --gold-dim:rgba(255,215,0,0.14);
          --text:#e8ecf3; --text-dim:#8c9bb3; --hairline:rgba(255,215,0,0.16);
          background:var(--ink); color:var(--text); font-family:'Inter',sans-serif;
          overflow-x:hidden; -webkit-font-smoothing:antialiased; position:relative;
        }
        .gp-root *{box-sizing:border-box;}
        .gp-root ::selection{background:var(--gold); color:var(--ink);}
        .gp-root h1,.gp-root h2,.gp-root h3{font-family:'Fraunces',serif; font-weight:600; line-height:1.05; margin:0;}
        .gp-root p{margin:0;}
        .gp-root button{font-family:inherit;}
        .gp-root img{display:block; width:100%; height:100%; object-fit:cover;}

        .eyebrow{font-family:'Space Mono',monospace; font-size:12px; letter-spacing:.22em; text-transform:uppercase; color:var(--gold); display:flex; align-items:center; gap:10px;}
        .eyebrow::before{content:''; width:22px; height:1px; background:var(--gold-deep);}
        .eyebrow.centered{justify-content:center;}

        #particles{position:fixed; inset:0; pointer-events:none; z-index:1; overflow:hidden;}
        .spark{position:absolute; background:var(--gold); border-radius:50%; opacity:.55; filter:blur(.3px); animation:drift linear infinite;}
        @keyframes drift{0%{transform:translateY(0) translateX(0); opacity:0;} 10%{opacity:.6;} 90%{opacity:.4;} 100%{transform:translateY(-110vh) translateX(20px); opacity:0;}}

        .scroll-bar{position:fixed; top:0; left:0; height:2px; z-index:100; background:linear-gradient(90deg, var(--gold-deep), var(--gold)); box-shadow:0 0 12px rgba(255,215,0,.6); transition:width .1s linear;}
        .confetti-piece{position:fixed; top:0; left:0; z-index:200; pointer-events:none; border-radius:1px; animation:confetti-burst 1.1s cubic-bezier(.2,.7,.3,1) forwards;}
        @keyframes confetti-burst{0%{transform:translate(0,0) rotate(0deg) scale(1); opacity:1;} 100%{transform:translate(var(--cx), var(--cy)) rotate(var(--cr)) scale(.4); opacity:0;}}

        nav{position:sticky; top:0; left:0; right:0; z-index:50; display:flex; justify-content:space-between; align-items:center; padding:22px 48px; backdrop-filter:blur(10px); background:linear-gradient(to bottom, rgba(10,14,22,.85), transparent);}
        .brand{font-family:'Fraunces',serif; font-weight:600; font-size:20px; letter-spacing:.02em;}
        .brand .accent{background:linear-gradient(120deg, var(--gold-deep), var(--gold) 60%, #fff3b0); -webkit-background-clip:text; background-clip:text; color:transparent;}
        .navlinks{display:flex; gap:34px; font-size:13px; letter-spacing:.04em;}
        .navlinks a{color:var(--text-dim); text-decoration:none; transition:color .3s ease; position:relative; cursor:pointer;}
        .navlinks a:hover{color:var(--gold);}
        .navlinks a::after{content:''; position:absolute; bottom:-6px; left:0; width:0; height:1px; background:var(--gold); transition:width .3s ease;}
        .navlinks a:hover::after{width:100%;}

        .hero{min-height:100vh; position:relative; display:flex; align-items:center; z-index:2; padding:80px 48px; overflow:hidden;}
        .hero-bg{position:absolute; inset:0; z-index:0;}
        .hero-bg img{filter:saturate(.75) brightness(.55);}
        .hero-bg::after{content:''; position:absolute; inset:0; background:linear-gradient(100deg, var(--ink) 28%, rgba(10,14,22,.75) 55%, rgba(10,14,22,.35) 100%), linear-gradient(0deg, var(--ink), transparent 30%); }
        .hero-grid{position:relative; z-index:2; display:grid; grid-template-columns:1.1fr .9fr; gap:60px; width:100%; max-width:1240px; margin:0 auto; align-items:center;}
        .hero-wordmark{font-family:'Fraunces',serif; font-weight:700; font-size:15px; letter-spacing:.06em; margin-bottom:18px; background:linear-gradient(120deg, var(--gold-deep), var(--gold) 55%, #fff3b0); -webkit-background-clip:text; background-clip:text; color:transparent; text-transform:uppercase;}
        .hero h1{font-size:clamp(42px,5.6vw,80px); margin:6px 0 22px; letter-spacing:-.01em;}
        .hero h1 em{font-style:italic; color:var(--gold); font-weight:500;}
        .hero-copy{font-size:17px; color:var(--text-dim); max-width:480px; line-height:1.7; margin-bottom:34px;}
        .hero-actions{display:flex; gap:16px; align-items:center;}
        .btn-primary{background:var(--gold); color:var(--ink); border:none; padding:15px 30px; font-weight:700; font-size:14px; letter-spacing:.03em; border-radius:2px; cursor:pointer; transition:all .35s cubic-bezier(.2,.8,.2,1); display:inline-flex; align-items:center; gap:8px;}
        .btn-primary:hover{transform:translateY(-2px); box-shadow:0 14px 30px -8px rgba(255,215,0,.5);}
        .btn-primary svg{transition:transform .3s ease;}
        .btn-primary:hover svg{transform:translateX(3px);}
        .btn-ghost{color:var(--text); border:1px solid var(--hairline); background:transparent; padding:15px 26px; font-size:14px; letter-spacing:.03em; border-radius:2px; cursor:pointer; transition:all .3s ease;}
        .btn-ghost:hover{border-color:var(--gold); color:var(--gold);}

        .tilt-wrap{perspective:1400px;}
        .diploma{position:relative; height:460px; border-radius:6px; background:linear-gradient(155deg, var(--slate-2), var(--slate) 60%); border:1px solid var(--hairline); transform-style:preserve-3d; transition:transform .1s ease-out; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; padding:40px; box-shadow:0 40px 80px -30px rgba(0,0,0,.8);}
        .diploma::before{content:''; position:absolute; inset:16px; border:1px solid var(--gold-dim); border-radius:2px; pointer-events:none;}
        .diploma .seal{width:78px; height:78px; border-radius:50%; border:2px solid var(--gold); display:flex; align-items:center; justify-content:center; margin-bottom:22px; transform:translateZ(50px); box-shadow:0 0 30px rgba(255,215,0,.25); color:var(--gold);}
        .diploma h3{transform:translateZ(40px); font-size:24px; color:var(--gold); margin-bottom:8px;}
        .diploma .cap-label{transform:translateZ(30px); color:var(--text-dim); font-size:13px; letter-spacing:.05em; text-transform:uppercase; font-family:'Space Mono',monospace;}
        .diploma .line{transform:translateZ(20px); width:120px; height:1px; background:var(--gold-deep); margin:22px 0;}

        section{position:relative; z-index:2; padding:120px 48px;}
        .section-head{max-width:640px; margin:0 auto 70px; text-align:center;}
        .section-head h2{font-size:clamp(32px,4vw,52px); margin-top:16px;}
        .section-head p{color:var(--text-dim); margin-top:16px; font-size:16px; line-height:1.7;}

        /* features */
        .features-grid{max-width:1180px; margin:0 auto; display:grid; grid-template-columns:repeat(3,1fr); gap:24px; perspective:1400px;}
        .feature-card{background:linear-gradient(160deg, var(--slate-2), var(--slate)); border:1px solid var(--hairline); border-radius:18px; padding:32px; transition:border-color .35s ease, box-shadow .35s ease; transform-style:preserve-3d;}
        .feature-card:hover{border-color:var(--gold); box-shadow:0 24px 50px -25px rgba(255,215,0,.3);}
        .feature-icon{width:48px; height:48px; border-radius:14px; background:var(--gold-dim); color:var(--gold); display:flex; align-items:center; justify-content:center; margin-bottom:18px; transition:transform .35s ease;}
        .feature-card:hover .feature-icon{transform:scale(1.08) rotate(-4deg);}
        .feature-card h3{font-size:19px; margin-bottom:8px;}
        .feature-card p{color:var(--text-dim); font-size:14px; line-height:1.6;}

        /* how it works */
        .steps-wrap{max-width:1080px; margin:0 auto; position:relative;}
        .steps-line{position:absolute; top:33px; left:6%; right:6%; height:1px; background:linear-gradient(90deg, transparent, var(--hairline) 15%, var(--hairline) 85%, transparent); z-index:0;}
        .steps-grid{position:relative; z-index:1; display:grid; grid-template-columns:repeat(4,1fr); gap:22px; perspective:1400px;}
        .step-card{background:linear-gradient(160deg, var(--slate-2), var(--slate)); border:1px solid var(--hairline); border-radius:18px; padding:28px 22px; text-align:center; transition:transform .35s ease, border-color .35s ease, box-shadow .35s ease;}
        .step-card:hover{transform:translateY(-6px); border-color:var(--gold); box-shadow:0 24px 50px -25px rgba(255,215,0,.3);}
        .step-num{width:44px; height:44px; border-radius:50%; margin:0 auto 14px; background:var(--gold-dim); border:1px solid var(--hairline); display:flex; align-items:center; justify-content:center; font-family:'Space Mono',monospace; font-weight:700; color:var(--gold); font-size:16px; transition:transform .35s ease, background .35s ease;}
        .step-card:hover .step-num{transform:scale(1.1); background:var(--gold); color:var(--ink);}
        .step-icon{width:32px; height:32px; margin:0 auto 12px; border-radius:50%; background:var(--slate-3); color:var(--text-dim); display:flex; align-items:center; justify-content:center; transition:color .3s ease;}
        .step-card:hover .step-icon{color:var(--gold);}
        .step-card h4{font-size:15px; margin-bottom:8px;}
        .step-card p{color:var(--text-dim); font-size:12.5px; line-height:1.55;}

        /* timeline */
        .timeline{max-width:900px; margin:0 auto; position:relative;}
        .spine{position:absolute; left:50%; top:0; bottom:0; width:2px; transform:translateX(-50%); background:linear-gradient(to bottom, transparent, var(--hairline) 8%, var(--hairline) 92%, transparent); overflow:hidden;}
        .spine-fill{position:absolute; top:0; left:0; width:100%; background:linear-gradient(to bottom, var(--gold-deep), var(--gold)); box-shadow:0 0 14px rgba(255,215,0,.5); transition:height .15s linear;}
        .tl-item{position:relative; width:50%; padding:0 56px 100px; perspective:1200px;}
        .tl-item.odd{left:0; text-align:right;}
        .tl-item.even{left:50%; text-align:left;}
        .tl-dot{position:absolute; top:6px; width:14px; height:14px; border-radius:50%; background:var(--gold); box-shadow:0 0 0 4px var(--ink), 0 0 0 5px var(--hairline); animation:pulse-dot 2.6s ease-in-out infinite;}
        .tl-item.odd .tl-dot{right:-8px;} .tl-item.even .tl-dot{left:-8px;}
        @keyframes pulse-dot{0%,100%{box-shadow:0 0 0 4px var(--ink), 0 0 0 5px var(--hairline);} 50%{box-shadow:0 0 0 4px var(--ink), 0 0 0 11px rgba(255,215,0,.18);}}
        .fold-card{display:inline-block; width:100%; max-width:360px; background:linear-gradient(160deg, var(--slate-2), var(--slate)); border:1px solid var(--hairline); border-radius:4px; padding:26px 28px; transform-style:preserve-3d; transform:rotateY(var(--fold-deg,-8deg)); transform-origin:left center; transition:transform .7s cubic-bezier(.2,.8,.2,1), border-color .4s ease, box-shadow .4s ease; cursor:default;}
        .tl-item.even .fold-card{transform:rotateY(calc(-1 * var(--fold-deg,-8deg)));}
        .tl-item:hover .fold-card{transform:rotateY(0deg); border-color:var(--gold); box-shadow:0 20px 50px -20px rgba(255,215,0,.25);}
        .fold-card .yr{font-family:'Space Mono',monospace; color:var(--gold); font-size:13px; letter-spacing:.1em;}
        .fold-card h4{font-family:'Fraunces',serif; font-size:22px; font-weight:600; margin:8px 0 10px;}
        .fold-card p{color:var(--text-dim); font-size:14px; line-height:1.6;}
        .fold-icon{width:40px; height:40px; border-radius:50%; border:1px solid var(--hairline); display:flex; align-items:center; justify-content:center; margin-bottom:14px; transition:border-color .4s ease, background .4s ease; color:var(--gold);}
        .tl-item.odd .fold-icon{margin-left:auto;}
        .tl-item:hover .fold-icon{border-color:var(--gold); background:var(--gold-dim);}

        /* gallery */
        .moments{max-width:1100px; margin:0 auto; display:grid; grid-template-columns:repeat(4,1fr); gap:2px; background:var(--hairline); border-radius:4px; overflow:hidden; perspective:1400px;}
        .moment{background:var(--slate); aspect-ratio:4/5; position:relative; overflow:hidden; display:flex; align-items:flex-end; padding:20px;}
        .moment .bg{position:absolute; inset:0; transition:transform .8s cubic-bezier(.2,.8,.2,1), filter .5s ease;}
        .moment .bg img{filter:saturate(.85) brightness(.7);}
        .moment:hover .bg{transform:scale(1.08); filter:brightness(1.08);}
        .moment .cap{position:relative; z-index:2;}
        .moment .cap .eb{font-family:'Space Mono',monospace; font-size:10px; letter-spacing:.14em; color:var(--gold); text-transform:uppercase;}
        .moment .cap h5{font-family:'Fraunces',serif; font-weight:600; font-size:16px; margin-top:5px; transition:color .4s ease;}
        .moment:hover .cap h5{color:var(--gold);}
        .moment::before{content:''; position:absolute; inset:0; background:linear-gradient(to top, rgba(10,14,22,.85), transparent 60%); z-index:1;}
        .moment::after{content:''; position:absolute; inset:0; border:1px solid transparent; transition:border-color .4s ease; pointer-events:none; z-index:3;}
        .moment:hover::after{border-color:var(--gold);}

        /* wishes rows */
        .rows{max-width:820px; margin:0 auto; border-top:1px solid var(--hairline); perspective:1400px;}
        .row{display:grid; grid-template-columns:80px 1fr auto; align-items:center; gap:24px; padding:24px 18px; border-bottom:1px solid var(--hairline); transition:background .35s ease, padding-left .35s ease; cursor:default;}
        .row:hover{background:linear-gradient(90deg, var(--gold-dim), transparent); padding-left:30px;}
        .row .num{font-family:'Space Mono',monospace; color:var(--text-dim); font-size:13px; transition:color .35s ease;}
        .row:hover .num{color:var(--gold);}
        .row h4{font-family:'Fraunces',serif; font-size:19px; font-weight:500; transition:color .35s ease; margin:0;}
        .row:hover h4{color:var(--gold);}
        .row .who{color:var(--text-dim); font-size:12.5px; font-family:'Space Mono',monospace; letter-spacing:.03em;}

        .quote-wrap{max-width:760px; margin:0 auto; text-align:center;}
        .quote-wrap .quote-icon{color:var(--gold); margin-bottom:26px;}
        .quote-wrap p{font-family:'Fraunces',serif; font-size:clamp(22px,3vw,32px); font-weight:300; font-style:italic; line-height:1.5; color:var(--text);}
        .quote-wrap .attr{margin-top:26px; font-family:'Space Mono',monospace; font-size:13px; color:var(--gold); letter-spacing:.05em;}

        .cta{background:linear-gradient(180deg, var(--ink), var(--slate) 200%); text-align:center; padding-bottom:80px;}
        .cta-card{max-width:880px; margin:0 auto; border:1px solid var(--hairline); border-radius:6px; padding:70px 50px; background:radial-gradient(ellipse at 50% 0%, var(--gold-dim), transparent 70%); position:relative; overflow:hidden;}
        .cta-card h2{font-size:clamp(30px,4vw,46px); margin-bottom:16px;}
        .cta-card p{color:var(--text-dim); margin-bottom:8px;}
        .countdown{display:flex; justify-content:center; gap:18px; margin:36px 0 8px; flex-wrap:wrap;}
        .countdown-unit{background:var(--slate-2); border:1px solid var(--hairline); border-radius:4px; padding:16px 20px; min-width:78px; text-align:center; transition:border-color .3s ease, transform .3s ease;}
        .countdown-unit:hover{border-color:var(--gold); transform:translateY(-3px);}
        .countdown-digit{font-family:'Space Mono',monospace; font-size:30px; font-weight:700; color:var(--gold); font-variant-numeric:tabular-nums;}
        .countdown-label{font-family:'Space Mono',monospace; font-size:10px; letter-spacing:.14em; text-transform:uppercase; color:var(--text-dim); margin-top:6px;}
        .countdown-arrived{font-family:'Fraunces',serif; font-style:italic; font-size:22px; color:var(--gold); margin:36px 0 8px;}

        footer{text-align:center; padding:50px 48px 40px; color:var(--text-dim); font-size:13px; font-family:'Space Mono',monospace; letter-spacing:.04em;}
        footer span{color:var(--gold);}
        footer .credit{display:block; margin-top:10px; font-size:11px; letter-spacing:.1em; opacity:.75;}

        @media (max-width:960px){
          .features-grid{grid-template-columns:1fr 1fr;}
          .steps-grid{grid-template-columns:1fr 1fr;}
          .steps-line{display:none;}
          .moments{grid-template-columns:1fr 1fr;}
        }
        @media (max-width:860px){
          .hero-grid{grid-template-columns:1fr;}
          .tl-item, .tl-item.even{width:100%; left:0; text-align:left; padding-left:56px;}
          .tl-item .tl-dot, .tl-item.odd .tl-dot{left:-8px; right:auto;}
          .tl-item.odd .fold-icon{margin-left:0;}
          .fold-card, .tl-item.even .fold-card{transform:rotateY(-8deg);}
          .navlinks{display:none;}
          .features-grid{grid-template-columns:1fr;}
          .steps-grid{grid-template-columns:1fr;}
        }
        @media (prefers-reduced-motion: reduce){ .gp-root *{animation:none !important; transition:none !important;} }
      `}</style>

      <div className="scroll-bar" style={{ width: `${scrollProgress}%` }} />

      {confetti.map((p) => {
        const dx = Math.cos(p.angle) * p.distance;
        const dy = Math.sin(p.angle) * p.distance - 40;
        return (
          <div
            key={p.id}
            className="confetti-piece"
            style={{ left: p.x, top: p.y, width: p.hue === "gold" ? 7 : 5, height: p.hue === "gold" ? 7 : 5, background: p.hue === "gold" ? "var(--gold)" : "var(--text)", "--cx": `${dx}px`, "--cy": `${dy}px`, "--cr": `${p.rotation}deg` } as React.CSSProperties}
          />
        );
      })}

      <div id="particles">
        {sparks.map((s, i) => (
          <div key={i} className="spark" style={{ left: `${s.left}vw`, bottom: `${s.bottom}px`, width: `${s.size}px`, height: `${s.size}px`, animationDuration: `${s.duration}s`, animationDelay: `${s.delay}s` }} />
        ))}
      </div>

      <nav>
        <div className="brand">
          Grad<span className="accent">Legacy</span>
        </div>
        <div className="navlinks">
          <a onClick={() => scrollTo("features")}>Features</a>
          <a onClick={() => scrollTo("how-it-works")}>How It Works</a>
          <a onClick={() => scrollTo("story")}>The Story</a>
          <a onClick={() => scrollTo("cta")}>Get Started</a>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-bg">
          <img src={HERO_IMG} alt="Graduates tossing their caps in celebration" />
        </div>
        <div className="hero-grid">
          <div>
            <div className="hero-wordmark">GradLegacy</div>
            <h1>
              Every ending
              <br />
              was just <em>practice</em>
              <br />
              for this one.
            </h1>
            <p className="hero-copy">
              Build a page that holds the whole story — from a kindergarten backpack too big for
              their shoulders to a cap thrown higher than they ever thought they'd reach. Then let
              everyone who loves them add to it.
            </p>
            <div className="hero-actions">
              <button className="btn-primary" onClick={() => scrollTo("cta")}>
                Get Started
                <ArrowRight size={16} />
              </button>
              <button className="btn-ghost" onClick={() => scrollTo("features")}>
                See Features
              </button>
            </div>
          </div>

          <div className="tilt-wrap" onMouseMove={handleTiltMove} onMouseLeave={handleTiltLeave}>
            <div className="diploma" style={{ transform: `rotateY(${tilt.x * 16}deg) rotateX(${-tilt.y * 16}deg)` }}>
              <div className="seal">
                <GraduationCap size={36} />
              </div>
              <p className="cap-label">Your GradLegacy Page</p>
              <h3>Conferred With Honor</h3>
              <div className="line" />
              <p className="cap-label">Photos, videos &amp; voice wishes, all in one place — forever</p>
            </div>
          </div>
        </div>
      </section>

      <section id="features">
        <div className="section-head">
          <div className="eyebrow centered">Features</div>
          <h2>Everything you need to preserve this chapter</h2>
        </div>
        <div className="features-grid">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} fold={i % 2 === 0 ? -8 : 8} delay={(i % 3) * 0.08}>
              <FeatureCard feature={f} />
            </Reveal>
          ))}
        </div>
      </section>

      <section id="how-it-works">
        <div className="section-head">
          <div className="eyebrow centered">Simple Process</div>
          <h2>How It Works</h2>
        </div>
        <div className="steps-wrap">
          <div className="steps-line" />
          <div className="steps-grid">
            {STEPS.map((s, i) => (
              <Reveal key={s.title} fold={i % 2 === 0 ? -8 : 8} delay={i * 0.1}>
                <div className="step-card">
                  <div className="step-num">{String(i + 1).padStart(2, "0")}</div>
                  <div className="step-icon">{s.icon}</div>
                  <h4>{s.title}</h4>
                  <p>{s.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="story">
        <div className="section-head">
          <div className="eyebrow centered">The Journey</div>
          <h2>This is the kind of story GradLegacy holds</h2>
          <p>Six chapters, one thread. Hover any milestone to let it unfold.</p>
        </div>
        <div className="timeline" ref={timelineRef}>
          <div className="spine">
            <div className="spine-fill" style={{ height: `${spineFill}%` }} />
          </div>
          {TIMELINE.map((entry, i) => (
            <TimelineCard key={entry.title} entry={entry} index={i} />
          ))}
        </div>
      </section>

      <section id="moments">
        <div className="section-head">
          <div className="eyebrow centered">The Celebration</div>
          <h2>Joy, in real frames</h2>
          <p>A glimpse of the moments families are already preserving.</p>
        </div>
        <div className="moments">
          {GALLERY_IMGS.map((src, i) => (
            <Reveal key={src + i} fold={i % 2 === 0 ? -10 : 10} delay={(i % 4) * 0.08}>
              <div className="moment">
                <div className="bg">
                  <img src={src} alt="Graduation celebration moment" />
                </div>
                <div className="cap">
                  <div className="eb">Frame {String(i + 1).padStart(2, "0")}</div>
                  <h5>{["Caps in the Air", "One Last Hug", "Together on the Steps", "The Whole Crowd Cheering"][i]}</h5>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="wishes">
        <div className="section-head">
          <div className="eyebrow centered">Already Arriving</div>
          <h2>The wishes start before the ceremony even ends</h2>
        </div>
        <div className="rows">
          {WISHES.map((w, i) => (
            <Reveal key={w.num} fold={i % 2 === 0 ? -6 : 6} delay={i * 0.05}>
              <div className="row">
                <div className="num">{w.num}</div>
                <h4>{w.line}</h4>
                <div className="who">{w.from}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section>
        <div className="quote-wrap">
          <Quote className="quote-icon" size={34} />
          <p>
            We didn't just save photos. We built somewhere our whole family can go back to and feel
            it all over again.
          </p>
          <div className="attr">THE RAMIREZ FAMILY · GRADLEGACY</div>
        </div>
      </section>

      <section className="cta" id="cta">
        <div className="cta-card">
          <div className="eyebrow centered">Start Today</div>
          <h2>Ready to Preserve Your Memories?</h2>
          <p>Create your graduation page and start collecting wishes today.</p>
          <Countdown target={EVENT_DATE} />
          <button className="btn-primary" onClick={burstConfetti} style={{ marginTop: 28 }}>
            Get Started
            <ArrowRight size={16} />
          </button>
        </div>
      </section>

      <footer>
        Made with pride for the <span>Class of 2026</span> — here's to everything next.
        <span className="credit">GradLegacy · Developed by Habtamu Samuel</span>
      </footer>
    </div>
  );
}