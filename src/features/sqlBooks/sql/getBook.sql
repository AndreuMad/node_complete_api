SELECT
    book.id AS book_id,
    book.title AS title,
    CONCAT(author.first_name, ' ', author.last_name) AS author_name,
    book.released_year AS released_year,
    book.stock_quantity AS stock_quantity,
    book.pages AS pages
FROM books book
LEFT JOIN authors author ON author.id = book.author_id
WHERE book.id = @id;
