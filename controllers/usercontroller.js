const User = require("../model/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const Mailgen = require("mailgen");

const { Sequelize, DataTypes } = require("sequelize");
const Expense = require("../model/expense");
const sendEmail = (req, res, link, email) => {
  let config = {
    service: "gmail",
    auth: {
      user: process.env.USER,
      pass: process.env.PASS,
    },
  };
  let transporter = nodemailer.createTransport(config);
  let maingenerator = new Mailgen({
    theme: "default",
    product: {
      name: "Fitbuzz Wellness",
      link: "https://mailgen.js/",
    },
  });
  let response = {
    body: {
      name: email,
      intro: "Reset Password",
      table: {
        data: [
          {
            description: "This is your password reset link" + "" + link,
          },
        ],
      },
      // outro: "Sharpener Tech",
    },
  };
  let mail = maingenerator.generate(response);
  let message = {
    from: "uddibhardwaj08@gmail.com",
    to: email,
    subject: "Password Reset Link",
    html: mail,
  };
  transporter.sendMail(message).then(() => {
    return res.status(200).json({
      msg: "Email has been sent successfully",
    });
  });
};
class UserController {
  static RegisterUser = async (req, res) => {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.json({
        status: 409,
        error: "User already exists.",
        user: existingUser,
      });
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);
      User.create({ name, email, password: hashPassword })
        .then((result) => {
          res
            .status(201)
            .json({ status: 201, message: "User registered successfully" });
        })
        .catch((error) => {
          res.status(500).json({ error: error });
        });
    }
  };
  static userLogin = async (req, res) => {
    try {
      const { email, password } = req.body;
      if (email && password) {
        const user = await User.findOne({ where: { email } });
        if (user != null) {
          const isMatch = await bcrypt.compare(password, user.password);
          if (user.email === email && isMatch) {
            const token = jwt.sign({ userID: user.id }, "jwt-secret-token", {
              expiresIn: "5d",
            });
            res.send({
              status: 200,
              message: "Login Success",
              token: token,
              user: user,
            });
          } else {
            res.send({
              status: 500,
              message: "Email or Password is not Valid",
            });
          }
        } else {
          res.send({
            status: "failed",
            message: "You are not a Registered User",
          });
        }
      } else {
        res.send({ status: "failed", message: "All Fields are Required" });
      }
    } catch (error) {
      console.log(error);
      res.send({ status: "failed", message: "Unable to Login" });
    }
  };
  static getUsers = async (req, res) => {
    const data = await User.findAll()
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((error) => {
        res.status(500).json({ error: error });
      });
  };
  static deleteUser = async (req, res) => {
    const { id } = req.params;
    User.destroy({ where: { id: id } })
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((error) => {
        res.status(500).json({ error: error });
      });
  };
  static getUserByEmail = async (req, res) => {
    const { email } = req.params;
    User.findOne({ where: { email: email } })
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((err) => {
        res.status(500).json({ error: err });
      });
  };
  static updatePremiumStatus = async (req, res) => {
    const { id } = req.params;
    User.update({ premium: true }, { where: { id: id } })
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((err) => {
        res.status(500).json({ error: err });
      });
  };
  static UserWithExpenseDetails = async (req, res, next) => {
    const { user } = req.params;
    const data = await User.findAll({
      // attributes: [
      //   "id",
      //   "name",
      //   [Sequelize.fn("sum", Sequelize.col("expenseMoney")), "total_amount"],
      // ],
      // include: [
      //   {
      //     model: Expense,
      //     attributes: [],
      //   },
      // ],
      // group: ["id"],
      // order: [["total_amount", "DESC"]],
      attributes: ["id", "name", "totalExpense"],
      group: ["id"],
    })
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((error) => {
        res.status(500).json({ error: error });
      });
  };
  static updateUserExpenseDetails = async (req, res, next) => {
    const { id } = req.params;
    const { totalExpense } = req.body;
    console.log(req.body);
    User.update({ totalExpense: totalExpense }, { where: { id: id } })
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((error) => {
        res.status(500).json({ error: error });
      });
  };
  static forgotpassword = async (req, res) => {
    const { email } = req.body;
    try {
      const User = await User.findOne({ where: { email } });
      if (User) {
        const secret = User.id + "jwt-secret-token";
        const token = jwt.sign({ userID: User.id }, secret, {
          expiresIn: "15m",
        });
        const link = `http://127.0.0.1:3000/api/user/reset/${User._id}/${token}`;
        sendEmail(req, res, link, User.email);
      } else {
        res.json({
          status: 404,
          error: "User not found",
        });
      }
    } catch (error) {
      console.log(error);
            res.status(500).json({ error: error });
    }
  };
}
module.exports = UserController;
