import React from 'react';
import { FiHelpCircle } from 'react-icons/fi';
import './LogoutModal.css';

const LogoutModal = ({ isOpen, onConfirm, onCancel }) => {
    if (!isOpen) return null;

    return (
        <div className="logout-modal-overlay">
            <div className="logout-modal">
                <div className="logout-modal-icon">
                    <FiHelpCircle />
                </div>
                <h2>Konfirmasi Logout</h2>
                <p>Apakah Anda yakin ingin keluar dari sistem?</p>
                <div className="logout-modal-actions">
                    <button className="btn-cancel" onClick={onCancel}>
                        Batal
                    </button>
                    <button className="btn-confirm" onClick={onConfirm}>
                        Ya, Logout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LogoutModal;
