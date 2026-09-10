import { motion } from "framer-motion"
import { useMemo, useRef } from "react";
import { Marquee } from "../marquee";

const WORD_COUNT = 80;
const WORD_SEPARATOR = " • ";
const PATH = "M 20,0 L 780,0 Q 800,0 800,20 L 800,180 Q 800,200 780,200 L 20,200 Q 0,200 0,180 L 0,20 Q 0,0 20,0 Z";

export const BorderText = ({ text }: { text: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none h-screen w-screen" ref={ref}>
      <Marquee baseVelocity={5} repeat={30} path={PATH} scrollContainerRef={ref}>{text}</Marquee>
      {/* <Border text={text} position="top" duration={duration} />
      <Border text={text} position="right" duration={duration} />
      <Border text={text} position="bottom" duration={duration} />
      <Border text={text} position="left" duration={duration} /> */}
    </div>
  )
}

// Parkeado: el uso esta comentado en <BorderText> mientras se prueba el enfoque con <Marquee>.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Border = ({ 
  text, 
  position, 
  duration
}: { 
  text: string, 
  position: "top" | "right" | "bottom" | "left",
  duration: number
}) => {
  const positionStyles = {
    top: { top: 0, left: 0, width: "100%", height: "auto" },
    right: { top: 0, right: 0, width: "auto", height: "100%", rotate: "90deg" },
    bottom: { bottom: 0, left: 0, width: "100%", height: "auto", rotate: "180deg" },
    left: { top: 0, left: 0, width: "auto", height: "100%", rotate: "270deg" }
  }[position];

  // Movimiento horario sincronizado
  const animateProps = useMemo(() => {
    switch(position) {
      case "top": 
        return {
          first: { x: ["0", "100%"] },
          second: { x: ["-100%", "0"] }
        }; // izquierda a derecha
      case "right": 
        return {
          first: { y: ["0", "100%"] },
          second: { y: ["-100%", "0"] }
        }; // arriba a abajo
      case "bottom": 
        return {
          first: { x: ["100%", "0"] },
          second: { x: ["0", "100%"] }
        }; // derecha a izquierda
      case "left": 
        return {
          first: { y: ["100%", "0"] },
          second: { y: ["0", "100%"] }
        }; // abajo a arriba
      default:
        return {
          first: { x: ["0", "100%"] },
          second: { x: ["-100%", "0"] }
        }
    }
  }, []);
  const repeatedText = `${text}${WORD_SEPARATOR}`.repeat(WORD_COUNT);

  return (
    <>
      <motion.div
        className="absolute text-white/70 text-xs tracking-widest flex items-center whitespace-nowrap overflow-hidden"
        style={{
          willChange: "transform",
          ...positionStyles
        }}
        animate={animateProps.first}
        transition={{
          duration: duration,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        {repeatedText}
      </motion.div>
      <motion.div
        className="absolute text-white/70 text-xs tracking-widest flex items-center whitespace-nowrap overflow-hidden"
        style={{
          willChange: "transform",
          ...positionStyles
        }}
        animate={animateProps.second}
        transition={{
          duration: duration,
          repeat: Infinity,
          ease: "linear",
          delay: duration,
        }}
      >
        {repeatedText}
      </motion.div>
    </>
  )
}