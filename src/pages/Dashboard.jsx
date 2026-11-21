import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Button from "../components/Button";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import EmptyState from "../components/EmptyState";
import { useAuth } from "../context/AuthContext";
import { getPosts } from "../services/api";
import { formatDate } from "../utils/format";

export default function Dashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [reloadKey, setReloadKey] = useState(0);

    useEffect(() => {
        let cancelled = false;

        async function load() {
            try {
                // The API returns published posts plus this user's own drafts.
                const data = await getPosts();
                if (!cancelled) setPosts(data);
            } catch (err) {
                if (!cancelled) setError(err.message || "Failed to load your posts.");
            } finally {
                if (!cancelled) setLoading(false);
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

    async function handleLogout() {
        await logout();
        navigate("/login");
    }

    const myPosts = posts.filter((post) => post.author === user.username);

    return (
        <main className="mx-auto max-w-6xl px-4 py-10">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Dashboard</h1>

                    <p className="mt-2 text-gray-600">Welcome back, {user.username}.</p>
                </div>

                <Button variant="secondary" onClick={handleLogout}>
                    Logout
                </Button>
            </div>

            <div className="mt-8">
                <Link
                    to="/posts/create"
                    className="inline-block rounded-lg bg-black px-5 py-3 font-medium text-white hover:bg-gray-800"
                >
                    Create Post
                </Link>
            </div>

            <section className="mt-10">
                <h2 className="mb-4 text-xl font-semibold text-gray-900">Your posts</h2>

                {loading && <LoadingSpinner message="Loading your posts..." />}
                {!loading && error && <ErrorMessage message={error} onRetry={retry} />}
                {!loading && !error && myPosts.length === 0 && (
                    <EmptyState title="No posts yet" message="Posts you write will show up here." />
                )}
                {!loading && !error && myPosts.length > 0 && (
                    <ul className="divide-y rounded-xl border bg-white">
                        {myPosts.map((post) => (
                            <li key={post.id} className="flex items-center justify-between gap-4 p-4">
                                <div className="min-w-0">
                                    <Link
                                        to={`/posts/${post.id}`}
                                        className="block truncate font-medium text-gray-900 hover:underline"
                                    >
                                        {post.title}
                                    </Link>
                                    <p className="text-sm text-gray-500">{formatDate(post.createdAt)}</p>
                                </div>

                                <div className="flex shrink-0 items-center gap-3">
                                    {post.status === "DRAFT" && (
                                        <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-800">
                                            Draft
                                        </span>
                                    )}
                                    <Link
                                        to={`/posts/${post.id}/edit`}
                                        className="text-sm font-medium text-gray-700 hover:text-black"
                                    >
                                        Edit
                                    </Link>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </main>
    );
}
