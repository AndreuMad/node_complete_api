CREATE TABLE books
(
    id INT NOT NULL IDENTITY PRIMARY KEY,
    title VARCHAR(100) DEFAULT 'No title' NOT NULL,
    author_id INT,
    FOREIGN KEY(author_id) REFERENCES authors(id) ON DELETE SET NULL,
    released_year INT NOT NULL,
    stock_quantity INT,
    pages INT,
    date_added DATETIME NOT NULL DEFAULT (GETDATE())
);

INSERT INTO books
(title, author_id, released_year, stock_quantity, pages)
VALUES
('10% happier', 2014, 29, 256),
('fake_book', 2001, 287, 428),
('Linkoln In The Bardo', 2017, 1000, 367),
('Harry Potter and prisoner of Azkaban', 2001, 287, 222);
