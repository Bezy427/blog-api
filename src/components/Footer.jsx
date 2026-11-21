import { Link } from "react-router-dom";

export default function Footer() {
    return (
        <footer className="mx-auto bg-gray-50">
            <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <Link
                            to="/"
                            className="text-lg font-bold text-gray-900 hover:text-blue-700"
                        >
                            TechBlog
                        </Link>

                        <p className="mt-1 text-sm text-gray-500">
                            A full-stack blogging application.
                        </p>
                    </div>

                    <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                        <Link
                            to="/"
                            className="text-gray-600 hover:text-gray-900"
                        >
                            Home
                        </Link>
                        
                        <Link
                            to="/posts"
                            className="text-gray-600 hover:text-gray-900"
                        >
                            Posts
                        </Link>
                        
                        <Link
                            to="/about"
                            className="text-gray-600 hover:text-gray-900"
                        >
                            About
                        </Link>
                    </nav>
                </div>

                <div className="mt-6 border-t pt-6 text-center text-sm text-gray-500">
                    © {new Date().getFullYear()} TechBlog. All rights reserved.
                </div>
            </div>
        </footer>
    )
}