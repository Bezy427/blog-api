alter table posts
    change createdAt created_at datetime not null;

alter table posts
    change updatedAt updated_at datetime not null;

