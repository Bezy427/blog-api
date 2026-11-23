
import { Link } from "react-router-dom";

const topics = [
    {
        number: "01",
        title: "Software Development",
        description: "Programming, software design and building better applications.",
        icon: "⌘",
    },
    {
        number: "02",
        title: "Technology",
        description: "Discover new tools, trends and ideas shaping the tech world.",
        icon: "◈",
    },
    {
        number: "03",
        title: "Tutorials & Guides",
        description: "Practical guides and lessons from real development experiences.",
        icon: "⌁",
    },
];

export default function Home() {
    return (
        <main className="min-h-screen bg-[#f8f9fc] text-slate-900">

            {/* Hero section */}
            <section className="mx-auto max-w-7xl px-5 pb-16 pt-12 sm:px-8 sm:pt-20">
                <div className="grid items-center gap-12 overflow-hidden rounded-3xl bg-[#111827] p-7 text-white shadow-xl sm:p-12 lg:grid-cols-2 lg:p-16">

                    <div>
                        <span className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-blue-300">
                            <span className="h-2 w-2 rounded-full bg-blue-400" />
                            Ideas. Technology. Innovation.
                        </span>

                        <h1 className="mt-8 max-w-xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                            Explore ideas.
                            <span className="block text-blue-400">
                                Build knowledge.
                            </span>
                        </h1>

                        <p className="mt-6 max-w-lg text-base leading-8 text-slate-300 sm:text-lg">
                            Welcome to TechBlog — a place for thoughts,
                            tutorials, technology insights and lessons from
                            the world of software development.
                        </p>

                        <div className="mt-9 flex flex-wrap gap-4">
                            <Link
                                to="/posts"
                                className="rounded-xl bg-blue-500 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-blue-400"
                            >
                                Explore articles →
                            </Link>

                            <Link
                                to="/register"
                                className="rounded-xl border border-white/25 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
                            >
                                Join the community
                            </Link>
                        </div>

                        <p className="mt-8 text-sm text-slate-400">
                            Learn something new. Share what you know.
                        </p>
                    </div>

                    <div className="relative">
                        <div className="absolute -inset-4 rounded-3xl bg-blue-500/20 blur-2xl" />
                        <img
                            src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=85"
                            alt="Technology and software development workspace"
                            className="relative h-72 w-full rounded-2xl object-cover shadow-2xl sm:h-96"
                        />
                        <div className="absolute -bottom-5 left-5 rounded-xl border border-white/10 bg-slate-900/90 px-5 py-4 shadow-xl backdrop-blur">
                            <p className="text-xs font-medium uppercase tracking-widest text-blue-300">
                                The TechBlog experience
                            </p>
                            <p className="mt-1 text-sm font-semibold text-white">
                                Ideas that move you forward.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Topics section */}
            <section className="mx-auto max-w-7xl px-5 pb-20 sm:px-8">
                <div className="mb-9 flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">
                            Explore
                        </p>
                        <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
                            What interests you?
                        </h2>
                        <p className="mt-3 max-w-xl text-slate-500">
                            Explore different areas of technology, development
                            and practical learning.
                        </p>
                    </div>

                    <Link
                        to="/posts"
                        className="text-sm font-bold text-blue-600 transition hover:text-blue-800"
                    >
                        Browse all articles →
                    </Link>
                </div>

                <div className="grid gap-5 md:grid-cols-3">
                    {topics.map((topic) => (
                        <Link
                            key={topic.number}
                            to="/posts"
                            className="group rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl"
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-3xl font-bold text-blue-600">
                                    {topic.icon}
                                </span>
                                <span className="text-sm font-semibold text-slate-300">
                                    {topic.number}
                                </span>
                            </div>

                            <h3 className="mt-8 text-xl font-bold transition group-hover:text-blue-600">
                                {topic.title}
                            </h3>

                            <p className="mt-3 text-sm leading-7 text-slate-500">
                                {topic.description}
                            </p>

                            <p className="mt-6 text-sm font-bold text-blue-600">
                                Explore articles →
                            </p>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Call to action */}
            <section className="border-t border-slate-200 bg-white">
                <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-5 py-14 sm:px-8 md:flex-row md:items-center">
                    <div>
                        <h2 className="text-2xl font-extrabold sm:text-3xl">
                            Have something worth sharing?
                        </h2>
                        <p className="mt-3 text-slate-500">
                            Join TechBlog and share your ideas with others.
                        </p>
                    </div>

                    <Link
                        to="/register"
                        className="rounded-xl bg-slate-900 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-blue-600"
                    >
                        Create an account →
                    </Link>
                </div>
            </section>
        </main>
    );
}
