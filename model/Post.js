import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  text: { type: String, required: true },
  author: { type: String, required: true },
  likes: { type: Array, default: [] },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Post || mongoose.model("Post", postSchema);
