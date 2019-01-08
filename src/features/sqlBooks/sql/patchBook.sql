UPDATE books
SET title = ISNULL(@title, title),
    author_id = ISNULL(@author_id, author_id),
    released_year = ISNULL(@released_year, released_year),
    stock_quantity = ISNULL(@stock_quantity, stock_quantity),
    pages = ISNULL(@pages, pages)
WHERE id = @id;
