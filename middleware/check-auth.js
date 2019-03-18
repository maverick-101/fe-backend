var jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      return res.status(403).json({
        message: "No Authorization Token Found!"
      })
    }
    const token = req.headers.authorization.split(" ")[1]
    const decode = jwt.verify(token, 'secret')
    req.userData = decode
    next()
  } catch (error) {
    return res.status(401).json({
      message: "Auth Failed!"
    })
  }
}