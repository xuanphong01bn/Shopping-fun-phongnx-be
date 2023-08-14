import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema;
const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
      maxlength: 1000,
      // index: true,
      // text: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      // index: true,
    },
    description: {
      type: String,
      required: true,
      maxlength: 2000,
      text: true,
      // index: true,
    },
    specifications: {},
    price: {
      type: Number,
      required: true,
      trim: true,
      maxlength: 32,
    },
    category: {
      type: ObjectId,
      ref: "Category",
    },
    subs: [
      {
        type: ObjectId,
        ref: "Sub",
      },
    ],
    quantity: Number,
    sold: {
      type: Number,
      default: 0,
    },
    images: {
      type: Array,
    },
    shipping: {
      type: String,
      enum: ["Yes", "No"],
    },
    color: {
      type: String,
      enum: ["Black", "Brown", "Silver", "White", "Blue", "Any"],
    },
    brand: {
      type: String,
      enum: [
        "Apple",
        "Samsung",
        "Microsoft",
        "Lenovo",
        "ASUS",
        "HP",
        "Dell",
        "Xiaomi",
        "Acer",
        "MSI",
        "OPPO",
        "Realme",
        "Nokia",
        "Vivo",
      ],
    },
    ratings: [
      {
        star: Number,
        postedBy: {
          type: ObjectId,
          ref: "User",
        },
        name: String,
        comment: String,
        timeRating: String,
      },
    ],
  },
  { timestamps: true }
);
productSchema.index({ "$**": "text" });
module.exports = mongoose.model("Product", productSchema);
