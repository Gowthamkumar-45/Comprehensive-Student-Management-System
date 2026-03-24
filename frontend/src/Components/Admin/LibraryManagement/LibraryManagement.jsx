import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Book, BookOpen, Clock, Activity, Settings, Plus, RotateCcw
} from 'lucide-react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar
} from 'recharts';
import Sidebar from './Sidebar/Sidebar';
import '../UsersManagement/UserDashboard/UserDashboard.css';
import './LibraryManagement.css';

const StatCard = ({ title, value, icon, color, delay }) => (
    <motion.div
        className="stat-card-clean"
        variants={itemVariants}
        whileHover={{ y: -5 }}
    >
        <div className="stat-content">
            <h4>{title}</h4>
            <span className="stat-value">{value}</span>
            <div className="stat-trend trend-up" style={{ color: '#10b981' }}>
                <Activity size={14} /> <span>Live tracking</span>
            </div>
        </div>
        <div className="stat-icon-box" style={{ background: color.bg }}>
            {icon}
        </div>
    </motion.div>
);

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: { type: 'spring', stiffness: 100, damping: 15 }
    }
};

const LibraryManagement = () => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        document.title = "Library Management Dashboard";
        setTimeout(() => setLoading(false), 600);
    }, []);

    const circulationData = [
        { name: 'Mon', issues: 40, returns: 24 },
        { name: 'Tue', issues: 30, returns: 35 },
        { name: 'Wed', issues: 55, returns: 40 },
        { name: 'Thu', issues: 20, returns: 50 },
        { name: 'Fri', issues: 65, returns: 45 },
        { name: 'Sat', issues: 15, returns: 80 },
    ];

    const popularCategories = [
        { name: 'Computer Sci', value: 340 },
        { name: 'Fiction', value: 210 },
        { name: 'Mathematics', value: 180 },
        { name: 'History', value: 120 },
        { name: 'Physics', value: 90 },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.1 }
        }
    };

    if (loading) return (
        <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="spinner"></div>
        </div>
    );

    return (
        <div className="users-management-page">
            <Sidebar />

            <main className="main-contents" style={{ padding: "0px", width: "100%", flex: 1 }}>
                <motion.div
                    className="dashboard-body"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <div className="dash-header" style={{ marginBottom: '1rem', marginTop: '1rem' }}>
                        <motion.h1 variants={itemVariants} style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.25rem' }}>Library Operations</motion.h1>
                        <motion.p variants={itemVariants} style={{ color: '#64748b', fontSize: '1rem', margin: 0 }}>Manage the institution's digital and physical archives.</motion.p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
                        <StatCard
                            title="Total Assets"
                            value="18,450"
                            icon={<Book size={22} color="#3b82f6" />}
                            color={{ bg: 'rgba(59, 130, 246, 0.1)' }}
                        />
                        <StatCard
                            title="Active Issues"
                            value="842"
                            icon={<BookOpen size={22} color="#10b981" />}
                            color={{ bg: 'rgba(16, 185, 129, 0.1)' }}
                        />
                        <StatCard
                            title="Overdue Items"
                            value="65"
                            icon={<Clock size={22} color="#ef4444" />}
                            color={{ bg: 'rgba(239, 68, 68, 0.1)' }}
                        />
                    </div>

                    <div className="charts-grid" style={{ gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                        <motion.div className="chart-container-card" variants={itemVariants} style={{ height: '380px' }}>
                            <div className="card-title-row">
                                <h3>Weekly Circulation Flow</h3>
                            </div>
                            <div style={{ height: '300px', width: '100%' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={circulationData} margin={{ top: 10, right: 30, left: -20, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorIssues" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                            </linearGradient>
                                            <linearGradient id="colorReturns" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                        <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                                        <Area type="monotone" dataKey="issues" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorIssues)" />
                                        <Area type="monotone" dataKey="returns" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorReturns)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </motion.div>

                        <motion.div className="chart-container-card" variants={itemVariants} style={{ height: '380px' }}>
                            <div className="card-title-row">
                                <h3>Most Borrowed Categories</h3>
                            </div>
                            <div style={{ height: '300px', width: '100%' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={popularCategories} layout="vertical" margin={{ top: 5, right: 30, left: 30, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                                        <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                        <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#1e293b', fontSize: 12, fontWeight: 600 }} width={100} />
                                        <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                                        <Bar dataKey="value" fill="#8b5cf6" radius={[0, 4, 4, 0]} barSize={20} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </motion.div>
                    </div>

                    <motion.div variants={itemVariants}>
                        <h2 className="chart-section-title" style={{ margin: '1rem 0', fontSize: '1.25rem' }}>Management Tools</h2>
                        <div className="course-action-grid">
                            <div className="course-action-card">
                                <div className="action-icon-circle" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>
                                    <Plus size={22} />
                                </div>
                                <div className="action-texts">
                                    <h3>Add New Book</h3>
                                    <p>Register new inventory</p>
                                </div>
                            </div>
                            <div className="course-action-card">
                                <div className="action-icon-circle" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>
                                    <RotateCcw size={22} />
                                </div>
                                <div className="action-texts">
                                    <h3>Issue / Return</h3>
                                    <p>Circulation desk operations</p>
                                </div>
                            </div>
                            <div className="course-action-card">
                                <div className="action-icon-circle" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>
                                    <Settings size={22} />
                                </div>
                                <div className="action-texts">
                                    <h3>Settings</h3>
                                    <p>Policies and fine config</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </main>
        </div>
    );
};

export default LibraryManagement;
