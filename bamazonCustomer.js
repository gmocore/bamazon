const inquirer = require("inquirer");
const sql = require("mysql");

const connection = sql.createConnection({
  host: "localhost",
  user: "root",
  password: "gerritt",
  database: "bamazon",
  port: 3306
});
function displayItems() {
  let query = `SELECT id, product_name, price FROM products;`;

  connection.connect();

  connection.query(query, (error, results) => {
    if (error) throw error;
    results.forEach(item => {
      console.log('ID:', item.id, 'Product:', item.product_name, '$' + item.price)
    })
    // console.log(results[1]);
  });

  // connection.end();
}

displayItems();

function getProductId() {
  inquirer
    .prompt([
      {
        type: "number",
        name: "id",
        message: "Enter the ID of the product you want to buy"
      }
    ])
    .then(idData => {
      // getUnitAmount(idData.id)
      let query = `SELECT id, product_name, price FROM products WHERE ?;`;

      // connection.connect();

      connection.query(query, { id: idData.id }, (error, results) => {
        if (error) throw error;
        console.log(`
        ID: ${results[0].id} 
        Product: ${results[0].product_name} 
        Price: ${results[0].price}
        `);
      });
      getUnitAmount(idData.id)
     
      // connection.end();
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
      connection.query(`SELECT stock_quantity, id, product_name, price FROM products WHERE ? `, { id: id }, (error, results) => {
        if (error) throw error;
        console.log(`
        ID: ${results[0].id} 
        Product: ${results[0].product_name} 
        Price: ${results[0].price}
        Quantity: ${results[0].stock_quantity}
        `);
        if(amount.units <= results[0].stock_quantity) {
          console.log('purchase amount', '$', amount.units * results[0]. price, 'plus tax, of course')
          console.log('this purchase can be approved')
          subtractUnits(amount.units, results[0].id)
        } else {
          return console.log(`not enough stock, don't be so greedy`)
         
        }
      });

      // connection.end()
    });
}

function subtractUnits(units, id) {
  connection.query(`UPDATE products SET stock_quantity = stock_quantity - ${units} WHERE id = ${id};`,
 function (error, results) {
    // error will be an Error if one occurred during the query
    if (error) throw error;
    console.log(results)
    // results will contain the results of the query
    // fields will contain information about the returned results fields (if any)
  connection.end()
  });
}

getProductId();
