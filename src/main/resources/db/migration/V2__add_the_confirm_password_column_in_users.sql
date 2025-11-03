CREATE TABLE blog_db.users
(
    id               BIGINT AUTO_INCREMENT NOT NULL,
    username         VARCHAR(255)          NULL,
    password         VARCHAR(255)          NULL,
    confirm_password VARCHAR(255)          NULL,
    email            VARCHAR(255)          NULL,
    `role`           VARCHAR(255)          NULL,
    created_at       datetime              NULL,
    CONSTRAINT pk_users PRIMARY KEY (id)
);