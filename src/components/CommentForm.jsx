
import { useState } from "react";

export default function CommentForm({ onAddComment }) {
    const [content, setContent] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(event) {
        event.preventDefault();

        const text = content.trim();
        if (!text || submitting) return;

        setSubmitting(true);
        setError("");

        try {
            await onAddComment(text);
            setContent("");
        } catch (err) {
            setError(err.message || "Could not post your comment.");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="mb-8">
            <label
                htmlFor="comment"
                className="mb-3 block text-sm font-bold text-slate-900"
            >
                Write a comment
            </label>

            <textarea
                id="comment"
                value={content}
                onChange={(event) => setContent(event.target.value)}
                rows={4}
                maxLength={2000}
                placeholder="Share your thoughts about this article..."
                className="w-full resize-y rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm leading-7 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50"
            />

            <div className="mt-2 flex items-center justify-between gap-3">
                <span className="text-xs text-slate-400">
                    {content.length}/2000 characters
                </span>

                <button
                    type="submit"
                    disabled={submitting || !content.trim()}
                    className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {submitting ? "Posting..." : "Post comment →"}
                </button>
            </div>

            {error && (
                <p role="alert" className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                    {error}
                </p>
            )}
        </form>
    );
}
