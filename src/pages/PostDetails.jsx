
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import CommentForm from "../components/CommentForm";
import CommentList from "../components/CommentList";
import ConfirmDialog from "../components/ConfirmDialog";

import {
    createComment,
    deleteComment,
    deletePost,
    getComments,
    getPost,
} from "../services/api";

import { useAuth } from "../context/AuthContext";
import { canManage, formatDate } from "../utils/format";

export default function PostDetails() {
    const { id } = useParams();

    return <PostDetailsContent key={id} id={id} />;
}

function PostDetailsContent({ id }) {
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();

    // Post and comment state
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);

    // Loading and error state
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [actionError, setActionError] = useState("");

    // Delete confirmation state
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);

    // Reload state
    const [reloadKey, setReloadKey] = useState(0);

    // Fetch post and comments
    useEffect(() => {
        let cancelled = false;

        async function load() {
            try {
                const [postData, commentData] = await Promise.all([
                    getPost(id),
                    getComments(id),
                ]);

                if (!cancelled) {
                    setPost(postData);
                    setComments(commentData);
                    setError("");
                }
            } catch (err) {
                if (!cancelled) {
                    setError(
                        err.status === 404
                            ? "This article does not exist."
                            : err.message || "Unable to load this article."
                    );
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        load();

        return () => {
            cancelled = true;
        };
    }, [id, reloadKey]);

    // Retry loading
    function retry() {
        setLoading(true);
        setError("");
        setReloadKey((key) => key + 1);
    }

    // Open post delete confirmation
    function handleDeletePost() {
        setActionError("");

        setDeleteTarget({
            type: "post",
            id: post.id,
        });
    }

    // Open comment delete confirmation
    function handleDeleteComment(commentId) {
        setActionError("");

        setDeleteTarget({
            type: "comment",
            id: commentId,
        });
    }

    // Confirm deletion
    async function confirmDelete() {
        if (!deleteTarget || deleting) return;

        setDeleting(true);
        setActionError("");

        try {
            if (deleteTarget.type === "post") {
                await deletePost(deleteTarget.id);
                navigate("/posts");
                return;
            }

            if (deleteTarget.type === "comment") {
                await deleteComment(deleteTarget.id);

                setComments((previous) =>
                    previous.filter(
                        (comment) => comment.id !== deleteTarget.id
                    )
                );

                setDeleteTarget(null);
            }
        } catch (err) {
            setActionError(
                err.message || "Could not complete the deletion."
            );

            setDeleteTarget(null);
        } finally {
            setDeleting(false);
        }
    }

    // Add comment
    async function handleAddComment(text) {
        const created = await createComment(post.id, text);

        setComments((previous) => [...previous, created]);
    }

    // Loading screen
    if (loading) {
        return <LoadingSpinner message="Loading article..." />;
    }

    // Error screen
    if (error) {
        return <ErrorMessage message={error} onRetry={retry} />;
    }

    const canEdit = canManage(user, post.author);

    return (
        <main className="min-h-screen bg-[#f8f9fc] px-4 py-8 sm:px-6 sm:py-12">
            <div className="mx-auto max-w-5xl">

                {/* Back navigation */}
                <Link
                    to="/posts"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-blue-600"
                >
                    <span aria-hidden="true">←</span>
                    All articles
                </Link>

                {/* Article */}
                <article className="mt-7 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

                    {/* Article header */}
                    <header className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-blue-700 px-6 py-12 text-white sm:px-12 sm:py-16">
                        <div className="absolute -right-16 -top-20 h-72 w-72 rounded-full border-[40px] border-white/5" />

                        <div className="absolute -bottom-24 -left-12 h-64 w-64 rounded-full bg-blue-400/20 blur-3xl" />

                        <div className="relative">
                            <div className="flex flex-wrap items-center gap-3">
                                <span className="rounded-full border border-blue-200/30 bg-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-blue-100">
                                    TechBlog
                                </span>

                                {post.status === "DRAFT" && (
                                    <span className="rounded-full bg-amber-100 px-3 py-1.5 text-xs font-bold text-amber-800">
                                        Draft
                                    </span>
                                )}
                            </div>

                            <h1 className="mt-7 max-w-4xl break-words text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                                {post.title}
                            </h1>

                            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-blue-100">
                                <span>
                                    By{" "}
                                    <strong className="text-white">
                                        {post.author || "TechBlog Author"}
                                    </strong>
                                </span>

                                {post.createdAt && (
                                    <time dateTime={post.createdAt}>
                                        {formatDate(post.createdAt)}
                                    </time>
                                )}
                            </div>
                        </div>
                    </header>

                    {/* Article content */}
                    <div className="px-6 py-9 sm:px-12 sm:py-12">
                        <div className="mx-auto max-w-3xl">
                            <div className="whitespace-pre-line break-words text-base leading-8 text-slate-700 sm:text-lg sm:leading-9">
                                {post.content}
                            </div>
                        </div>
                    </div>
                </article>

                {/* Article actions */}
                {canEdit && (
                    <div className="mt-6 flex flex-wrap items-center gap-3">
                        <Link
                            to={`/posts/${post.id}/edit`}
                            className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:border-blue-300 hover:text-blue-600"
                        >
                            Edit article
                        </Link>

                        <button
                            type="button"
                            onClick={handleDeletePost}
                            disabled={deleting}
                            className="rounded-xl border border-red-200 bg-white px-5 py-3 text-sm font-bold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Delete article
                        </button>
                    </div>
                )}

                {/* Action error */}
                {actionError && (
                    <p
                        role="alert"
                        className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
                    >
                        {actionError}
                    </p>
                )}

                {/* Comments section */}
                <section className="mt-12 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:mt-16 sm:p-10">

                    {/* Comments heading */}
                    <div className="flex flex-wrap items-end justify-between gap-3 border-b border-slate-100 pb-6">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">
                                Community
                            </p>

                            <h2 className="mt-2 text-2xl font-extrabold text-slate-900 sm:text-3xl">
                                Join the discussion
                            </h2>
                        </div>

                        <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-600">
                            {comments.length}{" "}
                            {comments.length === 1 ? "comment" : "comments"}
                        </span>
                    </div>

                    {/* Comment form */}
                    <div className="mt-7">
                        {isAuthenticated ? (
                            <CommentForm onAddComment={handleAddComment} />
                        ) : (
                            <div className="rounded-2xl bg-slate-50 p-5">
                                <p className="text-sm leading-7 text-slate-600">
                                    Want to share your thoughts?{" "}
                                    <Link
                                        to="/login"
                                        className="font-bold text-blue-600 hover:underline"
                                    >
                                        Log in
                                    </Link>{" "}
                                    to join the discussion.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Comment list */}
                    <div className="mt-9">
                        <CommentList
                            comments={comments}
                            currentUser={user}
                            onDelete={handleDeleteComment}
                        />
                    </div>
                </section>

                {/* Explore more articles */}
                <div className="py-10 text-center">
                    <Link
                        to="/posts"
                        className="text-sm font-bold text-blue-600 transition hover:text-blue-800"
                    >
                        ← Explore more articles
                    </Link>
                </div>
            </div>

            {/* Reusable delete confirmation dialog */}
            <ConfirmDialog
                isOpen={!!deleteTarget}
                title={
                    deleteTarget?.type === "post"
                        ? "Delete this article?"
                        : "Delete this comment?"
                }
                message={
                    deleteTarget?.type === "post"
                        ? "This article will be permanently deleted. This action cannot be undone."
                        : "This comment will be permanently deleted. This action cannot be undone."
                }
                onCancel={() => setDeleteTarget(null)}
                onConfirm={confirmDelete}
                loading={deleting}
            />
        </main>
    );
}
