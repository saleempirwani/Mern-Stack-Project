const express = require("express");
const { auth, isAdmin } = require("../middlewares/auth");
const Order = require("../models/order");

const Router = express.Router();

// Add to cart
Router.post("/", auth, async (req, res) => {
  const order = new Order({ ...req.body, userId: req.user._id });
  try {
    await order.save();
    res.status(201).send({ order, message: "Order added successfully" });
  } catch (err) {
    res.status(400).send({ message: err });
    // console.log("Add product Error ======> ", err);
  }
});

// Get cart
Router.get("/", auth, async (req, res) => {
  try {
    const order = await Order.findOne({ userId: req.user._id });
    res.status(200).send({ order, message: "Carts received successfully" });
  } catch (err) {
    res.status(404).send({ error: { message: err.message } });
    // console.log("Add product Error ======> ", err);
  }
});


// Get Income
Router.get("/income", auth, isAdmin, async (req, res) => {
  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth) - 1);
  const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));

  try {
    const order = await Order.find();
    const income = order.map((ord) => ord.amount).reduce((prev, curr) => (prev += curr));

    // const income =  Order.aggregate([
    //   { $match: { createdAt: { $gte: previousMonth } } },
    //   {
    //     $project: {
    //       month: { $month: "$createdAt" },
    //       sales: "$amount",
    //     },
    //     $group: {
    //       _id: "$month",
    //       total: { $sum: "$sales" },
    //     },
    //   },
    // ]);

    res.status(200).send({ income, message: "Income received successfully" });
  } catch (err) {
    res.status(404).send({ error: { message: err.message } });
    // console.log("Add product Error ======> ", err);
  }
});

// Update product
Router.patch("/:id", auth, isAdmin, async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id });

    const updates = Object.keys(req.body);
    updates.forEach((update) => {
      order[update] = req.body[update];
    });

    await order.save();
    res.status(200).send({ cart, message: "Order updated successfully" });
  } catch (err) {
    res.status(400).send({ error: { message: err.message } });
  }
});

// Delete cart - Admin
Router.delete("/:id", auth, isAdmin, async (req, res) => {
  try {
    await Products.findOneAndDelete({ _id: req.params.id });
    res.status(200).send({ message: "Cart deleted successfully" });
  } catch (err) {
    res.status(404).send({ error: { message: err.message } });
    // console.log("Add product Error ======> ", err);
  }
});

// Get all carts - Admin
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
