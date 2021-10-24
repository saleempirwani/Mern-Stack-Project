const express = require("express");
const mongoose = require("mongoose");
const { auth, isAdmin } = require("../middlewares/auth");
const User = require("../models/user");
const CryptoJS = require("crypto-js");

const Router = express.Router();

// Register User
Router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  const user = new User({ username, email, password });

  try {
    await user.save();
    const accessToken = await user.generateAuthToken();
    res.status(201).send({ user: { ...user.toJSON() }, accessToken });
  } catch (err) {
    res.status(400).send({ error: { message: err.message } });
    console.log("Auth Register Error ======> ", err);
  }
});

// Login User
Router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findByCredentials({ username, password });
    const accessToken = await user.generateAuthToken();
    res.status(200).send({ user: { ...user.toJSON() }, accessToken });
  } catch (err) {
    res.status(401).send({ error: { message: err.message } });
    console.log("Auth Login Error ======> ", err);
  }
});

// Change password
Router.patch("/change-password", auth, async (req, res) => {
  const { password, newPassword } = req.body;

  const originalPassword = CryptoJS.AES.decrypt(
    req.user.password,
    process.env.CRYPTOJS_SECRET
  ).toString(CryptoJS.enc.Utf8);

  if (password !== originalPassword) {
    return res.status(400).send({ message: "Invalid current password" });
  }

  req.user.password = newPassword;

  try {
    await req.user.save();
    res.status(200).send({ message: "Password has successfully changed" });
  } catch (error) {
    res.status(500).send({ error: { message: err.message } });
  }
});

// Admin Apis

// Get User stats
Router.get("/stats", auth, isAdmin, async (req, res) => {
  try {
    const users = await User.find({ isAdmin: false });
    console.log(users);
    res.status(200).send({ stats: { totalCount: users?.length } });
  } catch (error) {
    res.status(404).send({ error: error.message });
  }
});

// Get all User
Router.get("/", auth, isAdmin, async (req, res) => {
  try {
    const users = await User.find({ isAdmin: false });
    res.status(200).send({ users });
  } catch (error) {
    res.status(404).send({ error: error.message });
  }
});

// Get User
Router.get("/:id", auth, isAdmin, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    res.status(200).send({ user });
  } catch (error) {
    res.status(404).send({ error: error.message });
  }
});

module.exports = Router;
