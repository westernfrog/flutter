import CryptoJS from "crypto-js";
import Flutter from "@/model/User";
import connectToDatabase from "@/utils/dbConnect";

export default async function newUser(req, res) {
  await connectToDatabase();

  if (req.method !== "POST") {
    return res.status(400).json({ error: "This method is not allowed" });
  }
  const existingUser = await Flutter.findOne({ email: req.body.email });
  if (existingUser) {
    return res
      .status(200)
      .json({ success: false, error: "User already exists kindly login." });
  }
  const { name, username, email, password } = req.body;
  const encryptedPassword = CryptoJS.AES.encrypt(
    password,
    "secret123"
  ).toString();
  const user = new Flutter({
    name,
    username,
    email,
    password: encryptedPassword,
  });
  await user.save();

  res.status(200).json({ success: true });
}
