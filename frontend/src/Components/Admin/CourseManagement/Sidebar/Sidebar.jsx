import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    LayoutDashboard,
    PlusCircle,
    List,
    Users,
    ArrowLeft,
    ShieldCheck
} from 'lucide-react';

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const sidebarItems = [
        { name: 'Dashboard', icon: <LayoutDashboard size={18} />, link: '/admin/course-management' },
        { name: 'Add Course', icon: <PlusCircle size={18} />, link: '/add-course' },
        { name: 'Manage Courses', icon: <List size={18} />, link: '/manage-course' },
        { name: 'Faculty Assignment', icon: <Users size={18} />, link: '/assign-faculty' },
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
                <h2>Admin Portal</h2>
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
                >
                    <ArrowLeft size={18} />
                    <span>Back to Portal</span>
                </motion.div>
            </div>
        </aside>
    );
};

export default Sidebar;
