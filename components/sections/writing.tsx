import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { formatPostDate, getAllPosts } from "../../lib/posts";
import { Reveal } from "../reveal";

export function Writing() {
  const posts = getAllPosts().slice(0, 3);

  return (
    <section className="band writing" id="blog">
      {/* a escrita antes de existir */}
      <span className="writing__pilcrow editorial" aria-hidden="true">
        ¶
      </span>
      <div className="writing__ghost" aria-hidden="true">
        {[100, 84, 92, 56].map((width, index) => (
          <span key={width} style={{ "--w": `${width}%`, "--i": index } as React.CSSProperties} />
        ))}
      </div>

      <div className="shell band__inner">
        <Reveal className="section-head">
          <div className="section-head__title">
            <p className="label">Escrita</p>
            <h2>Notas de quem constrói</h2>
          </div>
          <div className="section-head__aside">
            <p>
              Comecei a escrever sobre o que aprendo construindo produto — decisões de arquitetura,
              detalhes de interface e os erros que custaram caro.
            </p>
          </div>
        </Reveal>

        <ul className="writing__list">
          {posts.map((post, index) => (
            <Reveal key={post.slug} as="li" delay={index * 60}>
              <Link href={`/blog/${post.slug}`} className="writing__post">
                <span className="writing__date mono">{formatPostDate(post.date)}</span>
                <span className="writing__title">{post.title}</span>
                <span className="writing__read mono">{post.readingMinutes} min</span>
              </Link>
            </Reveal>
          ))}
        </ul>

        <Reveal delay={200}>
          <Link href="/blog" className="link-arrow writing__all">
            Ver todos os posts
            <ArrowRight weight="bold" aria-hidden="true" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
