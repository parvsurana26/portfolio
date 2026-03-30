import { useRef, useState } from "react";
import type { MouseEvent, ReactNode } from "react";
import { motion } from "framer-motion";

type MagneticElementProps = {
  children: ReactNode;
  className?: string;
  strength?: number;
};

export function MagneticElement({ children, className = "", strength = 0.5 }: MagneticElementProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e: MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * strength, y: middleY * strength });
  };

  const reset = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className={`w-fit h-fit ${className}`}
    >
      {children}
    </motion.div>
  );
}
