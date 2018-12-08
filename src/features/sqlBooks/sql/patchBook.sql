UPDATE books
SET title = ISNULL(@title, title),
    author_first_name = ISNULL(@author_first_name, author_first_name),
    author_last_name = ISNULL(@author_last_name, author_last_name),
    released_year = ISNULL(@released_year, released_year),
    stock_quantity = ISNULL(@stock_quantity, stock_quantity),
    pages = ISNULL(@pages, pages)
WHERE id = @id;
