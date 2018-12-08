INSERT INTO books(
    title,
    author_first_name,
    author_last_name,
    released_year,
    stock_quantity,
    pages,
    date_added
)
VALUES (
    @title,
    @author_first_name,
    @author_last_name,
    @released_year,
    @stock_quantity,
    @pages,
    GETDATE()
);
