SELECT
    id AS book_id,
    title,
    CONCAT_WS(' ', author_first_name, UPPER(author_last_name)) AS author_name,
    released_year,
    stock_quantity,
    pages
FROM books;
