require('dotenv').config();

const PRICE_ID = process.env.PRICE_ID || 'price_1R7mMULsME8qSugw52rCyy58';
const STRIPE_KEY = process.env.STRIPE_KEY || 'sk_test_51PjPbZLsME8qSugwpKhZP2BgYcjUpksqjTUQntIjaO1CXAcwpGAqBTKygXh6d5ZWlJCQV3O2u0Znld6ixTFWS4sI004x955S6X';
const YOUR_DOMAIN = process.env.YOUR_DOMAIN || 'http://localhost:3000';

const stripe = require('stripe')(STRIPE_KEY);

const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const path = require('path');

const sleep = ms => new Promise(r => setTimeout(r, ms));

// Create application/x-www-form-urlencoded parser
const urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use(express.static('public'));

app.get('/', function (req, res) {
	res.sendFile(path.join(__dirname, '..', 'components', 'checkout.html'));
});

app.get('/about', function (req, res) {
	res.sendFile(path.join(__dirname, '..', 'components', 'about.html'));
});

app.get('/cancel', function (req, res) {
	res.sendFile(path.join(__dirname, '..', 'components', 'cancel.html'));
});

app.get('/success', function (req, res) {
	res.sendFile(path.join(__dirname, '..', 'components', 'success.html'));
});

app.get('/uploadUser', function (req, res) {
	res.sendFile(path.join(__dirname, '..', 'components', 'user_upload_form.html'));
});

app.post('/create-checkout-session', async (req, res) => {
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: PRICE_ID,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${YOUR_DOMAIN}/success`,
      cancel_url: `${YOUR_DOMAIN}/cancel`,
      automatic_tax: {enabled: true},
    });
  
    res.redirect(303, session.url);
});

app.post('/webhook', express.json({type: 'application/json'}), async (request, response) => {
    const event = request.body;

    // Handle the event
    switch (event.type) {
        case 'checkout.session.completed':
            console.log('webhook checkout.session.completed: sleeping and then responding');
            await sleep(8000);
            console.log('webhook checkout.session.completed: returning from sleep');
            break;

        case 'product.updated':
            console.log('webhook product.updated: sleeping and then responding');
            await sleep(8000);
            console.log('webhook product.updated: returning from sleep');
            break;

        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    // Return a response to acknowledge receipt of the event
    response.json({received: true});
});

app.listen(3000, () => console.log('Server ready on port 3000.'));

module.exports = app;
