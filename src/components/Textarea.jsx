
export default function Textarea({
    id,
    label,
    name,
    value,
    onChange,
    placeholder,
    error,
    required = false,
    rows = 10,
}) {
    const textareaId = id || name;

    return (
        <div>
            {label && (
                <label
                    htmlFor={textareaId}
                    className="mb-2 block text-sm font-bold text-slate-800"
                >
                    {label}
                    {required && <span className="ml-1 text-red-500">*</span>}
                </label>
            )}

            <textarea
                id={textareaId}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                rows={rows}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? `${textareaId}-error` : undefined}
                className={`w-full resize-y rounded-xl border bg-slate-50 px-4 py-4 text-sm leading-7 text-slate-800 outline-none transition placeholder:text-slate-400 focus:bg-white focus:ring-4 ${
                    error
                        ? "border-red-400 focus:border-red-400 focus:ring-red-50"
                        : "border-slate-200 focus:border-blue-400 focus:ring-blue-50"
                }`}
            />

            {error && (
                <p
                    id={`${textareaId}-error`}
                    className="mt-2 text-sm text-red-600"
                >
                    {error}
                </p>
            )}
        </div>
    );
}
