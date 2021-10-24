const express = require("express");
const { auth, isAdmin } = require("../middlewares/auth");
const Cart = require("../models/cart");

const Router = express.Router();

// Add to cart
Router.post("/", auth, async (req, res) => {
  const cart = new Cart(req.body);
  try {
    await cart.save();
    res.status(201).send({ cart, message: "Cart added successfully" });
  } catch (err) {
    res.status(400).send({ error: { message: err.message } });
    // console.log("Add product Error ======> ", err);
  }
});

// Update product
Router.patch("/:id", auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ _id: req.params.id });

    const updates = Object.keys(req.body);
    updates.forEach((update) => {
      cart[update] = req.body[update];
    });

    await cart.save();
    res.status(200).send({ cart, message: "Cart updated successfully" });
  } catch (err) {
    res.status(400).send({ error: { message: err.message } });
  }
});

// Get product
Router.get("/", auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id });
    res.status(200).send({ cart, message: "Carts received successfully" });
  } catch (err) {
    res.status(404).send({ error: { message: err.message } });
    // console.log("Add product Error ======> ", err);
  }
});

// Delete product
Router.delete("/:id", auth, async (req, res) => {
  try {
    await Products.findOneAndDelete({ _id: req.params.id });
    res.status(200).send({ message: "Cart deleted successfully" });
  } catch (err) {
    res.status(404).send({ error: { message: err.message } });
    // console.log("Add product Error ======> ", err);
  }
});

// Get all products - Admin
Router.get("/all", auth, isAdmin, async (req, res) => {
  try {
    const carts = await Cart.find();
    res.status(200).send({ carts, message: "Carts received successfully" });
  } catch (err) {
    res.status(404).send({ error: { message: err.message } });
    // console.log("Add product Error ======> ", err);
  }
});

module.exports = Router;
