CREATE TABLE orders
(
    id INT NOT NULL IDENTITY PRIMARY KEY,
    order_date DATETIME NOT NULL,
    amount INT NOT NULL,
    price DECIMAL(8, 2),
    customer_id INT,
    FOREIGN KEY(customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    book_id INT,
    FOREIGN KEY(book_id) REFERENCES books(id) ON DELETE SET NULL
);

--INSERT INTO orders (order_date, amount, price, customer_id, book_id)
--VALUES ('2016/02/10', 2, 90.99, 1, 1),
--       ('2017/01/11', 1, 19.99, 1, 1),
--       ('2018/01/29', 3, 200, 2, 2),
--       ('2017/12/12', 1, 100.99, 3, 5);
