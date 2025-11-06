create table users
(
    id       bigint auto_increment
        primary key,
    username varchar(255) not null,
    password varchar(255) not null,
    email    varchar(255) not null,
    role     varchar(255) not null,
    createdAt DateTime not null
);

create table posts
(
    id        bigint auto_increment
        primary key,
    title     varchar(255) not null,
    content   varchar(255) not null,
    createdAt DATETIME     not null,
    updatedAt DATETIME     not null,
    status varchar(255) not null,
    author    varchar(255) not null
);

create table comments
(
    id        bigint auto_increment
        primary key,
    text      TEXT         not null,
    createdAt DATETIME     not null,
    posts      varchar(255) not null,
    user_id   bigint       not null,
    constraint comments_users_id_fk
        foreign key (user_id) references users (id)
);

create table categories
(
    id          bigint auto_increment
        primary key,
    name        varchar(255) not null,
    description varchar(255) not null
);

create table tags
(
    id      bigint auto_increment
        primary key,
    name    varchar(255) not null,
    posts_id bigint       null,
    constraint tags_posts_id_fk
        foreign key (posts_id) references posts (id)
);

create table profiles
(
    id      bigint auto_increment
        primary key,
    users_id bigint       null,
    bio     varchar(255) not null,
    constraint profiles_users_id_fk
        foreign key (users_id) references users (id)
);
