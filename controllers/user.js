import Category from "../models/category";
import Cart from "../models/cart";
import Product from "../models/product";
import User from "../models/user";
import Order from "../models/order";

const userCart = async (req, res) => {
  //   res.json("hehe");
  const { cart } = req.body;
  let products = [];
  const user = await User.findOne({ email: req.user.email });

  // check if cart already exist

  let cartExist = await Cart.deleteMany({ orderedBy: user._id });

  //   if (cartExist) {
  //     Cart.deleteMany({ orderedBy: user._id });
  //   }

  for (let i = 0; i < cart.length; i++) {
    let object = {};
    object.product = cart[i]._id;
    object.count = cart[i].count;
    object.color = cart[i].color;
    // get price
    let { price } = await Product.findById(cart[i]._id).select("price");
    object.price = price;

    products.push(object);
  }

  console.log(products);

  let cartTotal = 0;
  for (let i = 0; i < products.length; i++) {
    cartTotal = cartTotal + products[i].price * products[i].count;
  }

  let newCart = await new Cart({
    products,
    cartTotal,
    orderedBy: user._id,
  }).save();
  res.json({ isSaveCart: true });
};

const getUserCart = async (req, res) => {
  const user = await User.findOne({ email: req.user.email });

  let cart = await Cart.findOne({ orderedBy: user._id }).populate(
    "products.product",
    "_id title price totalAfterDiscount"
  );

  const { products, cartTotal, totalAfterDiscount } = cart;
  res.json({ products, cartTotal, totalAfterDiscount });
};

const createOrder = async (req, res) => {
  // const { paymentIntent } = req.body.stripeResponse;
  const { address, name, phone, email, receiverInfo, paymentIntent } = req.body;
  const user = await User.findOne({ email: req.user.email });

  let { products } = await Cart.findOne({ orderedBy: user._id });

  let newOrder = await new Order({
    products,
    paymentIntent,
    orderedBy: user?._id,
    address,
    name,
    phone,
    email,
    receiverInfo,
  }).save();
  console.log("new order :", newOrder);
  res.json({ ok: true });
};

const emptyUserCart = async (req, res) => {
  const user = await User.findOne({ email: req.user.email });
  await Cart.deleteMany({ orderedBy: user._id });
  res.json({
    delete: true,
  });
};

const getUserOrder = async (req, res) => {
  const status = req?.params?.status;
  const user = await User.findOne({ email: req.user.email });
  const filter =
    status == "all"
      ? {
          orderedBy: user?._id,
        }
      : {
          orderStatus: status != "all" && status,
        };
  const userOrders = await Order.find(filter)
    .sort({ createdAt: -1 })
    .populate("products.product");
  res.json(userOrders);
};

const getAllUser = async (req, res) => {
  const user = await User.find({});
  res.json(user);
};

const userDeleteOrder = async (req, res) => {
  const { idOrder } = req?.body;
  await Order.deleteMany({ _id: idOrder });
  res.json("Đã xoá đơn hàng");
};
module.exports = {
  userCart: userCart,
  getUserCart: getUserCart,
  createOrder: createOrder,
  emptyUserCart: emptyUserCart,
  getUserOrder: getUserOrder,
  userDeleteOrder,
  getAllUser,
};
