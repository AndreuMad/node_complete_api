SELECT
    id AS book_id,
    title,
    CONCAT_WS(' ', author_first_name, UPPER(author_last_name)) AS author_name,
    released_year,
    stock_quantity,
    pages,
    CASE
        WHEN released_year >= 2000 THEN 20
        ELSE 19
    END AS century,
    date_added
FROM books
WHERE date_added >= (
 CASE @Period
   WHEN 'hour' THEN DATEADD(HOUR, -1, GETDATE())
   WHEN 'day' THEN DATEADD(DAY, -1, GETDATE())
   WHEN 'week' THEN DATEADD(WEEK, -1, GETDATE())
   WHEN 'month' THEN DATEADD(MONTH, -1, GETDATE())
   WHEN 'year' THEN DATEADD(YEAR, -1, GETDATE())
 END
)
ORDER BY released_year DESC
OFFSET @Skip ROWS
FETCH NEXT @Limit ROWS ONLY;

SELECT
 COUNT(*) AS booksCount,
 COUNT(DISTINCT(CONCAT_WS(' ', author_first_name, author_last_name))) AS authorsCount
 FROM books
 WHERE date_added >= (
 CASE @Period
   WHEN 'hour' THEN DATEADD(HOUR, -1, GETDATE())
   WHEN 'day' THEN DATEADD(DAY, -1, GETDATE())
   WHEN 'week' THEN DATEADD(WEEK, -1, GETDATE())
   WHEN 'month' THEN DATEADD(MONTH, -1, GETDATE())
   WHEN 'year' THEN DATEADD(YEAR, -1, GETDATE())
 END
);
