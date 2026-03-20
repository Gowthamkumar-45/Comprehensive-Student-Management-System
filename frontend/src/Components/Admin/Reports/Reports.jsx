import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Reports.css';

const Reports = () => {
    useEffect(() => {
        document.title = "System Reports - Admin Panel";
    }, []);

    const reportGroups = [
        {
            category: "Financial Reports",
            items: ["Collection Summary", "Outstanding Fines", "Budget Allocation", "Procurement Costs"]
        },
        {
            category: "Academic Reports",
            items: ["Class Performance", "Attendance Analytics", "Exam Results", "Departmental Growth"]
        },
        {
            category: "User Reports",
            items: ["Login Activity", "User Role Distribution", "Staff Workload", "Student Enrollment"]
        },
        {
            category: "Facility Reports",
            items: ["Library Usage", "Lab Equipment", "Classroom Allocation", "Infrastructure Health"]
        }
    ];

    return (
        <div className="reports-page">
            <div className="admin-sidebar">
                <div className="admin-logo">Admin Panel</div>
                <nav>
                    <ul>
                        <li><Link to="/admin-dashboard">Dashboard</Link></li>
                        <li><Link to="/admin/create-user">Users Management</Link></li>
                        <li><Link to="/admin/academic-management">Academic Management</Link></li>
                        <li><Link to="/admin/library-management">Library Management</Link></li>
                        <li className="active"><Link to="/admin/reports">Reports</Link></li>
                    </ul>
                </nav>
            </div>

            <div className="main-content">
                <header className="page-header">
                    <h1>System Reports</h1>
                    <p>Generate comprehensive analytics and reporting across all system modules.</p>
                </header>

                <div className="reports-container">
                    {reportGroups.map((group, idx) => (
                        <div key={idx} className="report-group-card">
                            <h3>{group.category}</h3>
                            <div className="report-items">
                                {group.items.map((item, i) => (
                                    <div key={i} className="report-item">
                                        <span className="report-dot"></span>
                                        <span className="report-name">{item}</span>
                                        <button className="gen-btn">Generate</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Reports;
