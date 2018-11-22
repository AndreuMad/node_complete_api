SELECT TOP(10)
    id AS bookId,
    title,
    CONCAT(author_first_name, ' ', author_last_name) AS author_name,
    released_year,
    stock_quantity,
    pages
FROM books
WHERE title LIKE '%' + @SearchQuery + '%';
