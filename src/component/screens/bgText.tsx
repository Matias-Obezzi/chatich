"use client";
import { motion } from "framer-motion";

export const BackgroundTextRows = ({ rows, className, text } : { rows: number; className?: string; text: string; }) => {
  return (
    <div 
      className={`absolute inset-0 text-[6vw] md:text-[4.5vw] font-bold text-white/10 leading-none select-none pointer-events-none ${className}`}
      style={{
        perspective: 1000,
        perspectiveOrigin: "0% 0%"
      }}
    >
      {[...Array(rows)].map((_, row) => (
        <motion.div
          key={row}
          className="whitespace-nowrap"
          animate={{
            x: row % 2 === 0 ? ["0%", "-50%"] : ["-50%", "0%"],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{ 
            willChange: "transform",
            transform: `rotateX(${row * 5}deg) translateZ(${-row * 20}px)`,
            transformOrigin: "0% 0%",
            perspective: 1000,
          }}
        >
          {`${text} - `.repeat(20)}
        </motion.div>
      ))}
    </div>
  )
}