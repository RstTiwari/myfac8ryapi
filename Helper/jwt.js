const jwt = require("jsonwebtoken");
const Token_key = "meerakin";

const JWT = async function (user) {
  const token = jwt.sign(
    {
      payload: { user: user },
    },
    Token_key,
    { expiresIn: "3h" }
  );
  return token;
};
module.exports = JWT;
