import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import '../../UsersManagement/UserDashboard/UserDashboard.css';
import './AddCourse.css';

const AddCourse = () => {
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
    const [status, setStatus] = useState({ type: '', message: '' });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        document.title = "Add New Course - Management System";
    }, []);

    useEffect(() => {
        if (status.message) {
            const timer = setTimeout(() => {
                setStatus({ type: '', message: '' });
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [status]);

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

    // Generic handler for array of strings (what_you_will_learn, opportunities)
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

    // Handlers for FAQs
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

    // Handlers for Modules & Topics
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
        setLoading(true);

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
            await axios.post('http://127.0.0.1:8000/api/v1/courses/', uploadData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setStatus({ type: 'success', message: 'Course added successfully!' });
            // Reset form
            setFormData({
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
            setImage(null);
            setImagePreview(null);
            // Reset file input in UI
            e.target.reset();
        } catch (err) {
            console.error(err);
            const errorMsg = err.response?.data
                ? Object.entries(err.response.data)
                    .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
                    .join(' | ')
                : 'Failed to add course. Please check your connection or data.';
            setStatus({ type: 'error', message: errorMsg });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="users-management-page">
            <Sidebar />

            <div className="main-content" style={{ padding: "40px", width: "100%", flex: 1, boxSizing: "border-box" }}>
                <header className="page-header">
                    <h1>Add Courses</h1>
                    <p>Add full course details including modules, FAQs, and career paths.</p>
                </header>

                <div className="add-course-form-card">
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
                                <label>Short Description (for cards)</label>
                                <textarea name="description" value={formData.description} onChange={handleChange} required />
                            </div>
                            <div className="form-group full-width">
                                <label>Full Detailed Description</label>
                                <textarea name="full_description" value={formData.full_description} onChange={handleChange} required />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Duration</label>
                                    <input name="duration" value={formData.duration} onChange={handleChange} placeholder="e.g. 4 Years" required />
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
                                        <div className="image-preview-container">
                                            <img src={imagePreview} alt="Preview" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Highlights Section */}
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

                        {/* Opportunities Section */}
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

                        {/* FAQs Section */}
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

                        {/* Modules Section */}
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
                            <button type="submit" className="submit-btn-for-add-course" disabled={loading}>
                                {loading ? 'Saving...' : 'Add Course'}
                            </button>
                            <button type="reset" className="cancel-btn-for-add-course">Clear All</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddCourse;
