const request = require('supertest');
const app = require('../app');
const { User, Tutor } = require('../models');
const { generateToken } = require('../helpers/jwt');
const { hashPassword } = require('../helpers/bcrypt');
jest.mock('openai');

let studentToken;

beforeAll(async () => {
    await User.destroy({ truncate: true, cascade: true });
    await Tutor.destroy({ truncate: true, cascade: true });

    // Create test student
    const testStudent = await User.create({
        fullName: 'Test Student',
        email: 'student@mail.com',
        password: hashPassword('password123'),
        role: 'Student'
    });

    studentToken = generateToken({
        id: testStudent.id,
        email: testStudent.email,
        role: testStudent.role
    });

    // Create test tutor
    const testTutor = await User.create({
        fullName: 'Test Tutor',
        email: 'tutor@mail.com',
        password: hashPassword('password123'),
        role: 'Tutor'
    });

    // Create tutor profile
    await Tutor.create({
        UserId: testTutor.id,
        photoUrl: 'https://example.com/photo.jpg',
        subjects: 'Mathematics',
        style: 'Interactive'
    });
});

describe('AIController', () => {
    describe('POST /ai/recommendations', () => {
        it('should return AI recommendations based on user input', async () => {
            const response = await request(app)
                .post('/ai/recommendations')
                .set('Authorization', `Bearer ${studentToken}`)
                .send({
                    messages: [
                        {
                            role: 'user',
                            content: 'I need a math tutor who is interactive'
                        }
                    ]
                });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('reply');
            expect(typeof response.body.reply).toBe('string');
        });

        it('should fail with empty messages', async () => {
            const response = await request(app)
                .post('/ai/recommendations')
                .set('Authorization', `Bearer ${studentToken}`)
                .send({
                    messages: []
                });

            expect(response.status).toBe(400);
        });
    });
});

afterAll(async () => {
    await User.destroy({ truncate: true, cascade: true });
    await Tutor.destroy({ truncate: true, cascade: true });
});
