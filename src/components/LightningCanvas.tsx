import { useEffect, useRef } from 'react';

interface Bolt {
  path: { x: number; y: number }[];
  branches: Bolt[];
  alpha: number;
}

export const LightningCanvas = ({ onStrike, enabled = true }: { onStrike?: () => void; enabled?: boolean }) => {
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
      
      // More segments for detailed branching
      const segments = 15 + Math.random() * 10;
      const segLen = length / segments;

      for (let i = 0; i < segments; i++) {
        // Multi-frequency jitter for natural look
        const jitter = (Math.random() - 0.5) * 0.8 + (Math.random() - 0.5) * 0.3;
        curX += Math.sin(angle + jitter) * segLen;
        curY += Math.cos(angle + jitter) * segLen;
        path.push({ x: curX, y: curY });
      }

      const branches: Bolt[] = [];
      // Higher chance of branching at top, decreasing with depth
      if (depth < 4 && Math.random() > 0.6) {
        const branchAngle = angle + (Math.random() - 0.5) * 1.6;
        const branchLen = length * (0.3 + Math.random() * 0.4);
        branches.push(createBolt(curX, curY, branchAngle, branchLen, depth + 1));
      }

      return { path, branches, alpha: 1 };
    };

    const drawBoltPath = (bolt: Bolt, currentAlpha: number, width: number, blur: number, color: string) => {
      if (!ctx) return;
      ctx.beginPath();
      ctx.moveTo(bolt.path[0].x, bolt.path[0].y);
      for (let i = 1; i < bolt.path.length; i++) {
        ctx.lineTo(bolt.path[i].x, bolt.path[i].y);
      }
      
      ctx.shadowBlur = blur;
      ctx.shadowColor = color;
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();

      bolt.branches.forEach(b => drawBoltPath(b, currentAlpha, width * 0.7, blur * 0.7, color));
    };

    const renderStrike = (bolt: Bolt) => {
      // Pass 1: Outer wide afterglow (lingering)
      // We use bolt.alpha directly here
      drawBoltPath(bolt, bolt.alpha, 20 * Math.pow(bolt.alpha, 0.5), 80 * bolt.alpha, `rgba(110, 160, 255, ${bolt.alpha * 0.15})`);
      
      // Pass 2: Inner blue aura
      drawBoltPath(bolt, bolt.alpha, 8 * bolt.alpha, 30 * bolt.alpha, `rgba(160, 210, 255, ${bolt.alpha * 0.4})`);
      
      // Pass 3: Bright white core (dies fast)
      const coreAlpha = Math.pow(bolt.alpha, 2.5); 
      if (coreAlpha > 0.05) {
        drawBoltPath(bolt, coreAlpha, 4 * coreAlpha, 8 * coreAlpha, `rgba(255, 255, 255, ${coreAlpha})`);
      }
    };

    let lastStrike = -2000;
    const animate = (time: number) => {
      if (!ctx) return;
      if (!enabled) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return;
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Flash effect (more intense but shorter)
      if (flashRef.current > 0) {
        ctx.fillStyle = `rgba(210, 235, 255, ${flashRef.current * 0.18})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        flashRef.current *= 0.82;
        if (flashRef.current < 0.01) flashRef.current = 0;
      }

      // Create new strike (randomly 1.5-5.5 seconds)
      if (time - lastStrike > 1500 + Math.random() * 4000) {
        const startX = Math.random() * canvas.width;
        // Sometimes double strikes for realism
        const count = Math.random() > 0.75 ? 2 : 1;
        for(let i=0; i<count; i++) {
          const xOff = (Math.random() - 0.5) * 150;
          boltsRef.current.push(createBolt(startX + xOff, 0, 0, canvas.height * (0.7 + Math.random() * 0.3)));
        }
        flashRef.current = 1;
        lastStrike = time;
        if (onStrike) onStrike();
      }

      // Update and draw bolts
      boltsRef.current = boltsRef.current.filter(bolt => {
        // Slow down the alpha decay to allow the afterglow to linger
        bolt.alpha *= 0.94;
        if (bolt.alpha > 0.01) {
          renderStrike(bolt);
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
  }, [enabled]);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 pointer-events-none z-0 opacity-40 dark:opacity-60"
    />
  );
};
