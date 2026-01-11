import React from 'react';
import './Modal.css';

const SuccessModal = ({ isOpen, title, message, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="success-modal" onClick={(e) => e.stopPropagation()}>
                <div className="success-icon">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="10" stroke="#10b981" strokeWidth="2" fill="none" />
                        <path d="M8 12l2.5 2.5L16 9" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
                <h2>{title}</h2>
                <p>{message}</p>
                <button className="success-btn" onClick={onClose}>
                    OK
                </button>
            </div>
        </div>
    );
};

export default SuccessModal;
