import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI, partsAPI, BASE_URL } from '../../services/api';
import { FaPlus, FaEdit, FaTrash, FaCogs } from 'react-icons/fa';
import './CarsList.css'; // Reuse same styles

const PartsList = () => {
    const [parts, setParts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchParts();
    }, [page]);

    const fetchParts = async () => {
        setLoading(true);
        try {
            const response = await adminAPI.getParts({ page, limit: 15 });
            if (response.data?.data) {
                setParts(response.data.data);
                setTotalPages(response.data.pagination?.pages || 1);
            }
        } catch (error) {
            console.error('Error fetching parts:', error);
            setParts([]);
        }
        setLoading(false);
    };

    const handleDelete = async (partId) => {
        if (!confirm('Are you sure you want to delete this part?')) return;

        try {
            await adminAPI.deletePart(partId);
            fetchParts();
        } catch (error) {
            console.error('Error deleting part:', error);
        }
    };

    const getImageUrl = (url) => {
        if (!url) return 'https://via.placeholder.com/80x60?text=Part';
        if (url.startsWith('http')) return url;
        return `${BASE_URL}${url}`;
    };

    return (
        <div className="cars-list-page">
            <div className="page-header">
                <div>
                    <h1><FaCogs /> Auto Parts</h1>
                    <p>{parts.length} parts found</p>
                </div>
                <Link to="/admin/add-part" className="btn btn-primary">
                    <FaPlus /> Add New Part
                </Link>
            </div>

            {loading ? (
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Loading parts...</p>
                </div>
            ) : parts.length === 0 ? (
                <div className="empty-state">
                    <FaCogs className="empty-icon" />
                    <h3>No parts found</h3>
                    <p>Start by adding a new auto part</p>
                    <Link to="/admin/add-part" className="btn btn-primary">Add Part</Link>
                </div>
            ) : (
                <div className="cars-table-container">
                    <table className="cars-table">
                        <thead>
                            <tr>
                                <th>Part</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Condition</th>
                                <th>City</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {parts.map(part => (
                                <tr key={part._id}>
                                    <td className="car-info">
                                        <div className="car-image">
                                            <img
                                                src={getImageUrl(part.images?.[0]?.url)}
                                                alt={part.title}
                                            />
                                        </div>
                                        <div className="car-details">
                                            <h4>{part.title}</h4>
                                        </div>
                                    </td>
                                    <td>{part.category}</td>
                                    <td className="price">PKR {part.price?.toLocaleString()}</td>
                                    <td>
                                        <span className={`badge ${part.condition?.toLowerCase()}`}>
                                            {part.condition}
                                        </span>
                                    </td>
                                    <td>{part.city}</td>
                                    <td className="actions">
                                        <Link to={`/admin/edit-part/${part._id}`} className="action-btn" title="Edit">
                                            <FaEdit />
                                        </Link>
                                        <button
                                            className="action-btn delete"
                                            onClick={() => handleDelete(part._id)}
                                            title="Delete"
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

export default PartsList;
