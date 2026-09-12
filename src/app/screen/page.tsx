"use client";

import { Suspense } from "react";
import ScreenOverlay from "@/component/overlays/screen/ScreenOverlay";

/**
 * Superficie para OBS: sin navbar ni footer. La lógica vive en ScreenOverlay, que es el
 * mismo componente que usa /overlay/screen y su builder.
 */
export default function SearchingScreen() {
  return (
    <div className="h-screen w-screen">
      <Suspense fallback={<div className="h-full w-full bg-black" />}>
        <ScreenOverlay />
      </Suspense>
    </div>
  );
}
