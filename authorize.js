const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

module.exports = function (req, resp, next) {
    const token = req.cookies.token;
    console.log("token", token);

    if (!token) return resp.status(403).json({ success: false, message: "UNAUTHORIZED" });

    try {
        const promises = jwt.verify(token, JWT_SECRET);
        req.userEmail = promises.email;

        next();
    } catch {
        return resp.status(403).json({ success: false, message: "UNAUTHORIZED" });
    }
}