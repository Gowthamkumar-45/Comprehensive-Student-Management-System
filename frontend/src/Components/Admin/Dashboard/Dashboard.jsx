import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Users,
    BookOpen,
    GraduationCap,
    TrendingUp,
    Activity,
    DollarSign,
    Calendar,
    ArrowLeft,
    ShieldCheck
} from 'lucide-react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar
} from 'recharts';
import axios from 'axios';
import './Dashboard.css';

const StatCard = ({ title, value, icon, trend, color, delay }) => (
    <motion.div
        className="admin-stat-card admin-glass-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.4 }}
    >
        <div className="admin-stat-card-header">
            <div>
                <h3 className="admin-stat-title">{title}</h3>
                <h2 className="admin-stat-value">{value}</h2>
            </div>
            <div className={`admin-stat-icon-wrapper ${color}`}>
                {icon}
            </div>
        </div>
        <div className={`admin-stat-trend ${trend >= 0 ? 'positive' : 'negative'}`}>
            <TrendingUp size={16} />
            <span>{Math.abs(trend)}% from last month</span>
        </div>
    </motion.div>
);

const Dashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [stats, setStats] = useState({
        students: { value: 0, trend: 0 },
        courses: { value: 0, trend: 0 },
        teachers: { value: 0, trend: 0 },
        revenue: { value: 0, trend: 0 }
    });
    const [chartData, setChartData] = useState([]);
    const [recentActivity, setRecentActivity] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        document.title = "Admin Dashboard - Overview";
        const userString = localStorage.getItem('user');
        if (userString) {
            setUser(JSON.parse(userString));
        }

        const fetchDashboardData = async () => {
            try {
                // Fetch stats and charts
                const statsResponse = await axios.get('http://localhost:8000/api/v1/dashboard/stats/');
                if (statsResponse.data.success) {
                    setStats(statsResponse.data.stats);
                    setChartData(statsResponse.data.chart_data);
                }

                // Fetch recent activity
                const activityResponse = await axios.get('http://localhost:8000/api/v1/dashboard/recent-activity/');
                if (activityResponse.data.success) {
                    setRecentActivity(activityResponse.data.activity);
                }

                setLoading(false);
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <div className="standalone-dashboard-page" style={{ justifyContent: 'center', alignItems: 'center' }}>
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="standalone-dashboard-page">
            {/* Side Navigation for Consistency */}
            <div className="dashboard-sidebar">
                <div className="sidebar-header">
                    <motion.div
                        className="logo-box"
                        whileHover={{ rotate: 10, scale: 1.05 }}
                    >
                        <ShieldCheck color="#6366f1" size={24} />
                    </motion.div>
                    <h2>Admin Portal</h2>
                </div>
                <nav>
                    <ul>
                        <li className="active"><Link to="/admin-dashboard">Dashboard</Link></li>
                        <li><Link to="/admin/users-management">Users Management</Link></li>
                        <li><Link to="/admin/course-management">Course Management</Link></li>
                        <li><Link to="/admin/academic-management">Academic Management</Link></li>
                        <li><Link to="/admin/enrollment-management">Enrollments</Link></li>
                        <li><Link to="/admin/library-management">Library Management</Link></li>
                        <li><Link to="/admin/reports">Reports</Link></li>
                        <li className="back-link" onClick={() => navigate('/')}>
                            <ArrowLeft size={16} />
                            <span>Back to Home</span>
                        </li>
                    </ul>
                </nav>
            </div>

            <div className="dashboard-main-content">
                <div className="dashboard-header-container">
                    <div className="dashboard-greeting">
                        <h1 className="admin-page-title">Welcome back, {user ? user.first_name || user.username : 'Admin'} 👋</h1>
                        <p className="admin-page-subtitle">Here is what's happening in your institution today.</p>
                    </div>
                    <div className="dashboard-actions">
                        <button className="admin-primary-btn">
                            <Calendar size={18} />
                            Generate Report
                        </button>
                    </div>
                </div>

                <div className="admin-stats-grid">
                    <StatCard
                        title="Total Students"
                        value={stats.students.value.toLocaleString()}
                        icon={<Users size={24} />}
                        trend={stats.students.trend}
                        color="blue"
                        delay={0.1}
                    />
                    <StatCard
                        title="Active Courses"
                        value={stats.courses.value.toLocaleString()}
                        icon={<BookOpen size={24} />}
                        trend={stats.courses.trend}
                        color="purple"
                        delay={0.2}
                    />
                    <StatCard
                        title="Total Teachers"
                        value={stats.teachers.value.toLocaleString()}
                        icon={<GraduationCap size={24} />}
                        trend={stats.teachers.trend}
                        color="orange"
                        delay={0.3}
                    />
                    <StatCard
                        title="Total Revenue"
                        value={`$${stats.revenue.value.toLocaleString()}`}
                        icon={<DollarSign size={24} />}
                        trend={stats.revenue.trend}
                        color="green"
                        delay={0.4}
                    />
                </div>

                <div className="admin-charts-grid">
                    <motion.div
                        className="admin-chart-card admin-glass-card"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5, duration: 0.4 }}
                    >
                        <div className="admin-chart-header">
                            <h3>Enrollment Overview</h3>
                            <button className="admin-icon-btn"><Activity size={18} /></button>
                        </div>
                        <div className="admin-chart-body">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dx={-10} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Area type="monotone" dataKey="students" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorStudents)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    <motion.div
                        className="admin-chart-card admin-glass-card"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.6, duration: 0.4 }}
                    >
                        <div className="admin-chart-header">
                            <h3>Revenue Analytics</h3>
                            <button className="admin-icon-btn"><DollarSign size={18} /></button>
                        </div>
                        <div className="admin-chart-body">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dx={-10} />
                                    <Tooltip
                                        cursor={{ fill: '#f1f5f9' }}
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Bar dataKey="revenue" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={30} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>
                </div>

                <div className="admin-recent-activity-section">
                    <motion.div
                        className="admin-glass-card full-width"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7, duration: 0.4 }}
                    >
                        <div className="admin-chart-header" style={{ marginBottom: '1.5rem' }}>
                            <h3>Recent Enrollments</h3>
                            <button className="admin-view-all-btn">View All</button>
                        </div>
                        <div className="admin-activity-list">
                            {recentActivity.length > 0 ? recentActivity.map((activity) => (
                                <div key={activity.id} className="admin-activity-item">
                                    <div className="admin-activity-avatar-wrapper">
                                        <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(activity.name)}&background=random`} alt={activity.name} />
                                    </div>
                                    <div className="admin-activity-details">
                                        <h4>{activity.name}</h4>
                                        <p>{activity.action}</p>
                                    </div>
                                    <div className="admin-activity-time">
                                        {activity.time}
                                    </div>
                                </div>
                            )) : (
                                <div className="admin-activity-item" style={{ justifyContent: 'center', color: '#64748b' }}>
                                    No recent activity found.
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
