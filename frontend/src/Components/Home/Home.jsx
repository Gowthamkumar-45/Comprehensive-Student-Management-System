import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion,} from 'framer-motion';
import './Home.css';
import './Dropdown.css';
import cardImage from '../../assets/images/Card image.jpg';
import aboutImage from '../../assets/images/aboutsection.jpg';
import Footer from '../Footer/Footer';

const Home = () => {
    const [user, setUser] = useState(null);
    const [courses, setCourses] = useState([]);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const navigate = useNavigate();
    const BASE_URL = 'http://127.0.0.1:8000';

    useEffect(() => {
        const userString = localStorage.getItem('user');
        if (userString) {
            setUser(JSON.parse(userString));
        }

        const fetchCourses = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/api/v1/courses/`);
                setCourses(response.data);
            } catch (err) {
                console.error("Error fetching courses:", err);
            }
        };

        fetchCourses();

        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        setUser(null);
        setIsSidebarOpen(false);
        navigate('/');
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const closeSidebar = () => {
        setIsSidebarOpen(false);
    };

    return (
        <div className="home-page">
            {/* Main Navigation Bar */}
            <nav className={`home-navbar ${isScrolled ? 'scrolled' : ''}`}>
                <div className="nav-container">
                    <div className="home-logo">
                        <Link to="/" className="logo-link">
                            <span className="logo-icon">SP</span>
                            <span className="logo-text">StudentPortal</span>
                        </Link>
                    </div>

                    <div className="nav-links">
                        <a href="#home" className="nav-link">Home</a>
                        <a href="#courses" className="nav-link">Courses</a>
                        <a href="#about" className="nav-link">About</a>
                        <a href="#contact" className="nav-link">Contact</a>
                    </div>

                    <div className="auth-section">
                        {!user ? (
                            <Link to="/login" className="login-btn">Login</Link>
                        ) : (
                            <div className="profile-group">
                                <div className="user-info">
                                    <span className="user-name">{user.username}</span>
                                    <span className="user-role">{user.role}</span>
                                </div>
                                <div className="avatar" onClick={toggleSidebar}>
                                    {user.username.charAt(0).toUpperCase()}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            {/* Sidebar Menu */}
            {user && (
                <>
                    <div
                        className={`sidebar-overlay ${isSidebarOpen ? 'active' : ''}`}
                        onClick={closeSidebar}
                    ></div>
                    <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
                        <div className="sidebar-header">
                            <div className="sidebar-user-info">
                                <div className="sidebar-avatar">
                                    {user.username.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <div className="sidebar-username">{user.username}</div>
                                    <div className="sidebar-role">{user.role}</div>
                                </div>
                            </div>
                            <button className="close-btn-for-home" onClick={closeSidebar}>✕</button>
                        </div>

                        <div className="sidebar-content">
                            {user.role === 'admin' && (
                                <>
                                    <Link to="/admin-dashboard" className="sidebar-item" onClick={closeSidebar}>
                                        <span className="sidebar-icon">📊</span>
                                        <span>Dashboard</span>
                                    </Link>
                                    <Link to="/admin/users-management" className="sidebar-item"  rel="noopener noreferrer" onClick={closeSidebar}>
                                        <span className="sidebar-icon">👤</span>
                                        <span>Users Management</span>
                                    </Link>
                                    <Link to="/admin/course-management" className="sidebar-item"  rel="noopener noreferrer" onClick={closeSidebar}>
                                        <span className="sidebar-icon">📚</span>
                                        <span>Course Management</span>
                                    </Link>
                                    <Link to="/admin/academic-management" className="sidebar-item" onClick={closeSidebar}>
                                        <span className="sidebar-icon">🎓</span>
                                        <span>Academic Management</span>
                                    </Link>
                                    <Link to="/admin/enrollment-management" className="sidebar-item"  rel="noopener noreferrer" onClick={closeSidebar}>
                                        <span className="sidebar-icon">📝</span>
                                        <span>Enrollment Applications</span>
                                    </Link>
                                    <Link to="/admin/library-management" className="sidebar-item" onClick={closeSidebar}>
                                        <span className="sidebar-icon">📖</span>
                                        <span>Library Management</span>
                                    </Link>
                                    <Link to="/admin/reports" className="sidebar-item" onClick={closeSidebar}>
                                        <span className="sidebar-icon">📊</span>
                                        <span>Reports</span>
                                    </Link>

                                </>
                            )}
                            {user.role === 'teacher' && (
                                <>
                                    <Link to="/teacher-dashboard" className="sidebar-item" onClick={closeSidebar}>
                                        <span className="sidebar-icon">📊</span>
                                        <span>Dashboard</span>
                                    </Link>
                                    <Link to="/teacher-list" className="sidebar-item" onClick={closeSidebar}>
                                        <span className="sidebar-icon">🎓</span>
                                        <span>View Student List</span>
                                    </Link>

                                    <Link to="/teacher-attendance" className="sidebar-item" onClick={closeSidebar}>
                                        <span className="sidebar-icon">🖥️</span>
                                        <span>Take Attendance</span>
                                    </Link>

                                </>

                            )}
                            {user.role === 'student' && (
                                <>
                                    <Link to="/student-dashboard" className="sidebar-item" onClick={closeSidebar}>
                                        <span className="sidebar-icon">📊</span>
                                        <span>Dashboard</span>
                                    </Link>
                                    <Link to="/student-attendance" className="sidebar-item" onClick={closeSidebar}>
                                        <span className="sidebar-icon">📅</span>
                                        <span>My Attendance</span>
                                    </Link>
                                    <Link to="/student-timetable" className="sidebar-item" onClick={closeSidebar}>
                                        <span className="sidebar-icon">🕰️</span>
                                        <span> Timetable</span>
                                    </Link>
                                </>
                            )}
                        </div>

                        <div className="sidebar-footer">
                            <button onClick={handleLogout} className="sidebar-logout-btn">
                                <span className="sidebar-icon">🚪</span>
                                <span>Logout</span>
                            </button>
                        </div>
                    </div>
                </>
            )}

            {/* Hero Section */}
            <section className="hero-section" id="home">
                <div className="hero-content">
                    <motion.h1
                        className="hero-title"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        Elevate Your <span className="gradient-text">Learning Journey</span>
                    </motion.h1>
                    <motion.p
                        className="hero-subtitle"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        A premium management system designed for students, teachers, and administrators to achieve excellence together.
                    </motion.p>
                    <motion.div
                        className="hero-actions"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                    >
                        <button className="primary-btn">Get Started</button>
                        <button className="secondary-btn">Learn More</button>
                    </motion.div>
                </div>
            </section>

            {/* Courses Section */}
            <section className="courses-section" id="courses">
                <div className="section-container">
                    <motion.div
                        className="section-header"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="section-title" id='title-section'>Popular Courses</h2>
                        <p className="section-subtitle">
                            Explore our wide range of courses designed to help you achieve your academic goals
                        </p>
                    </motion.div>

                    <div className="courses-grid">
                        {courses.length > 0 ? (
                            courses.map((course, index) => (
                                <motion.div
                                    key={course.id}
                                    className="course-card"
                                    initial={{ opacity: 0, scale: 0.95, y: 40 }}
                                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.11, delay: (index % 2) * 0.10 }}
                                    whileHover={{ y: -10 }}
                                >
                                    <div className="course-image-container">
                                        <img src={course.image ? (course.image.startsWith('http') ? course.image : `${BASE_URL}${course.image}`) : cardImage} alt={course.title} className="course-image" />
                                    </div>
                                    <div className="course-content">
                                        <h3 className="course-title">{course.title}</h3>
                                        <p className="course-description">{course.description}</p>
                                    </div>
                                    <div className="course-footer">
                                        <button className="enroll-btn" onClick={() => navigate('/enrollment')}>Enroll Now</button>
                                        <Link to={`/course/${course.title.toLowerCase().replace(/\s+/g, '-')}`} target="_blank" className="know-btn">Know More</Link>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <p className="no-courses">No courses available. Please add some from the admin panel.</p>
                        )}
                    </div>

                    <div className="section-action">
                        <Link to="/courses" target="_blank" className="view-all-link">
                            <button className="view-all-btn">View All Courses →</button>
                        </Link>
                    </div>
                </div>
            </section>





            {/* About Section */}
            <section className="about-section" id="about">
                <div className="section-container">
                    <div className="about-grid">
                        <motion.div
                            className="about-image-container"
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="about-image-glow"></div>
                            <img src={aboutImage} alt="About Us" className="about-section-image" />
                        </motion.div>
                        <motion.div
                            className="about-content"
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            <h2 className="section-title">Empowering Educational Excellence</h2>
                            <p className="about-description">
                                Our Student Management System is more than just a tool; it's a comprehensive platform designed to streamline educational workflows and foster student success. We provide educators with the technology they need to focus on what matters most: teaching.
                            </p>
                            <div className="about-features">
                                <motion.div whileHover={{ scale: 1.05 }} className="feature-item">
                                    <span className="feature-icon">✨</span>
                                    <div>
                                        <h4>Unified Platform</h4>
                                        <p>Everything you need to manage students, faculty, and courses in one place.</p>
                                    </div>
                                </motion.div>
                                <motion.div whileHover={{ scale: 1.05 }} className="feature-item">
                                    <span className="feature-icon">🚀</span>
                                    <div>
                                        <h4>Scalable Solutions</h4>
                                        <p>Designed to grow with your institution, from small schools to large universities.</p>
                                    </div>
                                </motion.div>
                                <motion.div whileHover={{ scale: 1.05 }} className="feature-item">
                                    <span className="feature-icon">🔒</span>
                                    <div>
                                        <h4>Data Security</h4>
                                        <p>Advanced security measures to protect sensitive student and faculty information.</p>
                                    </div>
                                </motion.div>
                                <motion.div whileHover={{ scale: 1.05 }} className="feature-item">
                                    <span className="feature-icon">🕰️</span>
                                    <div>
                                        <h4>24/7 Support</h4>
                                        <p>We are available 24/7 to help you with any issues you may face.</p>
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="contact-section" id="contact">
                <div className="section-container">
                    <div className="contact-grid">
                        <motion.div
                            className="contact-info"
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <h2 className="section-title">Get in Touch</h2>
                            <p className="contact-subtitle">Have questions? We're here to help you get started.</p>

                            <div className="contact-details">
                                <div className="contact-detail-item">
                                    <span className="contact-icon">📍</span>
                                    <span>123 Education Lane, Learning City, ED 12345</span>
                                </div>
                                <div className="contact-detail-item">
                                    <span className="contact-icon">📞</span>
                                    <span>+1 (234) 567-890</span>
                                </div>
                                <div className="contact-detail-item">
                                    <span className="contact-icon">📧</span>
                                    <span>support@studentportal.com</span>
                                </div>
                            </div>
                        </motion.div>

                        <motion.form
                            className="contact-form"
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                        >
                            <div className="form-group">
                                <input type="text" placeholder="Your Name" className="form-input" />
                            </div>
                            <div className="form-group">
                                <input type="email" placeholder="Your Email" className="form-input" />
                            </div>
                            <div className="form-group">
                                <textarea placeholder="Your Message" className="form-textarea"></textarea>
                            </div>
                            <motion.button type="submit" className="primary-btn w-full" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>Send Message</motion.button>
                        </motion.form>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Home;
