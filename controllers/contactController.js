const Contact = require('../models/Contact');
const axios = require('axios');

// Brevo Email Service
const BREVO_API_KEY = process.env.BREVO_API_KEY;
const ADMIN_EMAIL = 'yashi83yadav@gmail.com'; // Your email

const sendBREVOEmail = async (recipientEmail, recipientName, subject, htmlContent) => {
  try {
    const response = await axios.post(
      'https://api.brevo.com/v3/smtp/email',
      {
        to: [{ email: recipientEmail, name: recipientName }],
        sender: { email: ADMIN_EMAIL, name: 'Restaurant Support' },
        subject,
        htmlContent
      },
      {
        headers: {
          'api-key': BREVO_API_KEY,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Brevo email error:', error.response?.data || error.message);
    throw error;
  }
};

// Create new contact form submission
exports.createContact = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    // Validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, email, subject, message'
      });
    }

    // Create contact
    const contact = new Contact({
      name,
      email,
      phone,
      subject,
      message
    });

    await contact.save();

    // TODO: Send email notification to admin
    console.log(`📧 New contact submission from ${email}`);

    res.status(201).json({
      success: true,
      message: 'Your message has been received. We\'ll get back to you soon!',
      contactId: contact._id
    });
  } catch (error) {
    console.error('Error creating contact:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting form',
      error: error.message
    });
  }
};

// Get all contacts (Admin only)
exports.getAllContacts = async (req, res) => {
  try {
    const { status, limit = 20, page = 1 } = req.query;

    const query = status ? { status } : {};
    const skip = (page - 1) * limit;

    const contacts = await Contact.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Contact.countDocuments(query);

    res.status(200).json({
      success: true,
      count: contacts.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      contacts
    });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching contacts',
      error: error.message
    });
  }
};

// Get single contact (Admin only)
exports.getContact = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    // Mark as read if it's new
    if (contact.status === 'new') {
      contact.status = 'read';
      await contact.save();
    }

    res.status(200).json({
      success: true,
      contact
    });
  } catch (error) {
    console.error('Error fetching contact:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching contact',
      error: error.message
    });
  }
};

// Update contact status (Admin only)
exports.updateContactStatus = async (req, res) => {
  try {
    const { status, adminNotes } = req.body;

    if (!['new', 'read', 'replied', 'archived'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be: new, read, replied, or archived'
      });
    }

    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      {
        status,
        adminNotes: adminNotes || contact?.adminNotes,
        repliedAt: status === 'replied' ? Date.now() : null
      },
      { new: true }
    );

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Contact status updated',
      contact
    });
  } catch (error) {
    console.error('Error updating contact:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating contact',
      error: error.message
    });
  }
};

// Get contact stats (Admin Dashboard)
exports.getContactStats = async (req, res) => {
  try {
    const stats = {
      new: await Contact.countDocuments({ status: 'new' }),
      read: await Contact.countDocuments({ status: 'read' }),
      replied: await Contact.countDocuments({ status: 'replied' }),
      archived: await Contact.countDocuments({ status: 'archived' }),
      total: await Contact.countDocuments()
    };

    // Get recent contacts
    const recent = await Contact.find()
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      stats,
      recentContacts: recent
    });
  } catch (error) {
    console.error('Error fetching contact stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching contact stats',
      error: error.message
    });
  }
};

// Delete contact (Admin only)
exports.deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Contact deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting contact:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting contact',
      error: error.message
    });
  }
};

// Send reply email to user (Admin only)
exports.sendReplyEmail = async (req, res) => {
  try {
    const { contactId } = req.params;
    const { replyMessage } = req.body;

    if (!replyMessage || replyMessage.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Please provide a reply message'
      });
    }

    // Find the contact
    const contact = await Contact.findById(contactId);
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    // Send email to user
    const emailHTML = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #436270;">We've Responded to Your Message</h2>
        <p>Hi ${contact.name},</p>
        
        <p>Thank you for reaching out to us. Here's our response to your inquiry:</p>
        
        <div style="background-color: #f4f4f4; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #436270;">
          <p style="margin: 0;"><strong>Your Message:</strong></p>
          <p style="margin: 10px 0; color: #666;">${contact.message}</p>
          
          <p style="margin: 15px 0; margin-top: 20px;"><strong>Our Reply:</strong></p>
          <p style="margin: 10px 0;">${replyMessage}</p>
        </div>

        <p>If you have any further questions, feel free to contact us again.</p>
        
        <p style="color: #999; font-size: 14px; margin-top: 30px;">
          Best regards,<br/>
          <strong>Restaurant Support Team</strong><br/>
          ${ADMIN_EMAIL}
        </p>
      </div>
    `;

    await sendBREVOEmail(
      contact.email,
      contact.name,
      `Re: ${contact.subject}`,
      emailHTML
    );

    // Update contact status to replied
    contact.status = 'replied';
    contact.adminNotes = replyMessage;
    contact.repliedAt = Date.now();
    await contact.save();

    console.log(`✓ Reply sent to ${contact.email} for contact ID: ${contactId}`);

    res.status(200).json({
      success: true,
      message: 'Reply sent successfully to ' + contact.email,
      contact
    });
  } catch (error) {
    console.error('Error sending reply:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending reply',
      error: error.message
    });
  }
};
