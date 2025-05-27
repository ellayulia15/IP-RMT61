# TutorHub - Private Tutoring Platform

A platform that connects private tutors with students (or parents) looking for tutors. The platform is equipped with an AI system to recommend tutors based on students' interests and learning styles.

## Features

### Public Access
- View tutor profiles
- View available tutor schedules
- Register as a tutor or student
- View tutor ratings and reviews

### Student Features
- Book tutor sessions
- Process payments after schedule approval
- Provide ratings and reviews after sessions
- Get AI-based tutor recommendations based on:
  - Learning interests
  - Learning style
- View learning history

### Tutor Features
- Manage tutor profile
- CRUD teaching schedules
- Approve/reject student bookings
- View teaching history
- View received ratings and reviews

## Tech Stack

### Frontend
- React
- React Router
- Bootstrap
- Axios
- SweetAlert2

### Backend
- Express.js
- PostgreSQL
- Sequelize ORM
- JWT Authentication
- bcryptjs

## Database Schema

### Users Table
- id: INTEGER, PK, AUTO_INCREMENT
- fullName: STRING, NOT NULL
- email: STRING, UNIQUE, NOT NULL, isEmail
- password: STRING, NOT NULL, MIN(6)
- role: STRING, NOT NULL
- createdAt: DATE, NOT NULL
- updatedAt: DATE, NOT NULL
RELATIONSHIPS:
  - Has one TutorProfile (only if role is 'Tutor')
  - Has many Bookings (as student or tutor)
  - Has many Reviews (as reviewer or reviewed)

### Tutors (only for users with role='Tutor')
- id: INTEGER, PK, AUTO_INCREMENT
- UserId: INTEGER, FK(Users.id), NOT NULL, UNIQUE
- photoUrl: STRING, NOT NULL
- subjects: STRING, NOT NULL
- style: STRING, NOT NULL
- createdAt: DATE, NOT NULL
- updatedAt: DATE, NOT NULL
CONSTRAINTS:
  - Can only be created for users with role='Tutor'
  - One tutor can have only one profile (1:1)

### Schedules
- id: INTEGER, PK, AUTO_INCREMENT
- TutorId: INTEGER, FK(Users.id), NOT NULL
- date: DATE, NOT NULL
- time: TIME, NOT NULL
- fee: INTEGER, NOT NULL
- createdAt: DATE, NOT NULL
- updatedAt: DATE, NOT NULL
CONSTRAINTS:
  - date must not be in the past

### Bookings
- id: INTEGER, PK, AUTO_INCREMENT
- studentId: INTEGER, FK(Users.id), NOT NULL
- ScheduleId: INTEGER, FK(Schedules.id), NOT NULL
- bookingStatus: STRING ('pending', 'approved', 'rejected'), DEFAULT('pending')
- paymentStatus: STRING ('pending', 'paid'), DEFAULT('pending')
- createdAt: DATE, NOT NULL
- updatedAt: DATE, NOT NULL
CONSTRAINTS:
  - One student can't book same tutor at overlapping times
  - Cannot book cancelled schedules

## API Endpoints

### Public Routes
- GET /tutors - List all tutors
- GET /tutors/:id - Get tutor profile details
- GET /tutors/:id/schedules - Get tutor's available schedules
- POST /register - Register new user
- POST /login - User login

### Protected Routes
#### Students
- POST /bookings - Create new booking
- GET /bookings/history - View booking history
- POST /payments - Process payment
- POST /reviews - Submit rating and review
- GET /recommendations - Get AI tutor recommendations

#### Tutors
- GET /schedules - View teaching schedules
- POST /schedules - Add new schedule
- PUT /schedules/:id - Update schedule
- DELETE /schedules/:id - Delete schedule
- PUT /bookings/:id/status - Approve/reject booking
- GET /reviews - View received ratings and reviews

## Getting Started

### Prerequisites
- Node.js
- PostgreSQL
- npm/yarn

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   # Install server dependencies
   cd server
   npm install

   # Install client dependencies
   cd ../client
   npm install
   ```
3. Set up environment variables
4. Run migrations
5. Start development servers:
   ```bash
   # Start server
   cd server
   npm run dev

   # Start client
   cd client
   npm run dev
   ```
