import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import {
    Users, UserPlus, GraduationCap,
    School, Settings,
    TrendingUp, TrendingDown,
    ChevronRight
} from 'lucide-react';
import {
    AreaChart, Area, XAxis, YAxis,
    CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts';
import Sidebar from '../Sidebar/Sidebar';
import './UserDashboard.css';

const UserDashboard = () => {
    const navigate = useNavigate();
    const [data, setData] = useState({
        total: 0,
        students: 0,
        faculty: 0,
        admins: 0,
        recentUsers: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        document.title = "User Analytics Dashboard";
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/v1/list/');
            const users = response.data;
            const students = users.filter(u => u.role === 'student').length;
            const faculty = users.filter(u => u.role === 'teacher').length;
            const admins = users.filter(u => u.role === 'admin').length;
            const sortedUsers = [...users].sort((a, b) => new Date(b.date_joined) - new Date(a.date_joined)).slice(0, 5);

            setData({ total: users.length, students, faculty, admins, recentUsers: sortedUsers });
        } catch (err) {
            console.error("Dashboard error:", err);
        } finally {
            setLoading(false);
        }
    };

    const roleDistribution = [
        { name: 'Students', value: data.students, color: '#3b82f6' },
        { name: 'Faculty', value: data.faculty, color: '#10b981' },
        { name: 'Admins', value: data.admins, color: '#f59e0b' }
    ];

    const growthData = [
        { name: 'Mon', count: 4 }, { name: 'Tue', count: 7 }, { name: 'Wed', count: 5 },
        { name: 'Thu', count: 12 }, { name: 'Fri', count: 9 }, { name: 'Sat', count: 6 },
        { name: 'Sun', count: 8 },
    ];



    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.2 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: 'spring', stiffness: 100, damping: 15 }
        }
    };

    if (loading) return (
        <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifySelf: 'center' }}>
            <ActivityIndicator />
        </div>
    );

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
                        <motion.div className="icon-btn" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Bell size={20} />
                        </motion.div>
                        <div className="user-profile-toggle">
                            <div className="avatar-mini">A</div>
                            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1e293b' }}>Administrator</span>
                        </div>
                    </div>
                </header> */}

                <motion.div
                    className="dashboard-body"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <div className="dash-header">
                        <motion.h1 variants={itemVariants}>User Analytics</motion.h1>
                        <motion.p variants={itemVariants}>Real-time system telemetry and directory metrics.</motion.p>
                    </div>

                    <div className="stats-row">
                        <motion.div className="stat-card-clean" variants={itemVariants} whileHover={{ y: -5 }}>
                            <div className="stat-content">
                                <h4>Total Users</h4>
                                <span className="stat-value">{data.total}</span>
                                <div className="stat-trend trend-up">
                                    <TrendingUp size={14} /> <span>12% growth</span>
                                </div>
                            </div>
                            <div className="stat-icon-box" style={{ background: 'rgba(59, 130, 246, 0.1)' }}>
                                <Users size={22} color="#3b82f6" />
                            </div>
                        </motion.div>

                        <motion.div className="stat-card-clean" variants={itemVariants} whileHover={{ y: -5 }}>
                            <div className="stat-content">
                                <h4>Students</h4>
                                <span className="stat-value">{data.students}</span>
                                <div className="stat-trend trend-up">
                                    <TrendingUp size={14} /> <span>8% growth</span>
                                </div>
                            </div>
                            <div className="stat-icon-box" style={{ background: 'rgba(16, 185, 129, 0.1)' }}>
                                <GraduationCap size={22} color="#10b981" />
                            </div>
                        </motion.div>

                        <motion.div className="stat-card-clean" variants={itemVariants} whileHover={{ y: -5 }}>
                            <div className="stat-content">
                                <h4>Faculty</h4>
                                <span className="stat-value">{data.faculty}</span>
                                <div className="stat-trend trend-down">
                                    <TrendingDown size={14} /> <span>3% churn</span>
                                </div>
                            </div>
                            <div className="stat-icon-box" style={{ background: 'rgba(245, 158, 11, 0.1)' }}>
                                <School size={22} color="#f59e0b" />
                            </div>
                        </motion.div>

                        <motion.div className="stat-card-clean" variants={itemVariants} whileHover={{ y: -5 }}>
                            <div className="stat-content">
                                <h4>Sessions</h4>
                                <span className="stat-value">24</span>
                                <div className="stat-trend trend-up">
                                    <TrendingUp size={14} /> <span>Live status</span>
                                </div>
                            </div>
                            <div className="stat-icon-box" style={{ background: 'rgba(239, 68, 68, 0.1)' }}>
                                <ActivityIndicator />
                            </div>
                        </motion.div>
                    </div>

                    <div className="charts-grid">
                        <motion.div className="chart-container-card" variants={itemVariants}>
                            <div className="card-title-row">
                                <h3>Registration Velocity</h3>
                            </div>
                            <div style={{ height: '350px', width: '100%' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={growthData}>
                                        <defs>
                                            <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                                        <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                                        <Area type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </motion.div>

                        <motion.div className="chart-container-card" variants={itemVariants}>
                            <div className="card-title-row">
                                <h3>Role Distribution</h3>
                            </div>
                            <div style={{ height: '350px', width: '100%', position: 'relative' }}>
                                <div style={{
                                    position: 'absolute',
                                    top: '45%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    textAlign: 'center',
                                    pointerEvents: 'none'
                                }}>
                                    <div style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' }}>Total</div>
                                    <div style={{ fontSize: '32px', fontWeight: '900', color: '#1e293b', lineHeight: 1 }}>{data.total}</div>
                                </div>
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={roleDistribution}
                                            innerRadius={80}
                                            outerRadius={105}
                                            paddingAngle={8}
                                            dataKey="value"
                                            stroke="none"
                                            cx="50%"
                                            cy="45%"
                                        >
                                            {roleDistribution.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                            formatter={(value, name) => [`${value} Users`, name]}
                                        />
                                        <Legend
                                            content={({ payload }) => (
                                                <div style={{
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    gap: '24px',
                                                    marginTop: '10px',
                                                    flexWrap: 'wrap'
                                                }}>
                                                    {roleDistribution.map((entry, index) => {
                                                        const percentage = data.total > 0 ? ((entry.value / data.total) * 100).toFixed(1) : 0;
                                                        return (
                                                            <div key={`item-${index}`} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: '700', color: '#64748b' }}>
                                                                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: entry.color }}></div>
                                                                    <span>{entry.name}</span>
                                                                </div>
                                                                <div style={{ display: 'flex', alignItems: 'baseline', gap: '5px' }}>
                                                                    <span style={{ fontSize: '18px', fontWeight: '800', color: '#1e293b' }}>{entry.value}</span>
                                                                    <span style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8' }}>{percentage}%</span>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </motion.div>
                    </div>

                    <div className="charts-grid">
                        <motion.div className="table-card-dashboard" variants={itemVariants}>
                            <div className="table-header-dash">
                                <h3>Recent Provisioning</h3>
                                <button className="icon-btn" style={{ width: 'auto', padding: '0 1.25rem', fontSize: '0.8rem', fontWeight: 700 }} onClick={() => navigate('/admin/manage-users')}>View All</button>
                            </div>
                            <div className="table-dash-content">
                                <table className="dash-table">
                                    <thead>
                                        <tr>
                                            <th>USER</th>
                                            <th>ROLE</th>
                                            <th>DATE</th>
                                            <th>STATUS</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.recentUsers.map(user => (
                                            <tr key={user.id}>
                                                <td>
                                                    <div className="user-compact">
                                                        <div className="initials-round">{user.username[0].toUpperCase()}</div>
                                                        <span style={{ fontWeight: 700, color: '#1e293b' }}>{user.first_name || user.username}</span>
                                                    </div>
                                                </td>
                                                <td><span style={{ textTransform: 'capitalize', fontWeight: 600, color: '#64748b' }}>{user.role}</span></td>
                                                <td><span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>{new Date(user.date_joined).toLocaleDateString()}</span></td>
                                                <td>
                                                    <span style={{
                                                        background: user.is_active ? '#ecfdf5' : '#fef2f2',
                                                        color: user.is_active ? '#10b981' : '#ef4444',
                                                        padding: '0.35rem 0.75rem',
                                                        borderRadius: '8px',
                                                        fontSize: '0.75rem',
                                                        fontWeight: 800
                                                    }}>
                                                        {user.is_active ? 'Active' : 'Locked'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </motion.div>

                        <motion.div className="activity-card" variants={itemVariants}>
                            <div className="card-title-row">
                                <h3>Quick Actions</h3>
                            </div>
                            <div className="activity-list">
                                <ActionTile icon={<UserPlus size={18} color="#3b82f6" />} label="Provision User" onClick={() => navigate('/admin/create-user')} />
                                <ActionTile icon={<GraduationCap size={18} color="#10b981" />} label="Student List" onClick={() => navigate('/admin/students')} />
                                <ActionTile icon={<School size={18} color="#f59e0b" />} label="Faculty List" onClick={() => navigate('/admin/faculty')} />
                                <ActionTile icon={<Settings size={18} color="#6366f1" />} label="General Config" onClick={() => navigate('/admin/settings')} />
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </main>
        </div>
    );
};

const ActivityIndicator = () => (
    <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1.5 }} className="dot-pulse" style={{ width: '12px', height: '12px', background: '#3b82f6' }} />
);

const ActionTile = ({ icon, label, onClick }) => (
    <motion.div className="activity-item" style={{ cursor: 'pointer' }} onClick={onClick} whileHover={{ x: 8 }} transition={{ type: 'spring', stiffness: 300 }}>
        <div className="stat-icon-box" style={{ width: '38px', height: '38px', background: '#f8fafc' }}>
            {icon}
        </div>
        <div className="act-info">
            <p>{label}</p>
        </div>
        <ChevronRight size={16} style={{ marginLeft: 'auto', color: '#cbd5e1' }} />
    </motion.div>
);

export default UserDashboard;
