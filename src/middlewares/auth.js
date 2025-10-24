const jwt = require("jsonwebtoken");
const User = require("../models/user");

const auth = async (req, res, next) => {
  const authHeader = req.header("Authorization");
  if (!authHeader || !authHeader.startWith("Bearer")) {
    return res.status(401).json({ error: "Token not attached" });
  }
  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.id).select("-password");
    if (!user)
      return res.status(404).json({ error: "Invalid token - user not found" });
    req.user = user;
    next();
  } catch (error) {
    console.log("error", error);
    return res.status(500).json({ error: "Token Invalid or expired" });
  }
};

module.exports = auth;
