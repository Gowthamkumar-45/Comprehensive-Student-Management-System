import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    UserPlus,
    Search, ChevronRight,
    Mail, Calendar, Briefcase,
    Activity
} from 'lucide-react';
import Sidebar from '../Sidebar/Sidebar';
import '../UserDashboard/UserDashboard.css';
import './AllUsers.css';

const AllUsers = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        document.title = "Manage Users - Admin Portal";
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/v1/list/');
            setUsers(response.data);
            setLoading(false);
        } catch (err) {
            setError(err.message || 'Failed to fetch users');
            setLoading(false);
        }
    };

    const filteredUsers = users.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="modern-admin-layout">
                <div className="loader-container">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        className="loading-spinner"
                    >
                        <Activity size={40} color="#6366f1" />
                    </motion.div>
                </div>
            </div>
        );
    }

    return (
        <div className="users-management-page">
            <Sidebar />
            <main className="main-content">
                <header className="header">
                    <div className="header-left-group">

                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            <h1>User Repository</h1>
                        </motion.div>
                    </div>

                    <div className="header-actions">
                        <div className="search-pill">
                            <Search size={18} />
                            <input
                                type="text"
                                placeholder="Search by name, email or username..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button className="primary-action-btn" onClick={() => navigate('/admin/create-user')}>
                            <UserPlus size={18} /> <span>New Member</span>
                        </button>
                    </div>
                </header>

                <AnimatePresence mode="wait">
                    {error ? (
                        <motion.div
                            key="error"
                            className="status-message-box error"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                        >
                            <p>System Error: {error}</p>
                            <button onClick={fetchUsers}>Re-attempt Connection</button>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="table"
                            className="table-glass-card"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <div className="table-responsive">
                                <table className="modern-table">
                                    <thead>
                                        <tr>
                                            <th>IDENTITY</th>
                                            <th>CONTACT</th>
                                            <th>DESIGNATION</th>
                                            <th>ONBOARDING</th>
                                            <th>STATUS</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredUsers.map((user, idx) => (
                                            <motion.tr
                                                key={user.id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: idx * 0.03 }}
                                                onClick={() => navigate(`/admin/user/${user.id}`)}
                                                className="clickable-row"
                                            >
                                                <td>
                                                    <div className="user-profile-cell">
                                                        <div className="profile-initials">
                                                            {(user.first_name?.[0] || user.username[0]).toUpperCase()}
                                                        </div>
                                                        <div className="profile-info">
                                                            <span className="p-full-name">{user.first_name} {user.last_name}</span>
                                                            <span className="p-username">@{user.username}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="contact-cell">
                                                        <Mail size={14} /> <span>{user.email}</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className={`designation-badge role-${user.role}`}>
                                                        <Briefcase size={12} /> {user.role}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className="date-cell">
                                                        <Calendar size={14} /> <span>{new Date(user.date_joined).toLocaleDateString()}</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className={`status-toggle ${user.is_active ? 'on' : 'off'}`}>
                                                        <span className="glow-dot"></span>
                                                        {user.is_active ? 'Active' : 'Inactive'}
                                                    </div>
                                                </td>
                                                <td className="row-actions">
                                                    <button className="action-circle">
                                                        <ChevronRight size={18} />
                                                    </button>
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};

export default AllUsers;
