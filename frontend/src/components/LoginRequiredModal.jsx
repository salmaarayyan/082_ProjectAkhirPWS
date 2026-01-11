import React from 'react';
import { FiLogIn, FiX } from 'react-icons/fi';
import './LoginRequiredModal.css';

const LoginRequiredModal = ({ isOpen, onLogin, onCancel }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onCancel}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Login Required</h2>
                    <button className="modal-close" onClick={onCancel}>
                        <FiX />
                    </button>
                </div>

                <div className="modal-body">
                    <p>You must log in to add movies to your watchlist.</p>
                </div>

                <div className="modal-footer">
                    <button className="btn-cancel" onClick={onCancel}>
                        Cancel
                    </button>
                    <button className="btn-login-modal" onClick={onLogin}>
                        <FiLogIn /> Login
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginRequiredModal;
