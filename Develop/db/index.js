// Purpose: Grab the info from connection.js and use it to connect to the database before starting the app.

const inquirer = require('inquirer');
const connection = require('./connection.js');
const logo = require('asciiart-logo');
const consoleTable = require('console.table');

// Import the queries from the lib folder
const { viewAllDepartments, viewAllRoles, viewAllEmployees, addDepartment, addRole, addEmployee, UpdateEmployeeRole, deleteDepartment, deleteRole, deleteEmployee } = require('../lib/queries.js');

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
                viewAllEmployees(mainMenu);
                break;
            case '+ Add employee':
                addEmployee(mainMenu);
                break;
            case '+ Update employee role':
                UpdateEmployeeRole(mainMenu);
                break;
            case '+ Delete employee':
                deleteEmployee(mainMenu);
                break;
            case '+ View all roles':
                viewAllRoles(mainMenu);
                break;
            case '+ Add role':
                addRole(mainMenu);
                break;
            case '+ Delete role':
                deleteRole(mainMenu);
                break;
            case '+ View all departments':
                viewAllDepartments(mainMenu);
                break;
            case '+ Add department':
                addDepartment(mainMenu);
                break;
            case '+ Delete department':
                deleteDepartment(mainMenu);
                break;
            case '+ Exit':
                connection.end();
                break;
            default:
                console.error('Error: Invalid action');
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
