<<<<<<< HEAD
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
=======
# Blog API

A RESTful API for managing a blog system. Provides endpoints to create, read, update, and delete blog posts, as well as manage users and comments.

---

## Features

- User authentication (signup/login)
- CRUD operations for blog posts
- Commenting on posts
- RESTful API design
- JSON responses
- Error handling and validation

---

## Technologies

- **Backend:** Spring Boot
- **Database:** MySQL
- **Authentication:** Spring Security, JWT
- **Build Tool:** Maven
- **Version Control:** Git & GitHub

---

## Installation

1. **Clone the repository**
```bash
git clone https://github.com/Bezy427/blog-api.git
cd blog-api
```

2. **Configure environment variables**
Create a `.env` file in the project root with:
```
JWT_SECRET=your_secret_key
```

3. **Run the API**
```bash
mvn spring-boot:run
```

## API Endpoints

| Method | Endpoint             | Description                       |
|--------|--------------------|-----------------------------------|
| GET    | `/posts`            | Get all blog posts                 |
| GET    | `/posts/:id`        | Get a single post by ID            |
| POST   | `/posts`            | Create a new blog post             |
| PUT    | `/posts/:id`        | Update a blog post                 |
| DELETE | `/posts/:id`        | Delete a blog post                 |
| POST   | `/auth/signup`      | Register a new user                |
| POST   | `/auth/login`       | Login and get JWT token            |

*(Add more endpoints as needed)*

## Contributing

1. Fork the repository  
2. Create a branch: `git checkout -b feature-name`  
3. Make your changes  
4. Commit: `git commit -m "Add feature"`  
5. Push: `git push origin feature-name`  
6. Create a Pull Request

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
>>>>>>> 5b686c46b31ddc245e42ad76545453213fffbebf
