import connectToDatabase from "@/utils/dbConnect";
import Post from "@/model/Post";
import Flutter from "@/model/User";

connectToDatabase();
export default async function createPost(req, res) {
  if (req.method === "POST") {
    const { text, username } = req.body;

    try {
      // Find user by ID
      const user = await Flutter.findOne({ username });
      const author = user.username;

      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }

      // Create new post
      const post = new Post({ text, author: author });
      await post.save();

      res.status(201).json({ message: "Post created successfully!" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Could not create post." });
    }
  } else {
    res.status(400).json({ message: "Invalid request method." });
  }
}
