const SibApiV3Sdk = require('sib-api-v3-sdk');

// Configure Brevo client
const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKeyAuth = defaultClient.authentications['api-key'];
apiKeyAuth.apiKey = process.env.BREVO_API_KEY;

// Generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP Email
const sendOTPEmail = async (email, otp) => {
  try {
    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    sendSmtpEmail.subject = 'Your Restaurant Account Verification OTP';
    sendSmtpEmail.htmlContent = `
      <!DOCTYPE html>
      <html>
      <body style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h1 style="color: #333; text-align: center;">Welcome!</h1>
          <p style="color: #666; font-size: 16px; line-height: 1.6;">
            Thank you for signing up at our restaurant. To verify your email and complete your registration, please use the OTP below:
          </p>
          <div style="background-color: #f9f9f9; border: 2px solid #ddd; padding: 20px; margin: 20px 0; text-align: center; border-radius: 4px;">
            <p style="font-size: 14px; color: #666; margin: 0;">Your Verification Code:</p>
            <p style="font-size: 32px; font-weight: bold; color: #4CAF50; margin: 10px 0;">${otp}</p>
            <p style="font-size: 12px; color: #999; margin: 10px 0;">This code will expire in 10 minutes</p>
          </div>
          <p style="color: #666; font-size: 14px; line-height: 1.6;">
            If you didn't sign up for this account, please ignore this email.
          </p>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
          <p style="color: #999; font-size: 12px; text-align: center;">
            © 2026 Restaurant Project. All rights reserved.
          </p>
        </div>
      </body>
      </html>
    `;
    sendSmtpEmail.sender = {
      name: 'Restaurant Project',
      email: 'yashi83yadav@gmail.com'
    };
    sendSmtpEmail.to = [{ email: email }];
    
    const result = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('✓ OTP email sent successfully:', result.messageId);
    return result;
  } catch (error) {
    console.error('✗ Error sending OTP email:', error.message);
    throw new Error('Failed to send OTP email');
  }
};

// Send Booking Confirmation Email
const sendBookingConfirmationEmail = async (email, bookingDetails) => {
  try {
    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    sendSmtpEmail.subject = 'Booking Confirmation - ' + bookingDetails.confirmationNumber;
    sendSmtpEmail.htmlContent = `
      <!DOCTYPE html>
      <html>
      <body style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h1 style="color: #333; text-align: center;">Booking Confirmed! ✓</h1>
          <p style="color: #666; font-size: 16px;">Hello ${bookingDetails.guestName},</p>
          <p style="color: #666; font-size: 14px;">Thank you for booking a table with us!</p>
          
          <div style="background-color: #f0f7ff; border-left: 4px solid #4CAF50; padding: 15px; margin: 20px 0;">
            <h2 style="color: #333; margin-top: 0;">Reservation Details</h2>
            <p style="margin: 8px 0;"><strong>Confirmation #:</strong> ${bookingDetails.confirmationNumber}</p>
            <p style="margin: 8px 0;"><strong>Date:</strong> ${new Date(bookingDetails.reservationDate).toLocaleDateString()}</p>
            <p style="margin: 8px 0;"><strong>Time:</strong> ${bookingDetails.reservationTime}</p>
            <p style="margin: 8px 0;"><strong>Party Size:</strong> ${bookingDetails.numberOfGuests} guests</p>
            <p style="margin: 8px 0;"><strong>Duration:</strong> ${bookingDetails.duration} minutes</p>
          </div>
          
          <p style="color: #666; font-size: 14px;">We look forward to welcoming you!</p>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
          <p style="color: #999; font-size: 12px; text-align: center;">
            © 2026 Restaurant Project. All rights reserved.
          </p>
        </div>
      </body>
      </html>
    `;
    sendSmtpEmail.sender = {
      name: 'Restaurant Project',
      email: process.env.BREVO_SENDER_EMAIL || 'yashi83yadav@gmail.com'
    };
    sendSmtpEmail.to = [{ email: email }];
    
    const result = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('✓ Booking confirmation email sent:', result.messageId);
    return result;
  } catch (error) {
    console.error('✗ Error sending booking confirmation:', error.message);
    throw new Error('Failed to send booking confirmation email');
  }
};

module.exports = {
  generateOTP,
  sendOTPEmail,
  sendBookingConfirmationEmail
};
