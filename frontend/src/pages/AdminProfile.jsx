import React, { useState, useEffect } from 'react';
import { FiCamera } from 'react-icons/fi';
import { adminAPI, userAPI } from '../services/api';
import Navbar from '../components/Navbar';
import SuccessModal from '../components/SuccessModal';
import './Dashboard.css';

const AdminProfile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await adminAPI.getProfile();
            setProfile(response.data.user);
        } catch (err) {
            console.error('Failed to load profile:', err);
        } finally {
            setLoading(false);
        }
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        const reader = new FileReader();

        reader.onload = async (event) => {
            const base64 = event.target.result;
            try {
                await userAPI.updateProfilePhoto(base64);
                setProfile(prev => ({ ...prev, profile_photo: base64 }));

                // Update localStorage so navbar syncs
                const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
                storedUser.profile_photo = base64;
                localStorage.setItem('user', JSON.stringify(storedUser));

                setShowSuccessModal(true);
            } catch (err) {
                console.error('Failed to update photo:', err);
                alert('Failed to update photo');
            } finally {
                setUploading(false);
            }
        };

        reader.onerror = () => {
            console.error('FileReader error');
            setUploading(false);
        };

        reader.readAsDataURL(file);
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="dashboard-container">
                    <div className="loading">Loading...</div>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="dashboard-container">
                <SuccessModal
                    isOpen={showSuccessModal}
                    title="Photo Updated!"
                    message="Your profile photo has been updated successfully."
                    onClose={() => setShowSuccessModal(false)}
                />

                <div className="profile-section">
                    <h1>Admin Profile</h1>

                    <div className="profile-card">
                        <label htmlFor="admin-photo-input" className="profile-avatar clickable">
                            {profile?.profile_photo ? (
                                <img src={profile.profile_photo} alt="Profile" />
                            ) : (
                                <span className="avatar-initial">
                                    {profile?.username?.charAt(0).toUpperCase() || '?'}
                                </span>
                            )}
                            <div className="avatar-overlay">
                                <FiCamera />
                            </div>
                        </label>
                        <input
                            id="admin-photo-input"
                            type="file"
                            onChange={handlePhotoChange}
                            accept="image/*"
                            style={{ display: 'none' }}
                        />
                        <p className="photo-hint">
                            {uploading ? 'Uploading...' : 'Click to change photo'}
                        </p>

                        <div className="profile-info">
                            <div className="profile-row">
                                <label>Username</label>
                                <span>{profile?.username}</span>
                            </div>

                            <div className="profile-row">
                                <label>Email</label>
                                <span>{profile?.email || 'N/A'}</span>
                            </div>

                            <div className="profile-row">
                                <label>Role</label>
                                <span style={{
                                    background: 'var(--color-dark)',
                                    color: 'white',
                                    padding: '0.25rem 0.75rem',
                                    borderRadius: '20px',
                                    fontWeight: '600'
                                }}>
                                    {profile?.role}
                                </span>
                            </div>

                            <div className="profile-row">
                                <label>Joined</label>
                                <span>{profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'N/A'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AdminProfile;
