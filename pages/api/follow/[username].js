import connectToDatabase from "@/utils/dbConnect";
import Flutter from "@/model/User";
import jwt from "jsonwebtoken";

connectToDatabase();

export default async function handler(req, res) {
  if (req.method === "PUT") {
    const { username } = req.query;
    const { username: currentUserUsername } = req.body;

    // Find the current user
    const currentUser = await Flutter.findOne({
      username: currentUserUsername,
    });

    // Find the user to follow
    const userToFollow = await Flutter.findOne({ username });

    // Add the user to the current user's followers
    currentUser.following.push(userToFollow.username);
    await currentUser.save();

    // Add the current user to the user to follow's following
    userToFollow.followers.push(currentUser.username);
    await userToFollow.save();

    res.status(200).json({ message: "Followed successfully" });
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
