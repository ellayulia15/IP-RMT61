const request = require('supertest');
const app = require('../app');
const { User, Tutor, Schedule } = require('../models');
const { generateToken } = require('../helpers/jwt');
const { hashPassword } = require('../helpers/bcrypt');

let tutorToken;
let studentToken;
let testScheduleId;
let testTutorProfileId;

beforeAll(async () => {
    await User.destroy({ truncate: true, cascade: true });
    await Tutor.destroy({ truncate: true, cascade: true });
    await Schedule.destroy({ truncate: true, cascade: true });

    // Create test tutor
    const testTutor = await User.create({
        fullName: 'Test Tutor',
        email: 'tutor@mail.com',
        password: hashPassword('password123'),
        role: 'Tutor'
    });

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
        UserId: testTutor.id,
        photoUrl: 'https://example.com/photo.jpg',
        subjects: 'Mathematics',
        style: 'Interactive'
    });
    testTutorProfileId = tutorProfile.id;

    // Create test schedule
    const schedule = await Schedule.create({
        TutorId: tutorProfile.id,
        date: new Date('2025-12-31'),
        time: '10:00',
        fee: 100000
    });
    testScheduleId = schedule.id;
});

describe('ScheduleController', () => {
    describe('POST /schedules', () => {
        it('should create schedule when authenticated as tutor', async () => {
            const response = await request(app)
                .post('/schedules')
                .set('Authorization', `Bearer ${tutorToken}`)
                .send({
                    date: '2025-12-25',
                    time: '14:00',
                    fee: 150000
                });

            expect(response.status).toBe(201);
            expect(response.body.data).toHaveProperty('time', '14:00');
            expect(response.body.data).toHaveProperty('fee', 150000);
        });

        it('should fail when authenticated as student', async () => {
            const response = await request(app)
                .post('/schedules')
                .set('Authorization', `Bearer ${studentToken}`)
                .send({
                    date: '2025-12-25',
                    time: '14:00',
                    fee: 150000
                });

            expect(response.status).toBe(403);
        });
    });

    describe('GET /schedules', () => {
        it('should get tutor schedules when authenticated as tutor', async () => {
            const response = await request(app)
                .get('/schedules')
                .set('Authorization', `Bearer ${tutorToken}`);

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body.data)).toBe(true);
            expect(response.body.data[0]).toHaveProperty('fee');
        });
    });

    describe('PUT /schedules/:id', () => {
        it('should update schedule when authenticated as owner', async () => {
            const response = await request(app)
                .put(`/schedules/${testScheduleId}`)
                .set('Authorization', `Bearer ${tutorToken}`)
                .send({
                    time: '15:00',
                    fee: 200000
                });

            expect(response.status).toBe(200);
            expect(response.body.data).toHaveProperty('time', '15:00');
            expect(response.body.data).toHaveProperty('fee', 200000);
        });
    });

    describe('DELETE /schedules/:id', () => {
        it('should delete schedule when authenticated as owner', async () => {
            const response = await request(app)
                .delete(`/schedules/${testScheduleId}`)
                .set('Authorization', `Bearer ${tutorToken}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('message', 'Schedule deleted successfully');
        });
    });
});

afterAll(async () => {
    await User.destroy({ truncate: true, cascade: true });
    await Tutor.destroy({ truncate: true, cascade: true });
    await Schedule.destroy({ truncate: true, cascade: true });
});
