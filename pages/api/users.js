import connectToDatabase from "@/utils/dbConnect";
import Flutter from "@/model/User";

connectToDatabase();

export default async function users(req, res) {
  try {
    const users = await Flutter.find({}, "name username");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}
