import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  radius: number;
  drift: number;
  speed: number;
  hue: number;
  alpha: number;
}

const StarsBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prefersReducedMotion = useRef<boolean>(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    prefersReducedMotion.current = mediaQuery.matches;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrame: number;
    const particleCount = 140;
    let particles: Particle[] = [];

    const setSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createParticles = () => {
      particles = Array.from({ length: particleCount }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2 + 0.6,
        drift: (Math.random() - 0.5) * 0.3,
        speed: Math.random() * 0.5 + 0.35,
        hue: Math.random() > 0.5 ? (Math.random() > 0.5 ? 190 : 195) : (Math.random() > 0.5 ? 150 : 155), // light blue and light green
        alpha: Math.random() * 0.4 + 0.4,
      }));
    };

    const drawGradient = () => {
      // Solid dark blue-black background
      ctx.fillStyle = '#0a0e1a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    const render = () => {
      drawGradient();

      particles.forEach((p) => {
        ctx.beginPath();
        const alpha = prefersReducedMotion.current ? 0.3 : p.alpha;
        ctx.fillStyle = `hsla(${p.hue}, 85%, 65%, ${alpha})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = `hsla(${p.hue}, 90%, 70%, ${alpha})`;
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();

        p.y -= p.speed;
        p.x += p.drift;

        if (p.y < -10) {
          p.y = canvas.height + 10;
          p.x = Math.random() * canvas.width;
        }
        if (p.x > canvas.width + 10) p.x = -10;
        if (p.x < -10) p.x = canvas.width + 10;
      });

      animationFrame = requestAnimationFrame(render);
    };

    const handleResize = () => {
      setSize();
      createParticles();
    };

    setSize();
    createParticles();
    if (!prefersReducedMotion.current) {
      animationFrame = requestAnimationFrame(render);
    } else {
      drawGradient();
    }

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <div className="fixed inset-0 -z-10 bg-[#0a0e1a]">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
};

export default StarsBackground;