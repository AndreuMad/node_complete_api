CREATE TABLE order_books
(
    id INT NOT NULL IDENTITY PRIMARY KEY,
    order_id INT,
    FOREIGN KEY(order_id) REFERENCES orders(id) ON DELETE CASCADE,
    book_id INT,
    FOREIGN KEY(book_id) REFERENCES books(id) ON DELETE SET NULL,
    amount INT NOT NULL DEFAULT 1,
    price DECIMAL(8, 2)
);

--INSERT INTO order_books (order_id, book_id)
--VALUES ();
