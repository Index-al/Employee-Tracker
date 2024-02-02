-- Make sure using the correct database
USE employee_tracker;

-- Insert data into roles table
INSERT INTO roles (title, salary, department_id) VALUES 
('Delivery Associate', 42000.00, (SELECT department_id FROM departments WHERE name = 'Delivery' LIMIT 1)),
('Construction Worker', 68000.00, (SELECT department_id FROM departments WHERE name = 'Manual Labor' LIMIT 1)),
('Sales Manager', 70000.00, (SELECT department_id FROM departments WHERE name = 'Sales' LIMIT 1)),
('Banker', 50000.00, (SELECT department_id FROM departments WHERE name = 'Finance' LIMIT 1)),
('Sales Associate', 40000.00, (SELECT department_id FROM departments WHERE name = 'Sales' LIMIT 1));

-- Seed data into employees table
INSERT INTO employees (first_name, last_name, role_id) VALUES
('Michael', 'Stevens', (SELECT role_id FROM roles WHERE title = 'Delivery Associate' LIMIT 1)),
('Sam', 'Anderson', (SELECT role_id FROM roles WHERE title = 'Construction Worker' LIMIT 1)),
('Julie', 'Jackson', (SELECT role_id FROM roles WHERE title = 'Sales Manager' LIMIT 1)),
('Edgar', 'Pine', (SELECT role_id FROM roles WHERE title = 'Banker' LIMIT 1)),
('Vicky', 'Hatter', (SELECT role_id FROM roles WHERE title = 'Sales Associate' LIMIT 1));

-- Commit the transaction so the inserted employees can be used in the subquery
COMMIT;

-- Update the manager_id now that all employees exist in the table
UPDATE employees SET manager_id = (
  SELECT employee_id FROM (SELECT * FROM employees WHERE first_name = 'Julie' AND last_name = 'Jackson' LIMIT 1) AS e 
) WHERE first_name = 'Vicky' AND last_name = 'Hatter';

-- Commit the transaction so the updated manager_id can be used in the subquery
COMMIT;