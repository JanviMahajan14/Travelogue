const jwt = require('jsonwebtoken');
const User = require('../models/user');

const auth = async function (req, res, next) {
    try {
        const token = req.header('Authorization').replace('Bearer ', "");
        const decode = await jwt.verify(token, 'pizza1234');
        const user = await User.findOne({ _id: decode._id, 'tokens.token': token });
        if (!user) {
            throw new Error("Invalid login");
        }
        req.token = token;
        req.user = user;
        next();
    } catch (error) {
        res.statusCode = 400;
        res.send({ error : "You must be logged in" })
    }
}

module.exports = auth;