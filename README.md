# TechBlog (my-blog)

React frontend for the Blog API. Built with React, Vite, React Router and Tailwind CSS.

## Features

- Read posts and comments without logging in
- Sign up, log in and log out. The session is restored when the page reloads
- Create, edit and delete your own posts, as a draft or published
- Comment on posts and delete your own comments
- A dashboard that lists your posts

## Getting started

You need Node.js 20 or newer and the [Blog API](../blog-api-master) running on port 8080.

```
npm install
cp .env.example .env        # Windows PowerShell: Copy-Item .env.example .env
npm run dev
```

Open http://localhost:5173.

`.env` holds one setting:

```
VITE_API_URL=http://localhost:8080
```

No trailing slash and no semicolon. The API must list the address of this app in its `CORS_ORIGINS`
(`http://localhost:5173` is allowed by default).

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Check the code with ESLint |

## How login works

1. `POST /auth/login` returns an access token. It is kept in `localStorage` and sent as `Authorization: Bearer ...`.
2. The API also sets an httpOnly refresh cookie. When the access token expires (after 20 minutes) the app calls
   `POST /auth/refresh` and repeats the failed request. If the refresh fails, the user is logged out.
3. `GET /auth/me` loads the current user, so the app knows the username and role.

Requests use `credentials: "include"` so the browser sends the refresh cookie.

## Project layout

```
src/
  services/api.js        all API calls, token refresh and error messages
  context/AuthContext    logged-in user, login and logout
  utils/                 validation rules and date helpers
  components/            Navbar, PostCard, CommentList, form inputs ...
  pages/                 Home, Posts, PostDetails, CreatePost, EditPost, Login, Register, Dashboard
```
