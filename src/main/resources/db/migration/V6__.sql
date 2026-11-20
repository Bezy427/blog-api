CREATE TABLE post_tags
(
    post_id BIGINT NOT NULL,
    tag_id  BIGINT NOT NULL,
    CONSTRAINT pk_post_tags PRIMARY KEY (post_id, tag_id)
);

ALTER TABLE blog_db.posts
    MODIFY content LONGTEXT NULL;

ALTER TABLE blog_db.posts
    MODIFY status VARCHAR(255) NULL;

ALTER TABLE blog_db.posts
    MODIFY title VARCHAR(255) NULL;

ALTER TABLE blog_db.posts
    MODIFY updated_at datetime(6) NULL;