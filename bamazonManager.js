const sql = require("mysql");
const inquirer = require("inquirer");

const connection = sql.createConnection({
  host: "localhost",
  user: "root",
  password: "gerritt",
  database: "bamazon",
  port: 3306
});

//db connection here
connection.connect(error => {
  if (error) throw error;
  managerPrompt();
});

const managerPrompt = () => {
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
            addNewItem()
          break;

        case "exit":
          connection.end();
          break;
      }
    });
};

const viewProducts = () => {
  let query = `SELECT id, product_name, price, stock_quantity FROM products;`;

  connection.query(query, (error, results) => {
    if (error) throw error;
    results.forEach(item => {
      console.log(`
            ID: ${item.id},
            Product: ${item.product_name},
            $${item.price}
            Quantity: ${item.stock_quantity}`);
    });
    managerPrompt();
  });
};

const lowInventory = () => {
  connection.query(`SELECT * FROM products WHERE stock_quantity < 5;`, function(
    error,
    results
  ) {
    // error will be an Error if one occurred during the query
    if (error) throw error;
    results.forEach(item => {
      console.log(`
              ID: ${item.id},
              Product: ${item.product_name},
              $${item.price}
              Quantity: ${item.stock_quantity}`);
    });
    managerPrompt();
  });
};

const addNewItem = () => {
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
          name: 'price',
          message: 'what is the price of the product?',
          type: 'number'
      },
      {
          name: 'units',
          message: 'how many units would you like to add?',
          type: 'number'
      }
    ])
    .then(product => {
      console.log(product);
      connection.query(
        `INSERT INTO products(product_name, department_name, price, stock_quantity)
	VALUES('${product.item}', '${product.dept}', ${product.price}, ${product.units});`,
        function(error, results) {
          // error will be an Error if one occurred during the query
          if (error) throw error;
          managerPrompt();
        }
      );
    });
};

const addInventory = () => {
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
      console.log(product);
      connection.query(
        `UPDATE products SET stock_quantity = stock_quantity + ${product.units} WHERE id = ${product.id};`,
        function(error, results) {
          // error will be an Error if one occurred during the query
          if (error) throw error;
          managerPrompt();
        }
      );
    });
};
