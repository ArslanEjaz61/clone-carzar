// Notification utility functions for WhatsApp and Email

/**
 * Generate WhatsApp URL for customer notification
 */
const generateCustomerWhatsAppUrl = (order, status) => {
    const phone = order.customer.phone.replace(/[^0-9]/g, '');
    // Convert to international format (Pakistan)
    const intPhone = phone.startsWith('0') ? '92' + phone.slice(1) : phone;

    let message = '';

    if (status === 'confirmed') {
        message = `╔═══════════════════════════╗
       🚗 *CARZAR* 🚗
╚═══════════════════════════╝

🎉 *ORDER CONFIRMED!*

Assalam-o-Alaikum *${order.customer.fullName}*! 

Bohat shukriya CarZar se shopping karne ka! ❤️

Your order has been *CONFIRMED* and is being prepared for delivery! ✨

━━━━━━━━━━━━━━━━━━━━━━━

📦 *ORDER DETAILS*
━━━━━━━━━━━━━━━━━━━━━━━

🔖 Order #: *${order.orderNumber}*

🛒 *Items:*
${order.items.map(item => `   ▪️ ${item.title} × ${item.quantity}`).join('\n')}

💰 *Total Amount:* PKR ${order.total.toLocaleString()}/-

━━━━━━━━━━━━━━━━━━━━━━━

📍 *DELIVERY ADDRESS*
━━━━━━━━━━━━━━━━━━━━━━━

👤 ${order.customer.fullName}
🏠 ${order.customer.address}
🌆 ${order.customer.city}
📱 ${order.customer.phone}

━━━━━━━━━━━━━━━━━━━━━━━

⏰ *Expected Delivery:* 3-5 business days

🔗 *Track Order:*
carzar.pk/track/${order.orderNumber}

━━━━━━━━━━━━━━━━━━━━━━━

📞 *Customer Support:*
WhatsApp: 03013890851
━━━━━━━━━━━━━━━━━━━━━━━

Thank you for choosing CarZar! 🙏
Pakistan's #1 Auto Parts Marketplace

_Powered by CarZar™_ 🚗✨`;

    } else if (status === 'shipped') {
        message = `╔═══════════════════════════╗
       🚗 *CARZAR* 🚗
╚═══════════════════════════╝

🚚 *ORDER SHIPPED!*

Dear *${order.customer.fullName}*,

Great news! Your order is on its way! 🎉

━━━━━━━━━━━━━━━━━━━━━━━

📦 *SHIPMENT DETAILS*
━━━━━━━━━━━━━━━━━━━━━━━

🔖 Order #: *${order.orderNumber}*

📍 *Shipping to:*
🏠 ${order.customer.address}
🌆 ${order.customer.city}

━━━━━━━━━━━━━━━━━━━━━━━

🛒 *Your Items:*
${order.items.map(item => `   ▪️ ${item.title} × ${item.quantity}`).join('\n')}

💰 Total: PKR ${order.total.toLocaleString()}/-

━━━━━━━━━━━━━━━━━━━━━━━

🚚 *Delivery Status:* ON THE WAY

📱 Our delivery partner will contact you soon!

⏰ *Expected Delivery:* 1-2 business days

━━━━━━━━━━━━━━━━━━━━━━━

🔗 *Live Tracking:*
carzar.pk/track/${order.orderNumber}

📞 *Need Help?*
WhatsApp: 03013890851

━━━━━━━━━━━━━━━━━━━━━━━

_Stay tuned for delivery updates!_ 📲
_Powered by CarZar™_ 🚗✨`;

    } else if (status === 'delivered') {
        message = `╔═══════════════════════════╗
       🚗 *CARZAR* 🚗
╚═══════════════════════════╝

✅ *ORDER DELIVERED!*

Dear *${order.customer.fullName}*,

Your order has been successfully delivered! 🎉📦

━━━━━━━━━━━━━━━━━━━━━━━

📦 *DELIVERY CONFIRMED*
━━━━━━━━━━━━━━━━━━━━━━━

🔖 Order #: *${order.orderNumber}*

🛒 *Delivered Items:*
${order.items.map(item => `   ✓ ${item.title} × ${item.quantity}`).join('\n')}

💰 Total Paid: PKR ${order.total.toLocaleString()}/-

━━━━━━━━━━━━━━━━━━━━━━━

🙏 *Thank You!*

We hope you're satisfied with your purchase!

━━━━━━━━━━━━━━━━━━━━━━━

⭐⭐⭐⭐⭐

*Your feedback matters!*
Please rate your experience

━━━━━━━━━━━━━━━━━━━━━━━

🛒 *Shop Again:*
carzar.pk

📞 *Support:*
WhatsApp: 03013890851

━━━━━━━━━━━━━━━━━━━━━━━

Thank you for shopping with CarZar! ❤️
Pakistan's #1 Auto Parts Marketplace

_Powered by CarZar™_ 🚗✨`;

    } else if (status === 'cancelled') {
        message = `╔═══════════════════════════╗
       🚗 *CARZAR* 🚗
╚═══════════════════════════╝

❌ *ORDER CANCELLED*

Dear *${order.customer.fullName}*,

We regret to inform you that your order has been cancelled.

━━━━━━━━━━━━━━━━━━━━━━━

📦 *ORDER DETAILS*
━━━━━━━━━━━━━━━━━━━━━━━

🔖 Order #: *${order.orderNumber}*
💰 Amount: PKR ${order.total.toLocaleString()}/-

━━━━━━━━━━━━━━━━━━━━━━━

💰 *REFUND*

If you paid online, your refund will be processed within 3-5 business days.

━━━━━━━━━━━━━━━━━━━━━━━

📞 *Questions?*
WhatsApp: 03013890851

We apologize for any inconvenience.

━━━━━━━━━━━━━━━━━━━━━━━

_Powered by CarZar™_ 🚗`;
    }

    return {
        phone: intPhone,
        message: encodeURIComponent(message),
        url: `https://wa.me/${intPhone}?text=${encodeURIComponent(message)}`
    };
};

/**
 * Generate email HTML template for order status
 */
const generateOrderEmailTemplate = (order, status) => {
    const statusColors = {
        confirmed: '#10B981',
        shipped: '#3B82F6',
        delivered: '#059669',
        cancelled: '#EF4444'
    };

    const statusIcons = {
        confirmed: '✅',
        shipped: '🚚',
        delivered: '📦',
        cancelled: '❌'
    };

    const statusMessages = {
        confirmed: 'Your order has been confirmed and is being processed!',
        shipped: 'Your order is on its way!',
        delivered: 'Your order has been delivered!',
        cancelled: 'Your order has been cancelled.'
    };

    const itemsHtml = order.items.map(item => `
        <tr>
            <td style="padding: 12px; border-bottom: 1px solid #E5E7EB;">${item.title}</td>
            <td style="padding: 12px; border-bottom: 1px solid #E5E7EB; text-align: center;">${item.quantity}</td>
            <td style="padding: 12px; border-bottom: 1px solid #E5E7EB; text-align: right;">PKR ${(item.price * item.quantity).toLocaleString()}</td>
        </tr>
    `).join('');

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #F0FDFA;">
    <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 32px;">
            <div style="background: linear-gradient(135deg, #14B8A6 0%, #0D9488 100%); padding: 24px; border-radius: 16px;">
                <h1 style="color: white; font-size: 28px; margin: 0;">🚗 CarZar</h1>
                <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0; font-size: 14px;">Pakistan's #1 Auto Parts Marketplace</p>
            </div>
        </div>
        
        <!-- Main Card -->
        <div style="background: white; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);">
            <!-- Status Banner -->
            <div style="background: ${statusColors[status] || '#14B8A6'}; padding: 32px; text-align: center;">
                <span style="font-size: 56px;">${statusIcons[status] || '📦'}</span>
                <h2 style="color: white; margin: 20px 0 8px; font-size: 28px; font-weight: 700;">Order ${status.charAt(0).toUpperCase() + status.slice(1)}!</h2>
                <p style="color: rgba(255,255,255,0.95); margin: 0; font-size: 16px;">${statusMessages[status] || ''}</p>
            </div>
            
            <!-- Order Info -->
            <div style="padding: 40px;">
                <p style="color: #374151; font-size: 18px; margin: 0 0 8px;">Assalam-o-Alaikum <strong>${order.customer.fullName}</strong>! 👋</p>
                <p style="color: #6B7280; margin: 0 0 32px; font-size: 16px;">Thank you for shopping with CarZar!</p>
                
                <!-- Order Number -->
                <div style="background: linear-gradient(135deg, #F0FDFA 0%, #ECFDF5 100%); border-radius: 12px; padding: 20px; margin-bottom: 28px; border-left: 4px solid #14B8A6;">
                    <p style="color: #6B7280; margin: 0 0 4px; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Order Number</p>
                    <p style="color: #14B8A6; margin: 0; font-size: 24px; font-weight: 800;">${order.orderNumber}</p>
                </div>
                
                <!-- Items Table -->
                <h3 style="color: #1F2937; margin: 0 0 16px; font-size: 18px; font-weight: 600;">📦 Order Items</h3>
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 28px; background: #FAFAFA; border-radius: 12px; overflow: hidden;">
                    <thead>
                        <tr style="background: #F3F4F6;">
                            <th style="padding: 14px 16px; text-align: left; color: #6B7280; font-size: 13px; font-weight: 600;">Item</th>
                            <th style="padding: 14px 16px; text-align: center; color: #6B7280; font-size: 13px; font-weight: 600;">Qty</th>
                            <th style="padding: 14px 16px; text-align: right; color: #6B7280; font-size: 13px; font-weight: 600;">Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${itemsHtml}
                    </tbody>
                    <tfoot>
                        <tr style="background: #F9FAFB;">
                            <td colspan="2" style="padding: 14px 16px; text-align: right; font-weight: 600; color: #6B7280;">Subtotal:</td>
                            <td style="padding: 14px 16px; text-align: right; color: #374151;">PKR ${order.subtotal.toLocaleString()}</td>
                        </tr>
                        <tr style="background: #F9FAFB;">
                            <td colspan="2" style="padding: 14px 16px; text-align: right; font-weight: 600; color: #6B7280;">Shipping:</td>
                            <td style="padding: 14px 16px; text-align: right; color: #374151;">${order.shipping === 0 ? '🎉 FREE' : 'PKR ' + order.shipping.toLocaleString()}</td>
                        </tr>
                        <tr style="background: linear-gradient(135deg, #14B8A6 0%, #0D9488 100%);">
                            <td colspan="2" style="padding: 16px; text-align: right; font-weight: 700; color: white; font-size: 16px;">Total:</td>
                            <td style="padding: 16px; text-align: right; font-weight: 800; color: white; font-size: 20px;">PKR ${order.total.toLocaleString()}</td>
                        </tr>
                    </tfoot>
                </table>
                
                <!-- Delivery Address -->
                <h3 style="color: #1F2937; margin: 0 0 16px; font-size: 18px; font-weight: 600;">📍 Delivery Address</h3>
                <div style="background: #F9FAFB; border-radius: 12px; padding: 20px; margin-bottom: 32px;">
                    <p style="margin: 0; color: #1F2937; font-weight: 600; font-size: 16px;">${order.customer.fullName}</p>
                    <p style="margin: 6px 0 0; color: #6B7280;">${order.customer.address}</p>
                    <p style="margin: 4px 0 0; color: #6B7280;">${order.customer.city}</p>
                    <p style="margin: 10px 0 0; color: #14B8A6; font-weight: 500;">📱 ${order.customer.phone}</p>
                </div>
                
                <!-- Track Order Button -->
                <div style="text-align: center; margin-top: 36px;">
                    <a href="https://carzar.pk/track/${order.orderNumber}" style="display: inline-block; background: linear-gradient(135deg, #14B8A6 0%, #0D9488 100%); color: white; padding: 18px 40px; border-radius: 12px; text-decoration: none; font-weight: 700; font-size: 16px; box-shadow: 0 4px 15px rgba(13, 148, 136, 0.4);">
                        🔍 Track Your Order
                    </a>
                </div>
            </div>
        </div>
        
        <!-- Footer -->
        <div style="text-align: center; margin-top: 40px; color: #9CA3AF; font-size: 14px;">
            <p style="margin: 0;">Questions? Contact us at <a href="mailto:support@carzar.pk" style="color: #14B8A6; text-decoration: none;">support@carzar.pk</a></p>
            <p style="margin: 8px 0 0;">Or WhatsApp: <a href="https://wa.me/923013890851" style="color: #14B8A6; text-decoration: none;">03013890851</a></p>
            <div style="margin-top: 24px; padding-top: 24px; border-top: 1px solid #E5E7EB;">
                <p style="margin: 0; font-size: 12px;">© 2026 CarZar. All rights reserved.</p>
                <p style="margin: 8px 0 0; font-size: 12px;">Pakistan's #1 Auto Parts Marketplace 🚗</p>
            </div>
        </div>
    </div>
</body>
</html>
    `;
};

/**
 * Generate plain text email
 */
const generateOrderEmailText = (order, status) => {
    return `
═══════════════════════════
        🚗 CARZAR 🚗
═══════════════════════════

ORDER ${status.toUpperCase()}!

Dear ${order.customer.fullName},

Your order #${order.orderNumber} has been ${status}!

━━━━━━━━━━━━━━━━━━━━━━━
ORDER DETAILS
━━━━━━━━━━━━━━━━━━━━━━━

${order.items.map(item => `• ${item.title} × ${item.quantity} = PKR ${(item.price * item.quantity).toLocaleString()}`).join('\n')}

Total: PKR ${order.total.toLocaleString()}

━━━━━━━━━━━━━━━━━━━━━━━
DELIVERY ADDRESS
━━━━━━━━━━━━━━━━━━━━━━━

${order.customer.fullName}
${order.customer.address}
${order.customer.city}
Phone: ${order.customer.phone}

━━━━━━━━━━━━━━━━━━━━━━━

Track your order: https://carzar.pk/track/${order.orderNumber}

For queries: 03013890851

Thank you for shopping with CarZar! ❤️
Pakistan's #1 Auto Parts Marketplace

━━━━━━━━━━━━━━━━━━━━━━━
    `;
};

module.exports = {
    generateCustomerWhatsAppUrl,
    generateOrderEmailTemplate,
    generateOrderEmailText
};
