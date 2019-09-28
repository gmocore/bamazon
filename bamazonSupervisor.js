const sql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");
const Table = require('cli-table')

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

const viewSales = () => {
  connection.query(`SELECT d.department, SUM(IFNULL(p.product_sales, 0)) as product_sales, 
  SUM(IFNULL(p.product_sales, 0))  - d.overhead_costs as total_profit 
  FROM products p RIGHT JOIN departments d ON p.department_name = d.department
  GROUP BY d.department_id;`,
  (error, results) => {
    if (error) throw error;

    const table = new Table({
      head: ['Department', 'Total Profit']
  });
  
    results.forEach(item => {
      table.push([item.department, item.total_profit])
    });
    console.log('\n',table.toString())
  })
  supervisorPrompt()
}
