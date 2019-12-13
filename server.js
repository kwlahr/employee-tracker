const mysql = require("mysql");
const inquirer = require("inquirer");

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "root",
  database: "employee_tracker"
});

connection.connect(function(err) {
  if (err) throw err;
  start();
});

function start() {
  inquirer
    .prompt({
      name: "action",
      type: "rawlist",
      message: "What would you like to do?",
      choices: [
        "Add departments",
        "View departments",
        "Add roles",
        "View roles",
        "Add employees",
        "View employees",
        "Update employee roles"
      ]
    })
    .then(function(res) {
        switch (res.choice) {
            case "Add departments":
            createDep();
            break;

            case "View departments":
            viewDep();
            break;

            case "Add roles":
            createRole();
            break;

            case "View roles":
            viewRoles();
            break;

            case "Add employees":
            createEmp();
            break;

            case "View employees":
            viewEmp();
            break;

            case "Update employee roles":
            updateEmpRole();
            break;
        }
    });
}