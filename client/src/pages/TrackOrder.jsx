import { useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import {
    FaSearch,
    FaBox,
    FaCheck,
    FaTruck,
    FaHome,
    FaSpinner,
    FaExclamationTriangle,
    FaPhone,
    FaMapMarkerAlt
} from 'react-icons/fa';
import { ordersAPI } from '../services/api';
import './TrackOrder.css';

const TrackOrder = () => {
    const { orderNumber: urlOrderNumber } = useParams();
    const [searchParams] = useSearchParams();
    const [orderNumber, setOrderNumber] = useState(urlOrderNumber || '');
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [searched, setSearched] = useState(false);

    const trackOrder = async (e) => {
        e?.preventDefault();
        if (!orderNumber.trim()) {
            setError('Please enter order number');
            return;
        }

        setLoading(true);
        setError('');
        setSearched(true);

        try {
            const response = await ordersAPI.getByNumber(orderNumber.trim());
            if (response.data?.data) {
                setOrder(response.data.data);
            } else {
                setError('Order not found');
                setOrder(null);
            }
        } catch (err) {
            console.error('Track order error:', err);
            setError('Order not found. Please check the order number.');
            setOrder(null);
        }

        setLoading(false);
    };

    const getStatusStep = (status) => {
        const steps = {
            pending: 0,
            confirmed: 1,
            processing: 2,
            shipped: 3,
            delivered: 4,
            cancelled: -1
        };
        return steps[status] || 0;
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-PK', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatPrice = (price) => {
        return `PKR ${price?.toLocaleString() || 0}`;
    };

    const statusStep = order ? getStatusStep(order.orderStatus) : 0;

    return (
        <main className="track-order-page">
            <div className="container">
                {/* Header */}
                <div className="track-header">
                    <FaBox className="track-icon" />
                    <h1>Track Your Order</h1>
                    <p>Enter your order number to check delivery status</p>
                </div>

                {/* Search Form */}
                <form className="track-search-form" onSubmit={trackOrder}>
                    <div className="search-input-wrapper">
                        <FaSearch className="search-icon" />
                        <input
                            type="text"
                            placeholder="Enter Order Number (e.g., CZ12345678)"
                            value={orderNumber}
                            onChange={(e) => setOrderNumber(e.target.value.toUpperCase())}
                            className="track-input"
                        />
                    </div>
                    <button type="submit" className="btn-track" disabled={loading}>
                        {loading ? <FaSpinner className="spin" /> : 'Track Order'}
                    </button>
                </form>

                {/* Error Message */}
                {error && (
                    <div className="track-error">
                        <FaExclamationTriangle />
                        <p>{error}</p>
                    </div>
                )}

                {/* Order Details */}
                {order && (
                    <div className="order-tracking-details">
                        {/* Order Info Card */}
                        <div className="order-info-card">
                            <div className="order-info-header">
                                <div>
                                    <h2>Order #{order.orderNumber}</h2>
                                    <p className="order-date">Placed on {formatDate(order.createdAt)}</p>
                                </div>
                                <span className={`status-badge ${order.orderStatus}`}>
                                    {order.orderStatus}
                                </span>
                            </div>

                            {/* Progress Timeline */}
                            {order.orderStatus !== 'cancelled' ? (
                                <div className="progress-timeline">
                                    <div className={`timeline-step ${statusStep >= 0 ? 'active' : ''} ${statusStep > 0 ? 'completed' : ''}`}>
                                        <div className="step-icon">
                                            <FaCheck />
                                        </div>
                                        <div className="step-label">Order Placed</div>
                                    </div>
                                    <div className={`timeline-line ${statusStep >= 1 ? 'active' : ''}`}></div>

                                    <div className={`timeline-step ${statusStep >= 1 ? 'active' : ''} ${statusStep > 1 ? 'completed' : ''}`}>
                                        <div className="step-icon">
                                            <FaBox />
                                        </div>
                                        <div className="step-label">Confirmed</div>
                                    </div>
                                    <div className={`timeline-line ${statusStep >= 2 ? 'active' : ''}`}></div>

                                    <div className={`timeline-step ${statusStep >= 2 ? 'active' : ''} ${statusStep > 2 ? 'completed' : ''}`}>
                                        <div className="step-icon">
                                            <FaBox />
                                        </div>
                                        <div className="step-label">Processing</div>
                                    </div>
                                    <div className={`timeline-line ${statusStep >= 3 ? 'active' : ''}`}></div>

                                    <div className={`timeline-step ${statusStep >= 3 ? 'active' : ''} ${statusStep > 3 ? 'completed' : ''}`}>
                                        <div className="step-icon">
                                            <FaTruck />
                                        </div>
                                        <div className="step-label">Shipped</div>
                                    </div>
                                    <div className={`timeline-line ${statusStep >= 4 ? 'active' : ''}`}></div>

                                    <div className={`timeline-step ${statusStep >= 4 ? 'active' : ''}`}>
                                        <div className="step-icon">
                                            <FaHome />
                                        </div>
                                        <div className="step-label">Delivered</div>
                                    </div>
                                </div>
                            ) : (
                                <div className="cancelled-notice">
                                    <FaExclamationTriangle />
                                    <p>This order has been cancelled</p>
                                </div>
                            )}
                        </div>

                        {/* Order Items */}
                        <div className="tracking-section">
                            <h3>Order Items</h3>
                            <div className="order-items-list">
                                {order.items?.map((item, index) => (
                                    <div key={index} className="order-item">
                                        <div className="item-info">
                                            <span className="item-name">{item.title}</span>
                                            <span className="item-qty">Qty: {item.quantity}</span>
                                        </div>
                                        <span className="item-price">{formatPrice(item.price * item.quantity)}</span>
                                    </div>
                                ))}
                                <div className="order-total">
                                    <span>Total</span>
                                    <span>{formatPrice(order.total)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Delivery Address */}
                        <div className="tracking-section">
                            <h3><FaMapMarkerAlt /> Delivery Address</h3>
                            <div className="delivery-address">
                                <p className="customer-name">{order.customer.fullName}</p>
                                <p>{order.customer.address}</p>
                                <p>{order.customer.city}</p>
                                <p><FaPhone /> {order.customer.phone}</p>
                            </div>
                        </div>

                        {/* Help Section */}
                        <div className="tracking-help">
                            <h4>Need Help?</h4>
                            <p>If you have any questions about your order, please contact us:</p>
                            <div className="help-contacts">
                                <a href="tel:03013890851" className="help-link">
                                    <FaPhone /> 03013890851
                                </a>
                                <a href="https://wa.me/923013890851" target="_blank" rel="noopener noreferrer" className="help-link whatsapp">
                                    WhatsApp Support
                                </a>
                            </div>
                        </div>
                    </div>
                )}

                {/* No Results */}
                {searched && !order && !loading && !error && (
                    <div className="no-order-found">
                        <FaBox />
                        <h3>Order Not Found</h3>
                        <p>Please check your order number and try again</p>
                    </div>
                )}
            </div>
        </main>
    );
};

export default TrackOrder;
