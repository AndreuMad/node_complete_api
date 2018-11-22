SELECT released_year,
    COUNT(*) as count
FROM books
GROUP BY released_year;
