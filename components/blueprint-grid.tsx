"use client";

import { useEffect, useRef } from "react";

type Node = { left: string; top: string; dur: string };

/** Passo da grade em px — precisa bater com `background-size` de `.blueprint`. */
const CELL = 64;

/**
 * Pool fixo de pontos reaproveitados em rodízio. Evita criar/destruir nós do DOM
 * a cada movimento do cursor.
 */
const SPARKS = 24;

/** Ciclo de vida de um ponto: nasce, acende, estaciona no nível de pegada, dissipa. */
const SPARK_MS = 1400;

/**
 * Intervalo mínimo entre dois pontos. Existe para o rodízio nunca alcançar um ponto
 * ainda vivo: 24 × 60ms = 1440ms ≥ SPARK_MS, então um elemento só é reaproveitado
 * depois de ter morrido. Sem isso, movimento rápido corta a animação em curso e o
 * ponto some por corte, não por fade.
 */
const MIN_GAP_MS = 60;

export function BlueprintGrid({ nodes }: { nodes: Node[] }) {
  const gridRef = useRef<HTMLDivElement>(null);
  const poolRef = useRef<HTMLSpanElement[]>([]);

  useEffect(() => {
    const grid = gridRef.current;
    const host = grid?.parentElement;
    const pool = poolRef.current.filter(Boolean);
    if (!grid || !host || pool.length === 0) return;

    // Sem movimento para quem pediu menos movimento, e sem listener em touch:
    // `pointermove` dispara em tap e deixaria pontos presos na tela.
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || calm.matches) return;

    let frame = 0;
    let cursor = 0;
    let lastCell = "";
    let lastSpawn = 0;

    const onMove = (event: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rect = grid.getBoundingClientRect();
        const col = Math.round((event.clientX - rect.left) / CELL);
        const row = Math.round((event.clientY - rect.top) / CELL);

        // Fora dos limites: não inventa cruzamento que a grade não desenha.
        if (col < 0 || row < 0 || col * CELL > rect.width || row * CELL > rect.height) return;

        // O ponto nasce ao ENTRAR num cruzamento novo. Parado no mesmo
        // cruzamento nada acontece — é o que separa "reagir" de "piscar".
        const cell = `${col}:${row}`;
        if (cell === lastCell) return;
        lastCell = cell;

        const now = performance.now();
        if (now - lastSpawn < MIN_GAP_MS) return;
        lastSpawn = now;

        const spark = pool[cursor % pool.length];
        cursor += 1;

        const at = `translate3d(${col * CELL}px, ${row * CELL}px, 0)`;

        // O translate entra em todos os keyframes porque transform é uma
        // propriedade só — não dá para posicionar por fora e animar a escala.
        //
        // A curva é modelada à MÃO em keyframes densos com `easing: "linear"`, e não
        // com cubic-beziers por segmento. Motivo: a WAAPI interpola cada trecho de
        // forma independente, então duas curvas vizinhas com derivadas diferentes
        // produzem um solavanco na junção — era o que fazia o fade parecer "duro".
        // Com passos de ~100ms a poligonal é imperceptível e a forma é exata.
        //
        // Opacidade: deltas sempre decrescentes em módulo nas duas pontas, ou seja
        // aceleração zero nos extremos. O ponto nunca "parte" nem "chega" — ele
        // emerge e dissipa. Perto de zero o passo é de 0.02, abaixo do limiar em que
        // o olho percebe a mudança.
        spark.animate(
          [
            //           acender: 0 → 224ms, ease-out (deltas caindo)
            { offset: 0,    opacity: 0,    transform: `${at} scale(0.62)` },
            { offset: 0.04, opacity: 0.34, transform: `${at} scale(0.79)` },
            { offset: 0.08, opacity: 0.66, transform: `${at} scale(0.9)` },
            { offset: 0.12, opacity: 0.88, transform: `${at} scale(0.96)` },
            { offset: 0.16, opacity: 1,    transform: `${at} scale(1)` },
            //           assentar no nível de pegada: inversão gradual, sem bico
            { offset: 0.2,  opacity: 0.96, transform: `${at} scale(1.01)` },
            { offset: 0.26, opacity: 0.8,  transform: `${at} scale(1.03)` },
            { offset: 0.32, opacity: 0.58, transform: `${at} scale(1.05)` },
            //           dissipar: quadrática, arrasta cada vez mais devagar
            { offset: 0.42, opacity: 0.44, transform: `${at} scale(1.07)` },
            { offset: 0.52, opacity: 0.32, transform: `${at} scale(1.09)` },
            { offset: 0.63, opacity: 0.21, transform: `${at} scale(1.11)` },
            { offset: 0.74, opacity: 0.12, transform: `${at} scale(1.13)` },
            { offset: 0.85, opacity: 0.06, transform: `${at} scale(1.15)` },
            { offset: 0.93, opacity: 0.02, transform: `${at} scale(1.17)` },
            { offset: 1,    opacity: 0,    transform: `${at} scale(1.18)` },
          ],
          { duration: SPARK_MS, easing: "linear", fill: "forwards" },
        );
      });
    };

    const onLeave = () => {
      cancelAnimationFrame(frame);
      lastCell = "";
      lastSpawn = 0;
    };

    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(frame);
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div className="blueprint" ref={gridRef} aria-hidden="true">
      {nodes.map((node) => (
        <span
          key={node.left + node.top}
          className="blueprint__node"
          style={{ left: node.left, top: node.top, "--node-dur": node.dur } as React.CSSProperties}
        />
      ))}

      {/* rastro: pontos idênticos aos fixos, acesos pelo cursor e apagados sozinhos */}
      {Array.from({ length: SPARKS }, (_, i) => (
        <span
          key={i}
          className="blueprint__spark"
          ref={(el) => {
            if (el) poolRef.current[i] = el;
          }}
        />
      ))}
    </div>
  );
}
