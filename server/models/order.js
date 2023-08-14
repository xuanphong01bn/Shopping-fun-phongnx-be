import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema;

const orderSchema = new mongoose.Schema(
  {
    products: [
      {
        product: {
          type: ObjectId,
          ref: "Product",
        },
        count: Number,
        color: String,
      },
    ],
    receiverInfo: {},
    paymentIntent: {},
    orderStatus: {
      type: String,
      default: "Not Processed",
    },
    amountForpaymentAfter: Number,
    enum: [
      "Not Processed",
      "Processing",
      "Dispatched",
      "Cancelled",
      "Completed",
    ],
    orderedBy: {
      type: ObjectId,
      ref: "User",
    },
    address: String,
    name: String,
    phone: String,
    email: String,
  },
  { timestamps: true }
);
module.exports = mongoose.model("Order", orderSchema);
