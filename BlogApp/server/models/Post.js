const mongoose = require("mongoose");

const postSchema = mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    photo: { type: String, required: false },
    categories: { type: Array, required: false },
    username: { type: String, required: true },
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
