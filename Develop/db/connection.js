// Purpose: This file is used to connect to the database.

const mysql = require('mysql2');

// Info to connect to the database
const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'password',
    database: 'employee_tracker'
});

// Connect to the database
connection.connect(function(err) {
    if (err) throw err;
    console.log('Connection successful!');
});

// Export the connection
module.exports = connection;