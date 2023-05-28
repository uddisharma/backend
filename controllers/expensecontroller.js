const Expenses = require("../model/expense");
const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../utils/databse");
const User = require("../model/user");
class ExpenseController {
  static addexpense = async (req, res) => {
    // const t = sequelize.transaction();
    const {
      expenseName,
      expenseMoney,
      category,
      desc,
      UserId,
      UserTotalExpense,
    } = req.body;
    const totalExpense = Number(expenseMoney) + Number(UserTotalExpense);
    Expenses.create(
      { expenseName, expenseMoney, category, desc, UserId }
      // { transaction: t }
    )
      .then((result) => {
        res.send(result);
        // t.commit();
        // res.status(201).json(result);
        // User.update(
        //   { totalExpense: totalExpense },
        //   // { transaction: t },
        //   { where: { id: UserId } }
        // )
        //   .then((result) => {
        //     // t.commit();
        //     res.send("updated", result);
        //   })
        //   .catch((err) => {
        //     // t.rollback();
        //     res.status(500).json({ error: err });
        //   });
      })
      .catch((error) => {
        t.rollback();
        res.status(500).json({ error: error, data: req.body });
      });
  };
  static getexpenses = async (req, res) => {
    const { user } = req.params;
    const page = +req.query.page || 1;
    const limit = +req.query.limit || 2;
    // console.log(page)
    const data = await Expenses.findAll({
      offset: (page - 1) * limit,
      limit: limit,
      where: { userId: user },
    })
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((error) => {
        res.status(500).json({ error: error });
      });
  };
  static deleteexpense = async (req, res) => {
    const { id } = req.params;
    Expenses.destroy({ where: { id: id } })
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((error) => {
        res.status(500).json({ error: error });
      });
  };
  static getexpenseById = async (req, res) => {
    const { id } = req.params;
    Expenses.findOne({ where: { id: id } })
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((err) => {
        res.status(500).json({ error: err });
      });
  };
  static updateexpense = async (req, res) => {
    const { id } = req.params;
    const { expenseName, expenseMoney, category, desc } = req.body;
    Expenses.update(
      { expenseName, expenseMoney, category, desc },
      { where: { id: id } }
    )
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((error) => {
        res.status(500).json({ error: error });
      });
  };
  static expensesByGroup = async (req, res, next) => {
    const { user } = req.params;
    const data = await Expenses.findAll({
      attributes: [
        "userId",
        [Sequelize.fn("sum", Sequelize.col("expenseMoney")), "total_amount"],
      ],
      group: ["userId"],
    })
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((error) => {
        res.status(500).json({ error: error });
      });
  };
}
module.exports = ExpenseController;
