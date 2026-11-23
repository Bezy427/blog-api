import { useNavigate, useLocation, Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Input from "../components/Input";
import Button from "../components/Button";
import { login as loginRequest } from "../services/api";
import { validateEmail } from "../utils/validation";

export default function Login() {
    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [apiError, setApiError] = useState("");

    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();

    function handleChange(event) {
        const { name, value } = event.target;

        setForm((previous) => ({ ...previous, [name]: value }));
        setErrors((previous) => ({ ...previous, [name]: "" }));
        setApiError("");
    }

    function validateForm() {
        const newErrors = {};

        const emailError = validateEmail(form.email.trim());
        if (emailError) newErrors.email = emailError;

        // No length rule here: people with an older, shorter password must still be able to log in.
        if (!form.password) newErrors.password = "Password is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    async function handleSubmit(event) {
        event.preventDefault();

        if (!validateForm()) return;

        setLoading(true);
        setApiError("");

        try {
            const data = await loginRequest({
                email: form.email.trim(),
                password: form.password,
            });

            if (!data?.accessToken) {
                throw new Error("The server did not return an access token.");
            }

            await login(data.accessToken);
            navigate("/dashboard");
        } catch (error) {
            setApiError(error.message || "Unable to sign in.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="min-h-[70vh] px-4 py-8 sm:py-12">
            <div className="mx-auto max-w-md rounded-xl border bg-white p-5 shadow-sm sm:p-8">
                <h1 className="text-3xl font-bold">Welcome back</h1>

                <p className="mt-2 text-gray-600">Sign in to your account.</p>

                {location.state?.registered && (
                    <div role="status" className="mt-6 rounded-lg bg-green-50 p-3 text-sm text-green-700">
                        Account created. You can sign in now.
                    </div>
                )}

                {apiError && (
                    <div
                        role="alert"
                        className="mt-6 rounded-lg bg-red-50 p-3 text-sm text-red-600"
                    >
                        {apiError}
                    </div>
                )}

                <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-5">
                    <div>
                        <label htmlFor="email" className="mb-2 block text-sm font-medium">
                            Email
                        </label>

                        <Input
                            id="email"
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            required
                            placeholder="you@gmail.com"
                            error={errors.email}
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="mb-2 block text-sm font-medium">
                            Password
                        </label>

                        <Input
                            id="password"
                            name="password"
                            type="password"
                            value={form.password}
                            onChange={handleChange}
                            required
                            placeholder="Enter your password"
                            error={errors.password}
                        />
                    </div>

                    <Button
                        type="submit"
                        disabled={loading}
                        className="mx-auto block w-fit"
                    >
                        {loading ? "Signing in..." : "Sign in"}
                    </Button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-600">
                    Don't have an account?{" "}
                    <Link to="/register" className="font-medium text-black underline">
                        Create account
                    </Link>
                </p>
            </div>
        </main>
    );
}
