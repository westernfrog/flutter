import mongoose, { models, model } from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true, // Corrected typo: 'require' should be 'required'
    },
    username: {
      type: String,
      required: true, // Corrected typo: 'require' should be 'required'
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      unique: true,
    },
    followers: {
      type: Array,
      default: [],
    },
    following: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

const Flutter = models.Flutter || model("Flutter", userSchema);

export default Flutter;
