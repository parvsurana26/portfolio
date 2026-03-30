import { useRef } from "react";
import type { MouseEvent } from "react";

type MagneticButtonProps = {
  children: string;
  className?: string;
};

export function MagneticButton({ children, className = "" }: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement | null>(null);

  const handleMove = (event: MouseEvent<HTMLButtonElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (event.clientX - (rect.left + rect.width / 2)) * 0.3;
    const y = (event.clientY - (rect.top + rect.height / 2)) * 0.3;
    ref.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  };

  const reset = () => {
    if (!ref.current) return;
    ref.current.style.transform = "translate3d(0px, 0px, 0)";
  };

  return (
    <button
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      className={`magnetic transition-transform duration-300 ease-out ${className}`}
      type="button"
    >
      {children}
    </button>
  );
}
