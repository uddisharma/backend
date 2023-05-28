const ExpenseController= require('../controllers/expensecontroller');
const express= require('express');
const router= express.Router();
router.post('/add-expense',ExpenseController.addexpense);
router.get('/expenses/:user', ExpenseController.getexpenses);
router.delete('/delete-expense/:id', ExpenseController.deleteexpense);
router.get('/expense/:id', ExpenseController.getexpenseById)
router.put('/update-expense/:id', ExpenseController.updateexpense)
router.get('/expenseByGroup', ExpenseController.expensesByGroup)
module.exports= router;