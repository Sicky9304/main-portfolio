import { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export const TiltCard = ({ children, className = '' }) => {
  const cardRef = useRef(null);
  const [hovered, setHovered] = useState(false);

  // Mouse tracking variables
  const rotateXVal = useMotionValue(0);
  const rotateYVal = useMotionValue(0);

  // High-performance spring configs for natural inertia
  const springConfig = { damping: 25, stiffness: 180, mass: 0.5 };
  const rotateX = useSpring(rotateXVal, springConfig);
  const rotateY = useSpring(rotateYVal, springConfig);

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Centered percentage coordinates from -0.5 to 0.5
    const xPct = (mouseX / width) - 0.5;
    const yPct = (mouseY / height) - 0.5;

    // Calculate rotation degree limits (Max 12 degrees tilt)
    const targetRotateX = -yPct * 12;
    const targetRotateY = xPct * 12;

    rotateXVal.set(targetRotateX);
    rotateYVal.set(targetRotateY);
  };

  const handleMouseEnter = () => {
    setHovered(true);
  };

  const handleMouseLeave = () => {
    setHovered(false);
    rotateXVal.set(0);
    rotateYVal.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
        perspective: 1000,
      }}
      animate={{
        scale: hovered ? 1.025 : 1.0,
      }}
      transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
      className={`relative group rounded-[32px] overflow-hidden aspect-[16/10] shadow-lg transition-shadow duration-500 cursor-pointer ${
        hovered ? 'shadow-primary/10 dark:shadow-primary/5 shadow-2xl' : 'shadow-black/5'
      } ${className}`}
    >
      {children}
    </motion.div>
  );
};
