const inquirer = require("inquirer");
const sql = require("mysql");

const connection = sql.createConnection({
  host: "localhost",
  user: "root",
  password: "gerritt",
  database: "bamazon",
  port: 3306
});
function dbConnect() {
  let query = `SELECT id, product_name, price FROM products WHERE id = '5';`;

  connection.connect();

  connection.query(query, (error, results) => {
    if (error) throw error;
    console.log(results);
  });

  connection.end();
}

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

      connection.connect();

      connection.query(query, { id: idData.id }, (error, results) => {
        if (error) throw error;
        console.log(`
        ID: ${results[0].id} 
        Product name: ${results[0].product_name} 
        Price: ${results[0].price}
        `);
      });

      connection.end();
    });
}

function getUnitAmount(id) {
  inquirer
    .prompt([
      {
        type: "number",
        name: "units",
        message: "How many uniits would you like to purchase?"
      }
    ])
    .then(amount => {
      console.log("Product ID: ", id, "Units: ", amount.units);
    });
}

getProductId();
// dbConnect();
