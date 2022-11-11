const jwt = require("jsonwebtoken")
const token_key = "meeraki"

const JWT = (user)=>{
  const token = jwt.sign({ payload: user },token_key, {
    expiresIn: "5h",
  })
  return token
}

module.exports = JWT