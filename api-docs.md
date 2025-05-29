# TutorHub API Documentation

## Authentication

### Register User
- **URL**: `/register`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "fullName": "string",
    "email": "string",
    "password": "string",
    "role": "Student|Tutor"
  }
  ```
- **Success Response (201)**:
  ```json
  {
    "message": "User registered successfully",
    "data": {
      "id": "integer",
      "fullName": "string",
      "email": "string",
      "role": "string"
    }
  }
  ```

### Login
- **URL**: `/login`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "email": "string",
    "password": "string",
    "role": "Student|Tutor"
  }
  ```
- **Success Response (200)**:
  ```json
  {
    "message": "Login successful",
    "data": {
      "access_token": "string",
      "email": "string",
      "role": "string"
    }
  }
  ```

### Google Login
- **URL**: `/google-login`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "credential": "string",
    "role": "Student|Tutor"
  }
  ```
- **Success Response (200)**:
  ```json
  {
    "message": "Google login successful",
    "data": {
      "access_token": "string",
      "fullName": "string",
      "email": "string",
      "role": "string"
    }
  }
  ```

## Tutor Profile Management

### Create Tutor Profile
- **URL**: `/tutors`
- **Method**: `POST`
- **Authentication**: Required (Tutor only)
- **Request Body**:
  ```json
  {
    "photoUrl": "string",
    "subjects": "string",
    "style": "string"
  }
  ```
- **Success Response (201)**:
  ```json
  {
    "message": "Tutor profile created successfully",
    "data": {
      "id": "integer",
      "UserId": "integer",
      "photoUrl": "string",
      "subjects": "string",
      "style": "string"
    }
  }
  ```

### Get My Tutor Profile
- **URL**: `/tutors`
- **Method**: `GET`
- **Authentication**: Required (Tutor only)
- **Success Response (200)**:
  ```json
  {
    "message": "Tutor profile retrieved successfully",
    "data": {
      "id": "integer",
      "photoUrl": "string",
      "subjects": "string",
      "style": "string"
    }
  }
  ```

### Update Tutor Profile
- **URL**: `/tutors`
- **Method**: `PUT`
- **Authentication**: Required (Tutor only)
- **Request Body**:
  ```json
  {
    "photoUrl": "string",
    "subjects": "string",
    "style": "string"
  }
  ```
- **Success Response (200)**:
  ```json
  {
    "message": "Tutor profile updated successfully",
    "data": {
      "id": "integer",
      "photoUrl": "string",
      "subjects": "string",
      "style": "string",
      "UserId": "integer"
    }
  }
  ```

### Get All Tutors (Public)
- **URL**: `/pub/tutors`
- **Method**: `GET`
- **Success Response (200)**:
  ```json
  {
    "message": "Tutors retrieved successfully",
    "data": [
      {
        "id": "integer",
        "photoUrl": "string",
        "subjects": "string",
        "style": "string",
        "User": {
          "fullName": "string"
        }
      }
    ]
  }
  ```

### Get Tutor By ID (Public)
- **URL**: `/pub/tutors/:id`
- **Method**: `GET`
- **Success Response (200)**:
  ```json
  {
    "message": "Tutor retrieved successfully",
    "data": {
      "id": "integer",
      "photoUrl": "string",
      "subjects": "string",
      "style": "string",
      "User": {
        "fullName": "string",
        "email": "string"
      },
      "Schedules": [
        {
          "id": "integer",
          "date": "date",
          "time": "string",
          "fee": "integer"
        }
      ]
    }
  }
  ```

## Schedule Management

### Create Schedule
- **URL**: `/schedules`
- **Method**: `POST`
- **Authentication**: Required (Tutor only)
- **Request Body**:
  ```json
  {
    "date": "date",
    "time": "string",
    "fee": "integer"
  }
  ```
- **Success Response (201)**:
  ```json
  {
    "message": "Schedule created successfully",
    "data": {
      "id": "integer",
      "TutorId": "integer",
      "date": "date",
      "time": "string",
      "fee": "integer"
    }
  }
  ```

### Get All Schedules
- **URL**: `/schedules`
- **Method**: `GET`
- **Authentication**: Required (Tutor only)
- **Success Response (200)**:
  ```json
  {
    "message": "Schedules retrieved successfully",
    "data": [
      {
        "id": "integer",
        "date": "date",
        "time": "string",
        "fee": "integer"
      }
    ]
  }
  ```

### Update Schedule
- **URL**: `/schedules/:id`
- **Method**: `PUT`
- **Authentication**: Required (Tutor only)
- **Request Body**:
  ```json
  {
    "date": "date",
    "time": "string",
    "fee": "integer"
  }
  ```
- **Success Response (200)**:
  ```json
  {
    "message": "Schedule updated successfully",
    "data": {
      "id": "integer",
      "date": "date",
      "time": "string",
      "fee": "integer"
    }
  }
  ```

### Delete Schedule
- **URL**: `/schedules/:id`
- **Method**: `DELETE`
- **Authentication**: Required (Tutor only)
- **Success Response (200)**:
  ```json
  {
    "message": "Schedule deleted successfully"
  }
  ```

## Booking Management

### Create Booking
- **URL**: `/bookings`
- **Method**: `POST`
- **Authentication**: Required (Student only)
- **Request Body**:
  ```json
  {
    "ScheduleId": "integer"
  }
  ```
- **Success Response (201)**:
  ```json
  {
    "message": "Booking created successfully",
    "data": {
      "id": "integer",
      "studentId": "integer",
      "ScheduleId": "integer",
      "bookingStatus": "Pending",
      "paymentStatus": "Pending"
    }
  }
  ```

### Get All Bookings
- **URL**: `/bookings`
- **Method**: `GET`
- **Authentication**: Required
- **Notes**: Returns different results based on user role
- **Success Response (200)**:
  ```json
  {
    "message": "Bookings retrieved successfully",
    "data": [
      {
        "id": "integer",
        "studentId": "integer",
        "Schedule": {
          "id": "integer",
          "date": "date",
          "time": "string",
          "Tutor": {
            "User": {
              "fullName": "string"
            }
          }
        }
      }
    ]
  }
  ```

### Update Booking Status
- **URL**: `/bookings/:id/status`
- **Method**: `PUT`
- **Authentication**: Required (Tutor only)
- **Request Body**:
  ```json
  {
    "status": "Approved|Rejected"
  }
  ```
- **Success Response (200)**:
  ```json
  {
    "message": "Booking status updated successfully",
    "data": {
      "id": "integer",
      "bookingStatus": "string",
      "paymentStatus": "string"
    }
  }
  ```

### Delete Booking
- **URL**: `/bookings/:id`
- **Method**: `DELETE`
- **Authentication**: Required (Student only)
- **Success Response (200)**:
  ```json
  {
    "message": "Booking deleted successfully"
  }
  ```

## Payment

### Create Payment
- **URL**: `/payments/:bookingId`
- **Method**: `POST`
- **Authentication**: Required
- **Success Response (200)**:
  ```json
  {
    "paymentToken": "string",
    "paymentUrl": "string"
  }
  ```

### Handle Payment Notification
- **URL**: `/payments/notification`
- **Method**: `POST`
- **Request Body**: Midtrans notification payload
- **Success Response (200)**:
  ```json
  {
    "message": "OK"
  }
  ```

## AI Recommendation

### Get Tutor Recommendations
- **URL**: `/ai/recommendations`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "messages": [
      {
        "role": "user",
        "content": "string"
      }
    ]
  }
  ```
- **Success Response (200)**:
  ```json
  {
    "reply": "string"
  }
  ```

## Common Error Responses

### Bad Request (400)
```json
{
  "message": "Error message describing the issue"
}
```

### Unauthorized (401)
```json
{
  "message": "Invalid email/password or role"
}
```

### Forbidden (403)
```json
{
  "message": "You don't have permission to access this resource"
}
```

### Not Found (404)
```json
{
  "message": "Resource not found"
}
```
