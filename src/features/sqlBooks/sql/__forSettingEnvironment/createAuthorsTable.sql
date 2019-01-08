CREATE TABLE authors
(
    id INT NOT NULL IDENTITY PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL
);

INSERT INTO authors (first_name, last_name)
VALUES
('Dan', 'Harris'),
('Freida', 'Harris'),
('George', 'Saunders'),
('Joan', 'Rouling');
