const request = require('supertest');
const app = require('../app');
const { User, Tutor, Schedule, Booking } = require('../models');
const { generateToken } = require('../helpers/jwt');
const { hashPassword } = require('../helpers/bcrypt');
jest.mock('../config/midtrans');

let studentToken;
let testBookingId;

beforeAll(async () => {
    await User.destroy({ truncate: true, cascade: true });
    await Tutor.destroy({ truncate: true, cascade: true });
    await Schedule.destroy({ truncate: true, cascade: true });
    await Booking.destroy({ truncate: true, cascade: true });

    // Create test tutor user
    const testTutor = await User.create({
        fullName: 'Test Tutor',
        email: 'tutor@mail.com',
        password: hashPassword('password123'),
        role: 'Tutor'
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

    // Create test schedule
    const schedule = await Schedule.create({
        TutorId: tutorProfile.id,
        date: new Date('2025-12-31'),
        time: '10:00',
        fee: 100000
    });

    // Create test booking
    const booking = await Booking.create({
        studentId: testStudent.id,
        ScheduleId: schedule.id,
        bookingStatus: 'Approved',
        paymentStatus: 'Pending'
    });
    testBookingId = booking.id;
});

describe('PaymentController', () => {
    describe('POST /payments/:bookingId', () => {
        it('should create payment token for valid booking', async () => {
            const response = await request(app)
                .post(`/payments/${testBookingId}`)
                .set('Authorization', `Bearer ${studentToken}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('paymentToken');
            expect(response.body).toHaveProperty('paymentUrl');
        });

        it('should fail for non-existent booking', async () => {
            const response = await request(app)
                .post('/payments/99999')
                .set('Authorization', `Bearer ${studentToken}`);

            expect(response.status).toBe(404);
        });
    });

    describe('POST /payments/notification', () => {
        it('should handle successful payment notification', async () => {
            const response = await request(app)
                .post('/payments/notification')
                .send({
                    order_id: `BOOKING-${testBookingId}-${Date.now()}`,
                    transaction_status: 'settlement'
                });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('message', 'OK');
        });
    });
});

afterAll(async () => {
    await User.destroy({ truncate: true, cascade: true });
    await Tutor.destroy({ truncate: true, cascade: true });
    await Schedule.destroy({ truncate: true, cascade: true });
    await Booking.destroy({ truncate: true, cascade: true });
});
