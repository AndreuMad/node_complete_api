SELECT
    CONCAT(author_first_name, ' ', author_last_name) AS author_name,
    COUNT(*) as count,
    MIN(released_year) as min_released_year,
    MAX(released_year) as max_released_year,
    SUM(stock_quantity) as total_stock_quantity,
    AVG(pages) as average_pages
FROM books
GROUP BY author_last_name,  author_first_name;
