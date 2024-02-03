const connection = require('../db/connection.js');
const inquirer = require('inquirer');

// Needed functions: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role

//                      ---   VIEW ALL DEPARTMENTS   ---
function viewAllDepartments(callback) {
    connection.query('SELECT * FROM departments', (err, res) => {
        if (err) throw err;
        console.table(res);
        callback();
    });
}

//                      ---   VIEW ALL ROLES   ---
function viewAllRoles(callback) {
    connection.query('SELECT * FROM roles', (err, res) => {
        if (err) throw err;
        console.table(res);
        callback();
    });
}

//                      ---   VIEW ALL EMPLOYEES   ---
function viewAllEmployees(callback) {
    connection.query('SELECT * FROM employees', (err, res) => {
        if (err) throw err;
        console.table(res);
        callback();
    });
}

//                      ---   ADD DEPARTMENT   ---
function addDepartment(callback) {
    inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'Enter the name of the new department:'
        }
    ]).then((answers) => {
        connection.query('INSERT INTO departments SET ?', { name: answers.name }, (err, res) => {
            if (err) throw err;
            console.log('Department added.');
            callback();
        });
    });
}

//                      ---   ADD ROLE   ---
function addRole(callback, employeeId = null) {
    // Fetch existing departments to ensure users select a valid department
    connection.query('SELECT department_id, name FROM departments', (err, departments) => {
        if (err) throw err;

        // Map departments to choices for inquirer input
        const departmentChoices = departments.map(dept => ({
            name: dept.name,
            value: dept.department_id
        }));

        inquirer.prompt([
            {
                type: 'input',
                name: 'title',
                message: "Enter role title:"
            },
            {
                type: 'input',
                name: 'salary',
                message: "Enter role salary:"
            },
            {
                type: 'list', // Use a list to let the user select a department
                name: 'departmentId',
                message: "Select role department:",
                choices: departmentChoices
            }
        ]).then(answers => {
            // Insert the new role with validated department_id
            connection.query('INSERT INTO roles SET ?', {
                title: answers.title,
                salary: answers.salary,
                department_id: answers.departmentId
            }, (err, res) => {
                if (err) throw err;
                console.log('New role added');
                if (employeeId) {
                    // Update employee's role if employeeId was provided
                    const newRoleId = res.insertId;
                    connection.query('UPDATE employees SET role_id = ? WHERE employee_id = ?', [newRoleId, employeeId], (err, res) => {
                        if (err) throw err;
                        console.log(`Employee's role updated to the new role: ${answers.title}`);
                        callback();
                    });
                } else {
                    callback();
                }
            });
        });
    });
}

//                      ---   ADD EMPLOYEE   ---
function addEmployee(callback) {
    connection.query('SELECT role_id, title FROM roles', (err, roles) => {
        if (err) throw err;

        const roleChoices = roles.map(role => ({
            name: role.title,
            value: role.role_id
        }));

        inquirer.prompt([
            {
                type: 'input',
                name: 'firstName',
                message: "Enter employee first name:",
                validate: function(value) {
                    if (value.trim() === '') {
                        return 'This field is required.';
                    }
                    return true;
                }
            },
            {
                type: 'input',
                name: 'lastName',
                message: "Enter employee last name:",
                validate: function(value) {
                    if (value.trim() === '') {
                        return 'This field is required.';
                    }
                    return true;
                }
            },
            {
                type: 'list',
                name: 'roleId',
                message: "Select employee role:",
                choices: roleChoices,
                validate: function(value) {
                    if (value.length < 1) {
                        return 'You must choose at least one role.';
                    }
                    return true;
                }
            },
            {
                type: 'input',
                name: 'managerId',
                message: "Enter employee's manager ID (Leave blank if no manager):",
                validate: function(value) {
                    if (value === '') {
                        return true; // Allow blank for no manager
                    }
                    const pass = value.match(
                        /^[1-9]\d*$/
                    );
                    if (pass) {
                        return true;
                    }
                    return 'Please enter a valid ID (positive integer) or leave blank for no manager.';
                },
                filter: function(value) {
                    // Convert to null if blank
                    return value === '' ? null : value;
                }
            }
        ]).then(answers => {
            if (answers.firstName.trim().toLowerCase() === 'rick') {
                console.log("🎵 Never gonna give you up, never gonna let you down 🎵");
                console.log("🎵 Never gonna run around and desert you 🎵");
            }
            
            connection.query('INSERT INTO employees SET ?', {
                first_name: answers.firstName,
                last_name: answers.lastName,
                role_id: answers.roleId,
                manager_id: answers.managerId
            }, (err, res) => {
                if (err) throw err;
                console.log('Employee added');
                callback();
            });
        });
    });
}

//                      ---   UPDATE EMPLOYEE ROLE   ---
function updateEmployeeRole(callback) {
    inquirer.prompt([
        {
            type: 'input',
            name: 'employeeId',
            message: "Enter employee ID:"
        },
        {
            type: 'input',
            name: 'roleId',
            message: "Enter new role ID (or new role title to create):"
        }
    ]).then(answers => {
        // Check if the role ID exists
        connection.query('SELECT * FROM roles WHERE role_id = ?', [answers.roleId], (err, results) => {
            if (err) throw err;

            if (results.length > 0) {
                // Role exists, update employee
                connection.query('UPDATE employees SET role_id = ? WHERE employee_id = ?', [answers.roleId, answers.employeeId], (err, res) => {
                    if (err) throw err;
                    console.log('Employee role updated');
                    callback();
                });
            } else {
                // Role does not exist, prompt for new role details
                console.log("Role ID does not exist. Let's create a new role.");
                addRole(answers.roleId, callback, answers.employeeId);
            }
        });
    });
}

//                      ---   DELETE DEPARTMENT   ---
function deleteDepartment(callback) {
    inquirer.prompt([
        {
            type: 'input',
            name: 'id',
            message: "Enter department ID to delete"
        }
    ]).then((answers) => {
        connection.query('DELETE FROM departments WHERE id = ?', answers.id, (err, res) => {
            if (err) throw err;
            console.log('Department deleted');
            callback();
        });
    });
}

//                      ---   DELETE ROLE   ---
function deleteRole(callback) {
    inquirer.prompt([
        {
            type: 'input',
            name: 'id',
            message: "Enter role id"
        }
    ]).then((answers) => {
        connection.query('DELETE FROM role WHERE id = ?', answers.id, (err, res) => {
            if (err) throw err;
            console.log('Role deleted');
            callback();
        });
    });
}

//                      ---   DELETE EMPLOYEE   ---
function deleteEmployee(callback) {
    inquirer.prompt([
        {
            type: 'input',
            name: 'employeeId',
            message: "Enter employee ID:",
            validate: function(value) {
                // Ensure the input is not blank and is a number
                const pass = value.match(
                    /^[1-9]\d*$/ // Matches positive integers only
                );
                if (pass) {
                    return true;
                }
                return 'Please enter a valid positive employee ID.';
            }
        }
    ]).then(answers => {
        const { employeeId } = answers;
        connection.query('DELETE FROM employees WHERE employee_id = ?', [employeeId], (err, res) => {
            if (err) throw err;
            console.log(`Employee with ID ${employeeId} deleted successfully.`);
            callback(); // Return to the main menu
        });
    }).catch(error => {
        console.error('An error occurred: ', error);
        callback(); // Ensure callback is called even if there's an error
    });
}

// Export all functions
module.exports = {
    viewAllEmployees,
    viewAllDepartments,
    viewAllRoles,
    addDepartment,
    addRole,
    addEmployee,
    updateEmployeeRole,
    deleteDepartment,
    deleteRole,
    deleteEmployee
};