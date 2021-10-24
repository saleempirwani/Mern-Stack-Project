const express = require("express");
const { auth, isAdmin } = require("../middlewares/auth");
const Products = require("../models/products");

const Router = express.Router();

// Add product
Router.post("/", auth, isAdmin, async (req, res) => {
  const { title, description, image, price, categories, size, color } =
    req.body;

  const product = new Products({
    title,
    description,
    image,
    price,
    categories,
    size,
    color,
  });

  try {
    await product.save();
    res.status(201).send({ product });
  } catch (err) {
    res.status(400).send({ error: { message: err.message } });
    // console.log("Add product Error ======> ", err);
  }
});

// Update product
Router.patch("/:id", auth, isAdmin, async (req, res) => {
  try {
    const product = await Products.findOne({ _id: req.params.id });

    const updates = Object.keys(req.body);
    updates.forEach((update) => {
      product[update] = req.body[update];
    });

    await product.save();
    res.status(200).send({ product });
  } catch (err) {
    res.status(400).send({ error: { message: err.message } });
  }
});

// Get products
Router.get("/", async (req, res) => {
  try {
    const products = await Products.find({});
    res.status(200).send({ products });
  } catch (err) {
    res.status(404).send({ error: { message: err.message } });
    console.log("Add product Error ======> ", err);
  }
});

// Get product
Router.get("/:id", async (req, res) => {
  try {
    const product = await Products.findOne({ _id: req.params.id });
    res.status(200).send({ product });
  } catch (err) {
    res.status(404).send({ error: { message: err.message } });
    // console.log("Add product Error ======> ", err);
  }
});

// Delete product
Router.delete("/:id", async (req, res) => {
  try {
    await Products.findOneAndDelete({ _id: req.params.id });
    res.status(200).send({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(404).send({ error: { message: err.message } });
    // console.log("Add product Error ======> ", err);
  }
});

module.exports = Router;
