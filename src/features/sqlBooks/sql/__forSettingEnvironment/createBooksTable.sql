CREATE TABLE books
(
    id INT NOT NULL IDENTITY PRIMARY KEY,
    title VARCHAR(100) DEFAULT 'No title' NOT NULL,
    author_first_name VARCHAR(100) NOT NULL,
    author_last_name VARCHAR(100) NOT NULL,
    released_year INT NOT NULL,
    stock_quantity INT,
    pages INT,
    date_added DATETIME NOT NULL DEFAULT (GETDATE())
);
