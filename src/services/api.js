
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

// Requests that never need a token.
const PUBLIC_ENDPOINTS = [
    "/auth/login",
    "/auth/refresh",
    "/auth/logout",
    "/api/users",
];

export class ApiError extends Error {
    constructor(message, status) {
        super(message);
        this.name = "ApiError";
        this.status = status;
    }
}

async function parseResponse(response) {
    if (response.status === 204) return null;

    const contentType = response.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
        return response.json().catch(() => null);
    }

    const text = await response.text();
    return text || null;
}

function errorMessage(data, status) {
    if (typeof data === "string" && data) return data;

    if (data?.fields && Object.keys(data.fields).length > 0) {
        return Object.values(data.fields).join(" ");
    }

    return (
        data?.error ||
        data?.message ||
        `Request failed with status ${status}`
    );
}

function isPublicEndpoint(endpoint) {
    return PUBLIC_ENDPOINTS.includes(endpoint);
}

function expireSession() {
    localStorage.removeItem("token");
    window.dispatchEvent(new Event("auth:expired"));
}

async function doRefresh() {
    let response;

    try {
        response = await fetch(`${API_URL}/auth/refresh`, {
            method: "POST",
            credentials: "include",
        });
    } catch {
        throw new ApiError(
            "Cannot reach the server. Check that the API is running.",
            0
        );
    }

    if (!response.ok) {
        expireSession();

        throw new ApiError(
            "Your session has expired. Please log in again.",
            response.status
        );
    }

    const data = await parseResponse(response);

    if (!data?.accessToken) {
        expireSession();

        throw new ApiError(
            "Your session has expired. Please log in again.",
            401
        );
    }

    localStorage.setItem("token", data.accessToken);
    return data.accessToken;
}

let refreshPromise = null;

function refreshAccessToken() {
    if (!refreshPromise) {
        refreshPromise = doRefresh().finally(() => {
            refreshPromise = null;
        });
    }

    return refreshPromise;
}

export async function request(endpoint, options = {}, retry = true) {
    const publicEndpoint = isPublicEndpoint(endpoint);
    const token = localStorage.getItem("token");

    const headers = { ...options.headers };

    // FormData must NOT have a manually assigned Content-Type.
    // The browser automatically supplies multipart/form-data
    // together with the required boundary.
    const isFormData =
        typeof FormData !== "undefined" &&
        options.body instanceof FormData;

    if (options.body && !isFormData) {
        headers["Content-Type"] = "application/json";
    }

    if (token && !publicEndpoint) {
        headers.Authorization = `Bearer ${token}`;
    }

    let response;

    try {
        response = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers,
            credentials: "include",
        });
    } catch {
        throw new ApiError(
            "Cannot reach the server. Check that the API is running.",
            0
        );
    }

    if (response.status === 401 && retry && token && !publicEndpoint) {
        if (localStorage.getItem("token") === token) {
            await refreshAccessToken();
        }

        return request(endpoint, options, false);
    }

    const data = await parseResponse(response);

    if (!response.ok) {
        throw new ApiError(
            errorMessage(data, response.status),
            response.status
        );
    }

    return data;
}

const json = (body) => JSON.stringify(body);

// ----- Auth -----
export const login = (credentials) =>
    request("/auth/login", {
        method: "POST",
        body: json(credentials),
    });

export const logout = () =>
    request("/auth/logout", { method: "POST" });

export const getCurrentUser = () => request("/auth/me");

export const signup = (user) =>
    request("/api/users", {
        method: "POST",
        body: json(user),
    });

// ----- Posts -----
export const getPosts = () => request("/api/posts");

export const getPost = (id) => request(`/api/posts/${id}`);

export const createPost = (post) =>
    request("/api/posts", {
        method: "POST",
        body: json(post),
    });

export const updatePost = (id, post) =>
    request(`/api/posts/${id}`, {
        method: "PUT",
        body: json(post),
    });

export const deletePost = (id) =>
    request(`/api/posts/${id}`, { method: "DELETE" });

// ----- Comments -----
export const getComments = (postId) =>
    request(`/api/comments?postId=${postId}`);

export const createComment = (postId, text) =>
    request("/api/comments", {
        method: "POST",
        body: json({ postId, text }),
    });

export const deleteComment = (id) =>
    request(`/api/comments/${id}`, { method: "DELETE" });

// ----- Profile -----
export const getMyProfile = () =>
    request("/api/profiles/me");

export const updateMyProfile = (profile) =>
    request("/api/profiles/me", {
        method: "PUT",
        body: json(profile),
    });

export const uploadAvatar = (file) => {
    const formData = new FormData();
    formData.append("file", file);

    return request("/api/profiles/me/avatar", {
        method: "POST",
        body: formData,
    });
};
