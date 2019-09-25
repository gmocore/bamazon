DROP DATABASE IF EXISTS bamazon;
CREATE database bamazon;

USE bamazon;

CREATE TABLE products (
  id INT NOT NULL AUTO_INCREMENT, 
  product_name VARCHAR(50) NOT NULL,
  department_name VARCHAR(50) NOT NULL,
  price DEC(10,3) NOT NULL,
  stock_quantity INT(10) NOT NULL,
  PRIMARY KEY(id)
);

INSERT INTO products(product_name, department_name, price, stock_quantity)
	VALUES('Left Mittens', 'Unuseful Items', 5.00, 25), 
    ('Blank VHS Tape', 'Unuseful Items', 12.00, 200 ),
    ('Spinach', 'Produce', 1.00, 100), ('Batteries', 'Misc Items', 3.00, 70), 
    ('Frostbite', 'Ailments', 70.00, 5),
    ('Aaron Hernandez Jersey', 'Sports', 1.00, 750),
    ('Mana', 'Sorcery', 50.00, 75),
    ('Deaths Breath', 'Sorcery', 45.00, 1000),
    ('Deflated Footballs', 'Sports', 200.00, 5)
;

CREATE TABLE departments (
  department_id INT NOT NULL AUTO_INCREMENT,
  department VARCHAR(50) NOT NULL,
  overhead_costs INT(10) NOT NULL,
  PRIMARY KEY(department_id)
);

INSERT INTO departments(department, overhead_costs)
	VALUES 
    ('Unuseful Items', 5000),
    ('Produce', 10000),
    ('Ailments', 500), 
    ('Sports', 15000),
    ('Sorcery', 12000);

SELECT * FROM products;

