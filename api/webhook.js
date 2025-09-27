// api/webhook.js
import { createClient } from "@sanity/client";
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// Sanity client for writing data
const sanityClient = createClient({
  projectId: process.env.VITE_SANITY_PROJECT_ID, // Use your project ID
  dataset:process.env.VITE_SANITY_DATASET, // "production"
  token:process.env.SANITY_API_WRITE_TOKEN, // Use the token you created
  useCdn: false,
});

export default async function handler(req, res) {
  if (req.method === 'POST') {
    // --- This part is complex but crucial for security ---
    // It verifies that the request is actually coming from Stripe
    const buf = await buffer(req);
    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    let event;
    try {
      event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
    } catch (err) {
      console.log(`❌ Error message: ${err.message}`);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    // --- End of security verification ---

    // Handle the checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;

      // Retrieve the line items from the session
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id);

      // Create the order document in Sanity
      await sanityClient.create({
        _type: 'order',
        name: session.customer_details.name,
        email: session.customer_details.email,
        stripeId: session.id,
        total: session.amount_total / 100, // Convert from cents
        paid: true,
        orderItems: lineItems.data.map(item => ({
          _key: item.id,
          name: item.description,
          price: item.price.unit_amount / 100,
          quantity: item.quantity,
        })),
      });
    }
    res.status(200).json({ received: true });
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}

// Helper function to read the request body
const buffer = (req) => {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
};