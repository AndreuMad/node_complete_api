SELECT
    order_item.id AS id,
    order_item.order_date AS order_date,
    customer.id AS customer_id,
    customer.first_name AS customer_first_name,
    customer.last_name AS customer_last_name,
    customer.email AS customer_email,
    (
        SELECT
            order_book.amount AS amount
        FROM order_books order_book
        INNER JOIN books book ON book.id = order_book.book_id
        INNER JOIN authors author ON author.id = book.author_id
        WHERE order_book.order_id = order_item.id
    ) AS books
FROM orders AS order_item
INNER JOIN customers customer ON customer.id = order_item.customer_id;
