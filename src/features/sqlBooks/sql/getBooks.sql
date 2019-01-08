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
WHERE (@MinReleasedYear IS NULL OR book.released_year >= @MinReleasedYear)
AND (@MaxReleasedYear IS NULL OR book.released_year <= @MaxReleasedYear)
AND (@AuthorFirstName IS NULL OR author.first_name = @AuthorFirstName)
AND (@AuthorLastName IS NULL OR author.last_name = @AuthorLastName)
ORDER BY book.released_year DESC
OFFSET @Skip ROWS
FETCH NEXT @Limit ROWS ONLY;

SELECT
 COUNT(*) AS books_count,
 COUNT(DISTINCT(CONCAT_WS(' ', author.first_name, author.last_name))) AS authors_count
 FROM books book
 LEFT JOIN authors author ON author.id = book.author_id
 WHERE (@MinReleasedYear IS NULL OR book.released_year >= @MinReleasedYear)
 AND (@MaxReleasedYear IS NULL OR book.released_year <= @MaxReleasedYear)
 AND (@AuthorFirstName IS NULL OR author.first_name = @AuthorFirstName)
 AND (@AuthorLastName IS NULL OR author.last_name = @AuthorLastName);
