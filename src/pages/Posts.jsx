
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PostCard from "../components/PostCard";
import { getPosts } from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import EmptyState from "../components/EmptyState";

export default function Posts() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [reloadKey, setReloadKey] = useState(0);

    useEffect(() => {
        let cancelled = false;

        async function load() {
            try {
                const data = await getPosts();

                if (!cancelled) {
                    setPosts(data);
                }
            } catch (err) {
                if (!cancelled) {
                    setError(err.message || "Failed to load posts.");
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
    }, [reloadKey]);

    function retry() {
        setLoading(true);
        setError("");
        setReloadKey((key) => key + 1);
    }

    if (loading) {
        return <LoadingSpinner message="Loading posts..." />;
    }

    if (error) {
        return <ErrorMessage message={error} onRetry={retry} />;
    }

    return (
        <main className="min-h-screen bg-slate-50">
            <div className="mx-auto max-w-[1600px] px-4 py-10 sm:px-6 lg:px-8">

                <div className="mb-10 flex flex-col gap-5 border-b border-slate-200 pb-8 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <span className="text-sm font-bold uppercase tracking-widest text-blue-600">
                            Explore TechBlog
                        </span>

                        <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-slate-900">
                            Latest Articles
                        </h1>

                        <p className="mt-3 max-w-xl text-base leading-7 text-slate-500">
                            Discover insights, tutorials and ideas from the
                            TechBlog community.
                        </p>

                        {!loading && posts.length > 0 && (
                            <p className="mt-3 text-sm font-medium text-slate-400">
                                {posts.length} {posts.length === 1 ? "article" : "articles"}
                            </p>
                        )}
                    </div>

                    <Link
                        to="/posts/create"
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md"
                    >
                        <span className="text-lg">+</span>
                        Create Post
                    </Link>
                </div>

                {/* Articles grid */}
                {posts.length === 0 ? (
                    <EmptyState
                        title="No posts yet"
                        message="Be the first to create a blog post."
                    />
                ) : (
                    <div className="grid grid-cols-1 items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {posts.map((post) => (
                            <PostCard key={post.id} post={post} />
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
