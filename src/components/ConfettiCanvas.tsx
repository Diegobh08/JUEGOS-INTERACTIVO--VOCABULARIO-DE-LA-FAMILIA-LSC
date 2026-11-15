import React, { useEffect, useRef } from 'react';

const CONFETTI_COLORS = [
  '#B01E37',
  '#F2C94C',
  '#21704A',
  '#1F5FA8',
  '#D08A12',
  '#7B45A8',
  '#EA5B73',
  '#5CC48C',
  '#FFD166',
];

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  w: number;
  h: number;
  color: string;
  angle: number;
  angleSpeed: number;
  flip: number;
  flipSpeed: number;
  shape: 'rect' | 'circle' | 'star';
  alpha: number;
}

export const ConfettiCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const onResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize);

    const shapes: Array<'rect' | 'circle' | 'star'> = [
      'rect',
      'rect',
      'circle',
      'star',
    ];
    const particles: Particle[] = [];

    for (let i = 0; i < 160; i++) {
      const fromLeft = i < 64;
      const fromRight = i >= 64 && i < 128;
      let x = Math.random() * width;
      let y = -Math.random() * 100 - 10;
      let vx = (Math.random() - 0.5) * 4;
      let vy = Math.random() * 3 + 2;

      if (fromLeft) {
        x = width * 0.2 * Math.random();
        y = height + 10;
        vx = Math.random() * 9 + 4;
        vy = -Math.random() * 14 - 10;
      } else if (fromRight) {
        x = width - width * 0.2 * Math.random();
        y = height + 10;
        vx = -Math.random() * 9 - 4;
        vy = -Math.random() * 14 - 10;
      }

      particles.push({
        x,
        y,
        vx,
        vy,
        w: Math.random() * 8 + 6,
        h: Math.random() * 12 + 8,
        color:
          CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        angle: Math.random() * Math.PI * 2,
        angleSpeed: (Math.random() - 0.5) * 0.15,
        flip: Math.random(),
        flipSpeed: Math.random() * 0.12 + 0.04,
        shape: shapes[Math.floor(Math.random() * shapes.length)],
        alpha: 1,
      });
    }

    let rafId = 0;
    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.28;
        p.vx *= 0.985;
        p.angle += p.angleSpeed;
        p.flip += p.flipSpeed;
        p.vx += Math.sin(p.y * 0.02) * 0.08;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.scale(Math.cos(p.flip), 1);
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;

        if (p.shape === 'rect') {
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        } else if (p.shape === 'circle') {
          ctx.beginPath();
          ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.beginPath();
          const s = p.w * 0.8;
          ctx.moveTo(0, -s);
          ctx.lineTo(s * 0.3, -s * 0.3);
          ctx.lineTo(s, 0);
          ctx.lineTo(s * 0.3, s * 0.3);
          ctx.lineTo(0, s);
          ctx.lineTo(-s * 0.3, s * 0.3);
          ctx.lineTo(-s, 0);
          ctx.lineTo(-s * 0.3, -s * 0.3);
          ctx.closePath();
          ctx.fill();
        }
        ctx.restore();

        if (p.y > height + 40) {
          p.y = -20;
          p.x = Math.random() * width;
          p.vy = Math.random() * 4 + 2;
          p.vx = (Math.random() - 0.5) * 4;
        }
      }
      rafId = requestAnimationFrame(draw);
    };

    rafId = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50 w-full h-full"
    />
  );
};
