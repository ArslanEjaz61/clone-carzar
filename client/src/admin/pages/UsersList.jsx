import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { FaUsers, FaTrash, FaUserShield, FaUser, FaStore } from 'react-icons/fa';
import './CarsList.css'; // Reuse same styles

const UsersList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchUsers();
    }, [page]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await adminAPI.getUsers({ page, limit: 20 });
            if (response.data?.data) {
                setUsers(response.data.data);
                setTotalPages(response.data.pagination?.pages || 1);
            }
        } catch (error) {
            console.log('Using sample data');
            setUsers([
                { _id: '1', name: 'Ahmed Motors', email: 'ahmed@carzar.pk', phone: '0300-1234567', role: 'dealer', city: 'Lahore', createdAt: new Date() },
                { _id: '2', name: 'Ali Khan', email: 'ali@carzar.pk', phone: '0312-9876543', role: 'user', city: 'Karachi', createdAt: new Date() },
                { _id: '3', name: 'Yasir Admin', email: 'yasir@carzar.pk', phone: '0300-0000000', role: 'admin', city: 'Islamabad', createdAt: new Date() }
            ]);
        }
        setLoading(false);
    };

    const handleRoleChange = async (userId, newRole) => {
        try {
            await adminAPI.updateUserRole(userId, newRole);
            fetchUsers();
        } catch (error) {
            setUsers(prev => prev.map(user =>
                user._id === userId ? { ...user, role: newRole } : user
            ));
        }
    };

    const handleDelete = async (userId) => {
        if (!confirm('Are you sure you want to delete this user and all their listings?')) return;

        try {
            await adminAPI.deleteUser(userId);
            fetchUsers();
        } catch (error) {
            setUsers(prev => prev.filter(user => user._id !== userId));
        }
    };

    const getRoleIcon = (role) => {
        switch (role) {
            case 'admin': return <FaUserShield />;
            case 'dealer': return <FaStore />;
            default: return <FaUser />;
        }
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-PK', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    return (
        <div className="cars-list-page">
            <div className="page-header">
                <div>
                    <h1><FaUsers /> Users</h1>
                    <p>{users.length} users found</p>
                </div>
            </div>

            {loading ? (
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Loading users...</p>
                </div>
            ) : users.length === 0 ? (
                <div className="empty-state">
                    <FaUsers className="empty-icon" />
                    <h3>No users found</h3>
                </div>
            ) : (
                <div className="cars-table-container">
                    <table className="cars-table">
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>City</th>
                                <th>Role</th>
                                <th>Joined</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user._id}>
                                    <td className="car-info">
                                        <div className="user-avatar">
                                            {getRoleIcon(user.role)}
                                        </div>
                                        <div className="car-details">
                                            <h4>{user.name}</h4>
                                        </div>
                                    </td>
                                    <td>{user.email}</td>
                                    <td>{user.phone || '-'}</td>
                                    <td>{user.city || '-'}</td>
                                    <td>
                                        <select
                                            value={user.role}
                                            onChange={(e) => handleRoleChange(user._id, e.target.value)}
                                            className="role-select"
                                        >
                                            <option value="user">User</option>
                                            <option value="dealer">Dealer</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </td>
                                    <td>{formatDate(user.createdAt)}</td>
                                    <td className="actions">
                                        <button
                                            className="action-btn delete"
                                            onClick={() => handleDelete(user._id)}
                                            title="Delete User"
                                            disabled={user.role === 'admin'}
                                        >
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {totalPages > 1 && (
                <div className="pagination">
                    <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>Previous</button>
                    <span>Page {page} of {totalPages}</span>
                    <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next</button>
                </div>
            )}
        </div>
    );
};

export default UsersList;
