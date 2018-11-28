SELECT *
FROM books
WHERE released_year = (
    SELECT MAX(released_year)
    FROM books
)
AND CONCAT_WS(' ', author_first_name, author_last_name) = @author;
