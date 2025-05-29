const { verifyToken } = require('../helpers/jwt');
const { User } = require('../models');

async function authentication(req, res, next) {
    try {
        // Check if authorization header exists
        const { authorization } = req.headers;
        if (!authorization) {
            throw { name: 'Unauthorized', message: 'Invalid token' };
        }

        // Get token from Bearer header
        const rawToken = authorization.split(' ');
        const tokenType = rawToken[0];
        const tokenValue = rawToken[1];
        if (tokenType !== 'Bearer' || !tokenValue) {
            throw { name: 'Unauthorized', message: 'Invalid token' };
        }

        // Verify token and get payload
        const payload = verifyToken(tokenValue);

        // Check if user exists
        const user = await User.findByPk(payload.id);
        if (!user) {
            throw { name: 'Unauthorized', message: 'Invalid token' };
        }

        // Add user data to request
        req.user = {
            id: user.id,
            email: user.email,
            role: user.role
        };

        next();
    } catch (err) {
        next(err);
    }
}

module.exports = authentication;