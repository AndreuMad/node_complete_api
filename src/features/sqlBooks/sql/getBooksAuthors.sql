SELECT
    CONCAT(author.first_name, ' ', author.last_name) AS author_name,
    COUNT(*) as count,
    MIN(book.released_year) as min_released_year,
    MAX(book.released_year) as max_released_year,
    SUM(book.stock_quantity) as total_stock_quantity,
    AVG(book.pages) as average_pages
FROM books book
LEFT JOIN authors author ON author.id = book.author_id
GROUP BY author.last_name, author.first_name;
