import React, { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { useApp } from '../context/AppContext';

interface ParallaxBackgroundProps {
  children?: React.ReactNode;
}

export const ParallaxBackground: React.FC<ParallaxBackgroundProps> = ({ children }) => {
  const { theme } = useApp();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Motion values for smooth cursor tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for fluid cinematic parallax response
  const springConfig = { damping: 30, stiffness: 60 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Depth transforms for different visual layers
  const bgFarX = useTransform(smoothX, [-0.5, 0.5], [20, -20]);
  const bgFarY = useTransform(smoothY, [-0.5, 0.5], [15, -15]);

  const bgMidX = useTransform(smoothX, [-0.5, 0.5], [45, -45]);
  const bgMidY = useTransform(smoothY, [-0.5, 0.5], [30, -30]);

  const bgNearX = useTransform(smoothX, [-0.5, 0.5], [70, -70]);
  const bgNearY = useTransform(smoothY, [-0.5, 0.5], [45, -45]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize cursor position between -0.5 and 0.5
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth) - 0.5;
      const y = (e.clientY / innerHeight) - 0.5;
      mouseX.set(x);
      mouseY.set(y);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  // Golden stardust particle system on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle definition
    interface Particle {
      x: number;
      y: number;
      size: number;
      speedY: number;
      speedX: number;
      opacity: number;
      maxOpacity: number;
      pulseSpeed: number;
      color: string;
    }

    const particleCount = 48;
    const goldTones = [
      'rgba(212, 175, 55, ',
      'rgba(243, 229, 171, ',
      'rgba(255, 215, 0, ',
      'rgba(184, 134, 11, ',
    ];

    const particles: Particle[] = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2.2 + 0.8,
      speedY: -(Math.random() * 0.45 + 0.15),
      speedX: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.7,
      maxOpacity: Math.random() * 0.75 + 0.25,
      pulseSpeed: Math.random() * 0.02 + 0.008,
      color: goldTones[Math.floor(Math.random() * goldTones.length)],
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX;
        p.opacity += p.pulseSpeed;

        if (p.opacity > p.maxOpacity || p.opacity < 0.1) {
          p.pulseSpeed = -p.pulseSpeed;
        }

        // Loop boundaries
        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        // Draw soft glowing gold orb
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${Math.max(0, Math.min(1, p.opacity))})`;
        ctx.shadowBlur = p.size * 4;
        ctx.shadowColor = 'rgba(212, 175, 55, 0.6)';
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className={`relative min-h-screen w-full overflow-hidden transition-colors duration-500 ${
      theme === 'light' ? 'bg-[#FAF7F2] text-slate-800' : 'bg-[#060A16] text-slate-100'
    }`}>
      {/* Layer 0: Fixed deep luxury radial ambiance */}
      <div 
        className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-500"
        style={{
          background: theme === 'light'
            ? 'radial-gradient(circle at 50% 18%, rgba(243, 229, 171, 0.45) 0%, rgba(250, 247, 242, 0.98) 75%)'
            : 'radial-gradient(circle at 50% 18%, rgba(26, 41, 75, 0.45) 0%, rgba(6, 10, 22, 0.98) 75%)',
          opacity: theme === 'light' ? 0.95 : 0.8,
        }}
      />

      {/* Subtle Golden Ambient Light Cones */}
      <motion.div
        style={{ x: bgFarX, y: bgFarY }}
        className={`pointer-events-none absolute top-[-10%] right-[10%] h-[550px] w-[550px] rounded-full blur-[130px] bg-gradient-to-br from-amber-400 via-amber-600 to-transparent ${
          theme === 'light' ? 'opacity-15' : 'opacity-20'
        }`}
      />
      <motion.div
        style={{ x: bgMidX, y: bgMidY }}
        className={`pointer-events-none absolute bottom-[5%] left-[5%] h-[500px] w-[500px] rounded-full blur-[120px] bg-gradient-to-tr from-blue-900 via-amber-500/20 to-transparent ${
          theme === 'light' ? 'opacity-10' : 'opacity-15'
        }`}
      />

      {/* Layer 1: Geometric Arabesque / Ottoman Star Tessellation Background (Parallax Far) */}
      <motion.div
        style={{ x: bgFarX, y: bgFarY }}
        className={`pointer-events-none absolute inset-0 z-[1] ${
          theme === 'light' ? 'opacity-[0.055]' : 'opacity-[0.045] mix-blend-screen'
        }`}
      >
        <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          <defs>
            <pattern id="ottoman-pattern" width="80" height="80" patternUnits="userSpaceOnUse">
              <path
                d="M40 0 L52 28 L80 40 L52 52 L40 80 L28 52 L0 40 L28 28 Z"
                fill="none"
                stroke="#D4AF37"
                strokeWidth="1"
              />
              <circle cx="40" cy="40" r="14" fill="none" stroke="#D4AF37" strokeWidth="0.8" />
              <path d="M0 0 L15 15 M80 0 L65 15 M80 80 L65 65 M0 80 L15 65" stroke="#D4AF37" strokeWidth="0.6" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#ottoman-pattern)" />
        </svg>
      </motion.div>

      {/* Layer 2: Scenic Turkish Landmarks Silhouette (Bosphorus, Maiden's Tower & Balloons) (Parallax Mid) */}
      <motion.div
        style={{ x: bgMidX, y: bgMidY }}
        className="pointer-events-none absolute bottom-0 left-0 right-0 z-[2] h-[340px] opacity-25 overflow-hidden"
      >
        <svg
          viewBox="0 0 1600 400"
          preserveAspectRatio="none"
          className="h-full w-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Subtle Mountain ridgeline (Trabzon & Taurus peaks) */}
          <path
            d="M0 320 Q200 240 420 300 T850 250 T1300 290 Q1480 230 1600 320 L1600 400 L0 400 Z"
            fill="url(#mountain-grad)"
            opacity="0.3"
          />

          {/* Floating Cappadocia Balloons */}
          <g transform="translate(180, 70) scale(0.65)" opacity="0.65">
            <ellipse cx="30" cy="35" rx="20" ry="26" fill="url(#balloon-gold)" stroke="#D4AF37" strokeWidth="1" />
            <polygon points="20,58 40,58 35,66 25,66" fill="#AA771C" />
            <rect x="26" y="69" width="8" height="6" fill="#D4AF37" rx="1" />
            <line x1="22" y1="58" x2="27" y2="69" stroke="#D4AF37" strokeWidth="0.8" />
            <line x1="38" y1="58" x2="33" y2="69" stroke="#D4AF37" strokeWidth="0.8" />
          </g>

          <g transform="translate(320, 120) scale(0.42)" opacity="0.45">
            <ellipse cx="30" cy="35" rx="20" ry="26" fill="url(#balloon-gold)" stroke="#D4AF37" strokeWidth="1" />
            <polygon points="20,58 40,58 35,66 25,66" fill="#AA771C" />
            <rect x="26" y="69" width="8" height="6" fill="#D4AF37" rx="1" />
          </g>

          <g transform="translate(1380, 95) scale(0.55)" opacity="0.55">
            <ellipse cx="30" cy="35" rx="20" ry="26" fill="url(#balloon-gold)" stroke="#D4AF37" strokeWidth="1" />
            <polygon points="20,58 40,58 35,66 25,66" fill="#AA771C" />
            <rect x="26" y="69" width="8" height="6" fill="#D4AF37" rx="1" />
          </g>

          {/* Istanbul Bosphorus Silhouette & Maiden's Tower (Kız Kulesi) */}
          <g transform="translate(700, 180) scale(0.9)" opacity="0.8">
            {/* Maiden's tower base on island */}
            <path d="M120 180 L200 180 L185 155 L135 155 Z" fill="#D4AF37" fillOpacity="0.4" />
            {/* Tower lower body */}
            <rect x="145" y="105" width="30" height="50" fill="#D4AF37" fillOpacity="0.5" />
            {/* Balcony */}
            <rect x="140" y="100" width="40" height="5" fill="#D4AF37" fillOpacity="0.7" />
            {/* Upper turret & conical spire */}
            <path d="M150 100 L160 55 L170 100 Z" fill="#D4AF37" fillOpacity="0.8" />
            <line x1="160" y1="55" x2="160" y2="40" stroke="#D4AF37" strokeWidth="2" />
            <circle cx="160" cy="40" r="2.5" fill="#FFF6D5" />
            {/* Lantern glow */}
            <circle cx="160" cy="75" r="5" fill="#FFE58F" fillOpacity="0.6" />
          </g>

          {/* Historic Minarets and Hagia Sophia / Blue Mosque Domes */}
          <g transform="translate(950, 175) scale(0.85)" opacity="0.5">
            {/* Dome */}
            <path d="M100 180 Q150 110 200 180 Z" fill="#D4AF37" fillOpacity="0.35" />
            <path d="M130 145 Q150 115 170 145 Z" fill="#D4AF37" fillOpacity="0.6" />
            {/* Minarets */}
            <line x1="85" y1="180" x2="85" y2="80" stroke="#D4AF37" strokeWidth="3" />
            <polygon points="81,80 89,80 85,55" fill="#D4AF37" />
            <line x1="215" y1="180" x2="215" y2="80" stroke="#D4AF37" strokeWidth="3" />
            <polygon points="211,80 219,80 215,55" fill="#D4AF37" />
          </g>

          {/* Bosphorus Water and Yacht Silhouette */}
          <path
            d="M0 360 C300 350, 500 370, 800 355 C1100 345, 1300 365, 1600 355 L1600 400 L0 400 Z"
            fill="url(#water-grad)"
          />

          {/* Luxury Yacht Silhouette cruising Bosphorus */}
          <g transform="translate(540, 320) scale(0.75)" opacity="0.75">
            {/* Yacht Hull */}
            <path d="M20 30 L160 30 Q175 30 185 24 L145 42 L35 42 Z" fill="#0A1224" stroke="#D4AF37" strokeWidth="1" />
            {/* Superstructure */}
            <path d="M45 29 L120 29 L110 14 L60 14 Z" fill="#141E33" stroke="#D4AF37" strokeWidth="0.8" />
            <line x1="100" y1="14" x2="85" y2="2" stroke="#D4AF37" strokeWidth="1" />
            {/* Cabin glow */}
            <rect x="70" y="20" width="35" height="5" fill="#FFE58F" fillOpacity="0.7" rx="1" />
          </g>

          <defs>
            <linearGradient id="mountain-grad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#060A16" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="balloon-gold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFF2B2" />
              <stop offset="50%" stopColor="#D4AF37" />
              <stop offset="100%" stopColor="#8A6210" />
            </linearGradient>
            <linearGradient id="water-grad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0B162C" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#060A16" stopOpacity="1" />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>

      {/* Layer 3: Canvas Golden Ambient Dust Particles (Parallax Near) */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 z-[3]"
      />

      {/* Foreground Container with Near Parallax for Lighting */}
      <motion.div
        style={{ x: bgNearX, y: bgNearY }}
        className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full opacity-10 blur-[140px] bg-amber-300"
      />

      {/* Main Content Slot */}
      <div className="relative z-10 flex min-h-screen flex-col w-full">
        {children}
      </div>
    </div>
  );
};
