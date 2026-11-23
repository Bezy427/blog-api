// These rules match the API, so errors show up before the request is sent.

export function validateEmail(email) {
    if (!email) return "Email is required";
    if (!/^\S+@\S+\.\S+$/.test(email)) return "Enter a valid email address";
    return "";
}

export function validateUsername(username) {
    if (!username) return "Username is required";
    if (username.length < 3 || username.length > 50) return "Username must be 3 to 50 characters";
    if (!/^[\w-]+$/.test(username)) return "Use only letters, digits, underscores and hyphens";
    return "";
}

export function validatePassword(password) {
    if (!password) return "Password is required";
    if (password.length < 8) return "Password must be at least 8 characters";
    if (password.length > 72) return "Password must be at most 72 characters";
    return "";
}
