# Drasa - Learning Management System

A full-featured Learning Management System built with **Django** (backend) and **Next.js** (frontend), inspired by Drasa LMS.

## 🚀 Features

### For Students

- 📚 Browse and enroll in courses
- 📝 Submit assignments with multiple submission types (text, file, URL)
- 📈 Track grades and progress
- 💬 Participate in course discussions
- 📢 Receive course announcements
- 📅 View upcoming assignments and deadlines

### For Teachers

- 👨‍🏫 Create and manage courses
- 📦 Organize content into modules
- ✏️ Create assignments and assessments
- ✅ Grade student submissions with feedback
- 📣 Post announcements
- 💭 Moderate discussions

### For Admins

- 👥 Manage users and roles
- 🔧 System configuration
- 📊 Analytics and reporting (coming soon)

## 🛠️ Tech Stack

### Backend

- **Django 6.0** - Web framework
- **Django REST Framework** - API development
- **SQLite** - Database (can be changed to PostgreSQL/MySQL)
- **CORS Headers** - Cross-origin resource sharing

### Frontend

- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React Hooks** - State management

## 📦 Installation

### Prerequisites

- Python 3.10+
- Node.js 18+
- pip (Python package manager)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:

```bash
cd backend
```

2. Create a virtual environment:

```bash
python -m venv venv
```

3. Activate the virtual environment:

- Windows:
  ```bash
  venv\Scripts\activate
  ```
- macOS/Linux:
  ```bash
  source venv/bin/activate
  ```

4. Install dependencies:

```bash
pip install -r requirements.txt
```

5. Run migrations:

```bash
python manage.py makemigrations
python manage.py migrate
```

6. Create a superuser (admin):

```bash
python manage.py createsuperuser
```

7. Start the development server:

```bash
python manage.py runserver
```

The backend API will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## 🗂️ Project Structure

```
drasa/
├── backend/                 # Django backend
│   ├── api/                # Main API app
│   │   ├── models.py       # Database models
│   │   ├── serializers.py  # DRF serializers
│   │   ├── views.py        # API views
│   │   ├── urls.py         # API routes
│   │   └── admin.py        # Admin configuration
│   ├── drasa/              # Project settings
│   │   ├── settings.py     # Django settings
│   │   └── urls.py         # Root URL configuration
│   └── manage.py           # Django management script
│
└── frontend/               # Next.js frontend
    ├── app/                # App router pages
    │   ├── dashboard/      # Dashboard page
    │   ├── courses/        # Courses pages
    │   ├── assignments/    # Assignments page
    │   ├── grades/         # Grades page
    │   └── calendar/       # Calendar page
    ├── components/         # React components
    │   ├── Navigation.tsx  # Main navigation
    │   ├── CourseCard.tsx  # Course card component
    │   └── AssignmentCard.tsx # Assignment card
    └── lib/
        └── api.ts          # API client
```

## 📚 API Endpoints

### Courses

- `GET /api/courses/` - List all courses
- `GET /api/courses/?enrolled=true` - List enrolled courses
- `GET /api/courses/{id}/` - Get course details
- `POST /api/courses/` - Create course (teacher only)
- `POST /api/courses/{id}/enroll/` - Enroll in course
- `POST /api/courses/{id}/unenroll/` - Unenroll from course

### Assignments

- `GET /api/assignments/` - List assignments
- `GET /api/assignments/{id}/` - Get assignment details
- `POST /api/assignments/` - Create assignment (teacher only)

### Submissions

- `GET /api/submissions/` - List submissions
- `POST /api/submissions/` - Submit assignment

### Grades

- `GET /api/grades/` - List grades
- `POST /api/grades/` - Grade submission (teacher only)

### Announcements

- `GET /api/announcements/` - List announcements
- `POST /api/announcements/` - Create announcement (teacher only)

### Discussions

- `GET /api/discussions/` - List discussions
- `POST /api/discussions/` - Create discussion

### Users

- `GET /api/users/me/` - Get current user

## 🎨 Database Models

### Core Models

- **User** - Extended Django user with roles (student, teacher, admin)
- **Course** - Course information and metadata
- **Enrollment** - Student-course relationship
- **Module** - Course content organization
- **Assignment** - Course assignments
- **Submission** - Student assignment submissions
- **Grade** - Assignment grades and feedback
- **Announcement** - Course announcements
- **Discussion** - Discussion forums
- **Comment** - Discussion comments

## 🔐 Authentication

The system uses Django's built-in authentication with session-based auth. The custom User model extends AbstractUser with additional fields:

- `role` - User role (student, teacher, admin)
- `bio` - User biography
- `avatar` - Profile picture URL

## 🎯 Usage

### Creating a Course (Teacher)

1. Log in as a teacher
2. Navigate to the Course Management section
3. Click "Create Course"
4. Fill in course details and save

### Enrolling in a Course (Student)

1. Browse available courses
2. Click on a course to view details
3. Click "Enroll Now" button

### Submitting an Assignment (Student)

1. Navigate to the course
2. Click on the assignment
3. Submit your work (text, file, or URL)
4. View submission status and grades

### Grading Assignments (Teacher)

1. Navigate to the assignment
2. View all student submissions
3. Provide grade and feedback
4. Submit the grade

## 🚧 Coming Soon

- ✅ Real-time notifications
- ✅ Calendar integration
- ✅ File upload support
- ✅ Rich text editor for content
- ✅ Video conferencing integration
- ✅ Analytics dashboard
- ✅ Mobile app
- ✅ Email notifications

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is open source and available under the MIT License.

## 👨‍💻 Development

### Running Tests

```bash
# Backend tests
cd backend
python manage.py test

# Frontend tests
cd frontend
npm test
```

### Code Style

- Backend: Follow PEP 8 guidelines
- Frontend: ESLint configuration included

## 🐛 Troubleshooting

### CORS Issues

If you encounter CORS errors, make sure:

1. The backend `CORS_ALLOWED_ORIGINS` in `settings.py` includes your frontend URL
2. The frontend `.env.local` has the correct `NEXT_PUBLIC_API_URL`

### Database Issues

If migrations fail:

```bash
python manage.py migrate --run-syncdb
```

### Port Conflicts

If ports 8000 or 3000 are in use:

- Backend: `python manage.py runserver 8080`
- Frontend: Change port in `package.json` or use `npm run dev -- -p 3001`

## 📧 Support

For issues and questions, please open an issue on GitHub.

---

Built with ❤️ using Django and Next.js
