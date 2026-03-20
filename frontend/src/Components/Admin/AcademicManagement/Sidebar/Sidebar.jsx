import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    LayoutDashboard,
    Book,
    ClipboardCheck,
    GraduationCap,
    ArrowLeft,
    ShieldCheck
} from 'lucide-react';

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const sidebarItems = [
        { name: 'Dashboard', icon: <LayoutDashboard size={18} />, link: '/admin/academic-management' },
        { name: 'Subjects', icon: <Book size={18} />, link: '/admin/subjects' },
        { name: 'Attendance', icon: <ClipboardCheck size={18} />, link: '/admin/attendance' },
        { name: 'Marks & Results', icon: <GraduationCap size={18} />, link: '/admin/marks' },
    ];

    return (
        <aside className="admin-sidebar">
            <div className="sidebar-header">
                <motion.div
                    className="logo-box"
                    whileHover={{ rotate: 10, scale: 1.05 }}
                >
                    <ShieldCheck color="#6366f1" size={24} />
                </motion.div>
                <h2>Academic Portal</h2>
            </div>

            <nav className="sidebar-nav">
                <ul>
                    {sidebarItems.map((item, idx) => {
                        const isActive = location.pathname === item.link;
                        return (
                            <li key={idx} className={isActive ? 'active' : ''}>
                                <Link to={item.link}>
                                    {item.icon}
                                    <span>{item.name}</span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            <div className="sidebar-footer">
                <motion.div
                    className="back-tile"
                    onClick={() => navigate('/')}
                    whileHover={{ x: -5 }}
                    style={{ cursor: 'pointer' }}
                >
                    <ArrowLeft size={18} />
                    <span>Back to Home</span>
                </motion.div>
            </div>
        </aside>
    );
};

export default Sidebar;
