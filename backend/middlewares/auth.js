const jwt = require("jsonwebtoken")
const User = require("../models/userModel")

exports.isAuthenticated = async (req, res, next) => {
    const { Token } = req.cookies

    if (!Token) {
        return res.status(401).json({ success: false, message: "Please Login..." })
    }

    const decodedData = jwt.verify(Token, process.env.JWT_SECRET)

    req.user = await User.findById(decodedData.id)

    next();
}

exports.authorizeRole = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role)){
            return res.status(401).json({ success: false, message: `role: ${req.user.role} is not allowed to access this resource` })
        }
        next();
    }

}