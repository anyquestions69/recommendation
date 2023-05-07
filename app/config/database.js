const Sequelize = require("sequelize");
const sequelize = new Sequelize("test_db", "public_hysteria", "0666", {
  dialect: "postgres"
});

module.exports = sequelize