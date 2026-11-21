
import EmptyState from "./EmptyState";
import { canManage, formatDate } from "../utils/format";

export default function CommentList({ comments, currentUser, onDelete }) {
    if (comments.length === 0) {
        return (
            <EmptyState
                title="No comments yet."
                message="Be the first to share your thoughts."
            />
        );
    }

    return (
        <div className="space-y-4">
            {comments.map((comment) => {
                const username = comment.username || "Unknown user";
                const initial = username.charAt(0).toUpperCase();

                return (
                    <article
                        key={comment.id}
                        className="rounded-2xl border border-slate-100 bg-slate-50/70 p-5 transition hover:border-slate-200"
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex min-w-0 items-center gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-extrabold text-blue-700">
                                    {initial}
                                </div>

                                <div className="min-w-0">
                                    <h3 className="truncate text-sm font-bold text-slate-900">
                                        {username}
                                    </h3>

                                    <time className="mt-1 block text-xs text-slate-400">
                                        {formatDate(comment.createdAt)}
                                    </time>
                                </div>
                            </div>

                            {canManage(currentUser, username) && (
                                <button
                                    type="button"
                                    onClick={() => onDelete(comment.id)}
                                    className="inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-red-500 transition duration-200 hover:bg-red-50 hover:text-red-700"
                                >
                                    <svg
                                        className="h-4 w-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M6 7h12m-10 0V5h8v2m-9 0 1 13h8l1-13M10 11v5m4-5v5"
                                        />
                                    </svg>
                                    Delete
                                </button>
                            )}
                        </div>

                        <p className="mt-4 whitespace-pre-line break-words text-sm leading-7 text-slate-700">
                            {comment.text}
                        </p>
                    </article>
                );
            })}
        </div>
    );
}
