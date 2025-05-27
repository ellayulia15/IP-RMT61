const { User } = require('../models');
const { comparePassword } = require('../helpers/bcrypt');
const { generateToken } = require('../helpers/jwt');

class UserController {
    static async register(req, res, next) {
        try {
            const { fullName, email, password, role } = req.body;
            const user = await User.create({ fullName, email, password, role });

            res.status(201).json({
                message: 'User registered successfully',
                data: {
                    id: user.id,
                    fullName: user.fullName,
                    email: user.email,
                    role: user.role
                }
            });
        } catch (err) {
            next(err);
        }
    }

    static async login(req, res, next) {
        try {
            const { email, password } = req.body;

            // Check if user exists
            const user = await User.findOne({ where: { email } });
            if (!user) {
                throw { status: 401, message: 'Invalid email/password' };
            }

            // Verify password
            const isPasswordValid = comparePassword(password, user.password);
            if (!isPasswordValid) {
                throw { status: 401, message: 'Invalid email/password' };
            }

            // Generate JWT token
            const access_token = generateToken({
                id: user.id,
                email: user.email,
                role: user.role
            });

            res.json({
                message: 'Login successful',
                data: {
                    access_token,
                    username: user.username,
                    email: user.email,
                    role: user.role
                }
            });
        } catch (err) {
            next(err);
        }
    }
}

module.exports = UserController;
