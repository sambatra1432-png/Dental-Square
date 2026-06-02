import React, { useEffect, useRef, useState } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  originalAlpha: number;
  alpha: number;
}

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
}

export default function InteractiveHeroBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const mouseRef = useRef({ x: -1000, y: -1000, active: false });
  const particlesRef = useRef<Particle[]>([]);
  const sparksRef = useRef<Spark[]>([]);

  // Track the resize of the container using a ResizeObserver as mandated
  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) return;
      const { width, height } = entries[0].contentRect;
      
      // Update our dimensions and canvas resolution
      setDimensions({ width, height });
      if (canvasRef.current) {
        canvasRef.current.width = width;
        canvasRef.current.height = height;
      }
      
      // Initialize or regenerate particles to match the container density
      initParticles(width, height);
    });

    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  const initParticles = (width: number, height: number) => {
    if (width === 0 || height === 0) return;

    const count = Math.min(45, Math.floor((width * height) / 11000));
    const colors = [
      'rgba(45, 106, 106, ',   // Deep Teal
      'rgba(212, 176, 122, ',  // Luxury Gold
      'rgba(184, 151, 90, ',   // Accent Gold
      'rgba(45, 106, 106, ',   // Light Teal
    ];

    const particles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      const radius = Math.random() * 2.5 + 1.2;
      const colorBase = colors[Math.floor(Math.random() * colors.length)];
      const alpha = Math.random() * 0.45 + 0.15;

      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        radius,
        color: colorBase,
        originalAlpha: alpha,
        alpha: alpha,
      });
    }
    particlesRef.current = particles;
  };

  // Manage animation loops
  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();

    const draw = (time: number) => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!canvas || !ctx || dimensions.width === 0) {
        animId = requestAnimationFrame(draw);
        return;
      }

      // Clear the canvas on each frame with a very subtle alpha trail for smoothness
      ctx.clearRect(0, 0, dimensions.width, dimensions.height);

      const mouse = mouseRef.current;
      const particles = particlesRef.current;
      const sparks = sparksRef.current;

      // 1. Draw connecting mesh lines if particles are close
      ctx.lineWidth = 0.8;
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          // Connect particles within a threshold
          if (dist < 100) {
            const opacity = (1 - dist / 100) * 0.08;
            ctx.strokeStyle = `rgba(45, 106, 106, ${opacity})`;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }

        // Draw connections to the mouse cursor as well
        if (mouse.active) {
          const dx = p1.x - mouse.x;
          const dy = p1.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 150) {
            const opacity = (1 - dist / 150) * 0.18;
            ctx.strokeStyle = `rgba(212, 176, 122, ${opacity})`;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
          }
        }
      }

      // 2. Update and draw existing particles
      particles.forEach((p) => {
        // Subtle drift movement
        p.x += p.vx;
        p.y += p.vy;

        // Bounce back from boundaries gently
        if (p.x < 0 || p.x > dimensions.width) p.vx *= -1;
        if (p.y < 0 || p.y > dimensions.height) p.vy *= -1;

        // Keep inside bounds strictly
        p.x = Math.max(0, Math.min(dimensions.width, p.x));
        p.y = Math.max(0, Math.min(dimensions.height, p.y));

        // Magnetic attraction: pull particles gently to the mouse
        if (mouse.active) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 180) {
            // Soft proportional gravitational pull
            const force = (180 - dist) * 0.0015;
            p.x -= (dx / dist) * force;
            p.y -= (dy / dist) * force;
            // Flare up visual brightness
            p.alpha = Math.min(0.9, p.originalAlpha + (180 - dist) / 180 * 0.45);
          } else {
            // Decay back to normal brightness
            p.alpha = p.alpha > p.originalAlpha ? p.alpha - 0.01 : p.originalAlpha;
          }
        } else {
          p.alpha = p.alpha > p.originalAlpha ? p.alpha - 0.01 : p.originalAlpha;
        }

        // Render the node with its active opacity
        ctx.fillStyle = p.color + p.alpha + ')';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();

        // If hovered, give it an extra glowing outline ring
        if (mouse.active) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 40) {
            ctx.strokeStyle = `rgba(212, 176, 122, ${0.15 * (1 - dist / 40)})`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius * 2.5, 0, Math.PI * 2);
            ctx.stroke();
          }
        }
      });

      // 3. Render any click sparks (fading glowing stars or bubbles)
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.x += s.vx;
        s.y += s.vy;
        s.vy += 0.04; // Gentle gravity fall
        s.life++;
        s.alpha = 1 - (s.life / s.maxLife);

        if (s.life >= s.maxLife) {
          sparks.splice(i, 1);
          continue;
        }

        ctx.fillStyle = s.color.replace('ALPHA', s.alpha.toFixed(2));
        
        // Draw cross-hair/star sparkles
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size * s.alpha, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw elegant shining crosshairs
        ctx.strokeStyle = s.color.replace('ALPHA', (s.alpha * 0.45).toFixed(2));
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(s.x - s.size * 2 * s.alpha, s.y);
        ctx.lineTo(s.x + s.size * 2 * s.alpha, s.y);
        ctx.moveTo(s.x, s.y - s.size * 2 * s.alpha);
        ctx.lineTo(s.x, s.y + s.size * 2 * s.alpha);
        ctx.stroke();
      }

      animId = requestAnimationFrame(draw);
    };

    animId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animId);
  }, [dimensions]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    mouseRef.current = { x, y, active: true };
  };

  const handleMouseLeave = () => {
    mouseRef.current.active = false;
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const colors = [
      'rgba(212, 176, 122, ALPHA)', // Gold
      'rgba(45, 106, 106, ALPHA)',  // Teal
      'rgba(255, 255, 255, ALPHA)', // Brilliant White
    ];

    // Spawn 12 sparks on click to reward interaction
    const newSparks: Spark[] = [];
    for (let i = 0; i < 12; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 2.2 + 0.8;
      newSparks.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 0.5,
        size: Math.random() * 2.5 + 1.2,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
        life: 0,
        maxLife: Math.floor(Math.random() * 25) + 30, // frame duration life
      });
    }

    sparksRef.current = [...sparksRef.current, ...newSparks];
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      className="absolute inset-0 w-full h-full cursor-cell select-none overflow-hidden"
    >
      <canvas
        ref={canvasRef}
        className="block w-full h-full pointer-events-none"
      />
    </div>
  );
}
