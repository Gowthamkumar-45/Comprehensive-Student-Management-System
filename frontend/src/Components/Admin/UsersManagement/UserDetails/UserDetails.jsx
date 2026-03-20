import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft } from 'lucide-react';
import './UserDetails.css';

const UserDetails = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [enrollment, setEnrollment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const BASE_URL = 'http://127.0.0.1:8000';

    const getMediaUrl = (path) => {
        if (!path) return null;
        if (path.startsWith('http')) return path;
        return `${BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
    };

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                // Fetch User Details
                const response = await axios.get(`${BASE_URL}/api/v1/list/`);
                const foundUser = response.data.find(u => u.id === parseInt(userId));

                if (foundUser) {
                    setUser(foundUser);
                    document.title = `${foundUser.first_name} ${foundUser.last_name} - User Details`;

                    // Fetch Enrollment if the user is a student
                    if (foundUser.role === 'student') {
                        try {
                            const enrollResponse = await axios.get(`${BASE_URL}/api/v1/enrollment/submit/`);
                            const studentEnrollment = enrollResponse.data.find(e => e.email === foundUser.email);
                            if (studentEnrollment) {
                                setEnrollment(studentEnrollment);
                            }
                        } catch (enrollErr) {
                            console.error("Error fetching enrollment:", enrollErr);
                        }
                    }
                } else {
                    setError('User not found');
                }
            } catch (err) {
                setError('Failed to fetch user details');
            } finally {
                setLoading(false);
            }
        };

        fetchUserDetails();
    }, [userId]);

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            try {
                alert('Delete functionality endpoint pending backend implementation.');
            } catch (err) {
                alert('Failed to delete user.');
            }
        }
    };

    if (loading) return <div className="loading-container"><div className="spinner"></div></div>;
    if (error) return <div className="error-container"><h2>{error}</h2><button onClick={() => navigate('/admin/manage-users')}>Go Back</button></div>;

    return (
        <div className="user-details-page no-sidebar">
            <div className="details-content">
                <nav className="details-navigation">
                    <button className="back-navigation-btn" onClick={() => navigate(-1)}>
                        <ArrowLeft size={24} />
                    </button>
                    <span className="nav-breadcrumb">User Details</span>
                </nav>

                <div className="details-header">
                    <div className="user-profile-center">
                        <div className='profile-name-container'>
                            <div className="profile-avatar-large">
                                {user.first_name[0].toUpperCase()}
                            </div>
                            <div className="profile-title">
                                <h1>{user.first_name} {user.last_name}</h1>
                                <p>@{user.username} • <span className={`role-badge role-${user.role}`}>{user.role}</span></p>
                            </div>
                        </div>
                    </div>

                    <div className="ac-buttons">
                        <button className="btn btn-update" onClick={() => alert('Update functionality coming soon!')}>
                            Edit User
                        </button>
                        <button className="btn btn-delete" onClick={handleDelete}>
                            Delete Account
                        </button>
                    </div>
                </div>

                <div className="details-grid">
                    {/* User Info Cards */}
                    <div className="info-card">
                        <div className="card-header">
                            <h3>Personal Information</h3>
                        </div>
                        <div className='info-container'>
                            <div className="info-content">
                                <div className="detail-item">
                                    <label>Full Name</label>
                                    <span>{user.first_name} {user.last_name}</span>
                                </div>
                                <div className="detail-item">
                                    <label>Email Address</label>
                                    <span>{user.email}</span>
                                </div>
                                <div className="detail-item">
                                    <label>Username</label>
                                    <span>{user.username}</span>
                                </div>
                            </div>
                            <div className='for-photo'>
                                {enrollment?.passport_photo ? (
                                    <img src={getMediaUrl(enrollment.passport_photo)} alt="Profile" className='profile-photo' />
                                ) : (
                                    <div className="profile-photo-placeholder">
                                        {user.first_name[0].toUpperCase()}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="info-card">
                        <div className="card-header">
                            <h3>System Details</h3>
                        </div>
                        <div className="info-content">
                            <div className="detail-item">
                                <label>User Role</label>
                                <span style={{ textTransform: 'capitalize' }}>{user.role}</span>
                            </div>
                            <div className="detail-item">
                                <label>Account Status</label>
                                <span>{user.is_active ? 'Active' : 'Inactive'}</span>
                            </div>
                            <div className="detail-item">
                                <label>Date Joined</label>
                                <span>{new Date(user.date_joined).toLocaleString()}</span>
                            </div>
                            <div className="detail-item">
                                <label>User ID</label>
                                <span>#{user.id}</span>
                            </div>
                        </div>
                    </div>

                    {/* Enrollment Details - Only for Students */}
                    {user.role === 'student' && enrollment && (
                        <>
                            <div className="info-card enrollment-card">
                                <div className="card-header">
                                    <h3>Enrollment & Academic Details</h3>
                                </div>
                                <div className="info-content enrollment-grid">
                                    <div className="enrollment-column">
                                        <h4>Course & Status</h4>
                                        <div className="detail-item">
                                            <label>Selected Course</label>
                                            <span>{enrollment.selected_course_name}</span>
                                        </div>
                                        <div className="detail-item">
                                            <label>Mode of Study</label>
                                            <span style={{ textTransform: 'capitalize' }}>{enrollment.mode}</span>
                                        </div>
                                        <div className="detail-item">
                                            <label>Batch Timing</label>
                                            <span>{enrollment.batch_timing}</span>
                                        </div>
                                        <div className="detail-item">
                                            <label>Course Duration</label>
                                            <span>{enrollment.course_duration}</span>
                                        </div>
                                        <div className="detail-item">
                                            <label>Enrollment Status</label>
                                            <span className={`status-badges status-${enrollment.status}`}>{enrollment.status}</span>
                                        </div>
                                    </div>

                                    <div className="enrollment-column">
                                        <h4>Academic Info</h4>
                                        <div className="detail-item">
                                            <label>Previous Qualification</label>
                                            <span>{enrollment.previous_qualification}</span>
                                        </div>
                                        <div className="detail-item">
                                            <label>Marks / CGPA</label>
                                            <span className="highlight-text">{enrollment.marks_percentage_cgpa}</span>
                                        </div>
                                        <div className="detail-item">
                                            <label>College/School</label>
                                            <span>{enrollment.school_college_name}</span>
                                        </div>
                                        <div className="detail-item">
                                            <label>Residential Address</label>
                                            <span className="address-text">{enrollment.residential_address}</span>
                                        </div>
                                    </div>

                                    <div className="enrollment-column">
                                        <h4>Emergency Contact</h4>
                                        <div className="detail-item">
                                            <label>Guardian Name</label>
                                            <span>{enrollment.guardian_name}</span>
                                        </div>
                                        <div className="detail-item">
                                            <label>Guardian Contact</label>
                                            <span>{enrollment.guardian_contact}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="info-card documents-card">
                                <div className="card-header">
                                    <h3>Uploaded Documents</h3>
                                </div>
                                <div className="info-content">
                                    {enrollment.id_proof && (
                                        <div className="document-item">
                                            <div className="document-info">
                                                <label>ID Proof</label>
                                                <a href={getMediaUrl(enrollment.id_proof)} target="_blank" rel="noopener noreferrer" className="doc-link">View Document</a>
                                            </div>
                                        </div>
                                    )}
                                    {enrollment.passport_photo && (
                                        <div className="document-item">
                                            <div className="document-info">
                                                <label>Passport Photo</label>
                                                <a href={getMediaUrl(enrollment.passport_photo)} target="_blank" rel="noopener noreferrer" className="doc-link">View Image</a>
                                            </div>
                                        </div>
                                    )}
                                    {enrollment.certificates && (
                                        <div className="document-item">
                                            <div className="document-info">
                                                <label>Qualification Certificates</label>
                                                <a href={getMediaUrl(enrollment.certificates)} target="_blank" rel="noopener noreferrer" className="doc-link">View Document</a>
                                            </div>
                                        </div>
                                    )}
                                    {enrollment.transfer_certificate && (
                                        <div className="document-item">
                                            <div className="document-info">
                                                <label>Transfer Certificate (TC)</label>
                                                <a href={getMediaUrl(enrollment.transfer_certificate)} target="_blank" rel="noopener noreferrer" className="doc-link">View Document</a>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserDetails;
