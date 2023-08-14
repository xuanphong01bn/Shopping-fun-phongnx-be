const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const notiSchema = new mongoose.Schema(
  {
    type: String,
    description: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notiSchema);
