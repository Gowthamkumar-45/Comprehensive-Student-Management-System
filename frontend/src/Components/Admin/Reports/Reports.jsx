import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    DownloadCloud, Filter, Calendar, BarChart2,
    PieChart as PieChartIcon, TrendingUp, AlertTriangle
} from 'lucide-react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
    BarChart, Bar
} from 'recharts';
import Sidebar from '../UsersManagement/Sidebar/Sidebar';
import '../UsersManagement/UserDashboard/UserDashboard.css';
import '../CourseManagement/CourseManagement.css';
import './Reports.css';

const StatCard = ({ title, value, color, icon }) => (
    <motion.div
        className="stat-card-clean"
        variants={itemVariants}
        whileHover={{ y: -5 }}
    >
        <div className="stat-content">
            <h4>{title}</h4>
            <span className="stat-value">{value}</span>
            <div className="stat-trend trend-down" style={{ color: '#64748b' }}>
                <Calendar size={14} /> <span>Last 30 Days</span>
            </div>
        </div>
        <div className="stat-icon-box" style={{ background: color.bg, color: color.icon }}>
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

const Reports = () => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        document.title = "System Reports Dashboard";
        setTimeout(() => setLoading(false), 700);
    }, []);

    const activityData = [
        { name: '1', users: 120, queries: 400 },
        { name: '5', users: 180, queries: 450 },
        { name: '10', users: 150, queries: 420 },
        { name: '15', users: 240, queries: 500 },
        { name: '20', users: 210, queries: 480 },
        { name: '25', users: 290, queries: 550 },
        { name: '30', users: 260, queries: 600 },
    ];

    const reportSets = [
        { title: "Financial Output", desc: "Revenue, Expenses, Fines", type: "PDF" },
        { title: "Academic Grades", desc: "Midterm & Finals Analytics", type: "CSV" },
        { title: "Attendance Logs", desc: "Student & Faculty Presence", type: "XLSX" },
        { title: "System Audit", desc: "Login IPs, Error Logs", type: "TXT" },
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
                    <div className="dash-header" style={{ marginBottom: '1.5rem', marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <motion.h1 variants={itemVariants} style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.25rem' }}>Reports Engine</motion.h1>
                            <motion.p variants={itemVariants} style={{ color: '#64748b', fontSize: '1rem', margin: 0 }}>Comprehensive analytics and data exports.</motion.p>
                        </div>
                        <motion.button variants={itemVariants} className="primary-action-btn" style={{ padding: '0.75rem 1.5rem', borderRadius: '12px' }}>
                            <Filter size={18} /> <span>Custom Query</span>
                        </motion.button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
                        <StatCard
                            title="Total Reports Gen"
                            value="1,240"
                            icon={<BarChart2 size={24} />}
                            color={{ bg: 'rgba(59, 130, 246, 0.1)', icon: '#3b82f6' }}
                        />
                        <StatCard
                            title="Data Exported"
                            value="42.5 GB"
                            icon={<DownloadCloud size={24} />}
                            color={{ bg: 'rgba(168, 85, 247, 0.1)', icon: '#a855f7' }}
                        />
                        <StatCard
                            title="System Alerts"
                            value="3"
                            icon={<AlertTriangle size={24} />}
                            color={{ bg: 'rgba(245, 158, 11, 0.1)', icon: '#f59e0b' }}
                        />
                    </div>

                    <div className="charts-grid" style={{ gridTemplateColumns: '1.8fr 1fr', gap: '1.5rem', marginBottom: '1.5rem',marginTop: '2.5rem' }}>
                        <motion.div className="chart-container-card" variants={itemVariants} style={{ height: '380px' }}>
                            <div className="card-title-row">
                                <h3>System Activity & Data Usage</h3>
                            </div>
                            <div style={{ height: '300px', width: '100%' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={activityData} margin={{ top: 10, right: 30, left: -20, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                                        <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                        <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                        <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                                        <Line yAxisId="left" type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={3} dot={{ strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
                                        <Line yAxisId="right" type="monotone" dataKey="queries" stroke="#f43f5e" strokeWidth={3} dot={{ strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </motion.div>

                        <motion.div className="chart-container-card" variants={itemVariants} style={{ height: '380px' }}>
                            <div className="card-title-row">
                                <h3>Quick Export Templates</h3>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto', paddingBottom: '1rem' }}>
                                {reportSets.map((rs, idx) => (
                                    <div key={idx} style={{ padding: '1.25rem', background: '#f8fafc', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'all 0.2s', cursor: 'pointer', border: '1px solid #e2e8f0' }} className="report-list-item">
                                        <div>
                                            <h4 style={{ margin: '0 0 0.25rem', fontSize: '1rem', color: '#1e293b', fontWeight: 600 }}>{rs.title}</h4>
                                            <p style={{ margin: 0, fontSize: '0.8.5rem', color: '#64748b' }}>{rs.desc}</p>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#94a3b8', background: '#e2e8f0', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>{rs.type}</span>
                                            <DownloadCloud size={20} color="#3b82f6" style={{ cursor: 'pointer' }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </main>
        </div>
    );
};

export default Reports;
