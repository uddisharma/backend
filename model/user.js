const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../utils/databse");
const User = sequelize.define("User", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  premium: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  totalExpense:{
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  }
});
module.exports = User;
