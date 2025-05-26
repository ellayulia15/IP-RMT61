# Individual Project Phase 2
# TutorMe - Online Tutoring Platform

A platform connecting students with tutors, featuring schedule management, payment processing, and educational content sharing.

## Features

### Public Access
- View tutor profiles (photo, name, subject, likes)
- Browse available tutoring schedules
- View practice questions from tutors
- Search and filter tutors by subject

### Student Features
- Book tutoring sessions
- Process payments for sessions
- Rate and review tutors
- Access practice questions
- View booking history

### Tutor Features
- Manage teaching schedule
- Create/Edit/Delete practice questions
- View student bookings
- Update profile information
- Track earnings

### Admin Features
- Manage user accounts
- Review tutor applications
- Monitor transactions
- Generate reports
- Content moderation

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
- id (PK)
- username
- email
- password
- role (admin/student/tutor)
- created_at
- updated_at

### Tutors Profile
- id (PK)
- user_id (FK)
- full_name
- photo_url
- subject
- likes_count
- hourly_rate
- description

### Schedules
- id (PK)
- tutor_id (FK)
- date
- start_time
- end_time
- status (available/booked)

### Bookings
- id (PK)
- student_id (FK)
- tutor_id (FK)
- schedule_id (FK)
- status (pending/paid/completed)
- payment_status
- amount

### Questions
- id (PK)
- tutor_id (FK)
- subject
- content
- answer
- difficulty_level

## API Endpoints

### Public Routes
- GET /tutors - List all tutors
- GET /tutors/:id - Get tutor details
- GET /questions - List public questions

### Protected Routes
#### Students
- POST /bookings - Create booking
- GET /bookings/history - View booking history
- POST /payments - Process payment

#### Tutors
- POST /questions - Create question
- PUT /questions/:id - Update question
- DELETE /questions/:id - Delete question
- PUT /schedules - Update schedule

#### Admin
- GET /users - List all users
- PUT /users/:id - Update user
- DELETE /users/:id - Delete user

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

## Contributing
1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request
