"use client";

/**
 * Filas de texto que se desplazan en perspectiva, para el fondo de las pantallas de pausa.
 *
 * Dos detalles que importan y que antes estaban mal:
 * - El transform 3D va en un div externo y el desplazamiento en uno interno. Si van juntos,
 *   la librería de animación escribe su propio `transform` y borra la perspectiva.
 * - La rotación se reparte según la cantidad total de filas, no con un paso fijo por fila.
 *   Con un paso fijo, a partir de ~20 filas la rotación pasaba de 90° y el texto terminaba
 *   fuera del contenedor.
 */

/** Rotación y profundidad totales que se reparten entre todas las filas. */
const TOTAL_ROTATION_DEG = 95;
const TOTAL_DEPTH_PX = 380;

export const BackgroundTextRows = ({
  rows,
  className,
  text,
  color = "rgba(255,255,255,0.1)",
  /** Segundos que tarda una pasada completa. Más alto = más lento. */
  durationSeconds = 18,
  /** Tope de tamaño en vw; se reduce solo si hay muchas filas. */
  sizeVw = 4.5,
}: {
  rows: number;
  className?: string;
  text: string;
  color?: string;
  durationSeconds?: number;
  sizeVw?: number;
}) => {
  const rowCount = Math.max(1, Math.round(rows));
  // `cqh` es el alto del contenedor: con N filas de 90/N cada una, siempre ocupan ~90%
  // del alto disponible, sea la pantalla completa o la vista previa del builder.
  const rowHeight = 90 / rowCount;

  return (
    <div
      className={`absolute inset-0 font-bold leading-none select-none pointer-events-none overflow-hidden ${className ?? ""}`}
      style={{
        containerType: "size",
        perspective: 1000,
        perspectiveOrigin: "0% 0%",
        color,
        // El tope en vw evita que con pocas filas el texto quede gigante.
        fontSize: `min(${sizeVw}vw, ${rowHeight}cqh)`,
      }}
    >
      {[...Array(rowCount)].map((_, row) => {
        const progress = rowCount === 1 ? 0 : row / (rowCount - 1);
        return (
          // Sin `overflow-hidden` acá: el alto de la fila es la caja de línea (leading-none),
          // más baja que los glifos, así que recortaría el texto arriba y abajo. Lo que
          // impide que algo se escape es el `overflow-hidden` del contenedor.
          <div
            key={row}
            style={{
              transform: `rotateX(${progress * TOTAL_ROTATION_DEG}deg) translateZ(${-progress * TOTAL_DEPTH_PX}px)`,
              transformOrigin: "0% 0%",
            }}
          >
            <div
              className="whitespace-nowrap w-max"
              style={{
                willChange: "transform",
                animation: `bg-text-scroll-${row % 2 === 0 ? "left" : "right"} ${durationSeconds}s linear infinite`,
              }}
            >
              {`${text} - `.repeat(20)}
            </div>
          </div>
        );
      })}
    </div>
  );
};
