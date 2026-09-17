import Link from "next/link";
import { formatPostDate, type Post } from "../../lib/posts";
import { ThumbPattern } from "./thumb-pattern";

export function PostCard({ post }: { post: Post }) {
  return (
    <article className="post-card" data-accent={post.accent}>
      <ThumbPattern pattern={post.pattern} accent={post.accent} />

      <div className="post-card__body">
        <p className="post-meta">
          <time dateTime={post.date}>{formatPostDate(post.date)}</time>
          <span aria-hidden="true">·</span>
          <span>{post.readingMinutes} min de leitura</span>
        </p>

        <h3 className="post-card__title">
          {/* o link cobre o card inteiro via ::after — o alvo real continua sendo o título */}
          <Link href={`/blog/${post.slug}`} className="post-card__link">
            {post.title}
          </Link>
        </h3>

        <p className="post-card__lead">{post.lead}</p>

        <ul className="post-card__tags">
          {post.tags.map((tag) => (
            <li key={tag} className="chip">
              {tag}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
