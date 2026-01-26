import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    FaShoppingCart,
    FaArrowLeft,
    FaTruck,
    FaMoneyBillWave,
    FaMobileAlt,
    FaCheckCircle,
    FaMapMarkerAlt,
    FaUser,
    FaPhone,
    FaEnvelope,
    FaCopy,
    FaCheck,
    FaWhatsapp,
    FaReceipt,
    FaExclamationCircle
} from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { ordersAPI, BASE_URL } from '../services/api';
import './Checkout.css';

const Checkout = () => {
    const navigate = useNavigate();
    const { cartItems, getTotalPrice, clearCart } = useCart();
    const [step, setStep] = useState(1); // 1: Address, 2: Payment, 3: Transaction ID, 4: Confirmation
    const [paymentMethod, setPaymentMethod] = useState('cod');
    const [copied, setCopied] = useState(false);
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [orderNumber, setOrderNumber] = useState('');
    const [transactionId, setTransactionId] = useState('');
    const [transactionError, setTransactionError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        email: '',
        address: '',
        city: '',
        postalCode: '',
        notes: ''
    });

    // NayaPay & WhatsApp Details
    const NAYAPAY_NUMBER = '03013890851';
    const NAYAPAY_NAME = 'Muhammad Yasir';
    const WHATSAPP_NUMBER = '923013890851'; // Format for WhatsApp API

    const formatPrice = (price) => {
        if (price >= 100000) {
            return `PKR ${(price / 100000).toFixed(2)} Lac`;
        }
        return `PKR ${price?.toLocaleString() || 0}`;
    };

    const subtotal = getTotalPrice();
    const shipping = subtotal >= 5000 ? 0 : 200;
    const total = subtotal + shipping;

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleCopyNumber = () => {
        navigator.clipboard.writeText(NAYAPAY_NUMBER);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const validateStep1 = () => {
        return formData.fullName && formData.phone && formData.address && formData.city;
    };

    const validateTransactionId = () => {
        if (paymentMethod === 'nayapay' && !transactionId.trim()) {
            setTransactionError('Please enter your Transaction ID');
            return false;
        }
        if (paymentMethod === 'nayapay' && transactionId.trim().length < 5) {
            setTransactionError('Transaction ID seems too short');
            return false;
        }
        setTransactionError('');
        return true;
    };

    // Generate WhatsApp message
    const generateWhatsAppMessage = (orderId) => {
        const productsList = cartItems.map(item =>
            `• ${item.title} x${item.quantity} = ${formatPrice(item.price * item.quantity)}`
        ).join('\n');

        const message = `🛒 *NEW ORDER - CarZar*

📦 *Order #:* ${orderId}

👤 *Customer Details:*
Name: ${formData.fullName}
Phone: ${formData.phone}
Email: ${formData.email || 'Not provided'}
Address: ${formData.address}
City: ${formData.city}
${formData.notes ? `Notes: ${formData.notes}` : ''}

🛍️ *Products:*
${productsList}

💰 *Order Total:*
Subtotal: ${formatPrice(subtotal)}
Shipping: ${shipping === 0 ? 'FREE' : formatPrice(shipping)}
*Total: ${formatPrice(total)}*

💳 *Payment Method:* ${paymentMethod === 'cod' ? 'Cash on Delivery' : 'NayaPay'}
${paymentMethod === 'nayapay' ? `📝 *Transaction ID:* ${transactionId}` : ''}

${paymentMethod === 'nayapay' ? '⚠️ Please verify this transaction in your NayaPay app' : ''}

---
Powered by CarZar`;

        return encodeURIComponent(message);
    };

    // Send WhatsApp notification
    const sendWhatsAppNotification = (orderId) => {
        const message = generateWhatsAppMessage(orderId);
        const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
        window.open(whatsappUrl, '_blank');
    };

    const handleNextStep = () => {
        if (step === 1 && validateStep1()) {
            setStep(2);
        } else if (step === 2) {
            if (paymentMethod === 'nayapay') {
                setStep(3); // Go to Transaction ID step
            } else {
                // COD - Place order directly
                placeOrder();
            }
        } else if (step === 3) {
            if (validateTransactionId()) {
                placeOrder();
            }
        }
    };

    const placeOrder = async () => {
        setIsSubmitting(true);
        const newOrderNumber = 'CZ' + Date.now().toString().slice(-8);

        // Prepare order data
        const orderData = {
            orderNumber: newOrderNumber,
            customer: {
                fullName: formData.fullName,
                phone: formData.phone,
                email: formData.email || '',
                address: formData.address,
                city: formData.city,
                postalCode: formData.postalCode || ''
            },
            items: cartItems.map(item => ({
                productId: item._id,
                title: item.title,
                price: item.price,
                quantity: item.quantity,
                image: getImageUrl(item)
            })),
            subtotal,
            shipping,
            total,
            paymentMethod,
            transactionId: paymentMethod === 'nayapay' ? transactionId : null,
            notes: formData.notes || ''
        };

        console.log('Attempting to save order:', orderData);

        try {
            // Save order to database
            const response = await ordersAPI.create(orderData);
            console.log('Order saved successfully:', response);
        } catch (error) {
            console.error('FAILED to save order to database!');
            console.error('Error:', error);
            console.error('Error Response:', error.response?.data);
            console.error('Error Message:', error.message);
        }

        setOrderNumber(newOrderNumber);
        setOrderPlaced(true);
        setStep(4);
        setIsSubmitting(false);

        // Try to send WhatsApp notification (optional - won't break if fails)
        try {
            sendWhatsAppNotification(newOrderNumber);
        } catch (error) {
            console.log('WhatsApp notification skipped');
        }

        // Clear cart after order
        setTimeout(() => clearCart(), 3000);
    };

    const getImageUrl = (item) => {
        if (item.images && item.images.length > 0) {
            const img = item.images[0];
            const url = typeof img === 'string' ? img : img?.url;
            if (url && url.startsWith('/uploads/')) {
                return `${BASE_URL}${url}`;
            }
            return url;
        }
        return 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400';
    };

    if (cartItems.length === 0 && !orderPlaced) {
        return (
            <main className="checkout-page">
                <div className="container">
                    <div className="empty-checkout">
                        <FaShoppingCart />
                        <h2>Your cart is empty</h2>
                        <p>Add some items to your cart before checkout</p>
                        <Link to="/parts" className="btn btn-primary">Browse Parts</Link>
                    </div>
                </div>
            </main>
        );
    }

    // Order Confirmation Screen
    if (step === 4) {
        return (
            <main className="checkout-page">
                <div className="container">
                    <div className="order-confirmation">
                        <div className="confirmation-icon">
                            <FaCheckCircle />
                        </div>
                        <h1>Order Placed Successfully!</h1>
                        <p className="order-number">Order Number: <strong>{orderNumber}</strong></p>

                        <div className="confirmation-details">
                            {paymentMethod === 'cod' ? (
                                <div className="payment-info-box cod-info">
                                    <FaTruck />
                                    <div>
                                        <h3>Cash on Delivery</h3>
                                        <p>Pay <strong>{formatPrice(total)}</strong> when your order arrives</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="payment-info-box nayapay-info">
                                    <FaMobileAlt />
                                    <div>
                                        <h3>NayaPay Payment Submitted</h3>
                                        <p>Amount: <strong>{formatPrice(total)}</strong></p>
                                        <div className="payment-details-confirm">
                                            <p><strong>Transaction ID:</strong> {transactionId}</p>
                                        </div>
                                        <p className="payment-note">✅ Order will be confirmed after payment verification</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="whatsapp-sent-notice">
                            <FaWhatsapp />
                            <p>Order details sent to seller via WhatsApp</p>
                        </div>

                        <div className="confirmation-message">
                            <p>📧 You will receive confirmation on your phone</p>
                            <p>📦 Expected delivery: 3-5 business days</p>
                        </div>

                        <div className="confirmation-actions">
                            <Link to="/" className="btn btn-primary">Continue Shopping</Link>
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="checkout-page">
            <div className="container">
                {/* Checkout Header */}
                <div className="checkout-header">
                    <Link to="/cart" className="back-link">
                        <FaArrowLeft /> Back to Cart
                    </Link>
                    <h1>Checkout</h1>
                </div>

                {/* Progress Steps */}
                <div className="checkout-progress">
                    <div className={`progress-step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
                        <div className="step-number">1</div>
                        <span>Shipping</span>
                    </div>
                    <div className="progress-line"></div>
                    <div className={`progress-step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
                        <div className="step-number">2</div>
                        <span>Payment</span>
                    </div>
                    <div className="progress-line"></div>
                    {paymentMethod === 'nayapay' && (
                        <>
                            <div className={`progress-step ${step >= 3 ? 'active' : ''} ${step > 3 ? 'completed' : ''}`}>
                                <div className="step-number">3</div>
                                <span>Verify</span>
                            </div>
                            <div className="progress-line"></div>
                        </>
                    )}
                    <div className={`progress-step ${step >= 4 ? 'active' : ''}`}>
                        <div className="step-number">{paymentMethod === 'nayapay' ? '4' : '3'}</div>
                        <span>Confirm</span>
                    </div>
                </div>

                <div className="checkout-content">
                    {/* Main Form Section */}
                    <div className="checkout-main">
                        {/* Step 1: Shipping Address */}
                        {step === 1 && (
                            <div className="checkout-section">
                                <h2><FaMapMarkerAlt /> Shipping Address</h2>

                                <div className="form-grid">
                                    <div className="form-group full-width">
                                        <label><FaUser /> Full Name *</label>
                                        <input
                                            type="text"
                                            name="fullName"
                                            placeholder="Enter your full name"
                                            value={formData.fullName}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label><FaPhone /> Phone Number *</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            placeholder="03XX-XXXXXXX"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label><FaEnvelope /> Email (Optional)</label>
                                        <input
                                            type="email"
                                            name="email"
                                            placeholder="your@email.com"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                        />
                                    </div>

                                    <div className="form-group full-width">
                                        <label><FaMapMarkerAlt /> Street Address *</label>
                                        <input
                                            type="text"
                                            name="address"
                                            placeholder="House #, Street, Area"
                                            value={formData.address}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>City *</label>
                                        <select
                                            name="city"
                                            value={formData.city}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value="">Select City</option>
                                            <option value="Karachi">Karachi</option>
                                            <option value="Lahore">Lahore</option>
                                            <option value="Islamabad">Islamabad</option>
                                            <option value="Rawalpindi">Rawalpindi</option>
                                            <option value="Faisalabad">Faisalabad</option>
                                            <option value="Multan">Multan</option>
                                            <option value="Peshawar">Peshawar</option>
                                            <option value="Quetta">Quetta</option>
                                            <option value="Sialkot">Sialkot</option>
                                            <option value="Gujranwala">Gujranwala</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label>Postal Code (Optional)</label>
                                        <input
                                            type="text"
                                            name="postalCode"
                                            placeholder="XXXXX"
                                            value={formData.postalCode}
                                            onChange={handleInputChange}
                                        />
                                    </div>

                                    <div className="form-group full-width">
                                        <label>Order Notes (Optional)</label>
                                        <textarea
                                            name="notes"
                                            placeholder="Any special instructions for delivery..."
                                            value={formData.notes}
                                            onChange={handleInputChange}
                                            rows="3"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Payment Method */}
                        {step === 2 && (
                            <div className="checkout-section">
                                <h2><FaMoneyBillWave /> Payment Method</h2>

                                <div className="payment-methods">
                                    {/* Cash on Delivery */}
                                    <div
                                        className={`payment-option ${paymentMethod === 'cod' ? 'selected' : ''}`}
                                        onClick={() => setPaymentMethod('cod')}
                                    >
                                        <div className="payment-radio">
                                            <div className="radio-dot"></div>
                                        </div>
                                        <div className="payment-icon cod">
                                            <FaTruck />
                                        </div>
                                        <div className="payment-details">
                                            <h3>Cash on Delivery</h3>
                                            <p>Pay cash when your order arrives at your doorstep</p>
                                            <span className="payment-tag popular">Most Popular</span>
                                        </div>
                                    </div>

                                    {/* NayaPay */}
                                    <div
                                        className={`payment-option ${paymentMethod === 'nayapay' ? 'selected' : ''}`}
                                        onClick={() => setPaymentMethod('nayapay')}
                                    >
                                        <div className="payment-radio">
                                            <div className="radio-dot"></div>
                                        </div>
                                        <div className="payment-icon nayapay">
                                            <FaMobileAlt />
                                        </div>
                                        <div className="payment-details">
                                            <h3>NayaPay</h3>
                                            <p>Transfer via NayaPay mobile wallet</p>
                                            <span className="payment-tag instant">Fast & Secure</span>
                                        </div>
                                    </div>
                                </div>

                                {/* NayaPay Instructions Preview */}
                                {paymentMethod === 'nayapay' && (
                                    <div className="nayapay-preview">
                                        <div className="preview-header">
                                            <FaMobileAlt />
                                            <span>You'll transfer to this account in next step</span>
                                        </div>
                                        <div className="preview-details">
                                            <p><strong>{NAYAPAY_NAME}</strong></p>
                                            <p>{NAYAPAY_NUMBER}</p>
                                            <p className="preview-amount">{formatPrice(total)}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Step 3: Transaction ID (NayaPay only) */}
                        {step === 3 && paymentMethod === 'nayapay' && (
                            <div className="checkout-section">
                                <h2><FaReceipt /> Complete NayaPay Payment</h2>

                                <div className="nayapay-payment-section">
                                    {/* Step by Step Instructions */}
                                    <div className="payment-steps">
                                        <div className="payment-step">
                                            <span className="step-badge">1</span>
                                            <div className="step-content">
                                                <h4>Open NayaPay App</h4>
                                                <p>Launch the NayaPay app on your phone</p>
                                            </div>
                                        </div>
                                        <div className="payment-step">
                                            <span className="step-badge">2</span>
                                            <div className="step-content">
                                                <h4>Transfer Money</h4>
                                                <p>Send payment to the account below</p>
                                            </div>
                                        </div>
                                        <div className="payment-step">
                                            <span className="step-badge">3</span>
                                            <div className="step-content">
                                                <h4>Enter Transaction ID</h4>
                                                <p>Copy the Transaction ID from NayaPay and paste below</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Payment Details Card */}
                                    <div className="nayapay-details-card">
                                        <div className="card-header">
                                            <FaMobileAlt />
                                            <span>Transfer to this account</span>
                                        </div>
                                        <div className="card-body">
                                            <div className="detail-row">
                                                <span className="label">Account Number</span>
                                                <div className="value-with-copy">
                                                    <span className="value large">{NAYAPAY_NUMBER}</span>
                                                    <button
                                                        className="copy-btn"
                                                        onClick={handleCopyNumber}
                                                    >
                                                        {copied ? <FaCheck /> : <FaCopy />}
                                                        {copied ? 'Copied!' : 'Copy'}
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="detail-row">
                                                <span className="label">Account Name</span>
                                                <span className="value">{NAYAPAY_NAME}</span>
                                            </div>
                                            <div className="detail-row amount-row">
                                                <span className="label">Amount to Pay</span>
                                                <span className="value amount">{formatPrice(total)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Transaction ID Input */}
                                    <div className="transaction-input-section">
                                        <label>
                                            <FaReceipt /> Enter Transaction ID *
                                        </label>
                                        <div className="transaction-input-wrapper">
                                            <input
                                                type="text"
                                                placeholder="e.g., NP1234567890 or TXN123456"
                                                value={transactionId}
                                                onChange={(e) => {
                                                    setTransactionId(e.target.value);
                                                    setTransactionError('');
                                                }}
                                                className={transactionError ? 'error' : ''}
                                            />
                                        </div>
                                        {transactionError && (
                                            <div className="error-message">
                                                <FaExclamationCircle /> {transactionError}
                                            </div>
                                        )}
                                        <p className="helper-text">
                                            Find Transaction ID in your NayaPay app under transaction details
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Navigation Buttons */}
                        <div className="checkout-nav-buttons">
                            {step > 1 && (
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => setStep(step - 1)}
                                >
                                    Back
                                </button>
                            )}
                            <button
                                className="btn btn-primary btn-next"
                                onClick={handleNextStep}
                                disabled={step === 1 && !validateStep1()}
                            >
                                {step === 1 && 'Continue to Payment'}
                                {step === 2 && paymentMethod === 'cod' && 'Place Order'}
                                {step === 2 && paymentMethod === 'nayapay' && 'Continue to Pay'}
                                {step === 3 && 'Confirm & Place Order'}
                            </button>
                        </div>
                    </div>

                    {/* Order Summary Sidebar */}
                    <aside className="checkout-sidebar">
                        <div className="order-summary-card">
                            <h3>Order Summary</h3>

                            <div className="summary-items">
                                {cartItems.map(item => (
                                    <div key={item._id} className="summary-item">
                                        <div className="item-image">
                                            <img src={getImageUrl(item)} alt={item.title} />
                                            <span className="item-qty">{item.quantity}</span>
                                        </div>
                                        <div className="item-info">
                                            <p className="item-title">{item.title}</p>
                                            <p className="item-price">{formatPrice(item.price * item.quantity)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="summary-totals">
                                <div className="total-row">
                                    <span>Subtotal</span>
                                    <span>{formatPrice(subtotal)}</span>
                                </div>
                                <div className="total-row">
                                    <span>Shipping</span>
                                    <span className={shipping === 0 ? 'free' : ''}>
                                        {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                                    </span>
                                </div>
                                <div className="total-row grand-total">
                                    <span>Total</span>
                                    <span>{formatPrice(total)}</span>
                                </div>
                            </div>

                            {shipping === 0 && (
                                <div className="free-shipping-banner">
                                    🎉 You got FREE shipping!
                                </div>
                            )}

                            {/* Security Badge */}
                            <div className="security-badge">
                                <FaCheck /> Secure Checkout
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </main>
    );
};

export default Checkout;
