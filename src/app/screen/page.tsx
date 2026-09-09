"use client";
import { BackgroundTextRows } from "@/component/screens/bgText";
import Waves from "@/component/screens/wavy";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
// import { BorderText } from "@/component/screens/borderText";

export default function SearchingScreen() {
  const searchParams = useSearchParams();

  const middleText = useMemo(() => {
    const text = searchParams.get("middleText") || "";
    return text.length > 3 ? text.slice(0, 3) : text;
  }, [searchParams]);

  const backgroundText = useMemo(() => {
    const text = searchParams.get("backgroundText") || "";
    return text.length > 30 ? text.slice(0, 30) : text;
  }, [searchParams]);

  const Background = useMemo(() => {
    const type = searchParams.get("backgroundType");
    let Background = <img src="/wave_background.png" alt="Background" className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none opacity-20" />;
    // if (type === "animated") {
    //   Background = <video autoPlay loop muted className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none opacity-20">
    //     <source src="/animated_background.mp4" type="video/mp4" />
    //   </video>;
    // } else
    if (type === "interactive") {
      Background = <Waves lineColor="rgba(255,255,255,.2)" className="z-0 [&_*]:z-0 opacity-20" />
    }
    return Background;
  }, [searchParams]);

  return (
    <div className="relative flex items-center justify-center h-screen w-screen bg-black overflow-hidden">
      {Background}
      {/* Fondo de texto animado */}
      {backgroundText && <BackgroundTextRows rows={20} text={backgroundText} className="z-10" />}

      {/* Texto rotando alrededor (borde) */}
      {/* <BorderText text={backgroundText} /> */}

      {/* Letra central */}
      {middleText && (
        <div className="text-white text-[14vw] md:text-[10vw] font-extrabold z-20 pointer-events-none">
          {middleText}
        </div>
      )}
    </div>
  );
}
