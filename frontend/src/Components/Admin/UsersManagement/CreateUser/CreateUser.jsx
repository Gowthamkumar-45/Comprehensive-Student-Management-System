import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import Sidebar from '../Sidebar/Sidebar';
import './CreateUser.css';
import '../UserDashboard/UserDashboard.css'; // Shared sidebar styles

const CreateUser = () => {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        username: '',
        email: '',
        password: '',
        confirm_password: '',
        role: 'Select Role'
    });
    const [status, setStatus] = useState({ type: '', message: '' });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        document.title = "Provision User - Admin Portal";
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ type: '', message: '' });

        if (formData.password !== formData.confirm_password) {
            setStatus({ type: 'error', message: 'Passwords do not match!' });
            return;
        }

        if (formData.role === 'Select Role') {
            setStatus({ type: 'error', message: 'Please select a valid role.' });
            return;
        }

        setLoading(true);
        try {
            await axios.post('http://127.0.0.1:8000/api/v1/create-user/', formData);
            setStatus({ type: 'success', message: 'User provisioned successfully!' });
            setFormData({
                first_name: '', last_name: '', username: '',
                email: '', password: '', confirm_password: '',
                role: 'Select Role'
            });
        } catch (err) {
            setStatus({ type: 'error', message: 'Registration failed. Check system logs.' });
        } finally {
            setLoading(false);
        }
    };



    return (
        <div className="users-management-page">
            <Sidebar />

            <main className="main-contents">
                {/* <header className="topbar">
                    <div className="search-field">
                        <Search size={18} color="#94a3b8" />
                        <input type="text" placeholder="Search system repository..." />
                    </div>

                    <div className="topbar-actions">
                        <div className="icon-btn"><Bell size={20} /></div>
                        <div className="user-profile-toggle">
                            <div className="avatar-mini">A</div>
                            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1e293b' }}>Administrator</span>
                        </div>
                    </div>
                </header> */}

                <div className="dashboard-body">
                    <div className="dash-header">
                        <motion.h1 initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>User Provisioning</motion.h1>
                        <motion.p initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.1 }}>Onboard new authenticated accounts into the system.</motion.p>
                    </div>

                    <motion.div
                        className="form-card"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <form onSubmit={handleSubmit}>
                            {status.message && (
                                <div className={`status-banner ${status.type}`}>
                                    {status.message}
                                </div>
                            )}

                            <div className="form-row">
                                <div className="form-group">
                                    <label>First Name</label>
                                    <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} placeholder="First Name" required />
                                </div>
                                <div className="form-group">
                                    <label>Last Name</label>
                                    <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} placeholder="Last Name" required />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Username</label>
                                    <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder="Username" required />
                                </div>
                                <div className="form-group">
                                    <label>Email Address</label>
                                    <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="email@example.com" required />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Password</label>
                                    <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" required />
                                </div>
                                <div className="form-group">
                                    <label>Confirm Password</label>
                                    <input type="password" name="confirm_password" value={formData.confirm_password} onChange={handleChange} placeholder="••••••••" required />
                                </div>
                            </div>

                            <div className="form-group full-width">
                                <label>System Role</label>
                                <select name="role" value={formData.role} onChange={handleChange} className="styled-select">
                                    <option value="Select Role">Select Role</option>
                                    <option value="student">Student</option>
                                    <option value="teacher">Teacher</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>

                            <div className="form-actions">
                                <button type="submit" className="submit-btn" disabled={loading}>
                                    {loading ? 'Processing...' : 'Provision Account'}
                                </button>
                                <button type="reset" className="cancel-btn" onClick={() => setFormData({
                                    first_name: '', last_name: '', username: '', email: '', password: '', confirm_password: '', role: 'Select Role'
                                })}>
                                    Reset Form
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            </main>
        </div>
    );
};

export default CreateUser;
