import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Components/Auth/Login';
import CreateUser from './Components/Admin/UsersManagement/CreateUser/CreateUser';
import AllUsers from './Components/Admin/UsersManagement/AllUsers/AllUsers';
import StudentDirectory from './Components/Admin/UsersManagement/StudentDirectory/StudentDirectory';
import FacultyDirectory from './Components/Admin/UsersManagement/FacultyDirectory/FacultyDirectory';
import UserDetails from './Components/Admin/UsersManagement/UserDetails/UserDetails';
import UserDashboard from './Components/Admin/UsersManagement/UserDashboard/UserDashboard';
import AcademicManagement from './Components/Admin/AcademicManagement/AcademicManagement';
import LibraryManagement from './Components/Admin/LibraryManagement/LibraryManagement';
import Reports from './Components/Admin/Reports/Reports';
import AddCourse from './Components/Admin/CourseManagement/AddCourse/AddCourse';
import ManageCourse from './Components/Admin/CourseManagement/ManageCourse/ManageCourse';
import CourseManagement from './Components/Admin/CourseManagement/CourseManagement';
import Home from './Components/Home/Home';
import CourseDetails from './Components/Courses/CourseDetails';
import AllCourses from './Components/Courses/AllCourses';
import UpdateCourse from './Components/Admin/CourseManagement/UpdateCourse/UpdateCourse';
import EnrollmentForm from './Components/Enrollment/EnrollmentForm';
import EnrollmentManagement from './Components/Admin/EnrollmentManagement/EnrollmentManagement';
import AssignFaculty from './Components/Admin/CourseManagement/AssignFaculty/AssignFaculty';
import Dashboard from './Components/Admin/Dashboard/Dashboard';
import './App.css';

// Admin System App Shell
function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin-dashboard" element={<Dashboard />} />
          {/* <Route path="/dashboard" element={<Navigate to="/" replace />} />
          <Route path="/teacher-dashboard" element={<Navigate to="/" replace />} />
          <Route path="/student-dashboard" element={<Navigate to="/" replace />} /> */}
          <Route path="/admin/create-user" element={<CreateUser />} />
          <Route path="/admin/manage-users" element={<AllUsers />} />
          <Route path="/admin/students" element={<StudentDirectory />} />
          <Route path="/admin/faculty" element={<FacultyDirectory />} />
          <Route path="/admin/user/:userId" element={<UserDetails />} />
          <Route path="/admin/users-management" element={<UserDashboard />} />
          <Route path="/admin/academic-management" element={<AcademicManagement />} />
          <Route path="/admin/library-management" element={<LibraryManagement />} />
          <Route path="/admin/course-management" element={<CourseManagement />} />
          <Route path="/admin/reports" element={<Reports />} />
          <Route path="/add-course" element={<AddCourse />} />
          <Route path="/manage-course" element={<ManageCourse />} />
          <Route path="/update-course/:courseId" element={<UpdateCourse />} />
          <Route path="/courses" element={<AllCourses />} />
          <Route path="/course/:courseId" element={<CourseDetails />} />
          <Route path="/enrollment" element={<EnrollmentForm />} />
          <Route path="/admin/enrollment-management" element={<EnrollmentManagement />} />
          <Route path="/assign-faculty" element={<AssignFaculty />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
