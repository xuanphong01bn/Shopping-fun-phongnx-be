import User from "../models/user";
import Cart from "../models/cart";
import Product from "../models/product";
import Coupon from "../models/coupon";

const stripe = require("stripe")(
  "sk_test_51NF4ugGuwedm0TQJXclhx1UdGSk2r5bwH1oKjE9Gf6WQehbj20rjAg5nYq0g4H2U0v7hRh9bymNY8akwhVmI9hZS00tDn7bWp1"
);

const createPaymentStripe = async (req, res) => {
  const user = await User.findOne({ email: req.user.email });

  const userCart = await Cart.findOne({ orderedBy: user._id });
  let amountCart;
  if (userCart?.totalAfterDiscount > 0)
    amountCart = userCart?.totalAfterDiscount;
  else amountCart = userCart?.cartTotal;
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amountCart,
    currency: "vnd",
  });
  res.send({
    clientSecret: paymentIntent.client_secret,
  });
};
module.exports = {
  createPaymentStripe: createPaymentStripe,
};
