import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users, BookOpen, GraduationCap,
    Search, CheckCircle, AlertCircle,
    User, ArrowLeft, Loader2, Plus, X
} from 'lucide-react';
import Sidebar from '../Sidebar/Sidebar';
import '../../UsersManagement/UserDashboard/UserDashboard.css';
import './AssignFaculty.css';

const AssignFaculty = () => {
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [faculty, setFaculty] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [assignedFaculty, setAssignedFaculty] = useState([]);
    const [classTiming, setClassTiming] = useState('Morning');
    const [searchTerm, setSearchTerm] = useState('');
    const [submitLoading, setSubmitLoading] = useState(false);
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        document.title = "Assign Faculty - Admin Portal";
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        try {
            const [coursesRes, usersRes] = await Promise.all([
                axios.get('http://127.0.0.1:8000/api/v1/courses/'),
                axios.get('http://127.0.0.1:8000/api/v1/list/')
            ]);

            setCourses(coursesRes.data);
            // Filter only faculty (teachers)
            const teachers = usersRes.data.filter(user => user.role === 'teacher');
            setFaculty(teachers);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching data:", err);
            setNotification({ type: 'error', message: "Failed to load dashboard data." });
            setLoading(false);
        }
    };

    const handleCourseSelect = (course) => {
        setSelectedCourse(course);
        // In a real app, you'd fetch currently assigned faculty for this course
        // For now, we'll start with an empty or mock assignment
        setAssignedFaculty([]);
    };

    const toggleFacultyAssignment = (teacher) => {
        if (assignedFaculty.find(f => f.id === teacher.id)) {
            setAssignedFaculty(assignedFaculty.filter(f => f.id !== teacher.id));
        } else {
            setAssignedFaculty([...assignedFaculty, teacher]);
        }
    };

    const handleAssign = async () => {
        if (!selectedCourse) return;

        setSubmitLoading(true);
        try {
            // Mock API call - you'd replace this with your actual endpoint
            // e.g., axios.post(`http://127.0.0.1:8000/api/v1/courses/${selectedCourse.id}/assign-faculty/`, { faculty_ids: assignedFaculty.map(f => f.id), timing: classTiming })

            await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate delay

            setNotification({ type: 'success', message: `Faculty successfully assigned to ${selectedCourse.title} for ${classTiming} session!` });

            setTimeout(() => {
                setNotification(null);
                setSelectedCourse(null);
                setAssignedFaculty([]);
                setClassTiming('Morning');
            }, 3000);

        } catch (err) {
            setNotification({ type: 'error', message: "Failed to assign faculty. Please try again." });
        } finally {
            setSubmitLoading(false);
        }
    };

    const filteredFaculty = faculty.filter(f =>
        f.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${f.first_name} ${f.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return (
        <div className="flex-center-all" style={{ height: '100vh' }}>
            <Loader2 className="animate-spin" size={48} color="#6366f1" />
        </div>
    );

    return (
        <div className="users-management-page">
            <Sidebar />

            <main className="main-content" style={{ padding: '0', flex: 1 }}>
                <div className="dashboard-body" style={{ marginTop: '2.5rem' }}>
                    <header className="assign-header">
                        <div className="title-group">
                            {/* <motion.button
                                whileHover={{ x: -5 }}
                                onClick={() => navigate('/admin/course-management')}
                                className="back-btn-minimal"
                            >
                                <ArrowLeft size={20} />
                            </motion.button> */}
                            <div>
                                <h1>Faculty Assignment</h1>
                                <p>Allocate instructors and specify class timings for courses.</p>
                            </div>
                        </div>
                    </header>

                    <AnimatePresence>
                        {notification && (
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className={`notification-pill ${notification.type}`}
                            >
                                {notification.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                                <span>{notification.message}</span>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="assign-workspace">
                        {/* Step 1: Select Course */}
                        <div className="workspace-column courses-pane">
                            <div className="pane-header">
                                <div className="step-indicator">Step 1</div>
                                <h2>Select Course</h2>
                            </div>
                            <div className="course-list-scroll">
                                {courses.map(course => (
                                    <motion.div
                                        key={course.id}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className={`course-selection-card ${selectedCourse?.id === course.id ? 'active' : ''}`}
                                        onClick={() => handleCourseSelect(course)}
                                    >
                                        <div className="course-meta">
                                            <div className="c-icon"><BookOpen size={18} /></div>
                                            <div className="c-info">
                                                <h3>{course.title}</h3>
                                                <span>{course.category} • {course.duration}</span>
                                            </div>
                                        </div>
                                        {selectedCourse?.id === course.id && <div className="active-dot"></div>}
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Step 2: Assign Faculty & Timing */}
                        <div className={`workspace-column faculty-pane ${!selectedCourse ? 'disabled' : ''}`}>
                            <div className="pane-header">
                                <div className="step-indicator">Step 2</div>
                                <h2>Assign & Schedule</h2>
                                {!selectedCourse && <span className="locked-badge">Select a course first</span>}
                            </div>

                            <div className="faculty-controls">
                                <div className="flex-row-gap" style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
                                    <div className="search-bar-modern" style={{ flex: 1 }}>
                                        <Search size={18} />
                                        <input
                                            type="text"
                                            placeholder="Find faculty member..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            disabled={!selectedCourse}
                                        />
                                    </div>

                                    <div className="timing-selector">
                                        <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#64748b', marginBottom: '8px', display: 'block' }}>Class Timing:</label>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            {['Morning', 'Afternoon', 'Evening'].map(time => (
                                                <button
                                                    key={time}
                                                    className={`timing-chip ${classTiming === time ? 'active' : ''}`}
                                                    onClick={() => setClassTiming(time)}
                                                    disabled={!selectedCourse}
                                                >
                                                    {time}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="faculty-grid-scroll">
                                {filteredFaculty.map(teacher => {
                                    const isAssigned = assignedFaculty.find(f => f.id === teacher.id);
                                    return (
                                        <motion.div
                                            key={teacher.id}
                                            className={`faculty-assign-card ${isAssigned ? 'selected' : ''}`}
                                            onClick={() => selectedCourse && toggleFacultyAssignment(teacher)}
                                        >
                                            <div className="f-avatar">
                                                {teacher.first_name?.[0] || teacher.username[0]}
                                            </div>
                                            <div className="f-info">
                                                <h4>{teacher.first_name} {teacher.last_name}</h4>
                                                <p>@{teacher.username}</p>
                                            </div>
                                            <div className="selection-check">
                                                {isAssigned ? <CheckCircle size={20} fill="#6366f1" color="white" /> : <Plus size={20} />}
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>

                            <div className="assignment-footer">
                                <div className="summary-text">
                                    <strong>{assignedFaculty.length}</strong> Instructors Selected
                                </div>
                                <button
                                    className="confirm-assign-btn"
                                    disabled={!selectedCourse || assignedFaculty.length === 0 || submitLoading}
                                    onClick={handleAssign}
                                >
                                    {submitLoading ? <Loader2 className="animate-spin" size={18} /> : "Finalize Assignment"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AssignFaculty;
