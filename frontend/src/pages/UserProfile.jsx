import React, { useState, useEffect } from 'react';
import { FiCamera } from 'react-icons/fi';
import { userAPI } from '../services/api';
import Navbar from '../components/Navbar';
import SuccessModal from '../components/SuccessModal';
import './Dashboard.css';

const UserProfile = () => {
    const [profile, setProfile] = useState(null);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [profileRes, statsRes] = await Promise.all([
                userAPI.getProfile(),
                userAPI.getStats()
            ]);
            setProfile(profileRes.data.user);
            setStats(statsRes.data);
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
                    <h1>My Profile</h1>

                    <div className="profile-card">
                        <label htmlFor="photo-input" className="profile-avatar clickable">
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
                            id="photo-input"
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
                                <label>Role</label>
                                <span>{profile?.role}</span>
                            </div>

                            <div className="profile-row">
                                <label>Total Movies</label>
                                <span>{stats?.totalMovies || 0}</span>
                            </div>

                            <div className="profile-row">
                                <label>In Watchlist</label>
                                <span>{stats?.watchlist || 0}</span>
                            </div>

                            <div className="profile-row">
                                <label>Watched</label>
                                <span>{stats?.watched || 0}</span>
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

export default UserProfile;
