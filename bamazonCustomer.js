const inquirer = require("inquirer");
const sql = require("mysql");
const Table = require('cli-table')

// db connection object with credentials
const connection = sql.createConnection({
  host: "localhost",
  user: "root",
  password: "gerritt",
  database: "bamazon",
  port: 3306
});

// connect to db and get user input
connection.connect(error => {
  if (error) throw error;
  promptUser();
});

// get choice from user
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
    // route user by selection
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

  // query db to display all items
  connection.query(query, (error, results) => {
    if (error) throw error;
     
    // table objecy to display to user
    const table = new Table({
      head: ['ID', 'Product', 'Price']
  });
    // push items to table
    results.forEach(item => {
      table.push([item.id, item.product_name, `$${item.price}`])
    });
    // log table to console
    console.log('\n', table.toString())
  });
}

function getProductId() {
  // get id  input from user
  inquirer
    .prompt({
        type: "number",
        name: "id",
        message: "Enter the ID of the product you want to buy"
      })
    .then(idData => {
      let query = `SELECT id, product_name, price FROM products WHERE ?;`;
      // select db item based on input
      connection.query(query, { id: idData.id }, (error, results) => {
        if (error) throw error;

        const table = new Table({
          head: ['ID', 'Product', 'Price']
        });

        table.push([results[0].id, results[0].product_name, `$${results[0].price}`])
       
        console.log(`\n`,table.toString())

   
      });
      // id passed into function tp get amount
      getUnitAmount(idData.id);
    });
}

function getUnitAmount(id) {
  // get unit anount from user
  inquirer
    .prompt([
      {
        type: "number",
        name: "units",
        message: "How many units would you like to purchase?"
      }
    ])
    .then(amount => {
      // display transaction
      console.log("Product ID: ", id, "Units purchased: ", amount.units);
      // select item from db
      connection.query(
        `SELECT stock_quantity, id, product_name, price FROM products WHERE ? `,
        { id: id },
        (error, results) => {
          if (error) throw error;

          const table = new Table({
            head: ['ID', 'Product', 'Price']
          });

          table.push([results[0].id, results[0].product_name, `$${results[0].price}`])
         
          console.log(table.toString())
        
          // validation for transaction
          if (amount.units <= results[0].stock_quantity) {
            // display transaction amount
            console.log(
              "purchase amount",
              "$",
              amount.units * results[0].price,
              "plus tax, of course"
            );
            // subtract stock from db
            subtractUnits(amount.units, results[0].id);
          } else {
            // alerts user of insufficient stock
            console.log(`not enough stock, don't be so greedy`);
            // routes user to initial selections
            promptUser()
          }
        }
      );
    });
}

function subtractUnits(units, id) {
  // update db with amount from user
  connection.query(
    `UPDATE products SET stock_quantity = stock_quantity - ${units} WHERE id = ${id};`,
    function(error, results) {
      if (error) throw error;
      promptUser()
    }
  );
}
