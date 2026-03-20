import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CourseDetails.css';
import cardImage from '../../assets/images/Card image.jpg';
import Footer from '../Footer/Footer';

// const courseData = {
//     'computer-science': {
//         title: 'Computer Science',
//         description: 'Master programming, algorithms, and software development with hands-on projects.',
//         fullDescription: 'Our Computer Science program is designed to provide students with a deep understanding of both theoretical foundations and practical applications. From mastering low-level programming languages to exploring the frontiers of Artificial Intelligence, this course covers the spectrum of modern computing.',
//         duration: '4 Years',
//         level: 'Undergraduate',
//         highlights: {
//             whoIsItFor: 'Aspiring software engineers, data scientists, and anyone passionate about solving complex problems through technology.',
//             whyTakeThis: 'Gain high-demand skills in the fastest-growing industry. Our curriculum is tailored to modern market needs with 100% placement assistance.',
//             whatYouWillLearn: [
//                 'Advanced algorithms and data structures',
//                 'Full-stack web application development',
//                 'Artificial Intelligence and Machine Learning basics',
//                 'Cloud computing and database management'
//             ]
//         },
//         faqs: [
//             { question: 'Do I need prior coding experience?', answer: 'No, this course starts from absolute fundamentals. However, basic math knowledge is recommended.' },
//             { question: 'Is there a certificate provided?', answer: 'Yes, you will receive a globally recognized Undergraduate degree and industry certifications.' },
//             { question: 'What is the format of classes?', answer: 'We offer a hybrid model with both physical laboratory sessions and recorded online lectures.' }
//         ],
//         modules: [
//             {
//                 name: 'Introduction',
//                 topics: [
//                     { name: 'Computer Architecture', content: 'Understanding CPU, Memory, and I/O devices.' },
//                     { name: 'Operating Systems Basics', content: 'Introduction to kernels, processes, and file systems.' },
//                     { name: 'History of Computing', content: 'From abacus to modern supercomputers.' }
//                 ]
//             },
//             {
//                 name: 'Programming Fundamentals',
//                 topics: [
//                     { name: 'Logic and Flowcharts', content: 'Design programs using visual logic structures.' },
//                     { name: 'Variables & Data Types', content: 'Master integers, strings, booleans and pointers.' },
//                     { name: 'Control Structures', content: 'Mastering if-else, loops, and switch cases.' }
//                 ]
//             },
//             {
//                 name: 'Data Structures',
//                 topics: [
//                     { name: 'Arrays & Linked Lists', content: 'Foundations of linear data storage.' },
//                     { name: 'Stacks & Queues', content: 'LIFO and FIFO operations and applications.' },
//                     { name: 'Trees & Graphs', content: 'Hierarchical and networked data representation.' }
//                 ]
//             },
//             {
//                 name: 'Algorithms',
//                 topics: [
//                     { name: 'Sorting & Searching', content: 'Efficiency analysis of common tasks.' },
//                     { name: 'Dynamic Programming', content: 'Solving complex problems by breaking them down.' },
//                     { name: 'Complexity Analysis', content: 'Big O notation and efficiency metrics.' }
//                 ]
//             }
//         ],
//         opportunities: ['Software Architect', 'Data Scientist', 'Full Stack Developer', 'Systems Analyst']
//     },
//     'chemistry': {
//         title: 'Chemistry',
//         description: 'Explore the molecular world through experiments and theoretical knowledge.',
//         fullDescription: 'The Chemistry program offers a comprehensive study of matter, its properties, and how it interacts with energy. Students will spend significant time in state-of-the-art laboratories, conducting research that could lead to the next breakthrough in medicine or sustainable materials.',
//         duration: '3 Years',
//         level: 'Undergraduate',
//         highlights: {
//             whoIsItFor: 'Students interested in pharmaceuticals, material science, and chemical research.',
//             whyTakeThis: 'Access to state-of-the-art labs and mentorship from industry-leading researchers.',
//             whatYouWillLearn: [
//                 'Molecular structure and bonding',
//                 'Modern laboratory techniques',
//                 'Organic and inorganic synthesis',
//                 'Analytical chemistry methods'
//             ]
//         },
//         faqs: [
//             { question: 'Are lab coats provided?', answer: 'Yes, all safety equipment is provided by the university.' },
//             { question: 'Can I specialize in a specific branch?', answer: 'Yes, in the third year, you can choose specializations like Biochemistry or Industrial Chemistry.' }
//         ],
//         modules: [
//             {
//                 name: 'General Chemistry',
//                 topics: [
//                     { name: 'Atomic Structure', content: 'Protons, neutrons, and electron configuration.' },
//                     { name: 'Chemical Bonding', content: 'Ionic, covalent, and metallic bonds.' },
//                     { name: 'Periodic Table', content: 'Trends and properties of elements.' }
//                 ]
//             },
//             {
//                 name: 'Organic Chemistry',
//                 topics: [
//                     { name: 'Hydrocarbons', content: 'Alkanes, alkenes, and alkynes.' },
//                     { name: 'Functional Groups', content: 'Alcohols, ethers, and carboxylic acids.' },
//                     { name: 'Stereochemistry', content: '3D arrangement of molecules.' }
//                 ]
//             }
//         ],
//         opportunities: ['Research Scientist', 'Pharmacologist', 'Chemical Engineer', 'Toxicologist']
//     },
//     'mathematics': {
//         title: 'Mathematics',
//         description: 'Develop analytical and problem-solving skills through advanced mathematics.',
//         fullDescription: 'Mathematics is the language of the universe. This program challenges students to think abstractly and solve complex problems using rigorous logic.',
//         duration: '3 Years',
//         level: 'Undergraduate',
//         highlights: {
//             whoIsItFor: 'Logical thinkers who enjoy abstract problem-solving and numerical analysis.',
//             whyTakeThis: 'Develop a strong foundation for careers in data science, finance, and cryptography.',
//             whatYouWillLearn: [
//                 'Advanced calculus and analysis',
//                 'Probability and statistical modeling',
//                 'Discrete mathematics for computing',
//                 'Numerical methods and algorithms'
//             ]
//         },
//         faqs: [
//             { question: 'How much of this is applied vs theoretical?', answer: 'It is a 60/40 mix of theoretical concepts and practical applications in technology.' }
//         ],
//         modules: [
//             {
//                 name: 'Calculus',
//                 topics: [
//                     { name: 'Limits & Continuity', content: 'Foundations of calculus.' },
//                     { name: 'Derivatives', content: 'Rates of change and optimization.' },
//                     { name: 'Integrals', content: 'Area under curves and accumulation.' }
//                 ]
//             }
//         ],
//         opportunities: ['Actuary', 'Data Analyst', 'Financial Consultant', 'Cryptographer']
//     },
//     'physics': {
//         title: 'Physics',
//         description: 'Understand the fundamental laws of nature and their real-world applications.',
//         fullDescription: 'From the smallest subatomic particles to the vastness of the cosmos, Physics seeks to explain how everything works.',
//         duration: '4 Years',
//         level: 'Undergraduate',
//         highlights: {
//             whoIsItFor: 'Those curious about the universe, engineering, and fundamental laws of nature.',
//             whyTakeThis: 'Bridge the gap between pure science and real-world technology application.',
//             whatYouWillLearn: [
//                 'Quantum mechanics and relativity',
//                 'Thermodynamics and statistical physics',
//                 'Electromagnetism and optics',
//                 'Theoretical physics modeling'
//             ]
//         },
//         faqs: [
//             { question: 'Is research part of the curriculum?', answer: 'Yes, every student completes a senior research project.' }
//         ],
//         modules: [
//             {
//                 name: 'Mechanics',
//                 topics: [
//                     { name: 'Kinematics', content: 'Motion in one and two dimensions.' },
//                     { name: 'Newton\'s Laws', content: 'Force, mass, and acceleration.' },
//                     { name: 'Energy & Work', content: 'Conservation of energy.' }
//                 ]
//             }
//         ],
//         opportunities: ['Physicist', 'Aerospace Engineer', 'Renewable Energy Specialist', 'Medical Physicist']
//     },
//     'business-administration': {
//         title: 'Business Administration',
//         description: 'Learn management, finance, and entrepreneurship to lead organizations.',
//         fullDescription: 'Our Business Administration program prepares the next generation of global leaders.',
//         duration: '3 Years',
//         level: 'Undergraduate',
//         highlights: {
//             whoIsItFor: 'Future entrepreneurs, managers, and business consultants.',
//             whyTakeThis: 'Develop leadership skills and gain a global perspective on market dynamics.',
//             whatYouWillLearn: [
//                 'Strategic management and leadership',
//                 'Financial accounting and analysis',
//                 'Marketing and consumer behavior',
//                 'Human resource management'
//             ]
//         },
//         faqs: [
//             { question: 'Is an internship guaranteed?', answer: 'Yes, we have tie-ups with over 50+ multinational corporations for summer internships.' }
//         ],
//         modules: [
//             {
//                 name: 'Management',
//                 topics: [
//                     { name: 'Principles of Mgmt', content: 'Planning, organizing, and leading.' },
//                     { name: 'Human Resources', content: 'Recruitment and personnel mgmt.' },
//                     { name: 'Marketing', content: 'Market research and consumer behavior.' }
//                 ]
//             }
//         ],
//         opportunities: ['Business Manager', 'Marketing Executive', 'Financial Analyst', 'Entrepreneur']
//     },
//     'graphic-design': {
//         title: 'Graphic Design',
//         description: 'Create stunning visuals and master design principles for digital media.',
//         fullDescription: 'Graphic Design is at the heart of modern communication.',
//         duration: '3 Years',
//         level: 'Undergraduate',
//         highlights: {
//             whoIsItFor: 'Creative individuals who want to visually communicate ideas and build brands.',
//             whyTakeThis: 'Master industry-standard tools and build a professional portfolio.',
//             whatYouWillLearn: [
//                 'Typography and layout principles',
//                 'UI/UX design fundamentals',
//                 'Branding and identity design',
//                 'Advanced Adobe Creative Suite'
//             ]
//         },
//         faqs: [
//             { question: 'Do I need my own MacBook?', answer: 'While recommended, our labs are fully equipped with state-of-the-art design workstations.' }
//         ],
//         modules: [
//             {
//                 name: 'Design Basics',
//                 topics: [
//                     { name: 'Color Theory', content: 'Psychology and use of color.' },
//                     { name: 'Typography', content: 'Fonts, spacing, and layout.' },
//                     { name: 'Vector Graphics', content: 'Introduction to Adobe Illustrator.' }
//                 ]
//             }
//         ],
//         opportunities: ['Art Director', 'UI/UX Designer', 'Brand Consultant', 'Creative Lead']
//     }
// };

const CourseDetails = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const BASE_URL = 'http://127.0.0.1:8000';

    // States for UI interaction
    const [expandedModule, setExpandedModule] = useState(0);
    const [expandedTopic, setExpandedTopic] = useState(null);
    const [expandedFaq, setExpandedFaq] = useState(null);

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                setLoading(true);
                // Try fetching from API first
                const response = await axios.get(`http://127.0.0.1:8000/api/v1/courses/`);
                // Find course by ID or slug/title (assuming we might need to filter)
                // For simplicity, if courseId is a number, match ID, otherwise match title slug
                const allCourses = response.data;
                const foundCourse = allCourses.find(c =>
                    c.id.toString() === courseId ||
                    c.title.toLowerCase().replace(/\s+/g, '-') === courseId
                );

                if (foundCourse) {
                    setCourse(foundCourse);
                } else {
                    setError('Course not found');
                }
            } catch (err) {
                console.error("Fetch error:", err);
                setError('Failed to load course details');
            } finally {
                setLoading(false);
            }
        };

        fetchCourse();
    }, [courseId]);

    const toggleModule = (index) => {
        setExpandedModule(expandedModule === index ? null : index);
        setExpandedTopic(null);
    };

    const toggleTopic = (index) => {
        setExpandedTopic(expandedTopic === index ? null : index);
    };

    const toggleFaq = (index) => {
        setExpandedFaq(expandedFaq === index ? null : index);
    };

    if (loading) return <div className="loading-container"><div className="loader"></div><p>Loading Course Details...</p></div>;
    if (error && !course) return (
        <div className="error-container">
            <h2>{error}</h2>
            <Link to="/" className="back-btn">Return Home</Link>
        </div>
    );

    return (
        <div className="course-details-page">
            <nav className="details-nav">
                <Link to="/" className="back-link">← Back to Courses</Link>
                <div className="logo-text">StudentPortal</div>
            </nav>

            <div className="details-hero">
                <div className="hero-overlay"></div>
                <img src={course.image ? (course.image.startsWith('http') ? course.image : `${BASE_URL}${course.image}`) : cardImage} alt={course.title} className="hero-bg-image" />
                <div className="hero-content">
                    <span className="course-badge">{course.level}</span>
                    <h1 className="course-title-main">{course.title}</h1>
                    <p className="course-tagline">{course.description}</p>
                </div>
            </div>

            <div className="details-container">
                <div className="details-grid">
                    <div className="main-info">
                        <section className="info-section">
                            <h2 className="section-title">About the Course</h2>
                            <p className="description-text">{course.fullDescription || course.full_description}</p>
                        </section>

                        <section className="info-section">
                            <h2 className="section-title-large">Course Content</h2>
                            <div className="accordion-wrapper">
                                {(course.modules || []).map((module, index) => (
                                    <div
                                        key={index}
                                        className={`accordion-item main-module ${expandedModule === index ? 'active' : ''}`}
                                    >
                                        <div
                                            className="accordion-header"
                                            onClick={() => toggleModule(index)}
                                        >
                                            <div className="header-left">
                                                <span className="chevron-icon">›</span>
                                                <span className="module-number">{index + 1}.</span>
                                                <span className="module-name">{module.name}</span>
                                            </div>
                                        </div>
                                        <div className={`accordion-collapse ${expandedModule === index ? 'show' : ''}`}>
                                            <div className="sub-accordion-wrapper">
                                                {(module.topics || []).map((topic, tIndex) => (
                                                    <div
                                                        key={tIndex}
                                                        className={`sub-accordion-item ${expandedTopic === tIndex ? 'topic-active' : ''}`}
                                                    >
                                                        <div
                                                            className="sub-header"
                                                            onClick={() => toggleTopic(tIndex)}
                                                        >
                                                            <span className="sub-module-number">{index + 1}.{tIndex + 1}.</span>
                                                            <span className="sub-module-name">{topic.name}</span>
                                                        </div>
                                                        <div className={`sub-collapse ${expandedTopic === tIndex ? 'show' : ''}`}>
                                                            <div className="topic-content">
                                                                <p>{topic.content}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    <div className="sidebar-info">
                        <div className="sticky-card">
                            <div className="stats-grid">
                                <div className="stat-item">
                                    <span className="stat-label">Duration</span>
                                    <span className="stat-value">{course.duration}</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-label">Level</span>
                                    <span className="stat-value">{course.level}</span>
                                </div>
                            </div>

                            <div className="opportunity-section">
                                <h3>Career Opportunities</h3>
                                <div className="opp-tags">
                                    {(course.opportunities || []).map((opp, index) => (
                                        <span key={index} className="opp-tag">{opp}</span>
                                    ))}
                                </div>
                            </div>

                            <button className="enroll-now-btn" onClick={() => navigate('/enrollment')}>Enroll In Course</button>
                        </div>
                    </div>
                </div>

                <div className="bottom-sections-wrapper">
                    <section className="info-section highlights-section">
                        <h2 className="section-title">Highlights about the Course</h2>
                        <div className="highlights-grid">
                            <div className="highlight-card">
                                <h3>Who this course is for?</h3>
                                <p>{course.highlights?.whoIsItFor || course.who_is_it_for}</p>
                            </div>
                            <div className="highlight-card">
                                <h3>Why take this course?</h3>
                                <p>{course.highlights?.whyTakeThis || course.why_take_this}</p>
                            </div>
                            <div className="highlight-card full-width">
                                <h3>What you will learn?</h3>
                                <ul className="learn-list">
                                    {(course.highlights?.whatYouWillLearn || course.what_you_will_learn || []).map((item, idx) => (
                                        <li key={idx}>
                                            <span className="check-bullet">✓</span> {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </section>
                </div>

                <div className="bottom-sections-wrapper">
                    <section className="info-section faq-section">
                        <h2 className="section-title">Frequently Asked Questions</h2>
                        <div className="faq-wrapper">
                            {(course.faqs || []).map((faq, index) => (
                                <div key={index} className={`faq-item ${expandedFaq === index ? 'active' : ''}`}>
                                    <div className="faq-question" onClick={() => toggleFaq(index)}>
                                        <span>{faq.question}</span>
                                        <span className="faq-icon">{expandedFaq === index ? '−' : '+'}</span>
                                    </div>
                                    <div className="faq-answer">
                                        <p>{faq.answer}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>

            <footer className="details-footer">
                <Footer />
            </footer>
        </div>
    );
};

export default CourseDetails;
