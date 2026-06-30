import nodemailer from "nodemailer";

// Cache the transporter instance
let transporter = null;

/**
 * Lazily initializes and returns the nodemailer SMTP transporter.
 * Verifies connection on creation.
 */
const getTransporter = async () => {
  if (transporter) return transporter;

  const { EMAIL_USER, EMAIL_PASS } = process.env;

  if (!EMAIL_USER || !EMAIL_PASS) {
    console.error("❌ Email configuration missing. Please verify EMAIL_USER and EMAIL_PASS in your environment.");
    return null;
  }

  try {
    const freshTransporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
      },
    });

    // Test the SMTP connection parameters
    await freshTransporter.verify();
    console.log("✅ Email SMTP Connection Verified Successfully");
    
    transporter = freshTransporter;
    return transporter;
  } catch (error) {
    console.error("❌ SMTP Verification Failed:", error.message);
    return null;
  }
};

/**
 * Sends a beautifully designed HTML notification to the administrator.
 * @param {Object} contactDetails - The details of the contact submission.
 * @param {string} contactDetails.name - Name of the sender.
 * @param {string} contactDetails.email - Email of the sender.
 * @param {string} contactDetails.message - Message content.
 */
export const sendAdminNotification = async ({ name, email, message }) => {
  const adminEmail = process.env.CONTACT_EMAIL || process.env.EMAIL_USER;
  if (!adminEmail) {
    console.warn("⚠️ Cannot send notification: CONTACT_EMAIL or EMAIL_USER not specified.");
    return;
  }

  const client = await getTransporter();
  if (!client) {
    console.warn("⚠️ Transporter not initialized. Admin notification skipped.");
    return;
  }

  const formattedDate = new Date().toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  const mailOptions = {
    from: `"Portfolio Contact Service" <${process.env.EMAIL_USER}>`,
    to: adminEmail,
    subject: `📬 New message from ${name} via Portfolio`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Message Received</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');
            body {
              font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
              margin: 0;
              padding: 0;
              background-color: #f1f5f9;
              color: #1e293b;
              -webkit-font-smoothing: antialiased;
            }
            .wrapper {
              width: 100%;
              table-layout: fixed;
              background-color: #f1f5f9;
              padding: 40px 0;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
              border-radius: 16px;
              overflow: hidden;
              box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05), 0 10px 15px -3px rgba(0, 0, 0, 0.03);
            }
            .header {
              background: linear-gradient(135deg, #10b981 0%, #06b6d4 100%);
              padding: 40px 20px;
              text-align: center;
            }
            .header-icon {
              font-size: 40px;
              margin-bottom: 10px;
            }
            .header h1 {
              color: #ffffff;
              margin: 0;
              font-size: 24px;
              font-weight: 700;
              letter-spacing: -0.025em;
            }
            .content {
              padding: 32px 24px;
            }
            .meta-card {
              background-color: #f8fafc;
              border-radius: 12px;
              padding: 20px;
              margin-bottom: 24px;
              border: 1px solid #e2e8f0;
            }
            .meta-row {
              margin-bottom: 12px;
            }
            .meta-row:last-child {
              margin-bottom: 0;
            }
            .meta-label {
              font-size: 11px;
              text-transform: uppercase;
              letter-spacing: 0.1em;
              color: #64748b;
              font-weight: 600;
              margin-bottom: 4px;
            }
            .meta-val {
              font-size: 16px;
              color: #0f172a;
              font-weight: 500;
            }
            .meta-val a {
              color: #10b981;
              text-decoration: none;
            }
            .message-card {
              border-left: 4px solid #10b981;
              background-color: #f0fdf4;
              border-radius: 4px 12px 12px 4px;
              padding: 20px;
              margin-bottom: 28px;
            }
            .message-text {
              font-size: 15px;
              line-height: 1.6;
              color: #334155;
              white-space: pre-wrap;
              margin: 0;
            }
            .btn-container {
              text-align: center;
              margin-bottom: 8px;
            }
            .btn {
              display: inline-block;
              background: linear-gradient(135deg, #10b981 0%, #059669 100%);
              color: #ffffff !important;
              padding: 14px 32px;
              border-radius: 12px;
              text-decoration: none;
              font-weight: 600;
              font-size: 14px;
              box-shadow: 0 4px 6px -1px rgba(16, 185, 129, 0.2), 0 2px 4px -2px rgba(16, 185, 129, 0.2);
              transition: all 0.2s ease;
            }
            .footer {
              padding: 24px;
              text-align: center;
              font-size: 13px;
              color: #94a3b8;
              background-color: #f8fafc;
              border-top: 1px solid #e2e8f0;
            }
          </style>
        </head>
        <body>
          <div class="wrapper">
            <div class="container">
              <div class="header">
                <div class="header-icon">📬</div>
                <h1>New Message Received</h1>
              </div>
              <div class="content">
                <div class="meta-card">
                  <div class="meta-row">
                    <div class="meta-label">From</div>
                    <div class="meta-val">${name}</div>
                  </div>
                  <div class="meta-row">
                    <div class="meta-label">Email</div>
                    <div class="meta-val"><a href="mailto:${email}">${email}</a></div>
                  </div>
                  <div class="meta-row">
                    <div class="meta-label">Received At</div>
                    <div class="meta-val" style="color: #64748b; font-size: 14px;">${formattedDate}</div>
                  </div>
                </div>
                
                <div class="meta-label" style="margin-left: 4px; margin-bottom: 8px;">Message Content</div>
                <div class="message-card">
                  <p class="message-text">${message}</p>
                </div>
                
                <div class="btn-container">
                  <a href="mailto:${email}?subject=Re: Portfolio Contact" class="btn">Reply to ${name}</a>
                </div>
              </div>
              <div class="footer">
                This is an automated notification from your Portfolio contact form service.
              </div>
            </div>
          </div>
        </body>
      </html>
    `,
  };

  try {
    await client.sendMail(mailOptions);
    console.log(`📧 Admin notification email sent to ${adminEmail}`);
  } catch (error) {
    console.error("❌ Failed to send admin notification email:", error.message);
  }
};

/**
 * Sends a beautifully styled confirmation auto-reply email to the sender.
 * @param {Object} contactDetails - The details of the contact submission.
 * @param {string} contactDetails.name - Name of the sender.
 * @param {string} contactDetails.email - Email of the sender.
 * @param {string} contactDetails.message - Message content.
 */
export const sendUserAutoReply = async ({ name, email, message }) => {
  const client = await getTransporter();
  if (!client) {
    console.warn("⚠️ Transporter not initialized. Auto-reply email skipped.");
    return;
  }

  const portfolioUrl = process.env.CORS_ORIGIN || "https://yourportfolio.com";

  const mailOptions = {
    from: `"Portfolio Contact Service" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `⚡ Thanks for reaching out, ${name}!`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Thanks for reaching out!</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');
            body {
              font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
              margin: 0;
              padding: 0;
              background-color: #f1f5f9;
              color: #1e293b;
              -webkit-font-smoothing: antialiased;
            }
            .wrapper {
              width: 100%;
              table-layout: fixed;
              background-color: #f1f5f9;
              padding: 40px 0;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
              border-radius: 16px;
              overflow: hidden;
              box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05), 0 10px 15px -3px rgba(0, 0, 0, 0.03);
            }
            .header {
              background: linear-gradient(135deg, #10b981 0%, #6366f1 100%);
              padding: 40px 20px;
              text-align: center;
            }
            .header-icon {
              font-size: 40px;
              margin-bottom: 10px;
            }
            .header h1 {
              color: #ffffff;
              margin: 0;
              font-size: 24px;
              font-weight: 700;
              letter-spacing: -0.025em;
            }
            .content {
              padding: 32px 24px;
            }
            .salutation {
              font-size: 18px;
              font-weight: 600;
              color: #0f172a;
              margin-bottom: 12px;
            }
            .intro-text {
              font-size: 15px;
              line-height: 1.6;
              color: #475569;
              margin-bottom: 24px;
            }
            .copy-header {
              font-size: 11px;
              text-transform: uppercase;
              letter-spacing: 0.1em;
              color: #64748b;
              font-weight: 600;
              margin-bottom: 8px;
              margin-left: 4px;
            }
            .message-card {
              border-left: 4px solid #6366f1;
              background-color: #f5f3ff;
              border-radius: 4px 12px 12px 4px;
              padding: 20px;
              margin-bottom: 28px;
            }
            .message-text {
              font-size: 14px;
              line-height: 1.6;
              color: #4c1d95;
              white-space: pre-wrap;
              margin: 0;
              font-style: italic;
            }
            .btn-container {
              text-align: center;
              margin: 24px 0 8px;
            }
            .btn {
              display: inline-block;
              background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
              color: #ffffff !important;
              padding: 14px 32px;
              border-radius: 12px;
              text-decoration: none;
              font-weight: 600;
              font-size: 14px;
              box-shadow: 0 4px 6px -1px rgba(99, 102, 241, 0.2), 0 2px 4px -2px rgba(99, 102, 241, 0.2);
              transition: all 0.2s ease;
            }
            .footer {
              padding: 24px;
              text-align: center;
              font-size: 12px;
              color: #94a3b8;
              background-color: #f8fafc;
              border-top: 1px solid #e2e8f0;
            }
            .footer a {
              color: #6366f1;
              text-decoration: none;
            }
          </style>
        </head>
        <body>
          <div class="wrapper">
            <div class="container">
              <div class="header">
                <div class="header-icon">⚡</div>
                <h1>Thank You!</h1>
              </div>
              <div class="content">
                <div class="salutation">Hi ${name},</div>
                <div class="intro-text">
                  Thank you for reaching out and connecting with me! I have received your message and will review it as soon as possible. You can typically expect a response within 24 hours.
                </div>
                
                <div class="copy-header">Copy of Your Message</div>
                <div class="message-card">
                  <p class="message-text">"${message}"</p>
                </div>
                
                <div class="intro-text" style="margin-bottom: 12px;">
                  In the meantime, feel free to head back to my portfolio site or check out my work across social platforms.
                </div>

                <div class="btn-container">
                  <a href="${portfolioUrl}" class="btn">Return to Portfolio</a>
                </div>
              </div>
              <div class="footer">
                Sent from <a href="${portfolioUrl}">Sicky Kumar's Portfolio</a>. Please do not reply directly to this message.
              </div>
            </div>
          </div>
        </body>
      </html>
    `,
  };

  try {
    await client.sendMail(mailOptions);
    console.log(`📧 Confirmation auto-reply email sent to ${email}`);
  } catch (error) {
    console.error("❌ Failed to send auto-reply email:", error.message);
  }
};
