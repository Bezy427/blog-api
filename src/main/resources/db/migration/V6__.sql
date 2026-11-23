ALTER TABLE blog_db.posts
    MODIFY content LONGTEXT NULL;

ALTER TABLE blog_db.posts
    MODIFY status VARCHAR(255) NULL;

ALTER TABLE blog_db.posts
    MODIFY title VARCHAR(255) NULL;

ALTER TABLE blog_db.posts
    MODIFY updated_at datetime(6) NULL;