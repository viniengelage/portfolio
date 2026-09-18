import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeftIcon, ArrowRightIcon } from "@phosphor-icons/react/dist/ssr";

import { ShareLinks } from "../../../components/blog/share-links";
import { TableOfContents } from "../../../components/blog/table-of-contents";
import {
  AUTHOR,
  formatPostDate,
  getAdjacentPosts,
  getAllPosts,
  getPostBySlug,
  SITE_URL,
} from "../../../lib/posts";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Post não encontrado" };

  return {
    title: post.title,
    description: post.lead,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.lead,
      url: `/blog/${post.slug}`,
      type: "article",
      publishedTime: post.date,
      authors: [AUTHOR.name],
      tags: post.tags,
    },
    twitter: { card: "summary_large_image", title: post.title, description: post.lead },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const { previous, next } = getAdjacentPosts(post.slug);
  const PostContent = post.Content;
  const url = `${SITE_URL}/blog/${post.slug}`;
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.lead,
    datePublished: post.date,
    url,
    inLanguage: "pt-BR",
    author: {
      "@type": "Person",
      name: AUTHOR.name,
      url: SITE_URL,
    },
    publisher: {
      "@type": "Person",
      name: AUTHOR.name,
      url: SITE_URL,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    keywords: post.tags.join(", "),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
      />
      <a className="skip-link" href="#post-body">
        Pular para o conteúdo
      </a>

      <main className="blog post">
        <header className="post-header">
          <div className="shell">
            <Link href="/blog" className="post-back">
              <ArrowLeftIcon weight="bold" aria-hidden="true" /> Voltar para o blog
            </Link>

            <p className="post-meta post-meta--accent">
              <time dateTime={post.date}>{formatPostDate(post.date)}</time>
              <span aria-hidden="true">·</span>
              <span>{post.readingMinutes} min de leitura</span>
              <span aria-hidden="true">·</span>
              <span>{post.wordCount} palavras</span>
            </p>

            <h1 className="post-title">{post.title}</h1>
            <p className="post-lead">{post.lead}</p>

            <div className="post-byline">
              <div className="post-author">
                <Image
                  className="avatar post-author__avatar"
                  src="/profile.png"
                  alt={AUTHOR.name}
                  width={40}
                  height={40}
                />
                <span className="post-author__text">
                  <span className="post-author__name">{AUTHOR.name}</span>
                  <span className="post-author__role">{AUTHOR.role}</span>
                </span>
              </div>

              <ul className="post-tags">
                {post.tags.map((tag) => (
                  <li key={tag} className="chip">
                    {tag}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </header>

        <div className="shell post-layout">
          <aside className="post-aside">
            <TableOfContents headings={post.headings} />
          </aside>

          <article className="post-body" id="post-body">
            <PostContent />

            <footer className="post-footer">
              <div className="post-footer__row">
                <ul className="post-tags">
                  {post.tags.map((tag) => (
                    <li key={tag} className="chip">
                      {tag}
                    </li>
                  ))}
                </ul>
                <ShareLinks url={url} title={post.title} />
              </div>

              <div className="author-box glass">
                <Image
                  className="avatar author-box__avatar"
                  src="/profile.png"
                  alt={AUTHOR.name}
                  width={56}
                  height={56}
                />
                <div className="author-box__text">
                  <p className="author-box__name">{AUTHOR.name}</p>
                  <p className="author-box__bio">{AUTHOR.bio}</p>
                  <p className="author-box__links">
                    {AUTHOR.links.map((link) => (
                      <a
                        key={link.label}
                        className="prose-a"
                        href={link.href}
                        target="_blank"
                        rel="noreferrer noopener"
                      >
                        {link.label}
                      </a>
                    ))}
                  </p>
                </div>
              </div>

              <nav className="post-nav" aria-label="Outros posts">
                {previous ? (
                  <Link href={`/blog/${previous.slug}`} className="post-nav__card" data-direction="previous">
                    <span className="post-nav__label">
                      <ArrowLeftIcon weight="bold" aria-hidden="true" /> Anterior
                    </span>
                    <span className="post-nav__title">{previous.title}</span>
                  </Link>
                ) : (
                  <span className="post-nav__spacer" aria-hidden="true" />
                )}

                {next ? (
                  <Link href={`/blog/${next.slug}`} className="post-nav__card" data-direction="next">
                    <span className="post-nav__label">
                      Próximo <ArrowRightIcon weight="bold" aria-hidden="true" />
                    </span>
                    <span className="post-nav__title">{next.title}</span>
                  </Link>
                ) : null}
              </nav>
            </footer>
          </article>
        </div>
      </main>
    </>
  );
}
