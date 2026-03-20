import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Library,
    BookPlus,
    List,
    ArrowLeftRight,
    Search,
    DollarSign,
    ArrowLeft,
    ShieldCheck
} from 'lucide-react';

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const sidebarItems = [
        { name: 'Library Portal', icon: <Library size={18} />, link: '/admin/library-management' },
        { name: 'Add Books', icon: <BookPlus size={18} />, link: '/admin/add-book' },
        { name: 'Books List', icon: <List size={18} />, link: '/admin/books' },
        { name: 'Issue/Return', icon: <ArrowLeftRight size={18} />, link: '/admin/issue-return' },
        { name: 'Fine Management', icon: <DollarSign size={18} />, link: '/admin/library-fines' },
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
                <h2>Library Portal</h2>
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
