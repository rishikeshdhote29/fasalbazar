const nodemailer= require('nodemailer');
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // use STARTTLS (upgrade connection to TLS after connecting)
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.APP_PASSWORD,
  },
});


exports.sendOrderCancellationEmail = async (recipientEmail, newOrder) => {
  try {
      console.log("order details ",newOrder);
      // Convert Mongoose document to plain object
      const orderObj = newOrder.toObject ? newOrder.toObject() : newOrder;
      
    const info = await transporter.sendMail({
    
      from: '"Fasal Bazar" <team@example.com>',
      to: recipientEmail,
      subject: "Order Cancelation - Fasal Bazar",
      text: `Your order ${orderObj.orderId} has been calcelled successfully.`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2 style="color: #2e6c80;">Order Cancelation</h2>
          <p>Thank you for shopping with <strong>Fasal Bazar</strong>!</p>
          
           <h3>Order Details</h3>
           <ul>
             <li><strong>Order ID:</strong> ${orderObj.orderId}</li>
             <li><strong>Status:</strong> ${orderObj.status}</li>
             <li><strong>Order Date:</strong> ${new Date(orderObj.orderDate).toLocaleString()}</li>
             <li><strong>Tracking ID:</strong> ${orderObj.trackingId}</li>
             <li><strong>Payment Method:</strong> ${orderObj.paymentMethod || 'Online Payment'}</li>
           </ul>
          
            <h3>Product Details</h3>
            <ul>
              <li><strong>Product ID:</strong> ${orderObj.product}</li>
              <li><strong>Quantity:</strong> ${orderObj.quantity}</li>
              <li><strong>Total Amount:</strong> ₹${orderObj.amount}</li>
            </ul>
           
            <h3>Shipping Address</h3>
            <p>
             Address: ${orderObj.address || 'Address not provided'}<br/>
              Pincode: ${orderObj.pincode || 'Not provided'}
            </p>
          
          <p style="margin-top:20px;">shop again </p>
          <p>— Team Fasal Bazar</p>
        </div>
      `,
    });

    console.log("Message sent: %s", info.messageId);
  } catch (err) {
    console.error("Error while sending mail:", err);
  }
};
