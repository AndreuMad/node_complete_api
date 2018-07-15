UPDATE cats
SET name = @name,
    age = @age
WHERE id = @id;
