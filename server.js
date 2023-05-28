const express = require('express');
var cors = require('cors')
const sequelize = require('./utils/databse')
const ExpenseRoute= require('./routers/expenseRouter')
const UserRoute= require('./routers/userRouter')
const Expenses = require('./model/expense')
const User = require('./model/user')
const Razorpay = require('razorpay');

sequelize.sync()
  .then(() => {
    console.log('Database synced successfully.');
  })
  .catch((error) => {
    console.error('Error syncing database:', error);
  })
const app = express();
app.use(express.json());
app.use(cors())
app.use('/', ExpenseRoute)
app.use('/',UserRoute)
User.hasMany(Expenses);
Expenses.belongsTo(User)
const razorpay = new Razorpay({
  key_id: 'rzp_test_1ZKrAXvsXDbLn3',
  key_secret: 'mysecretkeyforrazorpay',
});

// Handle the POST request to create a payment
app.post('/create-payment', async (req, res) => {
  try {
    const options = {
      amount: 1000, // Amount in paise (e.g., 1000 paise = ₹10)
      currency: 'INR',
      receipt: 'order_receipt',
    };

    // Create the payment
    const payment = await razorpay.orders.create(options);

    // Return the payment details to the client
    res.json({ payment });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
});
// Handle the POST request for successful payment callback
app.post('/payment-success', (req, res) => {
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

  // Verify the payment signature
  const isValidSignature = razorpay.validateWebhookSignature(
    req.rawBody, // Make sure to install and use the "body-parser" middleware to get the raw body
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature
  );

  if (isValidSignature) {
    // Payment is valid, handle success logic here
    res.sendStatus(200);
  } else {
    // Invalid payment, handle error logic here
    res.sendStatus(400);
  }
});

const port = 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

