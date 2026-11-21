
import { Link } from "react-router-dom";
import { formatDate } from "../utils/format";

export default function PostCard({ post }) {
    const excerpt = post.content
        ? post.content.length > 160
            ? `${post.content.slice(0, 160).trim()}...`
            : post.content
        : "Discover this article on TechBlog.";

    const author = post.author || "Unknown author";

    return (
        <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">

            {/* Decorative article banner */}
            <div className="relative flex h-44 items-end overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-blue-600 p-6">
                <div className="absolute -right-8 -top-12 h-48 w-48 rounded-full border-[24px] border-white/10" />

                <div className="absolute -bottom-16 -left-8 h-40 w-40 rounded-full bg-blue-400/20 blur-2xl" />

                <span className="relative rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-widest text-blue-100 backdrop-blur">
                    TechBlog Article
                </span>

                {post.status === "DRAFT" && (
                    <span className="absolute right-4 top-4 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">
                        Draft
                    </span>
                )}
            </div>

            {/* Article information */}
            <div className="flex flex-1 flex-col p-6">

                {/* Author information */}
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold uppercase text-blue-700">
                        {author.charAt(0)}
                    </div>

                    <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-800">
                            {author}
                        </p>

                        {post.createdAt && (
                            <time
                                dateTime={post.createdAt}
                                className="text-xs text-slate-500"
                            >
                                {formatDate(post.createdAt)}
                            </time>
                        )}
                    </div>
                </div>

                {/* Title */}
                <h2 className="mt-5 text-xl font-extrabold leading-snug tracking-tight text-slate-900 transition group-hover:text-blue-600">
                    {post.title}
                </h2>

                {/* Excerpt */}
                <p className="mt-3 flex-1 text-sm leading-7 text-slate-500">
                    {excerpt}
                </p>

                {/* Read article */}
                <div className="mt-6 border-t border-slate-100 pt-5">
                    <Link
                        to={`/posts/${post.id}`}
                        className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 transition-all duration-200 hover:gap-3"
                    >
                        Read article
                        <span aria-hidden="true">→</span>
                    </Link>
                </div>
            </div>
        </article>
    );
}
