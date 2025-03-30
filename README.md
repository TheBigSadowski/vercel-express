# Stripe event testing

Simple Express.js + Vercel app for testing Stripe webhooks.

## Stripe setup

### Stripe configuration
1. In the Stripe dashboard, [create a few products](https://dashboard.stripe.com/products?active=true) (they will be listed at `/products`)
2. Set your origin address in [your tax settings](https://dashboard.stripe.com/settings/tax)

### Environment configuration

1. Set the `STRIPE_KEY` evironment variable to your Stripe secret key.
2. Set the `YOUR_DOMAIN` environment variable to where your app is running (the default is localhost for development, but if you're running this on a real server, you'll want to change this)


## How to Use (on Vercel)

You can choose from one of the following two methods to use this repository:

### One-Click Deploy

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=vercel-examples):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https://github.com/TheBigSadowski/vercel-express&project-name=stripe-webhooks&repository-name=stripe-webhooks)

### Clone and Deploy

```bash
git clone https://github.com/vercel/examples/tree/main/solutions/express
```

Install the Vercel CLI:

```bash
npm i -g vercel
```

Then run the app at the root of the repository:

```bash
vercel dev
```