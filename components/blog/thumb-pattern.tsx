import type { PostAccent, PostPattern } from "../../lib/posts";

/**
 * Thumb gráfico dos cards — CSS puro, sem imagem.
 * O desenho vem da tag do post; a cor vem de um accent do sistema
 * (o mapeamento accent -> token vive em `blog.css`).
 */
const shapeCount: Record<PostPattern, number> = {
  stack: 4,
  bars: 6,
  lines: 7,
  dots: 5,
};

export function ThumbPattern({
  pattern,
  accent,
}: {
  pattern: PostPattern;
  accent: PostAccent;
}) {
  return (
    <div className="thumb" data-pattern={pattern} data-accent={accent} aria-hidden="true">
      <div className="thumb__art">
        {Array.from({ length: shapeCount[pattern] }, (_, index) => (
          <span key={index} className="thumb__shape" data-index={index} />
        ))}
      </div>
    </div>
  );
}
