const sql = require("mysql");
const inquirer = require("inquirer");
const Table = require("cli-table");

// db connection object with credentials
const connection = sql.createConnection({
  host: "localhost",
  user: "root",
  password: "gerritt",
  database: "bamazon",
  port: 3306
});

//db connection
connection.connect(error => {
  if (error) throw error;
  managerPrompt();
});

const managerPrompt = () => {
  // get user choice
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "make a selection to continue",
      choices: [
        "view products for sale",
        "view low inventory",
        "add to inventory",
        "add new item",
        "exit"
      ]
    })
    .then(answer => {
      // route user choice to corresponding fucntion
      switch (answer.action) {
        case "view products for sale":
          viewProducts();
          break;
        case "view low inventory":
          lowInventory();
          break;
        case "add to inventory":
          addInventory();
          break;
        case "add new item":
          addNewItem();
          break;

        case "exit":
          connection.end();
          break;
      }
    });
};

const viewProducts = () => {
  // view all products from db
  let query = `SELECT id, product_name, price, stock_quantity FROM products;`;

  connection.query(query, (error, results) => {
    if (error) throw error;
    const table = new Table({
      head: ["ID", "Product", "Price", "Quantity"]
    });
    results.forEach(item => {
      table.push([item.id, item.product_name, item.price, item.stock_quantity]);
    });
    console.log(table.toString());
    // when completed, show user choices
    managerPrompt();
  });
};

const lowInventory = () => {
  // query db for low items (<5)
  connection.query(`SELECT * FROM products WHERE stock_quantity < 5;`, function(
    error,
    results
  ) {
    if (error) throw error;
    const table = new Table({
      head: ["ID", "Product", "Price", "Quantity"]
    });

    // display low items to user
    results.forEach(item => {
  
      table.push([item.id, item.product_name, item.price, item.stock_quantity]);
    });
    console.log(table.toString());

    // when complete, show user choices
    managerPrompt();
  });
};

const addNewItem = () => {
  // get inout for new item
  inquirer
    .prompt([
      {
        name: "item",
        type: "input",
        message: "new product name?"
      },
      {
        name: "dept",
        message: "what is the product department?",
        type: "input"
      },
      {
        name: "price",
        message: "what is the price of the product?",
        type: "number"
      },
      {
        name: "units",
        message: "how many units would you like to add?",
        type: "number"
      }
    ])
    .then(product => {
      // display item added to user
      console.log(
        `added ${product.units} of ${product.item} to ${product.dept} at $${product.price}`
      );

      // add item to db
      connection.query(
        `INSERT INTO products(product_name, department_name, price, stock_quantity)
	VALUES('${product.item}', '${product.dept}', ${product.price}, ${product.units});`,
        function(error, results) {
          // error will be an Error if one occurred during the query
          if (error) throw error;

          // send to choices
          managerPrompt();
        }
      );
    });
};

const addInventory = () => {
  // get input to add to stock
  inquirer
    .prompt([
      {
        name: "units",
        type: "number",
        message: "how many units would you like to add, mr manager?"
      },
      {
        name: "id",
        message: "what is the product id?",
        type: "number"
      }
    ])
    .then(product => {
      // display amount added
      console.log(`added ${product.units} units of prodcut id ${product.id}`);

      // update db with amount to corresponding id
      connection.query(
        `UPDATE products SET stock_quantity = stock_quantity + ${product.units} WHERE id = ${product.id};`,
        function(error, results) {
          // error will be an Error if one occurred during the query
          if (error) throw error;

          // show choices
          managerPrompt();
        }
      );
    });
};
