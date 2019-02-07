CREATE TABLE [sql_instagram_comments]
(
    id INT IDENTITY PRIMARY KEY,
    comment_text VARCHAR(255) NOT NULL,
    user_id INT,
    FOREIGN KEY(user_id) REFERENCES sql_instagram_users(id) ON DELETE SET NULL,
    photo_id INT,
    FOREIGN KEY(photo_id) REFERENCES sql_instagram_photos(id) ON DELETE SET NULL,
    created_at DATETIME DEFAULT (GETDATE())
)

INSERT INTO [sql_instagram_comments]
(
    comment_text,
    user_id,
    photo_id
)
VALUES
('dsfdsf', 1, 1),
('ertretert', 2, 2),
('xczxcxc', 3, 3)
