import connectToDatabase from "@/utils/dbConnect";
import Flutter from "@/model/User";

connectToDatabase();

export default async function handler(req, res) {
  if (req.method === "PUT") {
    const { username } = req.query;
    const { username: currentUserUsername } = req.body;

    const currentUser = await Flutter.findOne({
      username: currentUserUsername,
    });

    const userToFollow = await Flutter.findOne({ username });

    currentUser.following.push(userToFollow.username);
    await currentUser.save();

    userToFollow.followers.push(currentUser.username);
    await userToFollow.save();

    res.status(200).json({ message: "Followed successfully" });
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
