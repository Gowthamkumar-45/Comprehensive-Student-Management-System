import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    BookOpen,
    Users,
    ClipboardList,
    Calendar,
    ArrowLeft,
    MonitorPlay,
    Bell,
    CheckCircle
} from 'lucide-react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import axios from 'axios';
import './TeacherDashboard.css';

const StatCard = ({ title, value, icon, color, delay }) => (
    <motion.div
        className={`ts-stat-card ${color}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.4 }}
    >
        <div className="ts-stat-content">
            <h3>{title}</h3>
            <h2>{value}</h2>
        </div>
        <div className="ts-stat-icon">
            {icon}
        </div>
    </motion.div>
);

const TeacherDashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const scheduleData = [
        { time: '09:00 AM', cls: 'CS-101 Data Structures', room: 'Room 304' },
        { time: '11:30 AM', cls: 'CS-202 Algorithms', room: 'Lab 2' },
        { time: '02:00 PM', cls: 'IT-401 Machine Learning', room: 'Room 101' },
    ];

    const chartData = [
        { name: 'Week 1', attendance: 85 },
        { name: 'Week 2', attendance: 88 },
        { name: 'Week 3', attendance: 92 },
        { name: 'Week 4', attendance: 90 },
        { name: 'Week 5', attendance: 95 },
    ];

    useEffect(() => {
        document.title = "Teacher Dashboard";
        const userString = localStorage.getItem('user');
        if (userString) {
            setUser(JSON.parse(userString));
        }
        // Simulate loading
        setTimeout(() => setLoading(false), 800);
    }, []);

    if (loading) {
        return (
            <div className="ts-loader-container">
                <div className="ts-spinner"></div>
            </div>
        );
    }

    return (
        <div className="ts-dashboard-layout">


            <main className="ts-main-content">
                <header className="ts-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <button className="ts-icon-btn" onClick={() => navigate('/')}>
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <h1>Welcome back, Prof. {user ? user.last_name || user.username : 'Smith'}</h1>
                            <p>Here's an overview of your classes and schedules today.</p>
                        </div>
                    </div>
                    <div className="ts-header-actions">
                        <button className="ts-icon-btn"><Bell size={20} /></button>
                        <div className="ts-profile-avatar">
                            {user ? user.username[0].toUpperCase() : 'P'}
                        </div>
                    </div>
                </header>

                <div className="ts-stats-grid">
                    <StatCard title="Total Students" value="142" icon={<Users size={24} />} color="blue" delay={0.1} />
                    <StatCard title="Active Classes" value="4" icon={<BookOpen size={24} />} color="purple" delay={0.2} />
                    <StatCard title="Pending Grading" value="38" icon={<ClipboardList size={24} />} color="orange" delay={0.3} />
                    <StatCard title="Overall Attendance" value="92%" icon={<CheckCircle size={24} />} color="green" delay={0.4} />
                </div>

                <div className="ts-grid-layout">
                    <motion.div
                        className="ts-glass-card chart-card"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5, duration: 0.4 }}
                    >
                        <h3>Average Class Attendance</h3>
                        <div className="ts-chart-container">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="colorAtt" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dx={-10} />
                                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                    <Area type="monotone" dataKey="attendance" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorAtt)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    <motion.div
                        className="ts-glass-card schedule-card"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.6, duration: 0.4 }}
                    >
                        <div className="ts-card-header">
                            <h3><Calendar size={18} /> Today's Schedule</h3>
                        </div>
                        <div className="ts-schedule-list">
                            {scheduleData.map((item, idx) => (
                                <div key={idx} className="ts-schedule-item">
                                    <div className="ts-time">{item.time}</div>
                                    <div className="ts-class-info">
                                        <h4>{item.cls}</h4>
                                        <p>{item.room}</p>
                                    </div>
                                    <button className="ts-join-btn">View</button>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </main>
        </div>
    );
};

export default TeacherDashboard;
