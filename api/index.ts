require('dotenv').config();

const PRICE_ID = process.env.PRICE_ID || 'price_1R7mMULsME8qSugw52rCyy58';
const STRIPE_KEY = process.env.STRIPE_KEY || 'sk_test_51PjPbZLsME8qSugwpKhZP2BgYcjUpksqjTUQntIjaO1CXAcwpGAqBTKygXh6d5ZWlJCQV3O2u0Znld6ixTFWS4sI004x955S6X';
const YOUR_DOMAIN = process.env.YOUR_DOMAIN || 'http://localhost:3000';

const stripe = require('stripe')(STRIPE_KEY);

const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const path = require('path');

// Create application/x-www-form-urlencoded parser
const urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use(express.static('public'));

app.get('/', function (req, res) {
	res.sendFile(path.join(__dirname, '..', 'components', 'home.htm'));
});

app.get('/about', function (req, res) {
	res.sendFile(path.join(__dirname, '..', 'components', 'about.htm'));
});

app.get('/uploadUser', function (req, res) {
	res.sendFile(path.join(__dirname, '..', 'components', 'user_upload_form.htm'));
});

app.post('/create-checkout-session', async (req, res) => {
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
          price: 'price_1R7mMULsME8qSugw52rCyy58',
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${YOUR_DOMAIN}/success.html`,
      cancel_url: `${YOUR_DOMAIN}/cancel.html`,
      automatic_tax: {enabled: true},
    });
  
    res.redirect(303, session.url);
});

app.listen(3000, () => console.log('Server ready on port 3000.'));

module.exports = app;
