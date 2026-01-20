import { Link } from 'react-router-dom';
import { FaShoppingCart, FaTrash, FaPlus, FaMinus, FaArrowLeft, FaBolt, FaTag } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import './Cart.css';

const Cart = () => {
    const {
        cartItems,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalPrice
    } = useCart();

    const formatPrice = (price) => {
        if (price >= 100000) {
            return `PKR ${(price / 100000).toFixed(2)} Lac`;
        }
        return `PKR ${price?.toLocaleString() || 0}`;
    };

    const getImageUrl = (item) => {
        if (item.images && item.images.length > 0) {
            const img = item.images[0];
            return typeof img === 'string' ? img : img?.url;
        }
        return 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400';
    };

    if (cartItems.length === 0) {
        return (
            <main className="cart-page">
                <div className="container">
                    <div className="empty-cart">
                        <div className="empty-cart-icon">
                            <FaShoppingCart />
                        </div>
                        <h2>Your Cart is Empty</h2>
                        <p>Looks like you haven't added any items to your cart yet.</p>
                        <Link to="/parts" className="btn btn-primary">
                            <FaTag /> Browse Auto Parts
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="cart-page">
            <div className="container">
                <div className="cart-header">
                    <h1><FaShoppingCart /> Shopping Cart</h1>
                    <span className="cart-count">{cartItems.length} item(s)</span>
                </div>

                <div className="cart-content">
                    <div className="cart-items">
                        {cartItems.map(item => (
                            <div key={item._id} className="cart-item">
                                <div className="cart-item-image">
                                    <img src={getImageUrl(item)} alt={item.title} />
                                </div>
                                <div className="cart-item-details">
                                    <Link to={`/parts/${item._id}`} className="cart-item-title">
                                        {item.title}
                                    </Link>
                                    <div className="cart-item-meta">
                                        <span className="cart-item-category">{item.category}</span>
                                        <span className={`cart-item-condition ${item.condition?.toLowerCase()}`}>
                                            {item.condition}
                                        </span>
                                    </div>
                                    <div className="cart-item-price">
                                        {formatPrice(item.price)}
                                        <span className="per-unit">per unit</span>
                                    </div>
                                </div>
                                <div className="cart-item-quantity">
                                    <button
                                        className="qty-btn"
                                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                    >
                                        <FaMinus />
                                    </button>
                                    <span className="qty-value">{item.quantity}</span>
                                    <button
                                        className="qty-btn"
                                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                    >
                                        <FaPlus />
                                    </button>
                                </div>
                                <div className="cart-item-total">
                                    {formatPrice(item.price * item.quantity)}
                                </div>
                                <button
                                    className="cart-item-remove"
                                    onClick={() => removeFromCart(item._id)}
                                    title="Remove item"
                                >
                                    <FaTrash />
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="cart-summary">
                        <h3>Order Summary</h3>

                        <div className="summary-row">
                            <span>Subtotal</span>
                            <span>{formatPrice(getTotalPrice())}</span>
                        </div>
                        <div className="summary-row">
                            <span>Shipping</span>
                            <span className="free-shipping">
                                {getTotalPrice() >= 5000 ? 'FREE' : formatPrice(200)}
                            </span>
                        </div>
                        <div className="summary-row total">
                            <span>Total</span>
                            <span>
                                {formatPrice(getTotalPrice() + (getTotalPrice() >= 5000 ? 0 : 200))}
                            </span>
                        </div>

                        <Link to="/checkout" className="btn btn-checkout">
                            <FaBolt /> Proceed to Checkout
                        </Link>

                        <Link to="/parts" className="continue-shopping">
                            <FaArrowLeft /> Continue Shopping
                        </Link>

                        <button className="clear-cart-btn" onClick={clearCart}>
                            Clear Cart
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Cart;
