const mongoose = require("mongoose");

const cartSchema = mongoose.Schema(
  {
    userId: { type: String, required: true, ref: "User"},
    products: [
      {
        productId: { type: String },
        quantity: { type: Number, default: 1 },
      },
    ],
  },
  {
    timestamp: true,
  }
);

module.exports = mongoose.model("Cart", cartSchema);
