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
  - Learning preferences
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
- username: STRING, UNIQUE, NOT NULL, MIN(4)
- email: STRING, UNIQUE, NOT NULL, isEmail
- password: STRING, NOT NULL, MIN(6)
- role: STRING, NOT NULL
- createdAt: DATE, NOT NULL
- updatedAt: DATE, NOT NULL

### Tutors Profile
- id: INTEGER, PK, AUTO_INCREMENT
- user_id: INTEGER, FK(Users.id), NOT NULL
- full_name: STRING(100), NOT NULL
- photo_url: STRING(255), NOT NULL
- subjects: ARRAY(STRING), NOT NULL, MIN(1)
- rating_average: DECIMAL(2,1), DEFAULT(0.0)
- reviews_count: INTEGER, DEFAULT(0)
- hourly_rate: DECIMAL(10,2), NOT NULL
- description: TEXT, NOT NULL, MIN(50)
- teaching_style: STRING(100), NOT NULL
- experience_years: INTEGER, NOT NULL, MIN(0)
- education: TEXT, NOT NULL
- created_at: DATE, NOT NULL
- updated_at: DATE, NOT NULL

### Student Preferences
- id: INTEGER, PK, AUTO_INCREMENT
- user_id: INTEGER, FK(Users.id), NOT NULL
- learning_style: ENUM('visual', 'auditory', 'kinesthetic'), NOT NULL
- subjects_of_interest: ARRAY(STRING), NOT NULL
- preferred_teaching_style: STRING(100)
- study_goals: TEXT
- created_at: DATE, NOT NULL
- updated_at: DATE, NOT NULL

### Schedules
- id: INTEGER, PK, AUTO_INCREMENT
- tutor_id: INTEGER, FK(Users.id), NOT NULL
- date: DATE, NOT NULL
- start_time: TIME, NOT NULL
- end_time: TIME, NOT NULL
- status: ENUM('available', 'booked', 'cancelled'), DEFAULT('available')
- created_at: DATE, NOT NULL
- updated_at: DATE, NOT NULL
CONSTRAINTS:
  - start_time must be before end_time
  - date must not be in the past

### Bookings
- id: INTEGER, PK, AUTO_INCREMENT
- student_id: INTEGER, FK(Users.id), NOT NULL
- tutor_id: INTEGER, FK(Users.id), NOT NULL
- schedule_id: INTEGER, FK(Schedules.id), NOT NULL
- status: ENUM('pending', 'approved', 'rejected', 'completed'), DEFAULT('pending')
- payment_status: ENUM('pending', 'paid', 'refunded'), DEFAULT('pending')
- amount: DECIMAL(10,2), NOT NULL, MIN(0)
- created_at: DATE, NOT NULL
- updated_at: DATE, NOT NULL
CONSTRAINTS:
  - One student can't book same tutor at overlapping times
  - Cannot book cancelled schedules

### Reviews
- id: INTEGER, PK, AUTO_INCREMENT
- booking_id: INTEGER, FK(Bookings.id), NOT NULL, UNIQUE
- student_id: INTEGER, FK(Users.id), NOT NULL
- tutor_id: INTEGER, FK(Users.id), NOT NULL
- rating: INTEGER, NOT NULL, MIN(1), MAX(5)
- comment: TEXT, MIN(10)
- created_at: DATE, NOT NULL
- updated_at: DATE, NOT NULL
CONSTRAINTS:
  - Can only review after booking is completed
  - One review per booking

### AI Recommendations Log
- id: INTEGER, PK, AUTO_INCREMENT
- student_id: INTEGER, FK(Users.id), NOT NULL
- recommended_tutor_id: INTEGER, FK(Users.id), NOT NULL
- match_score: DECIMAL(3,2), NOT NULL, MIN(0), MAX(1)
- recommendation_factors: JSONB, NOT NULL
- created_at: DATE, NOT NULL
CONSTRAINTS:
  - match_score must be between 0 and 1
  - recommendation_factors must include at least learning_style and subjects

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
