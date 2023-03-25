import connectToDatabase from "@/utils/dbConnect";
import Post from "@/model/Post";

connectToDatabase();

export default async function handler(req, res) {
  const { username } = req.query;

  const post = await Post.findOne({
    author: username,
  });

  try {
    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found." });
    }

    post.likes.push(post.author);
    await post.save();

    res.status(200).json({ success: true, message: "Post liked!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error liking post." });
  }
}
