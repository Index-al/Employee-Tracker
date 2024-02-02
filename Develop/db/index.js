// Purpose: Grab the info from connection.js and use it to connect to the database before starting the app.

const inquirer = require('inquirer');
const connection = require('./db/connection');
const logo = require('asciiart-logo');
const consoleTable = require('console.table');

// Import the queries from the lib folder
const { viewAllEmployees, addEmployee, UpdateEmployeeRole, viewAllRoles, addRole, viewAllDepartments, addDepartment, viewEmployeesByDepartment, viewEmployeesByManager, updateEmployeeManager, deleteEmployee, deleteRole, deleteDepartment, viewDepartmentBudget } = require('./lib/queries');

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
                'View all employees',
                'Add employee',
                'Update employee role',
                'Delete employee',
                '---',
                'View all roles',
                'Add role',
                'View all departments',
                'Add department',
                'View all employees by department',
                'View all employees by manager',
                'Update employee manager',
                'Delete role',
                'Delete department',
                'View department budget',
                'Exit'
            ]
        }
    ]).then((answers) => {
        switch (answers.action) {
            case 'View all employees':
                viewAllEmployees();
                break;
            case 'Add employee':
                addEmployee();
                break;
            case 'Update employee role':
                UpdateEmployeeRole();
                break;
            case 'Delete employee':
                deleteEmployee();
                break;
            case 'View all roles':
                viewAllRoles();
                break;
            case 'Add role':
                addRole();
                break;
            case 'View all departments':
                viewAllDepartments();
                break;
            case 'Add department':
                addDepartment();
                break;
            case 'View all employees by department':
                viewEmployeesByDepartment();
                break;
            case 'View all employees by manager':
                viewEmployeesByManager();
                break;
            case 'Update employee manager':
                updateEmployeeManager();
                break;
            case 'Delete role':
                deleteRole();
                break;
            case 'Delete department':
                deleteDepartment();
                break;
            case 'View department budget':
                viewDepartmentBudget();
                break;
            case 'Exit':
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