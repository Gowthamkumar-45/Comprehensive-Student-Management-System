import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    BookOpen,
    GraduationCap,
    Clock,
    Award,
    ArrowLeft,
    Bell,
    CheckCircle,
    Calendar,
    Target
} from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import axios from 'axios';
import './StudentDashboard.css';

const StatCard = ({ title, value, icon, subtitle, color, delay }) => (
    <motion.div
        className={`sd-stat-card ${color}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.4 }}
    >
        <div className="sd-stat-content">
            <h3>{title}</h3>
            <h2>{value}</h2>
            <p>{subtitle}</p>
        </div>
        <div className="sd-stat-icon">
            {icon}
        </div>
    </motion.div>
);

const StudentDashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const upcomingDeadlines = [
        { task: 'Software Engineering Project', due: 'Today, 11:59 PM', course: 'CS-401' },
        { task: 'Calculus Assignment 4', due: 'Tomorrow, 5:00 PM', course: 'MATH-201' },
        { task: 'Physics Lab Report', due: 'Oct 25, 12:00 PM', course: 'PHY-102' },
    ];

    const performanceData = [
        { name: 'CS-401', grade: 92 },
        { name: 'MATH-201', grade: 88 },
        { name: 'PHY-102', grade: 75 },
        { name: 'ENG-101', grade: 95 },
        { name: 'HIST-200', grade: 82 },
    ];

    useEffect(() => {
        document.title = "Student Dashboard";
        const userString = localStorage.getItem('user');
        if (userString) {
            setUser(JSON.parse(userString));
        }
        setTimeout(() => setLoading(false), 800);
    }, []);

    if (loading) {
        return (
            <div className="sd-loader-container">
                <div className="sd-spinner"></div>
            </div>
        );
    }

    return (
        <div className="sd-dashboard-layout">


            <main className="sd-main-content">
                <header className="sd-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <button className="sd-icon-btn" onClick={() => navigate('/')}>
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <h1>Hello, {user ? user.first_name || user.username : 'Student'}! 👋</h1>
                            <p>Track your academic progress and upcoming deadlines.</p>
                        </div>
                    </div>
                    <div className="sd-header-actions">
                        <button className="sd-icon-btn"><Bell size={20} /></button>
                        <div className="sd-profile-avatar">
                            {user ? user.username[0].toUpperCase() : 'S'}
                        </div>
                    </div>
                </header>

                <div className="sd-stats-grid">
                    <StatCard title="Current GPA" value="3.8" subtitle="Top 10% in class" icon={<Award size={24} />} color="rose" delay={0.1} />
                    <StatCard title="Active Courses" value="5" subtitle="15 total credits" icon={<BookOpen size={24} />} color="blue" delay={0.2} />
                    <StatCard title="Attendance" value="95%" subtitle="Great consistency" icon={<Target size={24} />} color="teal" delay={0.3} />
                    <StatCard title="Study Hours" value="24h" subtitle="Logged this week" icon={<Clock size={24} />} color="amber" delay={0.4} />
                </div>

                <div className="sd-grid-layout">
                    <motion.div
                        className="sd-glass-card performance-card"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5, duration: 0.4 }}
                    >
                        <div className="sd-card-header">
                            <h3><Target size={18} /> Academic Performance</h3>
                        </div>
                        <div className="sd-chart-container">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={performanceData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dx={-10} domain={[0, 100]} />
                                    <Tooltip
                                        cursor={{ fill: 'rgba(244, 63, 94, 0.05)' }}
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Bar dataKey="grade" radius={[4, 4, 0, 0]} barSize={40}>
                                        {
                                            performanceData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.grade > 85 ? '#f43f5e' : entry.grade > 75 ? '#fbbf24' : '#94a3b8'} />
                                            ))
                                        }
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    <motion.div
                        className="sd-glass-card deadlines-card"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6, duration: 0.4 }}
                    >
                        <div className="sd-card-header">
                            <h3><Calendar size={18} /> Upcoming Tasks</h3>
                            <button className="sd-text-btn">View All</button>
                        </div>
                        <div className="sd-tasks-list">
                            {upcomingDeadlines.map((task, idx) => (
                                <div key={idx} className="sd-task-item">
                                    <div className="sd-task-icon">
                                        <Clock size={16} color="#fbbf24" />
                                    </div>
                                    <div className="sd-task-info">
                                        <h4>{task.task}</h4>
                                        <p>{task.course} • Due {task.due}</p>
                                    </div>
                                    <div className="sd-check-circle">
                                        <CheckCircle size={20} color="#cbd5e1" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </main>
        </div>
    );
};

export default StudentDashboard;
