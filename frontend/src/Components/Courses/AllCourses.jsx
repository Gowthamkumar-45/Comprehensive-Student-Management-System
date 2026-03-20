import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './AllCourses.css';
import cardImage from '../../assets/images/Card image.jpg';
// import Footer from '../Footer/Footer';
import { Search, Filter, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import Sidebar from '../Admin/CourseManagement/Sidebar/Sidebar';

const AllCourses = () => {
    const [courses, setCourses] = useState([]);
    const [filteredCourses, setFilteredCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [categories, setCategories] = useState(['All']);
    const [showFilters, setShowFilters] = useState(false);

    const BASE_URL = 'http://127.0.0.1:8000';

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${BASE_URL}/api/v1/courses/`);
                setCourses(response.data);
                setFilteredCourses(response.data);

                // Extract unique categories
                const cats = ['All', ...new Set(response.data.map(c => c.category).filter(Boolean))];
                setCategories(cats);
            } catch (err) {
                console.error("Error fetching courses:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
        document.title = "All Courses - StudentPortal";
    }, []);

    useEffect(() => {
        let result = courses;

        if (searchTerm) {
            result = result.filter(c =>
                c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                c.category.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (selectedCategory !== 'All') {
            result = result.filter(c => c.category === selectedCategory);
        }

        setFilteredCourses(result);
    }, [searchTerm, selectedCategory, courses]);

    if (loading) return (
        <div className="users-management-page">
            <Sidebar />
            <main className="main-content" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="loader"></div>
            </main>
        </div>
    );

    return (
        <div className="users-management-page">
            <Sidebar />

            <main className="main-content" style={{ flex: 1, height: '100vh', overflowY: 'auto', backgroundColor: '#f8fafc' }}>
                <div className="all-courses-page" style={{ padding: '40px', maxWidth: '1600px', margin: '0 auto' }}>
                    <header className="page-header" style={{ marginBottom: '3rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '2rem' }}>
                            <div>
                                <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.02em', textAlign: 'left' }}>Course Catalog</h1>
                                <p style={{ color: '#64748b', fontSize: '1.1rem', marginTop: '0.5rem', fontWeight: 500 }}>
                                    Search and browse the complete academic curriculum.
                                </p>
                            </div>

                            <div className="header-controls" style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                <div className="search-bar-modern" style={{ width: '400px', display: 'flex', alignItems: 'center', background: 'white', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '0 18px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', transition: 'all 0.3s' }}>
                                    <Search size={20} color="#94a3b8" />
                                    <input
                                        type="text"
                                        placeholder="Search by course name or category..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        style={{ border: 'none', background: 'transparent', outline: 'none', boxShadow: 'none', appearance: 'none', borderRadius: '0', padding: '14px 12px', width: '100%', fontSize: '1rem', color: '#1e293b' }}
                                    />
                                </div>

                                <button
                                    className={`filter-toggle-btn ${showFilters ? 'active' : ''}`}
                                    onClick={() => setShowFilters(!showFilters)}
                                    style={{
                                        width: '48px',
                                        height: '48px',
                                        borderRadius: '14px',
                                        border: '1px solid #e2e8f0',
                                        background: showFilters ? '#6366f1' : 'white',
                                        color: showFilters ? 'white' : '#64748b',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        boxShadow: showFilters ? '0 8px 15px -3px rgba(99, 102, 241, 0.4)' : '0 2px 4px rgba(0,0,0,0.02)'
                                    }}
                                >
                                    {showFilters ? <X size={22} /> : <Filter size={22} />}
                                </button>
                            </div>
                        </div>
                    </header>

                    <AnimatePresence>
                        {showFilters && (
                            <motion.div
                                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                                animate={{ opacity: 1, height: 'auto', marginBottom: '3rem' }}
                                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                                style={{ overflow: 'hidden' }}
                            >
                                <div style={{
                                    background: 'white',
                                    borderRadius: '20px',
                                    padding: '24px',
                                    border: '1px solid #e2e8f0',
                                    boxShadow: '0 12px 25px -5px rgba(0,0,0,0.05)'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                        <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1e293b' }}>Filter by Category:</span>
                                        <div className="category-tags" style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '10px' }}>
                                            {categories.map(cat => (
                                                <button
                                                    key={cat}
                                                    className={`cat-tag ${selectedCategory === cat ? 'active' : ''}`}
                                                    onClick={() => setSelectedCategory(cat)}
                                                    style={{
                                                        padding: '10px 20px',
                                                        borderRadius: '12px',
                                                        fontSize: '0.9rem',
                                                        fontWeight: 600,
                                                        border: '1px solid #e2e8f0',
                                                        background: selectedCategory === cat ? '#6366f1' : '#f8fafc',
                                                        color: selectedCategory === cat ? 'white' : '#64748b',
                                                        cursor: 'pointer',
                                                        transition: 'all 0.2s'
                                                    }}
                                                >
                                                    {cat}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <main style={{ width: '100%' }}>
                        <div className="courses-results">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                <p className="results-count" style={{ margin: 0, fontWeight: 600, color: '#64748b', fontSize: '1.1rem' }}>
                                    Total Courses: <span style={{ color: '#0f172a' }}>{filteredCourses.length}</span>
                                </p>
                            </div>

                            <div className="courses-grid">
                                {filteredCourses.length > 0 ? (
                                    filteredCourses.map((course, index) => (
                                        <div key={course.id} className="course-card-alt">
                                            <div className="card-image-box">
                                                <img src={course.image ? (course.image.startsWith('http') ? course.image : `${BASE_URL}${course.image}`) : cardImage} alt={course.title} />
                                                <div className="card-badge">{course.level}</div>
                                            </div>
                                            <div className="card-body">
                                                <span className="card-cat">{course.category}</span>
                                                <h3 className="card-title">{course.title}</h3>
                                                <p className="card-desc">{course.description}</p>
                                                <div className="card-footer-alt">
                                                    <span className="duration-pill">{course.duration}</span>
                                                    <Link to={`/course/${course.id}`} target="_blank" className="explore-btn">
                                                        Explore →
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="no-results">
                                        <h3>No courses found matching your criteria.</h3>
                                        <button onClick={() => { setSearchTerm(''); setSelectedCategory('All'); }}>Reset Filters</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </main>
                    <div style={{ marginTop: '4rem' }}>
                        {/* <Footer /> */}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AllCourses;
