const inquirer = require("inquirer");
const sql = require("mysql");

const connection = sql.createConnection({
  host: "localhost",
  user: "root",
  password: "gerritt",
  database: "bamazon",
  port: 3306
});

connection.connect();

connection.query("SELECT id, product_name, price FROM products", function(error, results, fields) {
  if (error) throw error;
  console.log(results);
});

connection.end();
