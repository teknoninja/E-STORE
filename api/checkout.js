// api/checkout.js

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      // Transform the cart items from your frontend into Stripe's required format
      const line_items = req.body.products.map((item) => {
        return {
          price_data: {
            currency: "usd",
            product_data: {
              name: item.title,
              images: [item.img],
            },
            unit_amount: item.price * 100, // Price in cents
          },
          quantity: item.quantity,
        };
      });

      // Create a Checkout Session from the items
      const session = await stripe.checkout.sessions.create({
        line_items: line_items,
        mode: "payment",
        success_url: `${req.headers.origin}/?success=true`,
        cancel_url: `${req.headers.origin}/?canceled=true`,
      });

      res.status(200).json(session);
    } catch (err) {
      res.status(err.statusCode || 500).json(err.message);
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}