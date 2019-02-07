CREATE TABLE [sql_instagram_users]
(
    id INT IDENTITY PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    created_at DATETIME DEFAULT (GETDATE())
)

INSERT INTO [sql_instagram_users]
(username)
VALUES
('BlueTheCat'),
('CharlieBrown'),
('ColtSteele');
