const mongoose = require("mongoose");
const cryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

const userSchema = mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: { type: String, default: "" },
    tokens: [{ token: { type: String, require: true } }],
  },
  { timestamps: true }
);

// Password encryption
userSchema.pre("save", function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = cryptoJS.AES.encrypt(
      user.password,
      process.env.CRYPTOJS_SECRET
    );
  }
  next();
});

// Token auth generation
userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

// Remove unnecessary fields
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  delete user.tokens;
  return user;
};

// Find user by credential
userSchema.statics.findByCredentials = async function (username, password) {
  const user = await User.findOne({ username });

  if (!user) throw new Error("Wrong credentials");

  const originalPassword = cryptoJS.AES.decrypt(
    user.password,
    process.env.CRYPTOJS_SECRET
  ).toString(cryptoJS.enc.Utf8);

  if (originalPassword !== password) throw new Error("Wrong credentials");

  return user;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
