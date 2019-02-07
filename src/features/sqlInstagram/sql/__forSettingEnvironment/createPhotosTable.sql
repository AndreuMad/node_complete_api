CREATE TABLE [sql_instagram_photos]
(
    id INT IDENTITY PRIMARY KEY,
    image_url VARCHAR(255) NOT NULL,
    user_id INT NOT NULL,
    FOREIGN KEY(user_id) REFERENCES sql_instagram_users(id) ON DELETE SET NULL,
    created_at DATETIME DEFAULT (GETDATE())
)

INSERT INTO sql_instagram_photos
(
    image_url,
    user_id
)
VALUES
('/dsdsf', 1),
('/hnhn', 2),
('/cxvcxv', 3)
