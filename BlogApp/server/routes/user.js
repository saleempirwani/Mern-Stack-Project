const router = require("express").Router();
const User = require("../models/User");

// Register
router.post("/register", async (req, res) => {
  try {
    if (Object.keys(req.body) < 3) {
      return res
        .status(400)
        .send({ message: "Please provide all the required fields" });
    }

    const isUsernameExist = await User.findOne({ username: req.body.username });
    console.log("isUsernameExist ========> ", isUsernameExist);
    if (isUsernameExist) {
      return res.status(400).send({ message: "Username already exist" });
    }

    const isEmailExist = await User.findOne({ email: req.body.email });
    if (isEmailExist) {
      return res.status(400).send({ message: "Email already exist" });
    }

    const user = new User(req.body);
    await user.save();
    const access_token = await user.generateAuthToken();

    res
      .status(201)
      .send({ data: { user, access_token }, message: "Successfully register" });
  } catch (err) {
    res.status(500).send({message: err.message});
    console.log("ERR =========> ", err);
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.username,
      req.body.password
    );
    const access_token = await user.generateAuthToken();
    res
      .status(200)
      .send({ data: { user, access_token }, message: "Successfully login" });
  } catch (err) {
    res.status(401).send({message: err.message});
    console.log("ERR =========> ", err);
  }
});

module.exports = router;
