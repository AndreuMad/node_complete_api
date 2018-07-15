INSERT INTO books(
    title,
    author_first_name,
    author_last_name,
    released_year,
    stock_quantity,
    pages
)
VALUES (
    @title,
    @author_first_name,
    @author_last_name,
    @released_year,
    @stock_quantity,
    @pages
);
