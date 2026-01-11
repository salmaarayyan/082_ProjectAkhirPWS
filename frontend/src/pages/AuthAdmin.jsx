import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiCamera } from 'react-icons/fi';
import { authAPI } from '../services/api';
import SuccessModal from '../components/SuccessModal';
import './Auth.css';

const AuthAdmin = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const [isRightPanelActive, setIsRightPanelActive] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    // Login state
    const [loginData, setLoginData] = useState({ username: '', password: '' });
    const [loginError, setLoginError] = useState('');
    const [loginLoading, setLoginLoading] = useState(false);

    // Register state
    const [registerData, setRegisterData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        profile_photo: null
    });
    const [photoPreview, setPhotoPreview] = useState(null);
    const [registerError, setRegisterError] = useState('');
    const [registerLoading, setRegisterLoading] = useState(false);

    const handleLoginChange = (e) => {
        setLoginData({ ...loginData, [e.target.name]: e.target.value });
    };

    const handleRegisterChange = (e) => {
        setRegisterData({ ...registerData, [e.target.name]: e.target.value });
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result);
                setRegisterData({ ...registerData, profile_photo: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoginError('');
        setLoginLoading(true);

        try {
            const response = await authAPI.loginAdmin(loginData);
            const { token, user } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            navigate('/admin/dashboard');
        } catch (err) {
            setLoginError(err.response?.data?.message || 'Login failed');
            setLoginData({ username: '', password: '' });
        } finally {
            setLoginLoading(false);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setRegisterError('');

        if (registerData.password !== registerData.confirmPassword) {
            setRegisterError('Passwords do not match');
            return;
        }

        setRegisterLoading(true);

        try {
            await authAPI.registerAdmin({
                username: registerData.username,
                email: registerData.email,
                password: registerData.password,
                profile_photo: registerData.profile_photo
            });

            // Show success modal
            setRegisterData({ username: '', email: '', password: '', confirmPassword: '', profile_photo: null });
            setPhotoPreview(null);
            setShowSuccessModal(true);
        } catch (err) {
            setRegisterError(err.response?.data?.message || 'Registration failed');
        } finally {
            setRegisterLoading(false);
        }
    };

    const handleCloseModal = () => {
        setShowSuccessModal(false);
        setIsRightPanelActive(false);
    };

    return (
        <div className="auth-page">
            {/* Success Modal */}
            <SuccessModal
                isOpen={showSuccessModal}
                title="Registration Successful!"
                message="Admin account has been created. Please sign in to continue."
                onClose={handleCloseModal}
            />

            <div className={`auth-container ${isRightPanelActive ? 'right-panel-active' : ''}`}>
                {/* Sign Up Form */}
                <div className="form-container sign-up-container">
                    <form onSubmit={handleRegister}>
                        <h1>Registration</h1>
                        <span>Create admin account</span>

                        {registerError && <div className="auth-error">{registerError}</div>}

                        {/* Profile Photo Upload */}
                        <div className="photo-upload" onClick={() => fileInputRef.current?.click()}>
                            {photoPreview ? (
                                <img src={photoPreview} alt="Preview" />
                            ) : (
                                <div className="photo-placeholder">
                                    <FiCamera />
                                    <span>Add Photo</span>
                                </div>
                            )}
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handlePhotoChange}
                                accept="image/*"
                                style={{ display: 'none' }}
                            />
                        </div>

                        <input
                            type="text"
                            name="username"
                            className="auth-input"
                            placeholder="Username"
                            value={registerData.username}
                            onChange={handleRegisterChange}
                            required
                        />
                        <input
                            type="email"
                            name="email"
                            className="auth-input"
                            placeholder="Email"
                            value={registerData.email}
                            onChange={handleRegisterChange}
                            required
                        />
                        <input
                            type="password"
                            name="password"
                            className="auth-input"
                            placeholder="Password"
                            value={registerData.password}
                            onChange={handleRegisterChange}
                            required
                        />
                        <input
                            type="password"
                            name="confirmPassword"
                            className="auth-input"
                            placeholder="Confirm Password"
                            value={registerData.confirmPassword}
                            onChange={handleRegisterChange}
                            required
                        />
                        <button type="submit" className="auth-btn" disabled={registerLoading}>
                            {registerLoading ? 'Creating...' : 'Create Admin'}
                        </button>
                    </form>
                </div>

                {/* Sign In Form */}
                <div className="form-container sign-in-container">
                    <form onSubmit={handleLogin}>
                        <span className="icon-title">🔐</span>
                        <h1>Admin Login</h1>
                        <span>Access admin dashboard</span>

                        {loginError && <div className="auth-error">{loginError}</div>}

                        <input
                            type="text"
                            name="username"
                            className="auth-input"
                            placeholder="Username"
                            value={loginData.username}
                            onChange={handleLoginChange}
                            required
                        />
                        <input
                            type="password"
                            name="password"
                            className="auth-input"
                            placeholder="Password"
                            value={loginData.password}
                            onChange={handleLoginChange}
                            required
                        />
                        <button type="submit" className="auth-btn" disabled={loginLoading}>
                            {loginLoading ? 'Signing In...' : 'Sign In'}
                        </button>

                        <Link to="/login" className="auth-link" style={{ marginTop: '20px' }}>
                            Back to User Login
                        </Link>
                    </form>
                </div>

                {/* Overlay */}
                <div className="overlay-container">
                    <div className="overlay admin-overlay">
                        <div className="overlay-panel overlay-left">
                            <h1>Welcome Back, Admin!</h1>
                            <p>Already have an admin account? Sign in to manage the platform.</p>
                            <button
                                className="auth-btn ghost"
                                onClick={() => setIsRightPanelActive(false)}
                            >
                                Sign In
                            </button>
                        </div>
                        <div className="overlay-panel overlay-right">
                            <h1>New Admin?</h1>
                            <p>Create an admin account to manage users and monitor platform activity.</p>
                            <button
                                className="auth-btn ghost"
                                onClick={() => setIsRightPanelActive(true)}
                            >
                                Register
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthAdmin;
