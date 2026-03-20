import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer-section">
            <div className="section-container">
                <div className="footer-grid">
                    <div className="footer-brand">
                        <div className="home-logo">
                            <Link to="/" className="logo-link">
                                <span className="logo-icon">SP</span>
                                <span className="logo-text">StudentPortal</span>
                            </Link>
                        </div>
                        <p className="footer-description">
                            Revolutionizing education management through innovation and technology.
                        </p>
                    </div>

                    <div className="footer-links-group">
                        <div className="footer-links">
                            <h4>Quick Links</h4>
                            <a href="/#home" className="nav-link">Home</a>
                            <a href="/#courses" className="nav-link">Courses</a>
                            <a href="/#about" className="nav-link">About</a>
                            <a href="/#contact" className="nav-link">Contact</a>
                        </div>
                        <div className="footer-links">
                            <h4>Support</h4>
                            <Link to="/help">Help Center</Link>
                            <Link to="/privacy">Privacy Policy</Link>
                            <Link to="/terms">Terms of Service</Link>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; 2026 StudentPortal. All rights reserved.</p>
                    <div className="social-icons">
                        <span className="social-icon">🌐</span>
                        <span className="social-icon">🐦</span>
                        <span className="social-icon">💼</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
