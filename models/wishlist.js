import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema;

const wislistSchema = new mongoose.Schema(
  {
    listProducts: [
      {
        type: ObjectId,
        ref: "Product",
      },
    ],
    createWishlistBy: {
      type: ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Wishlist", wislistSchema);
