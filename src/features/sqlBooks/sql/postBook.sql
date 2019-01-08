INSERT INTO books(
    title,
    author_id,
    released_year,
    stock_quantity,
    pages,
    date_added
)
VALUES (
    @title,
    @author_id,
    @released_year,
    @stock_quantity,
    @pages,
    GETDATE()
);
