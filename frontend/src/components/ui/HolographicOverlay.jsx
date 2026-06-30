import { useEffect, useRef } from 'react';

export const HolographicOverlay = ({ isHovered, theme }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    const size = 420; // Increased resolution size
    canvas.width = size;
    canvas.height = size;

    const centerX = size / 2;
    const centerY = size / 2;

    const numRings = 3;
    const nodesPerRing = 8;
    const ringRadii = [50, 95, 140]; // Scaled outward slightly
    let nodes = [];

    // 1. Create Ring Nodes
    for (let r = 0; r < numRings; r++) {
      const radius = ringRadii[r];
      for (let i = 0; i < nodesPerRing; i++) {
        const angle = (i / nodesPerRing) * Math.PI * 2;
        nodes.push({
          x: Math.cos(angle) * radius,
          y: Math.sin(angle) * radius,
          z: (Math.random() - 0.5) * 40,
          isFree: false,
          ringIndex: r,
          nodeIndex: i,
        });
      }
    }

    // 2. Create Free Floating Nodes (plexus mesh)
    const numFreeNodes = 16; // Increased node density
    for (let i = 0; i < numFreeNodes; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 140 + 10;
      nodes.push({
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
        z: (Math.random() - 0.5) * 140,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        vz: (Math.random() - 0.5) * 0.45,
        isFree: true,
      });
    }

    let angleX = 0.003;
    let angleY = 0.006; // Slightly faster rotation for visual energy

    const animate = () => {
      ctx.clearRect(0, 0, size, size);

      if (isHovered) {
        const cosX = Math.cos(angleX);
        const sinX = Math.sin(angleX);
        const cosY = Math.cos(angleY);
        const sinY = Math.sin(angleY);

        // Update positions and rotate nodes in 3D
        const projectedNodes = nodes.map((node) => {
          let x = node.x;
          let y = node.y;
          let z = node.z;

          if (node.isFree) {
            node.x += node.vx;
            node.y += node.vy;
            node.z += node.vz;

            const dist = Math.hypot(node.x, node.y, node.z);
            if (dist > 150) {
              node.vx = -node.vx;
              node.vy = -node.vy;
              node.vz = -node.vz;
            }
          }

          const x1 = x * cosY - z * sinY;
          const z1 = z * cosY + x * sinY;

          const y2 = y * cosX - z1 * sinX;
          const z2 = z1 * cosX + y * sinX;

          const fov = 340;
          const scale = fov / (fov + z2);
          return {
            x: x1 * scale + centerX,
            y: y2 * scale + centerY,
            z: z2,
            isFree: node.isFree,
            ringIndex: node.ringIndex,
            nodeIndex: node.nodeIndex,
          };
        });

        // Configure high-clarity volumetric neon glow
        ctx.shadowBlur = 12;
        ctx.shadowColor = theme === 'dark' ? '#10B981' : '#06B6D4'; // Brand secondary/cyan glow

        // 1. Draw Web Spoke Threads
        ctx.lineWidth = 1.0; // Thicker lines
        for (let i = 0; i < nodesPerRing; i++) {
          const innerNode = projectedNodes[i];
          
          ctx.beginPath();
          ctx.moveTo(centerX, centerY);
          ctx.lineTo(innerNode.x, innerNode.y);
          ctx.strokeStyle = theme === 'dark' 
            ? 'rgba(6, 182, 212, 0.22)' 
            : 'rgba(6, 182, 212, 0.16)';
          ctx.stroke();

          for (let r = 0; r < numRings - 1; r++) {
            const nodeCurrent = projectedNodes[r * nodesPerRing + i];
            const nodeNext = projectedNodes[(r + 1) * nodesPerRing + i];
            
            ctx.beginPath();
            ctx.moveTo(nodeCurrent.x, nodeCurrent.y);
            ctx.lineTo(nodeNext.x, nodeNext.y);
            ctx.strokeStyle = theme === 'dark' 
              ? 'rgba(6, 182, 212, 0.30)' 
              : 'rgba(6, 182, 212, 0.20)';
            ctx.stroke();
          }
        }

        // 2. Draw Concentric Web Rings
        ctx.lineWidth = 1.6; // Stronger primary ring outline
        for (let r = 0; r < numRings; r++) {
          const ringOffset = r * nodesPerRing;
          ctx.beginPath();
          for (let i = 0; i < nodesPerRing; i++) {
            const currNode = projectedNodes[ringOffset + i];
            const nextNode = projectedNodes[ringOffset + ((i + 1) % nodesPerRing)];
            
            if (i === 0) ctx.moveTo(currNode.x, currNode.y);
            else ctx.lineTo(currNode.x, currNode.y);
            
            ctx.lineTo(nextNode.x, nextNode.y);
          }
          ctx.closePath();
          ctx.strokeStyle = theme === 'dark' 
            ? 'rgba(16, 185, 129, 0.35)' 
            : 'rgba(16, 185, 129, 0.25)';
          ctx.stroke();
        }

        // 3. Draw Plexus Connections
        ctx.lineWidth = 1.0;
        for (let i = 0; i < projectedNodes.length; i++) {
          const n1 = projectedNodes[i];
          for (let j = i + 1; j < projectedNodes.length; j++) {
            const n2 = projectedNodes[j];
            
            if (n1.isFree || n2.isFree) {
              const dist = Math.hypot(n1.x - n2.x, n1.y - n2.y);
              if (dist < 75) {
                const alpha = (1 - dist / 75) * 0.45; // Increased visibility alpha
                ctx.beginPath();
                ctx.moveTo(n1.x, n1.y);
                ctx.lineTo(n2.x, n2.y);
                ctx.strokeStyle = theme === 'dark'
                  ? `rgba(99, 102, 241, ${alpha})`
                  : `rgba(6, 182, 212, ${alpha})`;
                ctx.stroke();
              }
            }
          }
        }

        // Disable shadow blur for dots to keep them sharp and dense
        ctx.shadowBlur = 0;

        // 4. Draw Glowing Web Nodes
        projectedNodes.forEach((node) => {
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.isFree ? 2.5 : 3.5, 0, Math.PI * 2);
          ctx.fillStyle = theme === 'dark'
            ? (node.isFree ? '#00f0ff' : '#34d399')
            : (node.isFree ? '#0891B2' : '#10B981');
          ctx.fill();

          // Overlay a bright white core dot on the nodes for realistic LED/laser specular highlight
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.isFree ? 1.0 : 1.5, 0, Math.PI * 2);
          ctx.fillStyle = '#ffffff';
          ctx.fill();
        });
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isHovered, theme]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute pointer-events-none z-20 transition-all duration-700 rounded-full"
      style={{
        width: isHovered ? '118%' : '100%',
        height: isHovered ? '118%' : '100%',
        opacity: isHovered ? 0.95 : 0,
        transform: isHovered ? 'scale(1.15) translateZ(60px)' : 'scale(0.8) translateZ(0px)',
        mixBlendMode: theme === 'dark' ? 'screen' : 'multiply',
      }}
    />
  );
};
