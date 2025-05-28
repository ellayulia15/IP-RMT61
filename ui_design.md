# UI Design Documentation

## Public Pages

### Landing Page
- Header
  - Logo
  - Navigation menu (Home, Tutors, Login)
- Hero Section
  - Welcome message
  - Grid of tutor cards showing:
    - Profile photo
    - Name
    - Subject expertise
    - Quick view button

### Tutor Profile Page
- Profile Header
  - Large profile photo
  - Name
  - Subjects taught
  - Average rating
  - Number of reviews
- About Section
  - Description
  - Teaching style
  - Experience years
  - Education background
- Schedule Section
  - Calendar view of available slots
  - Time slots in grid format
  - Booking button (disabled if not logged in)
- Reviews Section
  - List of reviews with:
    - Student name
    - Rating
    - Comment
    - Date

### Login/Register Page
- Toggle between login and register forms
- Login Form
  - Email/Username field
  - Password field
  - Login button
- Register Form
  - Choose role (Student/Tutor)
  - Username field
  - Email field
  - Password field
  - Confirm password field
  - Register button

## Student Dashboard

### Main Dashboard
- Welcome section with AI recommendations
- Quick Stats
  - Upcoming sessions
  - Completed sessions
  - Active bookings
- Recommended Tutors Section
  - AI-matched tutors based on preferences
  - Match percentage
  - Quick booking button

### Booking Management
- List of bookings with status
  - Pending
  - Approved
  - Completed
- Each booking shows:
  - Tutor photo and name
  - Subject
  - Date and time
  - Status
  - Payment status
  - Action buttons (Pay, Cancel, Review)

### Student Profile
- Personal Information
  - Profile photo
  - Name
  - Contact details
- Learning Preferences
  - Preferred subjects
  - Learning style
  - Study goals
- Booking History
  - Calendar view
  - List view with filters

## Tutor Dashboard

### Main Dashboard
- Quick Stats
  - Today's sessions
  - Pending bookings
  - Total earnings
  - Average rating
- Calendar Overview
  - Weekly/Monthly view
  - Color-coded bookings

### Schedule Management
- Calendar Interface
  - Add/Edit available slots
  - Drag and drop functionality
  - Bulk schedule creation
- Booking Requests
  - Student details
  - Requested time slot
  - Accept/Reject buttons

### Profile Management
- Edit Profile Form
  - Personal information
  - Professional information
  - Subject expertise
  - Hourly rate
  - Teaching style
- Upload Section
  - Profile photo
  - Credentials
  - Certificates

### Reviews & Ratings
- Overall Rating Display
- Detailed Reviews List
  - Student feedback
  - Rating breakdown
  - Response option

## Design Elements

### Color Scheme
- Primary: #4A90E2 (Professional Blue)
- Secondary: #50E3C2 (Fresh Mint)
- Accent: #F5A623 (Warm Orange)
- Background: #F8F9FA (Light Gray)
- Text: #2D3436 (Dark Gray)
- Success: #27AE60 (Green)
- Warning: #E67E22 (Orange)
- Error: #E74C3C (Red)

### Typography
- Headers: Poppins (Bold)
- Body: Inter (Regular)
- Accents: Poppins (Medium)

### Components
- Cards with soft shadows
- Rounded corners (8px)
- Consistent padding (16px/24px)
- Responsive grid system
- Loading states and animations