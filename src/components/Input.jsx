
export default function Input({
    id,
    label,
    name,
    type = "text",
    value,
    onChange,
    placeholder,
    error,
    required = false,
}) {
    const inputId = id || name;

    return (
        <div>
            {label && (
                <label
                    htmlFor={inputId}
                    className="mb-2 block text-sm font-bold text-slate-800"
                >
                    {label}
                    {required && <span className="ml-1 text-red-500">*</span>}
                </label>
            )}

            <input
                id={inputId}
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? `${inputId}-error` : undefined}
                className={`w-full rounded-xl border bg-slate-50 px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:bg-white focus:ring-4 ${
                    error
                        ? "border-red-400 focus:border-red-400 focus:ring-red-50"
                        : "border-slate-200 focus:border-blue-400 focus:ring-blue-50"
                }`}
            />

            {error && (
                <p
                    id={`${inputId}-error`}
                    className="mt-2 text-sm text-red-600"
                >
                    {error}
                </p>
            )}
        </div>
    );
}
