const UserController = require("../controllers/usercontroller");
const express = require("express");
const router = express.Router();
const checkUser = require("../middleware/alreadyexist");
// router.use("register", checkUser);
router.post("/register", UserController.RegisterUser);
router.post('/login', UserController.userLogin)
router.get("/users", UserController.getUsers);
router.delete("/delete-user/:id", UserController.deleteUser);
router.get("/user/:email", UserController.getUserByEmail);
router.patch('/update-premium-status/:id', UserController.updatePremiumStatus)
router.get('/UserWithExpenseDetails', UserController.UserWithExpenseDetails)
router.patch('/UserWithExpenseDetails/:id', UserController.updateUserExpenseDetails)
router.post('/password/forgotpassword/:email', UserController.forgotpassword)
module.exports = router;
