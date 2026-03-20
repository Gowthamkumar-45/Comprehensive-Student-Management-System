import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import '../../UsersManagement/UserDashboard/UserDashboard.css';
import '../../UsersManagement/AllUsers/AllUsers.css';
import './ManageCourse.css';

const ManageCourse = () => {
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        document.title = "Manage Courses - Admin Panel";
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/v1/courses/');
            setCourses(response.data);
            setLoading(false);
        } catch (err) {
            setError(err.message || 'Failed to fetch courses');
            setLoading(false);
        }
    };

    const handleCardClick = (courseTitle) => {
        // Assuming a route /course/:courseTitle or similar exists if we want to mimic Manage Users behavior
        navigate(`/course/${courseTitle.toLowerCase().replace(/\s+/g, '-')}`);
    };

    if (loading) {
        return (
            <div className="users-management-page">
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p>Fetching courses...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="users-management-page">
            <Sidebar />

            <div className="main-content" style={{ padding: "40px", width: "100%", flex: 1, boxSizing: "border-box" }}>
                <header className="page-header" style={{ textAlign: "center" }}>
                    <h1>Manage Courses</h1>
                    <p>View and manage all academic courses and curriculum.</p>
                </header>

                {error && (
                    <div className="error-container">
                        <p>Error: {error}</p>
                        <button onClick={fetchCourses}>Retry</button>
                    </div>
                )}

                {!loading && !error && (
                    <div className="table-glass-card">
                        <div className="table-responsive">
                            <table className="modern-table">
                                <thead>
                                    <tr>
                                        <th>COURSE</th>
                                        <th>LEVEL</th>
                                        <th>CATEGORY</th>
                                        <th>DURATION</th>
                                        <th>ACTION</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {courses.map(course => (
                                        <tr key={course.id} onClick={() => handleCardClick(course.title)} className="clickable-row">
                                            <td>
                                                <div className="user-profile-cell">
                                                    <div className="profile-initials">
                                                        {(course.title?.[0] || 'C').toUpperCase()}
                                                    </div>
                                                    <div className="profile-info">
                                                        <span className="p-full-name">{course.title}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <span className="designation-badge role-teacher">
                                                    {course.level || 'Standard'}
                                                </span>
                                            </td>
                                            <td>
                                                <span className="designation-badge role-admin">
                                                    {course.category || 'General'}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="contact-cell">
                                                    <span>{course.duration}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="action-buttons" style={{ display: 'flex', gap: '10px' }}>
                                                    <button
                                                        className="action-btn btn-update"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            navigate(`/update-course/${course.id}`);
                                                        }}
                                                    >
                                                        Update
                                                    </button>
                                                    <button
                                                        className="action-btn btn-delete"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            // Add delete logic here
                                                            if (window.confirm('Are you sure you want to delete this course?')) {
                                                                console.log('Delete', course.id);
                                                            }
                                                        }}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageCourse;
