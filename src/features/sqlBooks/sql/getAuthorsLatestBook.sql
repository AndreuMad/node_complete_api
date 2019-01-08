SELECT
 book.id AS id,
 book.title AS book_title,
 book.released_year AS book_released_year,
 book.pages AS book_pages,
 author.id AS author_id,
 author.first_name AS author_first_name,
 author.last_name AS author_last_name
FROM books book
INNER JOIN authors author ON author.id = book.author_id
WHERE book.released_year = (
    SELECT MAX(released_year)
    FROM books
    WHERE author_id = (
        SELECT id
        FROM authors
        WHERE CONCAT_WS(' ', first_name, last_name) = @author
    )
)
AND CONCAT_WS(' ', author.first_name, author.last_name) = @author;
