import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from './Sidebar/Sidebar';
import '../UsersManagement/UserDashboard/UserDashboard.css';
import './LibraryManagement.css';

const LibraryManagement = () => {
    useEffect(() => {
        document.title = "Library Management - Admin Panel";
    }, []);

    const sections = [
        { title: "Books", icon: "📚", count: "12,450", description: "Search, add, and manage library books and digital resources." },
        { title: "Issue / Return", icon: "🔄", count: "145 Today", description: "Track book circulation, pending returns, and reservation queues." },
        { title: "Availability Tracking", icon: "�", count: "98% Stock", description: "Monitor real-time shelf status and book locations." },
        { title: "Fine Management", icon: "💰", count: "65 Pending", description: "Track overdue books and manage automated fine collections." }
    ];

    return (
        <div className="users-management-page">
            <Sidebar />

            <div className="main-content">
                <header className="page-header">
                    <h1>Library Management</h1>
                    <p>Efficiently manage your institution's library resources, circulation, and digital archives.</p>
                </header>

                <div className="library-stats-strip">
                    <div className="stat-card">
                        <span className="stat-value">12.4k</span>
                        <span className="stat-label">Total Books</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-value">850</span>
                        <span className="stat-label">Digital Resources</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-value">3.2k</span>
                        <span className="stat-label">Active Members</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-value">145</span>
                        <span className="stat-label">Daily Issues</span>
                    </div>
                </div>

                <div className="library-grid">
                    {sections.map((section, index) => (
                        <div key={index} className="library-card">
                            <div className="card-top">
                                <div className="card-icon">{section.icon}</div>
                                <span className="card-badge">{section.count}</span>
                            </div>
                            <div className="card-info">
                                <h3>{section.title}</h3>
                                <p>{section.description}</p>
                            </div>
                            <button className="library-action-btn">Open Module</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LibraryManagement;
