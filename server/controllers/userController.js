const { User } = require('../models');
const { comparePassword } = require('../helpers/bcrypt');
const { generateToken } = require('../helpers/jwt');
const { OAuth2Client } = require('google-auth-library');

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
    }    static async login(req, res, next) {
        try {
            const { email, password, role } = req.body;
            if (!email) {
                throw { name: 'BadRequest', message: 'Email is required' };
            }
            if (!password) {
                throw { name: 'BadRequest', message: 'Password is required' };
            }
            if (!role) {
                throw { name: 'BadRequest', message: 'Role selection is required' };
            }

            // Check if user exists with correct role
            const user = await User.findOne({ 
                where: { 
                    email,
                    role 
                } 
            });
            if (!user) {
                throw { name: 'Unauthorized', message: 'Invalid email/password or role' };
            }

            // Verify password
            const isPasswordValid = comparePassword(password, user.password);
            if (!isPasswordValid) {
                throw { name: 'Unauthorized', message: 'Invalid email/password' };
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
    } static async googleLogin(req, res, next) {
        try {
            const { credential, role } = req.body;

            if (!credential) {
                throw { name: 'BadRequest', message: 'Google credential is required' };
            }
            if (!role) {
                throw { name: 'BadRequest', message: 'Role selection is required' };
            }

            const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
            const ticket = await client.verifyIdToken({
                idToken: credential,
                audience: process.env.GOOGLE_CLIENT_ID
            });
            const payload = ticket.getPayload();

            // Use findOrCreate to handle the user creation/retrieval atomically
            const [user, created] = await User.findOrCreate({
                where: { email: payload.email },
                defaults: {
                    fullName: payload.name,
                    password: 'GOOGLE-LOGIN-' + Date.now(),
                    role: role
                }
            });

            // If user exists but with different role, handle accordingly
            if (!created && user.role !== role) {
                throw {
                    name: 'Unauthorized',
                    message: `This email is already registered as a ${user.role}. Please login with the correct role.`
                };
            }

            // Generate JWT token
            const access_token = generateToken({
                id: user.id,
                email: user.email,
                role: user.role
            });

            res.json({
                message: created ? 'Google signup successful' : 'Google login successful',
                data: {
                    access_token,
                    fullName: user.fullName,
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
