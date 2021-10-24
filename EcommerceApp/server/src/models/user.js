const mongoose = require("mongoose");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

const userSchema = mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    tokens: [{ token: { type: String } }],
  },
  {
    timestamps: true,
  }
);

// Remove Unnecessary fields
userSchema.methods.toJSON = function () {
  const user = this.toObject();

  delete user.password;
  delete user.tokens;

  return user;
};

// Generate Token
userSchema.methods.generateAuthToken = async function () {
  const user = this;

  const token = jwt.sign(
    { _id: user._id.toString(), isAdmin: user.isAdmin },
    process.env.JWT_SECRET
  );

  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

// Check user credentials
userSchema.statics.findByCredentials = async function ({ username, password }) {
  const user = await User.findOne({ username });

  if (!user) throw new Error("Wrong credentials");

  const hashedPassword = CryptoJS.AES.decrypt(
    user.password,
    process.env.CRYPTOJS_SECRET
  );
  const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

  if (password !== originalPassword) throw new Error("Wrong credentials");

  return user;
};

// Encrypting password
userSchema.pre("save", function (next) {
  const user = this;

  if (user.isModified("password")) {
    user.password = CryptoJS.AES.encrypt(
      user.password,
      process.env.CRYPTOJS_SECRET
    ).toString();
  }

  next();
});

const User = mongoose.model("User", userSchema);
module.exports = User;
