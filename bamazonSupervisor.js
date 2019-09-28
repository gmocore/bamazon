const sql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");
const Table = require('cli-table')

// db object with credentials
const connection = sql.createConnection({
  host: "localhost",
  user: "root",
  password: "gerritt",
  database: "bamazon",
  port: 3306
});

// databease conenct
connection.connect(error => {

  if (error) throw error;

  supervisorPrompt();

});

const supervisorPrompt = () => {
  // get user choice
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
      // handle user choice
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


const createDepartment = () => {
  // get input for dept
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
      // add new entry to db
      connection.query(
        `INSERT INTO departments(department, overhead_costs)
        VALUES('${response.dept}', ${response.overhead});`,
        (error, results) => {
          if (error) throw error;
          // display to user
          console.table([
            {
              department: response.dept,
              overhead_cost: response.overhead
            }
          ]);
          // show choices
          supervisorPrompt();
        }
      );
    });
};

const viewSales = () => {
  // query to show sales for all depts
  connection.query(`SELECT d.department, SUM(IFNULL(p.product_sales, 0)) as product_sales, 
  SUM(IFNULL(p.product_sales, 0))  - d.overhead_costs as total_profit 
  FROM products p RIGHT JOIN departments d ON p.department_name = d.department
  GROUP BY d.department_id;`,
  (error, results) => {
    if (error) throw error;

    // display to console
    const table = new Table({
      head: ['Department', 'Total Profit']
  });
  
    results.forEach(item => {
      table.push([item.department, item.total_profit])
    });
    console.log('\n',table.toString())
  })
  // show choices
  supervisorPrompt()
}
