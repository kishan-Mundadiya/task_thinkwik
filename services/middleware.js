const jwt = require('jsonwebtoken');
const config = require('../config/config');

let middleware = async(req, res, next) => {
    let unAuthorizedUrls = [
        '/signin',
        '/signup'
    ]
    if (!unAuthorizedUrls.includes(req.url)) {
        let token = req.header('Authorization');
        let jwtSecretKey = config.JWT_SECRET_TOKEN;
        
        jwt.verify(JSON.parse(token), jwtSecretKey, (err, varified) => {
            if (varified) {
                next();
            } else if (err) {
                return res.status(401).json({ 'message': 'Authentication Fail' })
            }
        });
    } else {
        next()
    }
}

module.exports = middleware