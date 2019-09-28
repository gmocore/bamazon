# [B]amazon

## the fake storefront you never knew you needed

### Installing

type `npm i` into the command line (in the same directory as the bamazon.js application) to install the required packages included in `package.json` prior to running this application.

### Prerequisites

To run this app, you will need access to mySql. refer to `bmz.sql` for the queries to create the associated database.

## Instructions

type `node bamazonCustomer.js` to run the customer portal.

- options: `view all products`, `purchase a product by id`, `exit`

* `view all products` - displays all products, is, and prices - returns user to option selections
* `purchase product(by id)` - prompts user for item id, and the quantity they would like to purchase - if stock is available: the transaction is completed and the user is displayed with the amount of the purchase, and the database is updated with the amount of the sales for the product - if stock is not available: user is displayed with a message that quantity is insufficient - returns user to option selections

* `exit` - end the connection to the database and exit the application

type `node bamazonManager.js` to run the manager portal.

- options: `view products for sale`, `view low inventory`,`add to inventory`, `add new item`,`exi`t
- `view all products` - displays all products and details - returns user to option selections
- `view low inventory` - displays all products where the quantity is less than 5 - returns user to option selections
- `add to inventory` - prompts user for quantity and item id - updates the item quantity in the database by the value provided - returns user to option selections
- `add new item` - prompts the user for the required fields (item name, item department, item price, item quantity) and creates a a new item in the database with the values provided - returns user to option selections
- `exit` - end the connection to the database and exit the application

type `node bamazonSupervisor.js` to run the supervisor portal.

- `view product sales by department` - displays total profit for each department - returns user to option selections

- `create new department` - prompts the user for the required fields (dept name, overhead cost) and creates a a new department in the database with the values provided - returns user to option selections
- `exit` - end the connection to the database and exit the application

## Code Overview

user input is received from the `inquirer` package. database is connect with the `mySql` package. When the file is run in node, the database connection is initiated. the user is prompted with a function using `inquirer.prompt()` which creates a list of options to chose from. once the response is entered, the response is routed through a switch statement, which will route to the appropriate function call, based on the user input. each function contains a different `mySql` query to view or update the database, based on what the user selected. within case of the switch statement, the initial prompt function is called to route the user back to the selection function, which allows them to make another selection, or exit the application. Within the exit case of the switch statement, the connection to the database is ended with `connection.end()` and the application exits.

## Built With

### Languages

JavaScript, Node.js, mySql

### Packages/APIs

- [mysql](https://www.npmjs.com/package/mysql) - a node.js driver for mysql to access mysql with JavaScript

- [inquirer](https://www.npmjs.com/package/inquirer) - A collection of common interactive command line user interfaces.

- [console.table](https://www.npmjs.com/package/console.table) - Adds console.table method to node

## Authors

- **Gerritt Black** - _Backend, API, Scripting/_ - [gmocore](https://github.com/gmocore)

## Examples
![](images/customer.gif)
![](images/mg1-3.gif)
![](images/mg-add.gif)
![](images/supervisor.gif))
