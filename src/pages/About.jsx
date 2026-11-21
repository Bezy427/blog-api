export default function About() {
    return (
        <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
            <div className="rounded-2xl border bg-white p-6 shadow-sm sm:p-10">
                <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                    About Blog API
                </h1>

                <p className="mt-6 text-gray-600 leading-7">
                    Blog API is a full-stack blogging application build with
                    Spring Boot and React. It allows users to create, read,
                    update, and delete blog posts through a RESTful API.
                </p>

                <p className="mt-4 text-gray-600 leading-7">
                    The application uses Spring Security and JWT-based
                    authentication to protect user accounts and enforce
                    ownership-based authorization.
                </p>

                <h2 className="mt-10 text-2xl font-semibold text-gray-900">
                    Technology
                </h2>

                <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                    <li className="rounded-lg bg-gray-500 p-4">Java & Spring Boot</li>
                    <li className="rounded-lg bg-gray-500 p-4">Spring Security & JWT</li>
                    <li className="rounded-lg bg-gray-500 p-4">MySQL</li>
                    <li className="rounded-lg bg-gray-500 p-4">React</li>
                    <li className="rounded-lg bg-gray-500 p-4">React Router</li>
                    <li className="rounded-lg bg-gray-500 p-4">Tailwind CSS</li>
                </ul>
            </div>
        </main>
    )
}