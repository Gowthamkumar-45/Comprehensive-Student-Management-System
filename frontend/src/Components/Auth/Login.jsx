import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { User, Lock, ArrowRight, Loader } from 'lucide-react';
import './Login.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/v1/login/', {
                username,
                password
            });

            const data = response.data;
            localStorage.setItem('access_token', data.tokens.access);
            localStorage.setItem('refresh_token', data.tokens.refresh);
            localStorage.setItem('user', JSON.stringify(data.user));

            window.location.href = '/';
        } catch (err) {
            if (err.response) {
                setError(err.response.data.error || 'Invalid credentials');
            } else if (err.request) {
                setError('No response from server. Check if backend is running.');
            } else {
                setError('An error occurred. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modern-login-wrapper">
            <motion.div
                className="modern-login-card"
                initial={{ opacity: 0, scale: 0.95, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
            >
                <div className="login-header">
                    <motion.div
                        className="login-logo-circle"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                    >
                        SP
                    </motion.div>
                    <h2>Welcome Back</h2>
                    <p>Enter your credentials to access your portal</p>
                </div>

                <form onSubmit={handleLogin} className="login-form-body">
                    {error && (
                        <motion.div
                            className="login-error-toast"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            {error}
                        </motion.div>
                    )}

                    <div className="modern-form-group">
                        <label>Username</label>
                        <div className="modern-input-wrapper">
                            <User size={18} className="input-icon" />
                            <input
                                type="text"
                                placeholder="Enter your username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <div className="modern-form-group">
                        <label>Password</label>
                        <div className="modern-input-wrapper">
                            <Lock size={18} className="input-icon" />
                            <input
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <div className="login-options">
                        <label className="checkbox-container">
                            <input type="checkbox" disabled={loading} />
                            <span className="checkmark"></span>
                            Remember me
                        </label>
                        <a href="#forgot" className="forgot-link">Forgot Password?</a>
                    </div>

                    <motion.button
                        type="submit"
                        className="modern-login-btn"
                        disabled={loading}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        {loading ? (
                            <span className="btn-content loading">
                                <Loader className="spin-icon" size={18} /> Processing
                            </span>
                        ) : (
                            <span className="btn-content">
                                Sign In <ArrowRight size={18} />
                            </span>
                        )}
                    </motion.button>
                </form>
            </motion.div>

            {/* Background Animated Elements */}
            <div className="bg-shape bg-shape-1"></div>
            <div className="bg-shape bg-shape-2"></div>
        </div>
    );
};

export default Login;