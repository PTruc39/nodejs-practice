const jwt = require("jsonwebtoken");

const generateRefreshToken = (id) => {
  return jwt.sign({ id }, "123", { expiresIn: "3d" });
};

module.exports = { generateRefreshToken };