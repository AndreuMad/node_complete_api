CREATE TABLE customers
(
    id INT NOT NULL IDENTITY PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL
);

--INSERT INTO customers (first_name, last_name, email)
--VALUES ('Andrii', 'Kit', 'meow@gmail.com'),
--       ('Kit', 'Vasyl', 'vkit@gmail.com'),
--       ('Kot', 'Zhuz', 'kzhuz@gmail.com'),
--       ('Ivan', 'Ivanov', 'i_ivanov@gmail.com');
