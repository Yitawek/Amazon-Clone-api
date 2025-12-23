const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const stripe = require("stripe")(process.env.STRIPE_KEY);

const app = express();

// Middleware
app.use(
  cors({
    origin: "https://amazonyitu.netlify.app",
    credentials: true,
  })
);
app.use(express.json());

// route
app.get("/", (req, res) => {
  res.status(200).json({ message: "Success!" });
});

// Create payment gateway
app.post("/payment/create", async (req, res) => {
  try {
    const total = Number(req.query.total);

    if (!total || total <= 0) {
      return res.status(400).json({
        message: "Total must be greater than 0",
      });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: total,
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.status(201).json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Stripe error:", error.message);
    res.status(500).json({
      error: error.message,
    });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
