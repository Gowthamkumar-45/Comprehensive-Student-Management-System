import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    ClipboardList,
    Users,
    ArrowLeft,
    ShieldCheck
} from 'lucide-react';

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const sidebarItems = [
        { name: 'Enrollment Portal', icon: <ClipboardList size={18} />, link: '/admin/enrollment-management' },
        { name: 'Pending Approvals', icon: <Users size={18} />, link: '/admin/pending-enrollment' },
        { name: 'Enrollment History', icon: <ClipboardList size={18} />, link: '/admin/enrollment-history' },
    ];

    return (
        <aside className="admin-sidebar">
            <div className="sidebar-header">
                <motion.div
                    className="logo-box"
                    whileHover={{ rotate: 10, scale: 1.05 }}
                >
                    <ShieldCheck color="white" size={24} />
                </motion.div>
                <h2>Enrollment Portal</h2>
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
                    onClick={() => navigate('/admin-dashboard')}
                    whileHover={{ x: -5 }}
                    style={{ cursor: 'pointer' }}
                >
                    <ArrowLeft size={18} />
                    <span>Back to Admin</span>
                </motion.div>
            </div>
        </aside>
    );
};

export default Sidebar;
