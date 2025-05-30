const request = require('supertest');
const app = require('../app');
const { User } = require('../models');
const { generateToken } = require('../helpers/jwt');
const { hashPassword } = require('../helpers/bcrypt');

let validToken;
let testUserId;

beforeAll(async () => {
    await User.destroy({ truncate: true, cascade: true });
    
    // Create test user without hashing password in test
    const testUser = await User.create({
        fullName: 'Test User',
        email: 'test@mail.com',
        password: 'password123', // Let the model hooks handle password hashing
        role: 'Student'
    });

    console.log('Test user created:', {
        id: testUser.id,
        email: testUser.email,
        role: testUser.role,
        password: testUser.password // to verify it's hashed
    });

    testUserId = testUser.id;
    validToken = generateToken({
        id: testUser.id,
        email: testUser.email,
        role: testUser.role
    });
});

describe('UserController', () => {
    describe('POST /register', () => {
        it('should successfully register a new user', async () => {
            const response = await request(app)
                .post('/register')
                .send({
                    fullName: 'New User',
                    email: 'new@mail.com',
                    password: 'password123',
                    role: 'Student'
                });

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('message', 'User registered successfully');
            expect(response.body.data).toHaveProperty('email', 'new@mail.com');
            expect(response.body.data).not.toHaveProperty('password');
        });

        it('should fail if email is already registered', async () => {
            const response = await request(app)
                .post('/register')
                .send({
                    fullName: 'Test User',
                    email: 'test@mail.com',
                    password: 'password123',
                    role: 'Student'
                });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message');
        });
    });

    describe('POST /login', () => {        it('should successfully login with correct credentials', async () => {
            // First verify the user exists
            const user = await User.findOne({ 
                where: { email: 'test@mail.com' } 
            });
            console.log('Before login, verifying user:', {
                exists: !!user,
                email: user?.email,
                role: user?.role,
                hashedPassword: user?.password
            });

            const response = await request(app)
                .post('/login')
                .send({
                    email: 'test@mail.com',
                    password: 'password123',
                    role: 'Student'
                });

            console.log('Login response:', {
                status: response.status,
                body: response.body
            });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('message', 'Login successful');
            expect(response.body.data).toHaveProperty('access_token');
            expect(response.body.data).toHaveProperty('fullName');
            expect(response.body.data).toHaveProperty('email');
            expect(response.body.data).toHaveProperty('role');
        });

        it('should fail with incorrect password', async () => {
            const response = await request(app)
                .post('/login')
                .send({
                    email: 'test@mail.com',
                    password: 'wrongpassword',
                    role: 'Student'
                });

            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty('message', 'Invalid email/password');
        });

        it('should fail with incorrect role', async () => {
            const response = await request(app)
                .post('/login')
                .send({
                    email: 'test@mail.com',
                    password: 'password123',
                    role: 'Tutor'
                });

            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty('message', 'Invalid email/password or role');
        });
    });
});

afterAll(async () => {
    await User.destroy({ truncate: true, cascade: true });
});
