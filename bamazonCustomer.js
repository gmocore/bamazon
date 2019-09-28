const inquirer = require("inquirer");
const sql = require("mysql");
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
  promptUser();
});

function promptUser(){
  inquirer.prompt({
    name: "action",
    type: "list",
    message: "make a selection to continue",
    choices: [
      'display all items',
      'purchase an item (by id)',
      'exit'
    ]
  }).then(answer => {
    switch (answer.action) {
      case 'display all items':
        displayItems()
        promptUser();
        break;
      case 'purchase an item (by id)':
        getProductId()
        break;
      case 'exit':
        connection.end()
        break;
    }
  })
}

function displayItems() {
  let query = `SELECT id, product_name, price FROM products;`;

  connection.query(query, (error, results) => {
    if (error) throw error;

    const table = new Table({
      head: ['ID', 'Product', 'Price']
  });
    results.forEach(item => {
      table.push([item.id, item.product_name, `$${item.price}`])
    });
    console.log('\n', table.toString())
  });
}

function getProductId() {
  inquirer
    .prompt({
        type: "number",
        name: "id",
        message: "Enter the ID of the product you want to buy"
      })
    .then(idData => {
      let query = `SELECT id, product_name, price FROM products WHERE ?;`;

      connection.query(query, { id: idData.id }, (error, results) => {
        if (error) throw error;
        console.log(`
        ID: ${results[0].id} 
        Product: ${results[0].product_name} 
        Price: ${results[0].price}
        `);
      });
      getUnitAmount(idData.id);
    });
}

function getUnitAmount(id) {
  inquirer
    .prompt([
      {
        type: "number",
        name: "units",
        message: "How many units would you like to purchase?"
      }
    ])
    .then(amount => {
      console.log("Product ID: ", id, "Units: ", amount.units);
      connection.query(
        `SELECT stock_quantity, id, product_name, price FROM products WHERE ? `,
        { id: id },
        (error, results) => {
          if (error) throw error;
          var table = new Table({
            head: ['ID', 'Product', 'Price', 'Quantity']
        });
        
        table.push([results[0].id, results[0].product_name, results[0].price], results[0].stock_quantity)
      
        console.log(table.toString())
          if (amount.units <= results[0].stock_quantity) {
            console.log(
              "purchase amount",
              "$",
              amount.units * results[0].price,
              "plus tax, of course"
            );
            subtractUnits(amount.units, results[0].id);
          } else {
            console.log(`not enough stock, don't be so greedy`);
            promptUser()
          }
        }
      );
    });
}

function subtractUnits(units, id) {
  connection.query(
    `UPDATE products SET stock_quantity = stock_quantity - ${units} WHERE id = ${id};`,
    function(error, results) {
      // error will be an Error if one occurred during the query
      if (error) throw error;
      promptUser()
    }
  );
}
