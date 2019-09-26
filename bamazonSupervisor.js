const sql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");

const connection = sql.createConnection({
  host: "localhost",
  user: "root",
  password: "gerritt",
  database: "bamazon",
  port: 3306
});

connection.connect(error => {
  if (error) throw error;
  supervisorPrompt();
});

const supervisorPrompt = () => {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "make a selection to continue",
      choices: [
        "view product sales by department",
        "create new department",
        "exit"
      ]
    })
    .then(answer => {
      switch (answer.action) {
        case "view product sales by department":
          viewSales();
          break;
        case "create new department":
          createDepartment();
          break;
        case "exit":
          connection.end();
          break;
      }
    });
};

const viewSales = () => {
  connection.query("the query", (error, results) => {
    if (error) throw error;
    console.log(results);
  });
};

const createDepartment = () => {
  inquirer
    .prompt([
      {
        name: "dept",
        message: "Enter name of new department",
        type: "input"
      },
      {
        name: "overhead",
        message: "enter the overhead cost of the department",
        type: "number"
      }
    ])
    .then(response => {
      console.log(response);
      connection.query(
        `INSERT INTO departments(department, overhead_costs)
        VALUES('${response.dept}', ${response.overhead});`,
        (error, results) => {
          if (error) throw error;
          console.table([
            {
              department: response.dept,
              overhead_cost: response.overhead
            }
          ]);
          supervisorPrompt();
        }
      );
    });
};
