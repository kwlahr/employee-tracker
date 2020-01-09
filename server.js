const mysql = require("mysql");
const inquirer = require("inquirer");
const mysql2 = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "root",
  database: "employee_tracker"
});

// connection.connect(function(err) {
//   if (err) throw err;
//   start();
// });

var listRoles;
var listDep;
var listEmp;

function query() {
  connection.query("SELECT * from role", function(error, res) {
    listRoles = res.map(role => ({ name: role.title, value: role.id }));
  });
  connection.query("SELECT * from department", function(error, res) {
    listDep = res.map(dep => ({ name: dep.name, value: dep.id }));
  });
  connection.query("SELECT * from employee", function(error, res) {
    // console.log(error, res);
    listEmp = res.map(emp => ({
      name: `${emp.first_name} ${emp.last_name}`,
      value: emp.id
    }));
})};

// Initiate MySQL Connection.
connection.connect(function(err) {
  if (err) {
    console.error("error connecting: " + err.stack);
    return;
  }
  console.log("connected as id " + connection.threadId);
  });

  start();

function start() {
  query();
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "Add departments",
        "View departments",
        "Add roles",
        "View roles",
        "Add employees",
        "View employees",
        "Update employee roles",
        "End"
      ]
    })
    .then(function(res) {
      console.log(res);
      switch (res.action) {
        case "Add departments":
          addDep();
          break;

        case "View departments":
          viewDep();
          break;

        case "Add roles":
          addRole();
          break;

        case "View roles":
          viewRoles();
          break;

        case "Add employees":
          addEmp();
          break;

        case "View employees":
          viewEmp();
          break;

        case "Update employee roles":
          updateEmpRole();
          break;

        case "End":
          end();
          break;
      }
    });
}
//LEFT TO DO: Write functions for switch cases. Consider using helper functions for this. Write joins to connect the 3 tables together by id via
//belongsTo methods. Look at MySQL docs for reference

function addDep(data) {
  inquirer
    .prompt([
      {
        type: "input",
        message: "What is the name of the new department?",
        name: "name"
      }
    ])
    .then(function(res) {
      connection.query("INSERT INTO department SET ?", { 
        name: res.name 
        },
      function (error, res) {
      // console.log(error);
      if (error) throw error;
      });
    })
    .then(function(){
      console.log(`
      -----Department added!-----
      `);
    })
    .then(function() {
      start();
    });
}

function viewDep() {
  console.log("Depertments: \n")
  connection.query("SELECT * FROM department", function (error, res) {
    console.table(res);
    start();
  })
}

function addRole(data) {
  inquirer
    .prompt([
      {
        type: "input",
        message: "What is the name of the new role?",
        name: "name"
      },
      {
        type: "input",
        message: "What is the salary of the new role?",
        name: "salary"
      },
      {
        type: "list",
        message: "In which department is the new role?",
        name: "id",
        choices: listDep
      }
    ])
    .then(function(res) {
      connection.query("INSERT INTO role SET ?", { 
        title: res.name,
        salary: res.salary,
        department_id: res.id
        },
      function (error, res) {
      console.log(error);
      if (error) throw error;
      });
    })
    .then(function(){
      console.log(`
      -----Role added!-----
      `);
    })
    .then(function() {
      start();
    });
}

function viewRoles() {
  console.log("Roles: \n")
  connection.query("SELECT * FROM role", function (error, res) {
    console.table(res);
    start();
  })
}

function addEmp(data) {
  inquirer
    .prompt([
      {
        type: "input",
        message: "What is the employee's first name?",
        name: "firstName"
      },
      {
        type: "input",
        message: "What is the employee's last name?",
        name: "lastName"
      },
      {
        type: "list",
        message: "What is the employee's title?",
        name: "role",
        choices: listRoles
      }
    ])
    .then(function(res) {
      connection.query("INSERT INTO employee SET ?", { 
        first_name: res.firstName,
        last_name: res.lastName,
        role_id: res.role
        },
      function (error, res) {
      // console.log(error);
      if (error) throw error;
      });
    })
    .then(function(){
      console.log(`
      -----Employee added!-----
      `);
    })
    .then(function() {
      start();
    });
}

function viewEmp() {
  console.log("Employees: \n")
  connection.query("SELECT * FROM employee", function (error, res) {
    console.table(res);
    start();
  })
}

function updateEmpRole(data) {
  inquirer
    .prompt([
      {
        type: "list",
        message: "Which employee would you like to update the role of?",
        name: "emp",
        choices: listEmp
      },
      {
        type: "list",
        message: "What is this employees new title?",
        name: "role",
        choices: listRoles
      }
    ])
    .then(function(res) {
      connection.query(`UPDATE employee SET role_id = ${res.role} WHERE id = ${res.emp}`,
      function (error, res) {
      // console.log(error);
      if (error) throw error;
      });
    })
    .then(function(){
      console.log(`
      -----Employee added!-----
      `);
    })
    .then(function() {
      start();
    });
}


function end() {
  console.log("All done!");
  connection.end();
  process.exit();
}
