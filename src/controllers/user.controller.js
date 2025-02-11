import User from "../models/User";

export const registerUser = async (req, res) => {
  try {
    const { name, surname, team, password } = req.body;
    const newUser = new User({ name, surname, team, password });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error registering user", error });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { name, password } = req.body;
    const user = await User.findOne({ name });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (password !== user.password) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    res.status(200).json({ message: "Login successful", user });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
};