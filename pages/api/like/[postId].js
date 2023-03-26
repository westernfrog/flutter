import connectToDatabase from "@/utils/dbConnect";
import Post from "@/model/Post";

connectToDatabase();

export default async function handler(req, res) {
  const {
    method,
    query: { username },
    body: { likes },
    query: { postId },
  } = req;

  await connectToDatabase();

  switch (method) {
    case "POST":
      try {
        const post = await Post.findById(postId);

        if (!post) {
          return res.status(404).json({ message: "Post not found" });
        }

        const hasLiked = post.likes.some((user) => user === username);

        if (hasLiked) {
          return res
            .status(400)
            .json({ message: "User has already liked this post" });
        }

        post.likes.push(username);
        post.likes = likes;

        await post.save();

        res.status(200).json({ message: "Post liked successfully" });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
      }
      break;

    default:
      res.setHeader("Allow", ["POST"]);
      res.status(405).json({ message: `Method ${method} not allowed` });
  }
}
