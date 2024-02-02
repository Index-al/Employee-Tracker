// Purpose: Grab the info from connection.js and use it to connect to the database. Then, start the application.

const inquirer = require('inquirer');
const connection = require('./db/connection');
const logo = require('asciiart-logo');
const consoleTable = require('console.table');

// ASCII Art Logo
console.log(logo({ name: 'Employee Manager' }).render());

// Function to start the app
function startApp() {
    inquirer.prompt([
        // Your inquirer prompt configuration here
    ]).then((answers) => {
        // Logic based on answers to interact with the database and display results
    }).catch((error) => {
        console.error(error);
    });
}

// Connect to the database and start the application
connection.connect((err) => {
    if (err) throw err;
    console.log(`Connected to the MySQL server.`);
    startApp();  // Once connected, start the application
});