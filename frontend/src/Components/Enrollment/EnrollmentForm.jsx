import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import {
    User, Mail, Phone, MapPin,
    Book, Award, Calendar,
    Briefcase, Image as ImageIcon,
    FileText, CheckCircle,
    Lock, ArrowLeft
} from 'lucide-react';
import './EnrollmentForm.css';

const EnrollmentForm = () => {
    const [courses, setCourses] = useState([]);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        full_name: '', date_of_birth: '', gender: '', contact_number: '', email: '', residential_address: '',
        previous_qualification: '', marks_percentage_cgpa: '', passing_year: '', school_college_name: '',
        selected_course: '', course_duration: '', batch_timing: '', mode: 'offline',
        guardian_name: '', guardian_contact: ''
    });

    const [files, setFiles] = useState({
        certificates: null, id_proof: null, passport_photo: null, transfer_certificate: null
    });

    const BASE_URL = 'http://127.0.0.1:8000';

    useEffect(() => {
        window.scrollTo(0, 0);

        const userString = localStorage.getItem('user');
        if (userString) {
            const user = JSON.parse(userString);
            setCurrentUser(user);

            setFormData(prev => ({
                ...prev,
                full_name: user.first_name && user.last_name ? `${user.first_name} ${user.last_name}` : user.username,
                email: user.email || ''
            }));
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
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const { name, files: uploadedFiles } = e.target;
        setFiles(prev => ({ ...prev, [name]: uploadedFiles[0] }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const data = new FormData();

        Object.keys(formData).forEach(key => data.append(key, formData[key]));
        Object.keys(files).forEach(key => {
            if (files[key]) data.append(key, files[key]);
        });

        try {
            await axios.post(`${BASE_URL}/api/v1/enrollment/submit/`, data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setTimeout(() => {
                setIsSubmitting(false);
                setIsSubmitted(true);
                window.scrollTo(0, 0);
            }, 800);
        } catch (err) {
            console.error('Error submitting form:', err.response?.data || err.message);
            alert('There was an error submitting your enrollment.');
            setIsSubmitting(false);
        }
    };

    if (currentUser && (currentUser.role === 'admin' || currentUser.role === 'teacher')) {
        return (
            <div className="enrollment-wrapper">
                <motion.div
                    className="enrollment-glass-card status-card"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                >
                    <Lock size={64} color="#f43f5e" />
                    <h1 className="status-title error">Restricted Access</h1>
                    <p className="status-text">
                        This enrollment form is exclusively for <strong>new students and applicants</strong>.
                        As an {currentUser.role}, you do not need to fill out this application.
                    </p>
                    <button className="modern-glass-btn" onClick={() => window.location.href = '/'}>
                        <ArrowLeft size={18} /> Back to Dashboard
                    </button>
                </motion.div>
            </div>
        );
    }

    if (isSubmitted) {
        return (
            <div className="enrollment-wrapper">
                <motion.div
                    className="enrollment-glass-card status-card"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                >
                    <CheckCircle size={64} color="#10b981" />
                    <h1 className="status-title success">Submission Received!</h1>
                    <p className="status-text">
                        Thank you for applying. Your enrollment application has been sent to the administration for review.
                        You will receive an update once a decision is made.
                    </p>
                    <button className="modern-glass-btn success" onClick={() => window.location.href = '/'}>
                        <ArrowLeft size={18} /> Return Home
                    </button>
                </motion.div>
            </div>
        );
    }

    const formAnimation = {
        hidden: { opacity: 0, y: 30 },
        show: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } }
    };

    const itemAnimation = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="enrollment-wrapper">
            <div className="enrollment-bg-shapes">
                <div className="shape shape-1"></div>
                <div className="shape shape-2"></div>
                <div className="shape shape-3"></div>
            </div>

            <motion.div
                className="enrollment-glass-card main-form"
                variants={formAnimation}
                initial="hidden"
                animate="show"
            >
                <header className="enrollment-header">
                    <motion.div variants={itemAnimation} className="header-icon-wrapper">
                        <Award size={32} />
                    </motion.div>
                    <motion.h1 variants={itemAnimation}>Student Enrollment</motion.h1>
                    <motion.p variants={itemAnimation}>Start your professional journey with our world-class courses.</motion.p>
                </header>

                <form onSubmit={handleSubmit} className="modern-enrollment-form">

                    {/* Personal Details */}
                    <motion.section variants={itemAnimation} className="form-section glass-panel">
                        <div className="section-header">
                            <User className="section-icon" />
                            <h2>Personal Details</h2>
                        </div>
                        <div className="form-grid">
                            <div className="input-group full-width">
                                <label>Full Name</label>
                                <div className="input-with-icon">
                                    <User size={16} />
                                    <input type="text" name="full_name" placeholder="Enter your full name" value={formData.full_name} onChange={handleChange} required />
                                </div>
                            </div>
                            <div className="input-group">
                                <label>Date of Birth</label>
                                <input type="date" name="date_of_birth" value={formData.date_of_birth} onChange={handleChange} required />
                            </div>
                            <div className="input-group">
                                <label>Gender</label>
                                <select name="gender" value={formData.gender} onChange={handleChange} required>
                                    <option value="">Select Gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div className="input-group">
                                <label>Contact Number</label>
                                <div className="input-with-icon">
                                    <Phone size={16} />
                                    <input type="tel" name="contact_number" placeholder="Enter phone number" value={formData.contact_number} onChange={handleChange} required />
                                </div>
                            </div>
                            <div className="input-group">
                                <label>Email Address</label>
                                <div className="input-with-icon">
                                    <Mail size={16} />
                                    <input type="email" name="email" placeholder="example@email.com" value={formData.email} onChange={handleChange} required />
                                </div>
                            </div>
                            <div className="input-group full-width">
                                <label>Residential Address</label>
                                <div className="input-with-icon">
                                    <MapPin size={16} style={{ alignSelf: 'flex-start', top: '12px' }} />
                                    <textarea name="residential_address" rows="3" placeholder="Enter complete address" value={formData.residential_address} onChange={handleChange} required></textarea>
                                </div>
                            </div>
                        </div>
                    </motion.section>

                    {/* Educational Details */}
                    <motion.section variants={itemAnimation} className="form-section glass-panel">
                        <div className="section-header">
                            <Briefcase className="section-icon" />
                            <h2>Educational Details</h2>
                        </div>
                        <div className="form-grid">
                            <div className="input-group">
                                <label>Previous Qualification</label>
                                <select name="previous_qualification" value={formData.previous_qualification} onChange={handleChange} required>
                                    <option value="">Select Qualification</option>
                                    <option value="10th">10th Standard</option>
                                    <option value="12th">12th Standard</option>
                                    <option value="degree">Undergraduate Degree</option>
                                    <option value="masters">Postgraduate Degree</option>
                                </select>
                            </div>
                            <div className="input-group">
                                <label>Marks / Percentage / CGPA</label>
                                <input type="text" name="marks_percentage_cgpa" placeholder="e.g. 85% or 8.5 CGPA" value={formData.marks_percentage_cgpa} onChange={handleChange} required />
                            </div>
                            <div className="input-group">
                                <label>Passing Year</label>
                                <div className="input-with-icon">
                                    <Calendar size={16} />
                                    <input type="number" name="passing_year" placeholder="YYYY" min="1990" max="2026" value={formData.passing_year} onChange={handleChange} required />
                                </div>
                            </div>
                            <div className="input-group full-width">
                                <label>College or School Name</label>
                                <input type="text" name="school_college_name" placeholder="Enter institution name" value={formData.school_college_name} onChange={handleChange} required />
                            </div>
                        </div>
                    </motion.section>

                    {/* Course Details */}
                    <motion.section variants={itemAnimation} className="form-section glass-panel">
                        <div className="section-header">
                            <Book className="section-icon" />
                            <h2>Course Configuration</h2>
                        </div>
                        <div className="form-grid">
                            <div className="input-group full-width">
                                <label>Selected Course</label>
                                <select name="selected_course" value={formData.selected_course} onChange={handleChange} required>
                                    <option value="">Choose a course</option>
                                    {courses.map(course => <option key={course.id} value={course.id}>{course.title}</option>)}
                                </select>
                            </div>
                            <div className="input-group">
                                <label>Course Duration</label>
                                <input type="text" name="course_duration" placeholder="e.g. 6 Months" value={formData.course_duration} onChange={handleChange} required />
                            </div>
                            <div className="input-group">
                                <label>Batch Timing</label>
                                <select name="batch_timing" value={formData.batch_timing} onChange={handleChange} required>
                                    <option value="">Select batch</option>
                                    <option value="Morning">Morning</option>
                                    <option value="Afternoon">Afternoon</option>
                                    <option value="Evening">Evening</option>
                                </select>
                            </div>
                        </div>
                    </motion.section>

                    {/* Emergency Contact */}
                    <motion.section variants={itemAnimation} className="form-section glass-panel">
                        <div className="section-header">
                            <Phone className="section-icon" />
                            <h2>Emergency Contact</h2>
                        </div>
                        <div className="form-grid">
                            <div className="input-group">
                                <label>Guardian Name</label>
                                <div className="input-with-icon">
                                    <User size={16} />
                                    <input type="text" name="guardian_name" placeholder="Enter guardian's name" value={formData.guardian_name} onChange={handleChange} required />
                                </div>
                            </div>
                            <div className="input-group">
                                <label>Guardian Contact</label>
                                <div className="input-with-icon">
                                    <Phone size={16} />
                                    <input type="tel" name="guardian_contact" placeholder="Enter contact number" value={formData.guardian_contact} onChange={handleChange} required />
                                </div>
                            </div>
                        </div>
                    </motion.section>

                    {/* File Uploads */}
                    <motion.section variants={itemAnimation} className="form-section glass-panel">
                        <div className="section-header">
                            <FileText className="section-icon" />
                            <h2>Identity & Uploads</h2>
                        </div>
                        <div className="form-grid">
                            <div className="input-group file-group">
                                <label>ID Proof (Aadhar/Passport)</label>
                                <div className="file-upload-wrapper">
                                    <FileText size={18} />
                                    <input type="file" name="id_proof" onChange={handleFileChange} required />
                                </div>
                            </div>
                            <div className="input-group file-group">
                                <label>Passport-size Photo</label>
                                <div className="file-upload-wrapper">
                                    <ImageIcon size={18} />
                                    <input type="file" name="passport_photo" accept="image/*" onChange={handleFileChange} required />
                                </div>
                            </div>
                        </div>
                    </motion.section>

                    <motion.div variants={itemAnimation} className="submit-action-section">
                        <button type="submit" className="master-submit-btn" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <motion.div className="spinner-wrap" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                                    <Lock size={20} />
                                </motion.div>
                            ) : (
                                "Submit Application Securely"
                            )}
                        </button>
                    </motion.div>
                </form>
            </motion.div>
        </div>
    );
};

export default EnrollmentForm;
