import connectToDatabase from "@/utils/dbConnect";
import Post from "@/model/Post";

export default async function handler(req, res) {
  await connectToDatabase();

  const comments = await Post.find()
    .sort("-createdAt")
    .limit(10)
    .populate("comments");

  res.status(200).json(comments);
}
