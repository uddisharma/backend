const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../utils/databse");
const Expenses = sequelize.define("Expense", {
  date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: new Date(),
  },
  expenseName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  expenseMoney: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  desc: {
    type: DataTypes.STRING,
    allowNull: false,
  }
  // user:{
  //   type: DataTypes.STRING,
  //   allowNull: false,
  // }
});
module.exports = Expenses;
