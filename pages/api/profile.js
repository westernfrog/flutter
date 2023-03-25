import Flutter from "@/model/User";
import connectToDatabase from "@/utils/dbConnect";

connectToDatabase();

export default async function search(req, res) {
  const { username } = req.body;
  const user = await Flutter.findOne({ username });
  if (user) {
    res.status(200).json({
      name: user.name,
      email: user.email,
      followers: user.followers.length,
      following: user.following.length,
    });
  } else {
    res.status(404).json({ message: "User not found" });
  }
}
