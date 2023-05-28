
const { Sequelize, DataTypes } = require('sequelize');


const sequelize = new Sequelize('expenses', 'root', 'Deepak@123', {
  host: 'localhost',
  dialect: 'mysql',
});

module.exports = sequelize;