import { useState, useEffect } from 'react';
import {
    FaShoppingCart,
    FaEye,
    FaCheck,
    FaTruck,
    FaBox,
    FaTimes,
    FaPhone,
    FaMapMarkerAlt,
    FaMoneyBillWave,
    FaMobileAlt,
    FaSearch,
    FaFilter
} from 'react-icons/fa';
import { ordersAPI } from '../../services/api';
import './OrdersList.css';

const OrdersList = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchOrders();
    }, [filter]);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const params = {};
            if (filter !== 'all') {
                params.status = filter;
            }
            const response = await ordersAPI.getAll(params);
            if (response.data?.data) {
                setOrders(response.data.data);
            }
        } catch (error) {
            console.log('Using sample orders data');
            // Sample orders for testing
            setOrders([
                {
                    _id: '1',
                    orderNumber: 'CZ12345678',
                    customer: {
                        fullName: 'Ahmed Khan',
                        phone: '0312-1234567',
                        address: 'House 123, Street 5, Gulberg',
                        city: 'Lahore'
                    },
                    items: [
                        { title: 'Toyota Brake Pads', quantity: 2, price: 4500 }
                    ],
                    total: 9200,
                    paymentMethod: 'nayapay',
                    transactionId: '696381e4cb21ed1984d4d651',
                    paymentStatus: 'pending',
                    orderStatus: 'pending',
                    createdAt: new Date().toISOString()
                },
                {
                    _id: '2',
                    orderNumber: 'CZ87654321',
                    customer: {
                        fullName: 'Ali Hassan',
                        phone: '0300-9876543',
                        address: 'Flat 5, Block B, DHA',
                        city: 'Karachi'
                    },
                    items: [
                        { title: 'Honda Civic Air Filter', quantity: 1, price: 2500 }
                    ],
                    total: 2700,
                    paymentMethod: 'cod',
                    transactionId: null,
                    paymentStatus: 'pending',
                    orderStatus: 'confirmed',
                    createdAt: new Date(Date.now() - 86400000).toISOString()
                }
            ]);
        }
        setLoading(false);
    };

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            const response = await ordersAPI.updateStatus(orderId, { orderStatus: newStatus });

            // Update local state
            setOrders(orders.map(order =>
                order._id === orderId
                    ? { ...order, orderStatus: newStatus }
                    : order
            ));
            if (selectedOrder?._id === orderId) {
                setSelectedOrder({ ...selectedOrder, orderStatus: newStatus });
            }

            // Check if notification should be sent
            if (response.data?.notification) {
                const { whatsappUrl, customerPhone, status } = response.data.notification;

                // Show confirmation dialog
                const statusText = status.charAt(0).toUpperCase() + status.slice(1);
                const shouldNotify = window.confirm(
                    `Order ${statusText}! 🎉\n\nSend WhatsApp notification to customer?\n\nCustomer Phone: ${customerPhone}`
                );

                if (shouldNotify && whatsappUrl) {
                    window.open(whatsappUrl, '_blank');
                }
            }
        } catch (error) {
            console.error('Failed to update status:', error);
            // Update locally anyway for demo
            setOrders(orders.map(order =>
                order._id === orderId
                    ? { ...order, orderStatus: newStatus }
                    : order
            ));
        }
    };

    const updatePaymentStatus = async (orderId, newStatus) => {
        try {
            await ordersAPI.updateStatus(orderId, { paymentStatus: newStatus });
            setOrders(orders.map(order =>
                order._id === orderId
                    ? { ...order, paymentStatus: newStatus }
                    : order
            ));
            if (selectedOrder?._id === orderId) {
                setSelectedOrder({ ...selectedOrder, paymentStatus: newStatus });
            }
        } catch (error) {
            console.error('Failed to update payment status:', error);
            setOrders(orders.map(order =>
                order._id === orderId
                    ? { ...order, paymentStatus: newStatus }
                    : order
            ));
        }
    };

    const formatPrice = (price) => {
        return `PKR ${price?.toLocaleString() || 0}`;
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-PK', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusColor = (status) => {
        const colors = {
            pending: '#F59E0B',
            confirmed: '#3B82F6',
            processing: '#8B5CF6',
            shipped: '#6366F1',
            delivered: '#10B981',
            cancelled: '#EF4444'
        };
        return colors[status] || '#6B7280';
    };

    const getPaymentStatusColor = (status) => {
        const colors = {
            pending: '#F59E0B',
            verified: '#10B981',
            failed: '#EF4444'
        };
        return colors[status] || '#6B7280';
    };

    const filteredOrders = orders.filter(order => {
        const matchesSearch =
            order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.customer.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.customer.phone.includes(searchTerm);
        return matchesSearch;
    });

    const openOrderModal = (order) => {
        setSelectedOrder(order);
        setShowModal(true);
    };

    if (loading) {
        return (
            <div className="orders-loading">
                <div className="spinner"></div>
                <p>Loading orders...</p>
            </div>
        );
    }

    return (
        <div className="orders-list-page">
            <div className="orders-header">
                <h1><FaShoppingCart /> Orders Management</h1>
                <p>Manage and track all customer orders</p>
            </div>

            {/* Filters */}
            <div className="orders-filters">
                <div className="search-box">
                    <FaSearch />
                    <input
                        type="text"
                        placeholder="Search by order #, name, or phone..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="filter-tabs">
                    <button
                        className={filter === 'all' ? 'active' : ''}
                        onClick={() => setFilter('all')}
                    >
                        All Orders
                    </button>
                    <button
                        className={filter === 'pending' ? 'active' : ''}
                        onClick={() => setFilter('pending')}
                    >
                        Pending
                    </button>
                    <button
                        className={filter === 'confirmed' ? 'active' : ''}
                        onClick={() => setFilter('confirmed')}
                    >
                        Confirmed
                    </button>
                    <button
                        className={filter === 'shipped' ? 'active' : ''}
                        onClick={() => setFilter('shipped')}
                    >
                        Shipped
                    </button>
                    <button
                        className={filter === 'delivered' ? 'active' : ''}
                        onClick={() => setFilter('delivered')}
                    >
                        Delivered
                    </button>
                </div>
            </div>

            {/* Orders Table */}
            <div className="orders-table-wrapper">
                <table className="orders-table">
                    <thead>
                        <tr>
                            <th>Order #</th>
                            <th>Customer</th>
                            <th>Items</th>
                            <th>Total</th>
                            <th>Payment</th>
                            <th>Status</th>
                            <th>Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredOrders.length === 0 ? (
                            <tr>
                                <td colSpan="8" className="no-orders">
                                    No orders found
                                </td>
                            </tr>
                        ) : (
                            filteredOrders.map(order => (
                                <tr key={order._id}>
                                    <td className="order-number">{order.orderNumber}</td>
                                    <td className="customer-info">
                                        <strong>{order.customer.fullName}</strong>
                                        <small>{order.customer.phone}</small>
                                    </td>
                                    <td className="items-count">
                                        {order.items?.length || 0} item(s)
                                    </td>
                                    <td className="order-total">
                                        {formatPrice(order.total)}
                                    </td>
                                    <td>
                                        <div className="payment-info">
                                            <span className={`payment-method ${order.paymentMethod}`}>
                                                {order.paymentMethod === 'cod' ? <FaTruck /> : <FaMobileAlt />}
                                                {order.paymentMethod === 'cod' ? 'COD' : 'NayaPay'}
                                            </span>
                                            <span
                                                className="payment-status"
                                                style={{ background: getPaymentStatusColor(order.paymentStatus) }}
                                            >
                                                {order.paymentStatus}
                                            </span>
                                        </div>
                                    </td>
                                    <td>
                                        <span
                                            className="order-status"
                                            style={{ background: getStatusColor(order.orderStatus) }}
                                        >
                                            {order.orderStatus}
                                        </span>
                                    </td>
                                    <td className="order-date">
                                        {formatDate(order.createdAt)}
                                    </td>
                                    <td className="order-actions">
                                        <button
                                            className="btn-view"
                                            onClick={() => openOrderModal(order)}
                                        >
                                            <FaEye /> View
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Order Detail Modal */}
            {showModal && selectedOrder && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="order-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Order #{selectedOrder.orderNumber}</h2>
                            <button className="close-btn" onClick={() => setShowModal(false)}>
                                <FaTimes />
                            </button>
                        </div>

                        <div className="modal-body">
                            {/* Customer Info */}
                            <div className="modal-section">
                                <h3><FaPhone /> Customer Details</h3>
                                <div className="customer-details">
                                    <p><strong>Name:</strong> {selectedOrder.customer.fullName}</p>
                                    <p><strong>Phone:</strong> {selectedOrder.customer.phone}</p>
                                    <p><strong>Email:</strong> {selectedOrder.customer.email || 'Not provided'}</p>
                                    <p><FaMapMarkerAlt /> {selectedOrder.customer.address}, {selectedOrder.customer.city}</p>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div className="modal-section">
                                <h3><FaBox /> Order Items</h3>
                                <div className="order-items">
                                    {selectedOrder.items?.map((item, index) => (
                                        <div key={index} className="order-item">
                                            <span className="item-name">{item.title}</span>
                                            <span className="item-qty">x{item.quantity}</span>
                                            <span className="item-price">{formatPrice(item.price * item.quantity)}</span>
                                        </div>
                                    ))}
                                    <div className="order-total-row">
                                        <strong>Total</strong>
                                        <strong>{formatPrice(selectedOrder.total)}</strong>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Info */}
                            <div className="modal-section">
                                <h3><FaMoneyBillWave /> Payment Info</h3>
                                <div className="payment-details">
                                    <p><strong>Method:</strong> {selectedOrder.paymentMethod === 'cod' ? 'Cash on Delivery' : 'NayaPay'}</p>
                                    {selectedOrder.transactionId && (
                                        <p><strong>Transaction ID:</strong> <code>{selectedOrder.transactionId}</code></p>
                                    )}
                                    <p>
                                        <strong>Payment Status:</strong>
                                        <span
                                            className="status-badge"
                                            style={{ background: getPaymentStatusColor(selectedOrder.paymentStatus) }}
                                        >
                                            {selectedOrder.paymentStatus}
                                        </span>
                                    </p>
                                </div>

                                {selectedOrder.paymentMethod === 'nayapay' && selectedOrder.paymentStatus === 'pending' && (
                                    <div className="payment-actions">
                                        <button
                                            className="btn btn-success"
                                            onClick={() => updatePaymentStatus(selectedOrder._id, 'verified')}
                                        >
                                            <FaCheck /> Verify Payment
                                        </button>
                                        <button
                                            className="btn btn-danger"
                                            onClick={() => updatePaymentStatus(selectedOrder._id, 'failed')}
                                        >
                                            <FaTimes /> Mark Failed
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Order Status */}
                            <div className="modal-section">
                                <h3><FaTruck /> Order Status</h3>
                                <div className="status-buttons">
                                    <button
                                        className={`status-btn ${selectedOrder.orderStatus === 'pending' ? 'active' : ''}`}
                                        onClick={() => updateOrderStatus(selectedOrder._id, 'pending')}
                                    >
                                        Pending
                                    </button>
                                    <button
                                        className={`status-btn ${selectedOrder.orderStatus === 'confirmed' ? 'active' : ''}`}
                                        onClick={() => updateOrderStatus(selectedOrder._id, 'confirmed')}
                                    >
                                        Confirmed
                                    </button>
                                    <button
                                        className={`status-btn ${selectedOrder.orderStatus === 'processing' ? 'active' : ''}`}
                                        onClick={() => updateOrderStatus(selectedOrder._id, 'processing')}
                                    >
                                        Processing
                                    </button>
                                    <button
                                        className={`status-btn ${selectedOrder.orderStatus === 'shipped' ? 'active' : ''}`}
                                        onClick={() => updateOrderStatus(selectedOrder._id, 'shipped')}
                                    >
                                        Shipped
                                    </button>
                                    <button
                                        className={`status-btn ${selectedOrder.orderStatus === 'delivered' ? 'active' : ''}`}
                                        onClick={() => updateOrderStatus(selectedOrder._id, 'delivered')}
                                    >
                                        Delivered
                                    </button>
                                    <button
                                        className={`status-btn cancelled ${selectedOrder.orderStatus === 'cancelled' ? 'active' : ''}`}
                                        onClick={() => updateOrderStatus(selectedOrder._id, 'cancelled')}
                                    >
                                        Cancelled
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrdersList;
