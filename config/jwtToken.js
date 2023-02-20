const jwt = require("jsonwebtoken");

const generateToken = (id,role) => {
  return jwt.sign({ id, role }, '123', { expiresIn: "1d" });
};

module.exports = { generateToken };