import React, { useState, useEffect } from 'react';
import { FiSearch, FiEye, FiTrash2, FiX } from 'react-icons/fi';
import { adminAPI } from '../services/api';
import Navbar from '../components/Navbar';
import './Dashboard.css';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({});
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [viewModal, setViewModal] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, [page]);

    useEffect(() => {
        filterUsers();
    }, [users, searchTerm, roleFilter]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await adminAPI.getUsers({ page, limit: 50 });
            setUsers(response.data.users);
            setPagination(response.data.pagination);
        } catch (err) {
            console.error('Failed to load users:', err);
        } finally {
            setLoading(false);
        }
    };

    const filterUsers = () => {
        let result = users;

        // Filter by search term
        if (searchTerm) {
            result = result.filter(user =>
                user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        // Filter by role
        if (roleFilter !== 'all') {
            result = result.filter(user => user.role === roleFilter);
        }

        setFilteredUsers(result);
    };

    const handleDelete = async () => {
        if (!deleteConfirm) return;

        try {
            await adminAPI.deleteUser(deleteConfirm.id);
            setDeleteConfirm(null);
            fetchUsers();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to delete user');
        }
    };

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('id-ID', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    return (
        <>
            <Navbar />
            <div className="dashboard-container">
                <div className="dashboard-header">
                    <h1>User Management</h1>
                </div>

                {/* Search & Filter */}
                <div className="filter-section">
                    <div className="search-box">
                        <FiSearch className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search by username or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="filter-tabs">
                        <button
                            className={`filter-tab ${roleFilter === 'all' ? 'active' : ''}`}
                            onClick={() => setRoleFilter('all')}
                        >
                            All
                        </button>
                        <button
                            className={`filter-tab ${roleFilter === 'user' ? 'active' : ''}`}
                            onClick={() => setRoleFilter('user')}
                        >
                            Users
                        </button>
                        <button
                            className={`filter-tab ${roleFilter === 'admin' ? 'active' : ''}`}
                            onClick={() => setRoleFilter('admin')}
                        >
                            Admins
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="loading">Loading...</div>
                ) : filteredUsers.length === 0 ? (
                    <div className="empty-state">
                        <p>No users found.</p>
                    </div>
                ) : (
                    <>
                        <div className="data-table">
                            <table>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Profile</th>
                                        <th>Username</th>
                                        <th>Email</th>
                                        <th>Role</th>
                                        <th>Created</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.map((user) => (
                                        <tr key={user.id}>
                                            <td>{user.id}</td>
                                            <td>
                                                <div className="table-avatar">
                                                    {user.profile_photo ? (
                                                        <img src={user.profile_photo} alt="Profile" />
                                                    ) : (
                                                        <span>{user.username?.charAt(0).toUpperCase()}</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td><strong>{user.username}</strong></td>
                                            <td>{user.email || '-'}</td>
                                            <td>
                                                <span className={`role-badge ${user.role}`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td>{formatDate(user.created_at)}</td>
                                            <td>
                                                <div className="action-buttons">
                                                    <button
                                                        className="btn-icon btn-view"
                                                        onClick={() => setViewModal(user)}
                                                        title="View Details"
                                                    >
                                                        <FiEye />
                                                    </button>
                                                    <button
                                                        className="btn-icon btn-delete"
                                                        onClick={() => setDeleteConfirm(user)}
                                                        title="Delete User"
                                                    >
                                                        <FiTrash2 />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {pagination.totalPages > 1 && (
                            <div className="pagination">
                                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
                                    ← Previous
                                </button>
                                <span>Page {pagination.page} of {pagination.totalPages}</span>
                                <button onClick={() => setPage(p => p + 1)} disabled={page >= pagination.totalPages}>
                                    Next →
                                </button>
                            </div>
                        )}
                    </>
                )}

                {/* View Details Modal */}
                {viewModal && (
                    <div className="modal-overlay" onClick={() => setViewModal(null)}>
                        <div className="modal view-modal" onClick={(e) => e.stopPropagation()}>
                            <button className="modal-close" onClick={() => setViewModal(null)}>
                                <FiX />
                            </button>
                            <div className="view-modal-header">
                                <div className="view-avatar">
                                    {viewModal.profile_photo ? (
                                        <img src={viewModal.profile_photo} alt="Profile" />
                                    ) : (
                                        <span>{viewModal.username?.charAt(0).toUpperCase()}</span>
                                    )}
                                </div>
                                <h2>{viewModal.username}</h2>
                                <span className={`role-badge ${viewModal.role}`}>{viewModal.role}</span>
                            </div>
                            <div className="view-modal-body">
                                <div className="view-row">
                                    <label>User ID</label>
                                    <span>{viewModal.id}</span>
                                </div>
                                <div className="view-row">
                                    <label>Email</label>
                                    <span>{viewModal.email || 'Not provided'}</span>
                                </div>
                                <div className="view-row">
                                    <label>Role</label>
                                    <span>{viewModal.role}</span>
                                </div>
                                <div className="view-row">
                                    <label>Watchlist Count</label>
                                    <span>{viewModal.watchlistCount || 0} movies</span>
                                </div>
                                <div className="view-row">
                                    <label>Watched Count</label>
                                    <span>{viewModal.watchedCount || 0} movies</span>
                                </div>
                                <div className="view-row">
                                    <label>Created Date</label>
                                    <span>{formatDate(viewModal.created_at)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Delete Confirmation Modal */}
                {deleteConfirm && (
                    <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
                        <div className="modal delete-modal" onClick={(e) => e.stopPropagation()}>
                            <div className="delete-icon">⚠️</div>
                            <h2>Delete User?</h2>
                            <p>Are you sure you want to delete <strong>{deleteConfirm.username}</strong>? This action cannot be undone.</p>
                            <div className="modal-actions">
                                <button className="btn btn-cancel" onClick={() => setDeleteConfirm(null)}>
                                    Cancel
                                </button>
                                <button className="btn btn-delete" onClick={handleDelete}>
                                    Yes, Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default AdminUsers;
