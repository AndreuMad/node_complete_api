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
WHERE released_year IS NOT NULL
AND author_first_name IS NOT NULL
AND author_last_name IS NOT NULL
AND (@MinReleasedYear IS NULL OR released_year >= @MinReleasedYear)
AND (@MaxReleasedYear IS NULL OR released_year <= @MaxReleasedYear)
AND (@AuthorFirstName IS NULL OR author_first_name = @AuthorFirstName)
AND (@AuthorLastName IS NULL OR author_last_name = @AuthorLastName)
ORDER BY released_year DESC
OFFSET @Skip ROWS
FETCH NEXT @Limit ROWS ONLY;

SELECT
 COUNT(*) AS booksCount,
 COUNT(DISTINCT(CONCAT_WS(' ', author_first_name, author_last_name))) AS authorsCount
 FROM books
 WHERE released_year IS NOT NULL
 AND author_first_name IS NOT NULL
 AND author_last_name IS NOT NULL
 AND (@MinReleasedYear IS NULL OR released_year >= @MinReleasedYear)
 AND (@MaxReleasedYear IS NULL OR released_year <= @MaxReleasedYear)
 AND (@AuthorFirstName IS NULL OR author_first_name = @AuthorFirstName)
 AND (@AuthorLastName IS NULL OR author_last_name = @AuthorLastName);
