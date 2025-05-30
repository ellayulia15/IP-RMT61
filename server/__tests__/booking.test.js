const request = require('supertest');
const app = require('../app');
const { User, Tutor, Schedule, Booking } = require('../models');
const { generateToken } = require('../helpers/jwt');

let tutorToken;
let studentToken;
let testScheduleId;
let testBookingId;
let tutorProfile;

beforeAll(async () => {
    // Create test tutor
    const testTutor = await User.create({
        fullName: 'Test Tutor',
        email: 'tutor@mail.com',
        password: 'password123',
        role: 'Tutor'
    });

    tutorToken = generateToken({
        id: testTutor.id,
        email: testTutor.email,
        role: testTutor.role
    });    // Create test student
    const testStudent = await User.create({
        fullName: 'Test Student',
        email: 'student@mail.com',
        password: 'password123',
        role: 'Student'
    });

    studentToken = generateToken({
        id: testStudent.id,
        email: testStudent.email,
        role: testStudent.role
    });

    // Create tutor profile
    tutorProfile = await Tutor.create({
        UserId: testTutor.id,
        photoUrl: 'https://example.com/photo.jpg',
        subjects: 'Mathematics',
        style: 'Interactive'
    });

    // Create test schedule
    const schedule = await Schedule.create({
        TutorId: tutorProfile.id,
        date: new Date('2025-12-31'),
        time: '10:00 - 12:00',
        fee: 100000
    });
    testScheduleId = schedule.id;    // Create test booking
    const booking = await Booking.create({
        studentId: testStudent.id,
        ScheduleId: schedule.id,
        bookingStatus: 'Pending',
        paymentStatus: 'Pending'
    });
    testBookingId = booking.id;
});

describe('BookingController', () => {
    describe('POST /bookings', () => {
        it('should create booking when authenticated as student', async () => {
            // Pastikan tutorProfile sudah didefinisikan di beforeAll
            const newSchedule = await Schedule.create({
                TutorId: tutorProfile.id,
                date: new Date('2025-12-30'),
                time: '14:00 - 16:00',
                fee: 120000
            });
            const response = await request(app)
                .post('/bookings')
                .set('Authorization', `Bearer ${studentToken}`)
                .send({ ScheduleId: newSchedule.id });

            expect(response.status).toBe(201);
            expect(response.body.data).toHaveProperty('bookingStatus', 'Pending');
            expect(response.body.data).toHaveProperty('paymentStatus', 'Pending');
        });

        it('should fail when authenticated as tutor', async () => {
            const schedule = await Schedule.findOne({ where: { id: testScheduleId } });
            const response = await request(app)
                .post('/bookings')
                .set('Authorization', `Bearer ${tutorToken}`)
                .send({
                    ScheduleId: schedule.id
                });

            expect(response.status).toBe(403);
        });
    });

    describe('GET /bookings', () => {
        it('should get student bookings when authenticated as student', async () => {
            const response = await request(app)
                .get('/bookings')
                .set('Authorization', `Bearer ${studentToken}`);

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body.data)).toBe(true);
            expect(response.body.data[0]).toHaveProperty('bookingStatus');
        });

        it('should get tutor bookings when authenticated as tutor', async () => {
            const response = await request(app)
                .get('/bookings')
                .set('Authorization', `Bearer ${tutorToken}`);

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body.data)).toBe(true);
        });
    }); describe('PATCH /bookings/:id/status', () => {
        it('should update booking status when authenticated as tutor', async () => {
            const response = await request(app)
                .patch(`/bookings/${testBookingId}/status`)
                .set('Authorization', `Bearer ${tutorToken}`)
                .send({
                    status: 'Approved'
                });

            expect(response.status).toBe(200);
            expect(response.body.data).toHaveProperty('bookingStatus', 'Approved');
        });

        it('should fail when authenticated as student', async () => {
            const response = await request(app)
                .patch(`/bookings/${testBookingId}/status`)
                .set('Authorization', `Bearer ${studentToken}`)
                .send({
                    status: 'Approved'
                });

            expect(response.status).toBe(403);
        });
    });

    describe('DELETE /bookings/:id', () => {
        it('should delete pending booking when authenticated as student owner', async () => {
            // Ambil student dan schedule yang benar dari beforeAll
            const student = await User.findOne({ where: { email: 'student@mail.com' } });
            const schedule = await Schedule.findOne({ where: { id: testScheduleId } });
            // Buat booking dengan data yang valid
            const booking = await Booking.create({
                studentId: student.id,
                ScheduleId: schedule.id,
                bookingStatus: 'Pending',
                paymentStatus: 'Pending'
            });
            const response = await request(app)
                .delete(`/bookings/${booking.id}`)
                .set('Authorization', `Bearer ${studentToken}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('message', 'Booking deleted successfully');
        });
    });
});

afterAll(async () => {
    await User.destroy({ truncate: true, cascade: true });
    await Tutor.destroy({ truncate: true, cascade: true });
    await Schedule.destroy({ truncate: true, cascade: true });
    await Booking.destroy({ truncate: true, cascade: true });
});
