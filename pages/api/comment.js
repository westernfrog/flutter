import connectToDatabase from "@/utils/dbConnect";
import Post from "@/model/Post";

connectToDatabase();
export default async function comment(req, res) {
  if (req.method === "POST") {
    const { comment, username, postId } = req.body;

    const newComment = {
      comment: comment,
      author: username,
    };

    const post = await Post.findById(postId);

    post.comments.push(newComment);
    await post.save();
  }
}
