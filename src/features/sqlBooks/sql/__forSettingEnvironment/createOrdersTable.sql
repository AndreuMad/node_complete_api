CREATE TABLE orders
(
    id INT NOT NULL IDENTITY PRIMARY KEY,
    order_date DATETIME NOT NULL,
    customer_id INT,
    FOREIGN KEY(customer_id) REFERENCES customers(id) ON DELETE CASCADE
);

--INSERT INTO orders (order_date, customer_id)
--VALUES ('2016/02/10', 1),
--       ('2017/01/11', 1),
--       ('2018/01/29', 2),
--       ('2017/12/12', 5);
