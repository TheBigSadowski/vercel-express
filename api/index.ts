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
app.use(express.urlencoded({extended: true}));

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

app.get('/products', async function (req, res) {
    const products = await stripe.products.list({
        limit: 3,
        expand: ['data.default_price']
    });

    const content = `<!DOCTYPE html>
        <html>
        <head>
            <title>Buy cool new products</title>
            <link rel="stylesheet" href="style.css">
            <script src="https://js.stripe.com/v3/"></script>
        </head>
        <body>
        ` + products.data.map(p => `
            <section>
            <div class="product">
                <img src="https://i.imgur.com/EHyR2nP.png" alt="The cover of Stubborn Attachments" />
                <div class="description">
                <h3>${p.name}</h3>
                <h5>$${p.default_price.unit_amount/100}</h5>
                </div>
            </div>
            <form action="/create-checkout-session" method="POST">
                <input type="hidden" name="price" value="${p.default_price.id}" />
                <button type="submit" id="checkout-button">Buy</button>
            </form>
            </section>
        `).join() + `
        </body>
        </html>`;

    res.setHeader('Content-Type', 'text/html')
    res.end(content);
});

app.post('/create-checkout-session', async (req, res) => {
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: req.body.price || PRICE_ID,
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

const EXPECTED_VERSION = '2025-01-27.acacia';

app.post('/webhook', express.json({type: 'application/json'}), async (request, response) => {
    const event = request.body;

    console.log(`received event ${event.type} in version ${event.api_version}`);

    if (event.api_version != EXPECTED_VERSION) {
        response.status(500).json({ 
            error: `Expected version '${EXPECTED_VERSION}' but got '${event.version}' ` 
        });
        return;
    }

    // Handle the event
    switch (event.type) {
        case 'checkout.session.completed':
            console.log('webhook checkout.session.completed: sleeping and then responding');
            await sleep(8000);
            await stripe.checkout.sessions.update(
                event.data.object.id,
                {
                  metadata: {
                    webhook: YOUR_DOMAIN,
                  },
                }
              );
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
