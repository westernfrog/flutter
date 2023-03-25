import connectToDatabase from "@/utils/dbConnect";
import Post from "@/model/Post";

export default async function handler(req, res) {
  // Connect to MongoDB
  await connectToDatabase();

  // Fetch the latest posts and their authors
  const posts = await Post.find()
    .sort("-createdAt")
    .limit(10)
    .populate("author", "username");

  res.status(200).json(posts);
}
