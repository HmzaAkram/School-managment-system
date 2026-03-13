# BrightScope School Management System - Demo Guide

Welcome to BrightScope, a comprehensive school management system designed for modern education institutions.

## System Overview

BrightScope is a full-featured platform that enables:
- **Administrators** to manage the entire school system
- **Teachers** to manage classes, assignments, and student performance
- **Students** to track their grades, attendance, and academic progress

## Demo Credentials

Use the following credentials to test different user roles:

### Administrator Access
- **Email**: `admin@brightscope.edu`
- **Password**: `admin123`
- **Features**: Teacher management, student management, class management, fee tracking, attendance monitoring

### Teacher Access
- **Email**: `teacher@brightscope.edu`
- **Password**: `teacher123`
- **Features**: Class management, assignment creation, exam management, student performance tracking

### Student Access
- **Email**: `student@brightscope.edu`
- **Password**: `student123`
- **Features**: Grade tracking, attendance monitoring, assignment submission, fee information

## Getting Started

1. Navigate to the homepage at `/`
2. Click "Get Started" or "Sign In" to access the login page
3. Select your desired role (Admin, Teacher, or Student)
4. Use the corresponding demo credentials provided above
5. You'll be redirected to your personalized dashboard

## Key Features

### For Administrators
- **Dashboard Overview**: View key statistics and recent activities
- **Teacher Management**: Add, edit, and manage teacher profiles
- **Student Management**: Add, edit, and manage student profiles
- **Class Management**: Create and manage class schedules
- **Fee Tracking**: Monitor fee collection and pending payments
- **Attendance Monitoring**: Track class-wise attendance rates

### For Teachers
- **My Classes**: View assigned classes and schedules
- **Assignment Management**: Create and track student assignments
- **Exam Management**: Create exams and manage exam schedules
- **Student Performance**: Track and analyze student performance
- **Attendance Marking**: Mark and track class attendance

### For Students
- **My Classes**: View enrolled classes and teacher information
- **Grades**: View subject-wise grades and GPA
- **Attendance**: Monitor attendance percentage by subject
- **Assignments**: View pending and submitted assignments
- **Fee Information**: Check fee payment status and history

## Dummy Data

The system comes pre-populated with demo data:
- **6 Classes**: Classes 8-A, 8-B, 9-A, 9-B, 10-A, 10-B
- **275 Total Students**: Distributed across all classes
- **6 Teachers**: Each managing 1-2 classes
- **Multiple Subjects**: Mathematics, English, Science, History, Geography, PE

## Dashboard Tabs

Each user role has access to multiple tabs for different functionalities:

**Admin Dashboard:**
- Overview | Teachers | Students | Classes | Fees | Attendance

**Teacher Dashboard:**
- Overview | My Classes | Assignments | Exams | Performance | Attendance

**Student Dashboard:**
- Overview | My Classes | Grades | Attendance | Assignments | Fees

## Pages

### Public Pages
- **Home** (`/`): Landing page with features overview
- **About** (`/about`): Information about BrightScope
- **Events** (`/events`): Upcoming school events
- **Classes** (`/classes`): Overview of all classes
- **Contact** (`/contact`): Contact form and information

### Authentication
- **Login** (`/login`): Role-based login page

### Protected Pages
- **Admin Dashboard** (`/admin-dashboard`): Administrative interface
- **Teacher Dashboard** (`/teacher-dashboard`): Teacher interface
- **Student Dashboard** (`/student-dashboard`): Student interface

## Color Scheme

The application uses a professional blue and white color scheme:
- **Primary Color**: Professional Blue (#4F46E5)
- **Secondary Color**: Light Blue (#7C8EF5)
- **Accent Color**: Orange (#FFA500)
- **Background**: Off-White (#F9FAFB)
- **Foreground**: Dark Blue (#2D1B3D)

## Responsive Design

All pages are fully responsive and optimized for:
- Mobile devices (320px and up)
- Tablets (768px and up)
- Desktop screens (1024px and up)

## Notes

- This is a demo version with mock data for demonstration purposes
- All login information is stored in localStorage during the session
- Admin/Teacher/Student dashboards are role-restricted
- Contact form submissions are handled client-side for demo purposes
- Logout functionality clears user data from localStorage
