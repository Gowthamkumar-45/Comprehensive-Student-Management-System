import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Link, useParams, useNavigate } from 'react-router-dom';
import './UpdateCourse.css';

const UpdateCourse = () => {
    const { courseId } = useParams(); // Should be ID
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState(null);
    const [status, setStatus] = useState({ type: '', message: '' });

    // Initial State Structure
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        full_description: '',
        duration: '',
        level: 'Undergraduate',
        category: '',
        who_is_it_for: '',
        why_take_this: '',
        what_you_will_learn: [''],
        opportunities: [''],
        faqs: [{ question: '', answer: '' }],
        modules: [{ name: '', topics: [{ name: '', content: '' }] }]
    });

    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    // Fetch Course Data
    const fetchCourseData = useCallback(async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/v1/courses/${courseId}/`);
            const data = response.data;

            // Transform data if needed to match form structure
            // Assuming API returns similar structure to what we send
            setFormData({
                title: data.title || '',
                description: data.description || '',
                full_description: data.full_description || '',
                duration: data.duration || '',
                level: data.level || 'Undergraduate',
                category: data.category || '',
                who_is_it_for: data.who_is_it_for || '',
                why_take_this: data.why_take_this || '',
                what_you_will_learn: Array.isArray(data.what_you_will_learn) ? data.what_you_will_learn : (data.what_you_will_learn ? [data.what_you_will_learn] : ['']),
                opportunities: Array.isArray(data.opportunities) ? data.opportunities : (data.opportunities ? [data.opportunities] : ['']),
                // Ensure faqs and modules are arrays even if empty in DB
                faqs: Array.isArray(data.faqs) && data.faqs.length > 0 ? data.faqs : [{ question: '', answer: '' }],
                modules: Array.isArray(data.modules) && data.modules.length > 0 ? data.modules : [{ name: '', topics: [{ name: '', content: '' }] }]
            });

            if (data.image) {
                setImagePreview(data.image.startsWith('http') ? data.image : `http://127.0.0.1:8000${data.image}`);
            }
            setLoading(false);
        } catch (err) {
            console.error(err);
            setFetchError('Failed to load course details.');
            setLoading(false);
        }
    }, [courseId]);

    useEffect(() => {
        document.title = "Update Course - Management System";
        if (courseId) {
            fetchCourseData();
        }
    }, [courseId, fetchCourseData]);

    // Handle Changes (Similar to AddCourse)
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    // Array Handlers
    const handleArrayChange = (index, value, field) => {
        const newArray = [...formData[field]];
        newArray[index] = value;
        setFormData(prev => ({ ...prev, [field]: newArray }));
    };

    const addArrayItem = (field) => {
        setFormData(prev => ({ ...prev, [field]: [...prev[field], ''] }));
    };

    const removeArrayItem = (index, field) => {
        const newArray = formData[field].filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, [field]: newArray }));
    };

    // FAQ Handlers
    const handleFaqChange = (index, field, value) => {
        const newFaqs = [...formData.faqs];
        newFaqs[index][field] = value;
        setFormData(prev => ({ ...prev, faqs: newFaqs }));
    };

    const addFaq = () => {
        setFormData(prev => ({ ...prev, faqs: [...prev.faqs, { question: '', answer: '' }] }));
    };

    const removeFaq = (index) => {
        setFormData(prev => ({ ...prev, faqs: prev.faqs.filter((_, i) => i !== index) }));
    };

    // Module Handlers
    const handleModuleChange = (mIndex, value) => {
        const newModules = [...formData.modules];
        newModules[mIndex].name = value;
        setFormData(prev => ({ ...prev, modules: newModules }));
    };

    const addModule = () => {
        setFormData(prev => ({
            ...prev,
            modules: [...prev.modules, { name: '', topics: [{ name: '', content: '' }] }]
        }));
    };

    const removeModule = (mIndex) => {
        setFormData(prev => ({ ...prev, modules: prev.modules.filter((_, i) => i !== mIndex) }));
    };

    const handleTopicChange = (mIndex, tIndex, field, value) => {
        const newModules = [...formData.modules];
        newModules[mIndex].topics[tIndex][field] = value;
        setFormData(prev => ({ ...prev, modules: newModules }));
    };

    const addTopic = (mIndex) => {
        const newModules = [...formData.modules];
        newModules[mIndex].topics.push({ name: '', content: '' });
        setFormData(prev => ({ ...prev, modules: newModules }));
    };

    const removeTopic = (mIndex, tIndex) => {
        const newModules = [...formData.modules];
        newModules[mIndex].topics = newModules[mIndex].topics.filter((_, i) => i !== tIndex);
        setFormData(prev => ({ ...prev, modules: newModules }));
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ type: '', message: '' });
        setLoading(true); // Re-use loading or add separate submitting state

        const uploadData = new FormData();
        Object.keys(formData).forEach(key => {
            if (Array.isArray(formData[key]) || typeof formData[key] === 'object') {
                uploadData.append(key, JSON.stringify(formData[key]));
            } else {
                uploadData.append(key, formData[key]);
            }
        });

        if (image) {
            uploadData.append('image', image);
        }

        try {
            await axios.put(`http://127.0.0.1:8000/api/v1/courses/${courseId}/`, uploadData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setStatus({ type: 'success', message: 'Course updated successfully!' });
            setLoading(false);
            // Optional: Redirect after success
            setTimeout(() => navigate('/manage-course'), 2000);
        } catch (err) {
            console.error(err);
            const errorMsg = err.response?.data
                ? Object.entries(err.response.data)
                    .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
                    .join(' | ')
                : 'Failed to update course.';
            setStatus({ type: 'error', message: errorMsg });
            setLoading(false);
        }
    };

    if (loading && !formData.title) {
        return (
            <div className="update-course-page">
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p>Loading Course Data...</p>
                </div>
            </div>
        );
    }

    if (fetchError) {
        return (
            <div className="update-course-page">
                <div className="error-container">
                    <p>{fetchError}</p>
                    <button onClick={() => navigate('/manage-course')}>Back to List</button>
                </div>
            </div>
        )
    }

    return (
        <div className="update-course-page">
            <div className="admin-sidebar">
                <div className="admin-logo">Course Portal</div>
                <nav>
                    <ul>
                        <li><Link to="/admin/course-management">Course Management</Link></li>
                        <li><Link to="/add-course">Add New Course</Link></li>
                        <li className="active"><Link to="/manage-course">Manage Courses</Link></li>
                        <li><Link to="/courses">View All Courses</Link></li>
                    </ul>
                </nav>
            </div>

            <div className="main-content">
                <header className="page-header">
                    <h1>Update Course</h1>
                    <p>Edit course details, curriculum, and information.</p>
                </header>

                <div className="form-card">
                    <form onSubmit={handleSubmit}>
                        {status.message && (
                            <div className={`status-banner ${status.type}`}>
                                {status.message}
                            </div>
                        )}

                        {/* Basic Section */}
                        <div className="form-section">
                            <h3>Basic Information</h3>
                            <div className="form-group full-width">
                                <label>Course Title</label>
                                <input name="title" value={formData.title} onChange={handleChange} required />
                            </div>
                            <div className="form-group full-width">
                                <label>Short Description</label>
                                <textarea name="description" value={formData.description} onChange={handleChange} required />
                            </div>
                            <div className="form-group full-width">
                                <label>Full Detailed Description</label>
                                <textarea name="full_description" value={formData.full_description} onChange={handleChange} required />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Duration</label>
                                    <input name="duration" value={formData.duration} onChange={handleChange} required />
                                </div>
                                <div className="form-group">
                                    <label>Level</label>
                                    <select name="level" value={formData.level} onChange={handleChange}>
                                        <option value="Undergraduate">Undergraduate</option>
                                        <option value="Postgraduate">Postgraduate</option>
                                        <option value="Diploma">Diploma</option>
                                        <option value="Certification">Certification</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Category</label>
                                    <input name="category" value={formData.category} onChange={handleChange} required />
                                </div>
                                <div className="form-group">
                                    <label>Course Image</label>
                                    <input type="file" name="image" onChange={handleImageChange} accept="image/*" />
                                    {imagePreview && (
                                        <div className="image-preview-container" style={{ marginTop: '10px' }}>
                                            <img src={imagePreview} alt="Preview" style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px' }} />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Highlights */}
                        <div className="form-section">
                            <h3>Highlights</h3>
                            <div className="form-group full-width">
                                <label>Who is this course for?</label>
                                <textarea name="who_is_it_for" value={formData.who_is_it_for} onChange={handleChange} />
                            </div>
                            <div className="form-group full-width">
                                <label>Why take this course?</label>
                                <textarea name="why_take_this" value={formData.why_take_this} onChange={handleChange} />
                            </div>
                            <div className="form-group full-width">
                                <label>What you will learn</label>
                                {formData.what_you_will_learn.map((item, idx) => (
                                    <div key={idx} className="list-item">
                                        <input value={item} onChange={(e) => handleArrayChange(idx, e.target.value, 'what_you_will_learn')} />
                                        <button type="button" onClick={() => removeArrayItem(idx, 'what_you_will_learn')}>×</button>
                                    </div>
                                ))}
                                <button type="button" className="add-btn" onClick={() => addArrayItem('what_you_will_learn')}>+ Add Point</button>
                            </div>
                        </div>

                        {/* Opportunities */}
                        <div className="form-section">
                            <h3>Career Opportunities</h3>
                            <div className="form-group full-width">
                                {formData.opportunities.map((item, idx) => (
                                    <div key={idx} className="list-item">
                                        <input value={item} onChange={(e) => handleArrayChange(idx, e.target.value, 'opportunities')} />
                                        <button type="button" onClick={() => removeArrayItem(idx, 'opportunities')}>×</button>
                                    </div>
                                ))}
                                <button type="button" className="add-btn" onClick={() => addArrayItem('opportunities')}>+ Add Career Path</button>
                            </div>
                        </div>

                        {/* FAQs */}
                        <div className="form-section">
                            <h3>FAQs</h3>
                            {formData.faqs.map((faq, idx) => (
                                <div key={idx} className="nested-card">
                                    <div className="form-group">
                                        <label>Question</label>
                                        <input value={faq.question} onChange={(e) => handleFaqChange(idx, 'question', e.target.value)} />
                                    </div>
                                    <div className="form-group">
                                        <label>Answer</label>
                                        <textarea value={faq.answer} onChange={(e) => handleFaqChange(idx, 'answer', e.target.value)} />
                                    </div>
                                    <button type="button" className="remove-nested" onClick={() => removeFaq(idx)}>Remove FAQ</button>
                                </div>
                            ))}
                            <button type="button" className="add-btn" onClick={addFaq}>+ Add FAQ</button>
                        </div>

                        {/* Modules */}
                        <div className="form-section">
                            <h3>Curriculum Modules</h3>
                            {formData.modules.map((module, mIdx) => (
                                <div key={mIdx} className="nested-card module-card">
                                    <div className="form-group">
                                        <label>Module Name</label>
                                        <input value={module.name} onChange={(e) => handleModuleChange(mIdx, e.target.value)} />
                                    </div>
                                    <div className="topics-section">
                                        <label>Topics</label>
                                        {module.topics.map((topic, tIdx) => (
                                            <div key={tIdx} className="topic-item">
                                                <input placeholder="Topic Name" value={topic.name} onChange={(e) => handleTopicChange(mIdx, tIdx, 'name', e.target.value)} />
                                                <input placeholder="Short Content" value={topic.content} onChange={(e) => handleTopicChange(mIdx, tIdx, 'content', e.target.value)} />
                                                <button type="button" onClick={() => removeTopic(mIdx, tIdx)}>×</button>
                                            </div>
                                        ))}
                                        <button type="button" className="add-sub-btn" onClick={() => addTopic(mIdx)}>+ Add Topic</button>
                                    </div>
                                    <button type="button" className="remove-nested" onClick={() => removeModule(mIdx)}>Remove Module</button>
                                </div>
                            ))}
                            <button type="button" className="add-btn" onClick={addModule}>+ Add Module</button>
                        </div>

                        <div className="form-actions">
                            <button type="submit" className="submit-btn" disabled={loading}>
                                {loading && !formData.title ? 'Loading...' : 'Update Course'}
                            </button>
                            <button type="button" className="cancel-btn" onClick={() => navigate('/manage-course')}>Cancel</button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default UpdateCourse;
