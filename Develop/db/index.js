// Purpose: Grab the info from connection.js and use it to connect to the database before starting the app.

const inquirer = require('inquirer');
const connection = require('./db/connection');
const logo = require('asciiart-logo');
const consoleTable = require('console.table');


// options: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role

// Import the queries from the lib folder
const { viewAllDepartments, viewAllRoles, viewAllEmployees, addDepartment, addRole, addEmployee, UpdateEmployeeRole, deleteDepartment, deleteRole, deleteEmployee } = require('./lib/queries');

// ASCII Art Logo
console.log(logo({ name: 'Employee Manager' }).render());

// Main menu prompt
function mainMenu() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'What would you like to do?',
            choices: [
                '+ View all employees',
                '+ Add employee',
                '+ Update employee role',
                '+ Delete employee',
                '---',
                '+ View all roles',
                '+ Add role',
                '+ Delete role',
                '---',
                '+ View all departments',
                '+ Add department',
                '+ Delete department',
                '---',
                '+ Exit'
            ]
        }
    ]).then((answers) => {
        switch (answers.action) {
            case '+ View all employees':
                viewAllEmployees();
                break;
            case '+ Add employee':
                addEmployee();
                break;
            case '+ Update employee role':
                UpdateEmployeeRole();
                break;
            case '+ Delete employee':
                deleteEmployee();
                break;
            case '+ View all roles':
                viewAllRoles();
                break;
            case '+ Add role':
                addRole();
                break;
            case '+ Delete role':
                deleteRole();
                break;
            case '+ View all departments':
                viewAllDepartments();
                break;
            case '+ Add department':
                addDepartment();
                break;
            case '+ Delete department':
                deleteDepartment();
                break;
            case '+ Exit':
                connection.end();
                break;
        }
    }).catch((error) => {
        console.error('Error: ' + error);
    });
}

// Connect to the database
connection.connect((err) => {
    if (err) {
        console.error(`Error connecting to the MySQL server: ${err.stack}`);
        return;
    }
    console.log(`Connected to the MySQL server. Starting the application...`);
    mainMenu();  // Once connected, start the application
});