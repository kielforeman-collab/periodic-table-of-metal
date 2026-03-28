import { useEffect, useRef } from 'react';

interface Bolt {
  path: { x: number; y: number }[];
  branches: Bolt[];
  alpha: number;
}

export const LightningCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const boltsRef = useRef<Bolt[]>([]);
  const flashRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    const createBolt = (x: number, y: number, angle: number, length: number, depth: number = 0): Bolt => {
      const path = [{ x, y }];
      let curX = x;
      let curY = y;
      const segments = 8 + Math.random() * 10;
      const segLen = length / segments;

      for (let i = 0; i < segments; i++) {
        curX += Math.sin(angle + (Math.random() - 0.5) * 0.7) * segLen;
        curY += Math.cos(angle + (Math.random() - 0.5) * 0.7) * segLen;
        path.push({ x: curX, y: curY });
      }

      const branches: Bolt[] = [];
      if (depth < 2 && Math.random() > 0.7 && length > 100) {
        branches.push(createBolt(curX, curY, angle + (Math.random() - 0.5) * 1.5, length * 0.5, depth + 1));
      }

      return { path, branches, alpha: 1 };
    };

    const drawBolt = (bolt: Bolt, currentAlpha: number) => {
      if (!ctx) return;
      ctx.beginPath();
      ctx.moveTo(bolt.path[0].x, bolt.path[0].y);
      for (let i = 1; i < bolt.path.length; i++) {
        ctx.lineTo(bolt.path[i].x, bolt.path[i].y);
      }
      ctx.strokeStyle = `rgba(180, 220, 255, ${currentAlpha * bolt.alpha})`;
      ctx.lineWidth = Math.max(0.5, 2 * bolt.alpha);
      ctx.shadowBlur = Math.max(2, 10 * bolt.alpha);
      ctx.shadowColor = 'rgba(0, 150, 255, 0.5)';
      ctx.stroke();

      bolt.branches.forEach(b => drawBolt(b, currentAlpha * bolt.alpha));
    };

    let lastStrike = -2000;
    const animate = (time: number) => {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Flash effect
      if (flashRef.current > 0) {
        ctx.fillStyle = `rgba(255, 255, 255, ${flashRef.current * 0.15})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        flashRef.current *= 0.88;
        if (flashRef.current < 0.01) flashRef.current = 0;
      }

      // Create new strike (randomly 3-10 seconds)
      if (time - lastStrike > 3000 + Math.random() * 7000) {
        const startX = Math.random() * canvas.width;
        boltsRef.current.push(createBolt(startX, 0, 0, canvas.height * 0.85));
        flashRef.current = 1;
        lastStrike = time;
      }

      // Update and draw bolts
      boltsRef.current = boltsRef.current.filter(bolt => {
        bolt.alpha *= 0.86;
        if (bolt.alpha > 0.01) {
          drawBolt(bolt, 1);
          return true;
        }
        return false;
      });

      animId = requestAnimationFrame(animate);
    };

    let animId = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 pointer-events-none z-0 opacity-40 dark:opacity-60"
    />
  );
};
