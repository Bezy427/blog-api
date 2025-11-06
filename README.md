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
DB_HOST=your_database_host
DB_USER=your_database_user
DB_PASSWORD=your_database_password
JWT_SECRET=your_secret_key
PORT=3000
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
