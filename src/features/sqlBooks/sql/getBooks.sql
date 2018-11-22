SELECT
    id AS book_id,
    title,
    CONCAT_WS(' ', author_first_name, UPPER(author_last_name)) AS author_name,
    released_year,
    stock_quantity,
    pages
FROM books
ORDER BY released_year DESC
OFFSET @Skip ROWS
FETCH NEXT @Limit ROWS ONLY;

SELECT
 COUNT(*) AS booksCount,
 COUNT(DISTINCT(CONCAT_WS(' ', author_first_name, author_last_name))) AS authorsCount
FROM books;
