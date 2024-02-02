-- Make sure using the correct database
USE employee_tracker;

-- Insert data into departments table
INSERT INTO departments (name) VALUES ('Delivery'), ('Manual Labor'), ('Sales'), ('Finance');

-- Insert data into roles table with department_id as a foreign key
INSERT INTO roles (title, salary, department_id) VALUES 
('Delivery Associate', 42000.00, (SELECT department_id FROM departments WHERE name = 'Delivery')),
('Construction Worker', 68000.00, (SELECT department_id FROM departments WHERE name = 'Manual Labor')),
('Sales Manager', 70000.00, (SELECT department_id FROM departments WHERE name = 'Sales'));
('Banker', 50000.00, (SELECT department_id FROM departments WHERE name = 'Finance')),
('Sales Associate', 40000.00, (SELECT department_id FROM departments WHERE name = 'Sales'));

-- Seed data into employees table with role_id and manager_id as foreign keys
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES
('Michael', 'Stevens', (SELECT role_id FROM roles WHERE titles = 'Delivery Associate'), NULL),
('Sam', 'Anderson', (SELECT role_id FROM roles WHERE titles = 'Construction Worker'), NULL),
('Julie', 'Jackson', (SELECT role_id FROM roles WHERE titles = 'Sales Manager'), (SELECT employee_id FROM employees WHERE first_name = 'Sam' AND last_name = 'Anderson')),
('Edgar', 'Pine', (SELECT role_id FROM roles WHERE titles = 'Banker'), (SELECT employee_id FROM employees WHERE first_name = 'Julie' AND last_name = 'Jackson')),
('Vicky', 'Hatter', (SELECT role_id FROM roles WHERE titles = 'Sales Associate'), (SELECT employee_id FROM employees WHERE first_name = 'Julie' AND last_name = 'Jackson'));