import nodemailer from 'nodemailer';

// Create reusable transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'Reachoutpro.ai@gmail.com',
      pass: 'fhtkcqbdluziedjm',
    },
  });
};

// Email templates
const emailTemplates = {
  referralCode: (data) => ({
    subject: 'Your Referral Code - DocAlert',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your Referral Code</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            color: #333333;
            background-color: #ffffff;
            padding: 40px 20px;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
          }
          .header {
            text-align: center;
            margin-bottom: 40px;
          }
          .logo {
            font-size: 24px;
            font-weight: 600;
            color: #333333;
            margin-bottom: 20px;
          }
          .title {
            font-size: 28px;
            font-weight: 700;
            color: #333333;
            margin-bottom: 16px;
          }
          .message {
            font-size: 16px;
            color: #666666;
            margin-bottom: 40px;
            line-height: 1.5;
          }
          .referral-code {
            background-color: #ffffff;
            border: 2px solid #e5e5e5;
            border-radius: 8px;
            padding: 30px;
            text-align: center;
            margin: 40px 0;
          }
          .code-value {
            font-size: 36px;
            font-weight: 700;
            color: #333333;
            letter-spacing: 4px;
            font-family: 'Courier New', monospace;
            margin-bottom: 16px;
          }
          .code-subtitle {
            font-size: 14px;
            color: #666666;
          }
          .info-section {
            margin: 40px 0;
          }
          .info-item {
            display: flex;
            justify-content: space-between;
            padding: 12px 0;
            border-bottom: 1px solid #f0f0f0;
          }
          .info-item:last-child {
            border-bottom: none;
          }
          .info-label {
            font-weight: 500;
            color: #333333;
          }
          .info-value {
            color: #666666;
          }
          .usage-guide {
            margin: 40px 0;
            padding: 24px;
            background-color: #f9f9f9;
            border-radius: 8px;
          }
          .usage-title {
            font-size: 18px;
            font-weight: 600;
            color: #333333;
            margin-bottom: 16px;
          }
          .usage-steps {
            list-style: none;
            padding: 0;
          }
          .usage-steps li {
            padding: 8px 0;
            color: #666666;
            position: relative;
            padding-left: 24px;
          }
          .usage-steps li:before {
            content: "•";
            color: #333333;
            font-weight: bold;
            position: absolute;
            left: 0;
          }
          .cta-section {
            text-align: center;
            margin: 40px 0;
          }
          .cta-button {
            display: inline-block;
            background-color: #333333;
            color: white !important;
            padding: 14px 28px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 500;
            font-size: 16px;
            transition: background-color 0.3s ease;
          }
          .cta-button:hover {
            background-color: #555555;
          }
          .footer {
            text-align: center;
            margin-top: 50px;
            padding-top: 30px;
            border-top: 1px solid #e5e5e5;
          }
          .footer-text {
            color: #999999;
            font-size: 14px;
            margin-bottom: 8px;
          }
          .copyright {
            color: #cccccc;
            font-size: 12px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">DocAlert</div>
            <div class="title">Referral Code</div>
            <div class="message">
              Hello ${data.doctorName || 'Doctor'}, your unique referral code has been generated successfully.
            </div>
          </div>
          
          <div class="referral-code">
            <div class="code-value">${data.code}</div>
            <div class="code-subtitle">To protect your account, do not share this code publicly.</div>
          </div>
          
          <div class="info-section">
            <div class="info-item">
              <span class="info-label">Doctor Name:</span>
              <span class="info-value">${data.doctorName || 'Not specified'}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Valid Until:</span>
              <span class="info-value">${(() => {
        const d = new Date(data.validUntil);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        return `${day}/${month}/${year}`;
      })()
      }</span>
            </div>
            <div class="info-item">
              <span class="info-label">Status:</span>
              <span class="info-value">Active</span>
            </div>
          </div>
          
          <div class="usage-guide">
            <div class="usage-title">How to use:</div>
            <ul class="usage-steps">
              <li>Go to our website and log in to your account.</li>
              <li>After logging in, locate the section to enter your referral code.</li>
              <li>Enter your code and click the "Activate Now" button to apply it.</li>
              <li>Please note: This code is valid only until the specified expiration date.</li>
            </ul>
          </div>
          
          <div class="cta-section">
            <a href="https://www.docalert.in" class="cta-button">Visit DocAlert</a>
          </div>
          
          <div class="footer">
            <div class="footer-text">Thank you for being part of our healthcare community</div>
            <div class="copyright">&copy; ${new Date().getFullYear()} DocAlert. All rights reserved.</div>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Your Referral Code - DocAlert
      
      Hello ${data.doctorName || 'there'},
      
      Your referral code has been generated successfully: ${data.code}
      
      Doctor Name: ${data.doctorName || 'Not specified'}
      Valid Until: ${new Date(data.validUntil).toLocaleDateString()}
      Status: Active
      
      How to use:
      - Go to our website and log in to your account.
      - After logging in, locate the section to enter your referral code.
      - Enter your code and click the "Activate Now" button to apply it.
      - Please note: This code is valid only until the specified expiration date.
      
      Visit: https://www.docalert.in
      
      Thank you for being part of our healthcare community!
    `
  }),

  passwordReset: (data) => ({
    subject: 'Reset Your Password - DocAlert',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your Password</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            color: #333333;
            background-color: #ffffff;
            padding: 40px 20px;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
          }
          .header {
            text-align: center;
            margin-bottom: 40px;
          }
          .logo {
            font-size: 24px;
            font-weight: 600;
            color: #333333;
            margin-bottom: 20px;
          }
          .title {
            font-size: 28px;
            font-weight: 700;
            color: #333333;
            margin-bottom: 16px;
          }
          .message {
            font-size: 16px;
            color: #666666;
            margin-bottom: 40px;
            line-height: 1.5;
          }
          .cta-section {
            text-align: center;
            margin: 40px 0;
          }
          .cta-button {
            display: inline-block;
            background-color: #dc3545;
            color: white !important;
            padding: 14px 28px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 500;
            font-size: 16px;
            transition: background-color 0.3s ease;
          }
          .cta-button:hover {
            background-color: #c82333;
          }
          .security-notice {
            background-color: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 6px;
            padding: 20px;
            margin: 30px 0;
            color: #856404;
            font-size: 14px;
            text-align: center;
          }
          .expiry-notice {
            font-size: 14px;
            color: #666666;
            margin-top: 30px;
            text-align: center;
            font-style: italic;
          }
          .footer {
            text-align: center;
            margin-top: 50px;
            padding-top: 30px;
            border-top: 1px solid #e5e5e5;
          }
          .footer-text {
            color: #999999;
            font-size: 14px;
            margin-bottom: 8px;
          }
          .copyright {
            color: #cccccc;
            font-size: 12px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">DocAlert</div>
            <div class="title">Reset Your Password</div>
            <div class="message">
              We received a request to reset your password for your DocAlert account. Click the button below to create a new password.
            </div>
          </div>
          
          <div class="cta-section">
            <a href="https://www.docalert.in/reset-password/${data.link}" class="cta-button">Reset Password</a>
          </div>
          
          <div class="security-notice">
            <strong>Didn't request this?</strong><br>
            If you didn't request this password reset, you can safely ignore this email. Your account remains secure.
          </div>
          
          <div class="expiry-notice">
            This reset link will expire in 1 hour for your security.
          </div>
          
          <div class="footer">
            <div class="footer-text">Thank you for using DocAlert</div>
            <div class="copyright">&copy; ${new Date().getFullYear()} DocAlert. All rights reserved.</div>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `Reset Your Password - DocAlert

Hello,

We received a request to reset your password for your DocAlert account.

Please reset your password using this link: https://www.docalert.in/reset-password/${data.link}

If you didn't request this password reset, please ignore this email.

This link will expire in 1 hour for security reasons.

Thank you for using DocAlert!`
  })
};

// Main send email function
export const sendEmail = async (to, templateName, data) => {
  try {
    const transporter = createTransporter();
    const template = emailTemplates[templateName];

    if (!template) {
      throw new Error(`Email template '${templateName}' not found`);
    }

    const emailContent = template(data);

    const mailOptions = {
      from: 'Reachoutpro.ai@gmail.com',
      to: to,
      subject: emailContent.subject,
      // text: emailContent.text,
      html: emailContent.html,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully:', result.messageId);
    return result;
  } catch (error) {
    console.error('❌ Email send failed:', error.message);
    throw error;
  }
};

// Specific email functions for backward compatibility
export const sendReferralEmail = async (email, data) => {
  return sendEmail(email, 'referralCode', data);
};

export const sendPasswordResetEmail = async (email, link) => {
  return sendEmail(email, 'passwordReset', { link });
};

// Legacy function for backward compatibility
export const resetMail = async (email, link) => {
  return sendPasswordResetEmail(email, link);
};
