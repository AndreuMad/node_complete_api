UPDATE books
SET name = @name,
    age = @age
WHERE id = @id;
