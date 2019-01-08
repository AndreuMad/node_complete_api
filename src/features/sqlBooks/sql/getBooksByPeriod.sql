SELECT
    book.id AS book_id,
    book.title AS title,
    CONCAT_WS(' ', author.first_name, UPPER(author.last_name)) AS author_name,
    book.released_year AS released_year,
    book.stock_quantity AS stock_quantity,
    book.pages AS pages,
    CASE
        WHEN book.released_year >= 2000 THEN 20
        ELSE 19
    END AS century,
    book.date_added AS date_added
FROM books book
LEFT JOIN authors author ON author.id = book.author_id
WHERE book.date_added >= (
 CASE @Period
   WHEN 'hour' THEN DATEADD(HOUR, -1, GETDATE())
   WHEN 'day' THEN DATEADD(DAY, -1, GETDATE())
   WHEN 'week' THEN DATEADD(WEEK, -1, GETDATE())
   WHEN 'month' THEN DATEADD(MONTH, -1, GETDATE())
   WHEN 'year' THEN DATEADD(YEAR, -1, GETDATE())
 END
)
ORDER BY book.released_year DESC
OFFSET @Skip ROWS
FETCH NEXT @Limit ROWS ONLY;

SELECT
 COUNT(*) AS books_count,
 COUNT(DISTINCT(CONCAT_WS(' ', author.first_name, author.last_name))) AS authors_count
 FROM books book
 LEFT JOIN authors author ON author.id = book.author_id
 WHERE book.date_added >= (
 CASE @Period
   WHEN 'hour' THEN DATEADD(HOUR, -1, GETDATE())
   WHEN 'day' THEN DATEADD(DAY, -1, GETDATE())
   WHEN 'week' THEN DATEADD(WEEK, -1, GETDATE())
   WHEN 'month' THEN DATEADD(MONTH, -1, GETDATE())
   WHEN 'year' THEN DATEADD(YEAR, -1, GETDATE())
 END
);
