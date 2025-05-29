const request = require('supertest');
const app = require('../app');
const { User, Tutor } = require('../models');
const { generateToken } = require('../helpers/jwt');
const { hashPassword } = require('../helpers/bcrypt');

let tutorToken;
let studentToken;
let testTutorId;
let testTutorProfileId;

beforeAll(async () => {
    await User.destroy({ truncate: true, cascade: true });
    await Tutor.destroy({ truncate: true, cascade: true });

    // Create test tutor
    const testTutor = await User.create({
        fullName: 'Test Tutor',
        email: 'tutor@mail.com',
        password: hashPassword('password123'),
        role: 'Tutor'
    });
    testTutorId = testTutor.id;
    tutorToken = generateToken({
        id: testTutor.id,
        email: testTutor.email,
        role: testTutor.role
    });

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

    // Create tutor profile
    const tutorProfile = await Tutor.create({
        UserId: testTutorId,
        photoUrl: 'https://example.com/photo.jpg',
        subjects: 'Mathematics',
        style: 'Interactive'
    });
    testTutorProfileId = tutorProfile.id;
});

describe('TutorController', () => {
    describe('GET /pub/tutors', () => {
        it('should list all tutors', async () => {
            const response = await request(app)
                .get('/pub/tutors');

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('message', 'Tutors retrieved successfully');
            expect(Array.isArray(response.body.data)).toBe(true);
            expect(response.body.data[0]).toHaveProperty('subjects');
        });
    });

    describe('GET /pub/tutors/:id', () => {
        it('should get tutor details by id', async () => {
            const response = await request(app)
                .get(`/pub/tutors/${testTutorProfileId}`);

            expect(response.status).toBe(200);
            expect(response.body.data).toHaveProperty('id', testTutorProfileId);
            expect(response.body.data).toHaveProperty('subjects', 'Mathematics');
        });

        it('should return 404 for non-existent tutor', async () => {
            const response = await request(app)
                .get('/pub/tutors/99999');

            expect(response.status).toBe(404);
        });
    });

    describe('POST /tutors', () => {
        it('should create tutor profile when authenticated as tutor', async () => {
            await Tutor.destroy({ where: { UserId: testTutorId } }); // Clean existing profile

            const response = await request(app)
                .post('/tutors')
                .set('Authorization', `Bearer ${tutorToken}`)
                .send({
                    photoUrl: 'https://example.com/newphoto.jpg',
                    subjects: 'Physics',
                    style: 'Structured'
                });

            expect(response.status).toBe(201);
            expect(response.body.data).toHaveProperty('subjects', 'Physics');
        });

        it('should fail when authenticated as student', async () => {
            const response = await request(app)
                .post('/tutors')
                .set('Authorization', `Bearer ${studentToken}`)
                .send({
                    photoUrl: 'https://example.com/photo.jpg',
                    subjects: 'Chemistry',
                    style: 'Interactive'
                });

            expect(response.status).toBe(403);
        });
    });

    describe('PUT /tutors', () => {
        it('should update tutor profile when authenticated as owner', async () => {
            const response = await request(app)
                .put('/tutors')
                .set('Authorization', `Bearer ${tutorToken}`)
                .send({
                    photoUrl: 'https://example.com/updated.jpg',
                    subjects: 'Physics, Mathematics',
                    style: 'Interactive and Structured'
                });

            expect(response.status).toBe(200);
            expect(response.body.data).toHaveProperty('subjects', 'Physics, Mathematics');
        });
    });
});

afterAll(async () => {
    await User.destroy({ truncate: true, cascade: true });
    await Tutor.destroy({ truncate: true, cascade: true });
});
