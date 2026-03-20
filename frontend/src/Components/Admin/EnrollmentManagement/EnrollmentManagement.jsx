import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar/Sidebar';
import '../UsersManagement/UserDashboard/UserDashboard.css';
import './EnrollmentManagement.css';

const EnrollmentManagement = () => {
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedEnrollment, setSelectedEnrollment] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        approved: 0,
        rejected: 0
    });

    const BASE_URL = 'http://127.0.0.1:8000';

    useEffect(() => {
        window.scrollTo(0, 0); // Reset scroll to top
        fetchEnrollments();
    }, []);

    const fetchEnrollments = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${BASE_URL}/api/v1/enrollment/submit/`);
            const data = response.data;
            setEnrollments(data);

            // Calculate stats
            const s = {
                total: data.length,
                pending: data.filter(e => e.status === 'pending').length,
                approved: data.filter(e => e.status === 'approved').length,
                rejected: data.filter(e => e.status === 'rejected').length
            };
            setStats(s);
        } catch (err) {
            console.error("Error fetching enrollments:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            await axios.patch(`${BASE_URL}/api/v1/enrollment/submit/${id}/`, {
                status: newStatus
            });
            alert(`Enrollment ${newStatus} successfully!`);
            fetchEnrollments(); // Refresh list
            if (selectedEnrollment && selectedEnrollment.id === id) {
                setShowModal(false);
            }
        } catch (err) {
            console.error("Error updating status:", err);
            alert("Failed to update enrollment status.");
        }
    };

    const openDetails = (enrollment) => {
        setSelectedEnrollment(enrollment);
        setShowModal(true);
    };

    if (loading) return <div className="loading">Loading enrollments...</div>;

    return (
        <div className="users-management-page">
            <Sidebar />

            <div className="main-content">
                <header className="page-header" style={{ padding: "0 2.5rem" }}>
                    <h1>Student Enrollments</h1>
                    <p>Review and process pending and approved student enrollment lists.</p>
                </header>

                <div className="enrollment-wrapper" style={{ padding: "0 2.5rem 2.5rem" }}>

                    <div className="enrollment-stats">
                        <div className="stat-card">
                            <span className="stat-label">Total Applications</span>
                            <span className="stat-value">{stats.total}</span>
                        </div>
                        <div className="stat-card">
                            <span className="stat-label">Pending Review</span>
                            <span className="stat-value" style={{ color: '#92400e' }}>{stats.pending}</span>
                        </div>
                        <div className="stat-card">
                            <span className="stat-label">Approved</span>
                            <span className="stat-value" style={{ color: '#166534' }}>{stats.approved}</span>
                        </div>
                        <div className="stat-card">
                            <span className="stat-label">Rejected</span>
                            <span className="stat-value" style={{ color: '#991b1b' }}>{stats.rejected}</span>
                        </div>
                    </div>

                    <div className="enrollment-table-container">
                        <table className="enrollment-table">
                            <thead>
                                <tr>
                                    <th>Student Name</th>
                                    <th>Contact</th>
                                    <th>Course</th>
                                    <th>Submitted On</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {enrollments.length > 0 ? (
                                    enrollments.map((enrollment) => (
                                        <tr key={enrollment.id}>
                                            <td>
                                                <div style={{ fontWeight: '700' }}>{enrollment.full_name}</div>
                                                <div style={{ fontSize: '0.85rem', color: '#64748b' }}>{enrollment.email}</div>
                                            </td>
                                            <td>{enrollment.contact_number}</td>
                                            <td>
                                                <span style={{ fontWeight: '600' }}>{enrollment.selected_course_name}</span>
                                            </td>
                                            <td>{new Date(enrollment.created_at).toLocaleDateString()}</td>
                                            <td>
                                                <span className={`status-badge ${enrollment.status}`}>
                                                    {enrollment.status}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="action-buttons">
                                                    <button className="btn-view" onClick={() => openDetails(enrollment)}>View Details</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>No enrollment applications found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Detail Modal */}
            {showModal && selectedEnrollment && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Enrollment Details</h2>
                            <button className="close-modal-btn" onClick={() => setShowModal(false)}>&times;</button>
                        </div>
                        <div className="modal-body">
                            <div className="detail-section">
                                <h3>Personal Details</h3>
                                <div className="detail-grid">
                                    <div className="detail-item">
                                        <span className="detail-label">Full Name</span>
                                        <span className="detail-value">{selectedEnrollment.full_name}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Date of Birth</span>
                                        <span className="detail-value">{selectedEnrollment.date_of_birth}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Gender</span>
                                        <span className="detail-value">{selectedEnrollment.gender}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Email</span>
                                        <span className="detail-value">{selectedEnrollment.email}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Contact</span>
                                        <span className="detail-value">{selectedEnrollment.contact_number}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Address</span>
                                        <span className="detail-value">{selectedEnrollment.residential_address}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="detail-section">
                                <h3>Educational Details</h3>
                                <div className="detail-grid">
                                    <div className="detail-item">
                                        <span className="detail-label">Qualification</span>
                                        <span className="detail-value">{selectedEnrollment.previous_qualification}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Marks/CGPA</span>
                                        <span className="detail-value">{selectedEnrollment.marks_percentage_cgpa}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Passing Year</span>
                                        <span className="detail-value">{selectedEnrollment.passing_year}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Institution</span>
                                        <span className="detail-value">{selectedEnrollment.school_college_name}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="detail-section">
                                <h3>Course Selection</h3>
                                <div className="detail-grid">
                                    <div className="detail-item">
                                        <span className="detail-label">Selected Course</span>
                                        <span className="detail-value">{selectedEnrollment.selected_course_name}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Duration</span>
                                        <span className="detail-value">{selectedEnrollment.course_duration}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Batch Timing</span>
                                        <span className="detail-value">{selectedEnrollment.batch_timing}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Mode</span>
                                        <span className="detail-value">{selectedEnrollment.mode}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="detail-section">
                                <h3>Emergency Contact</h3>
                                <div className="detail-grid">
                                    <div className="detail-item">
                                        <span className="detail-label">Guardian Name</span>
                                        <span className="detail-value">{selectedEnrollment.guardian_name}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Guardian Contact</span>
                                        <span className="detail-value">{selectedEnrollment.guardian_contact}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="detail-section">
                                <h3>Documents</h3>
                                <div className="detail-grid">
                                    {selectedEnrollment.passport_photo && (
                                        <div className="detail-item">
                                            <span className="detail-label">Passport Photo</span>
                                            <a href={selectedEnrollment.passport_photo} target="_blank" rel="noopener noreferrer" className="file-link">🖼️ View Photo</a>
                                        </div>
                                    )}
                                    {selectedEnrollment.id_proof && (
                                        <div className="detail-item">
                                            <span className="detail-label">ID Proof</span>
                                            <a href={selectedEnrollment.id_proof} target="_blank" rel="noopener noreferrer" className="file-link">📄 View ID Proof</a>
                                        </div>
                                    )}
                                    {selectedEnrollment.certificates && (
                                        <div className="detail-item">
                                            <span className="detail-label">Certificates</span>
                                            <a href={selectedEnrollment.certificates} target="_blank" rel="noopener noreferrer" className="file-link">🎓 View Certificates</a>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {selectedEnrollment.status === 'pending' && (
                                <div className="modal-actions">
                                    <button className="btn-approve" onClick={() => handleStatusUpdate(selectedEnrollment.id, 'approved')}>Approve Enrollment</button>
                                    <button className="btn-reject" onClick={() => handleStatusUpdate(selectedEnrollment.id, 'rejected')}>Reject Enrollment</button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EnrollmentManagement;
