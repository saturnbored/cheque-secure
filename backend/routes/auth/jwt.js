const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
  const token = req.headers["x-access-token"];
  // console.log("hu", authHeader);
  // const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}
function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_KEY, { expiresIn: "1h" });
}

module.exports = {
  authenticateToken,
  generateAccessToken,
};
