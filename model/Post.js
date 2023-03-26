import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  comment: { type: String, required: true },
  author: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const postSchema = new mongoose.Schema({
  text: { type: String, required: true },
  author: { type: String, required: true },
  likes: { type: Array, default: [] },
  createdAt: { type: Date, default: Date.now },
  comments: [commentSchema],
});

export default mongoose.models.Post || mongoose.model("Post", postSchema);
