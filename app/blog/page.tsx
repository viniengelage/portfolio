import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { CodeBlock } from "../../components/blog/code-block";
import { PostCard } from "../../components/blog/post-card";
import { TagFilter } from "../../components/blog/tag-filter";
import {
  formatPostDate,
  getAllPosts,
  getAllTags,
  getFeaturedPost,
  type ContentNode,
  type Post,
} from "../../lib/posts";

const title = "Blog";
const description =
  "Notas sobre engenharia de produto, design de interface e as decisões que sobrevivem ao deploy.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description, url: "/blog", type: "website" },
};

type CodeNode = Extract<ContentNode, { type: "code" }>;

/** O "thumbnail" do post em destaque é um bloco de código real do próprio post. */
function firstCodeNode(post: Post): CodeNode | undefined {
  return post.content.find((node): node is CodeNode => node.type === "code");
}

/* ------------------------------------------------------------------ */
/* Feed                                                                */
/* ------------------------------------------------------------------ */

/**
 * Síncrono de propósito: serve tanto para o estado filtrado quanto para o
 * fallback estático do Suspense (que é exatamente a listagem sem filtro).
 */
function Feed({ activeTag }: { activeTag?: string }) {
  const posts = getAllPosts();
  const tags = getAllTags();

  const featured = activeTag ? undefined : getFeaturedPost();
  const featuredCode = featured ? firstCodeNode(featured) : undefined;

  const listed = posts
    .filter((post) => (activeTag ? post.tags.includes(activeTag) : true))
    .filter((post) => post.slug !== featured?.slug);

  return (
    <>
      <TagFilter tags={tags} active={activeTag} />

      <div className="blog-list__body" id="posts">
        {/* mantém h1 > h2 > h3 mesmo quando o destaque some por causa do filtro */}
        <h2 className="blog-sr-only">{activeTag ? `Posts sobre ${activeTag}` : "Todos os posts"}</h2>

        {featured ? (
          <article className="feature glass" data-accent={featured.accent}>
            <div className="feature__visual">
              {featuredCode ? (
                <CodeBlock
                  code={featuredCode.code}
                  lang={featuredCode.lang}
                  filename={featuredCode.filename}
                  variant={featuredCode.variant}
                  highlightLines={featuredCode.highlightLines}
                  copyable={false}
                />
              ) : null}
            </div>

            <div className="feature__body">
              <p className="post-meta post-meta--accent">
                <time dateTime={featured.date}>{formatPostDate(featured.date)}</time>
                <span aria-hidden="true">·</span>
                <span>{featured.readingMinutes} min de leitura</span>
              </p>

              <h2 className="feature__title">
                <Link href={`/blog/${featured.slug}`} className="feature__link">
                  {featured.title}
                </Link>
              </h2>

              <p className="feature__lead">{featured.lead}</p>

              <ul className="feature__tags">
                {featured.tags.map((tag) => (
                  <li key={tag} className="chip">
                    {tag}
                  </li>
                ))}
              </ul>

              <span className="link-arrow feature__cta">
                Ler o post <ArrowRight weight="bold" aria-hidden="true" />
              </span>
            </div>
          </article>
        ) : null}

        {listed.length > 0 ? (
          <div className="post-grid">
            {listed.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <p className="blog-empty">
            PLACEHOLDER — Nenhum post com essa tag ainda.{" "}
            <Link href="/blog" className="prose-a">
              Ver tudo
            </Link>
            .
          </p>
        )}
      </div>
    </>
  );
}

/** Única parte dinâmica da rota — por isso vive dentro do `<Suspense>`. */
async function FilteredFeed({ searchParams }: { searchParams: Promise<{ tag?: string | string[] }> }) {
  const params = await searchParams;
  const raw = Array.isArray(params.tag) ? params.tag[0] : params.tag;
  const tags = getAllTags();

  return <Feed activeTag={raw && tags.includes(raw) ? raw : undefined} />;
}

/* ------------------------------------------------------------------ */

export default function BlogIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string | string[] }>;
}) {
  return (
    <>
      <a className="skip-link" href="#posts">
        Pular para os posts
      </a>

      <main className="blog">
        <section className="band blog-hero">
          <div className="shell band__inner">
            <p className="label">Escrita</p>
            <h1 className="blog-hero__title">
              Notas de quem <span className="editorial">constrói</span>
            </h1>
            <p className="blog-hero__lead">
              PLACEHOLDER — Registro do que aprendo construindo produto de verdade: decisões de
              interface, arquitetura que aguenta manutenção e os detalhes que só aparecem depois do
              deploy.
            </p>
          </div>
        </section>

        <section className="band band--raised blog-list" aria-label="Posts">
          <div className="shell band__inner">
            {/* Cache Components: o fallback é a listagem completa estática,
                então a rota pinta na hora e só troca se houver `?tag=`. */}
            <Suspense fallback={<Feed />}>
              <FilteredFeed searchParams={searchParams} />
            </Suspense>
          </div>
        </section>
      </main>
    </>
  );
}
