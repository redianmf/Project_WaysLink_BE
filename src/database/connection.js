// Import sequelize
const Sequelize = require("sequelize");

// Create db variable here ...
const db = {};

// Config sequelize and database
const sequelize = new Sequelize("dumblinks", "root", null, {
  host: "localhost",
  dialect: "mysql",
  logging: console.log,
  freezeTableName: true,

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

// Enter the database config to sequelize here ...
db.sequelize = sequelize;

// Create exports module db here ...
module.exports = db;
