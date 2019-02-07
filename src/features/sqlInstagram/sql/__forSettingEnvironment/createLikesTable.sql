CREATE TABLE [sql_instagram_likes]
(
    user_id INT,
    FOREIGN KEY(user_id) REFERENCES sql_instagram_users(id) ON DELETE SET NULL,
    photo_id INT,
    FOREIGN KEY(photo_id) REFERENCES sql_instagram_photos(id) ON DELETE CASCADE,
    created_at DATETIME DEFAULT (GETDATE())
    PRIMARY KEY(user_id, photo_id)
);

INSERT INTO [sql_instagram_likes]
(
    user_id,
    photo_id
)
VALUES
(1, 1),
(2, 2),
(3, 3);
