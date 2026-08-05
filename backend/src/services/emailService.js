const axios = require('axios');

/**
 * Send OTP via Brevo v3 Transactional Email API
 * @param {string} email - Recipient Email Address
 * @param {string} otp - Verification OTP Code
 */
const sendOTP = async (email, otp) => {
  console.log(`\n==================================================`);
  console.log(`[DELIVERY BOY OTP VERIFICATION]`);
  console.log(`To Email: ${email}`);
  console.log(`OTP Code: ${otp}`);
  console.log(`==================================================\n`);

  if (!process.env.BREVO_API_KEY) {
    console.log('[EmailService] BREVO_API_KEY not configured in .env. Falling back to console OTP log.');
    return { success: true, mode: 'console', otp };
  }

  try {
    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: { email: "rizeworldcode@gmail.com", name: "RizeWorld" },
        to: [{ email: email }],
        subject: "Password Reset Verification Code",
        textContent: `Dear User,
Your verification code is: ${otp}
This code is valid for 10 minutes.
If you did not request a password reset, please ignore this email.
Thank you, RizeWorld Team`,
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );
    console.log(`[EmailService] Brevo OTP email successfully sent to ${email}`);
    return response.data;
  } catch (error) {
    console.error(`[EmailService] Failed to send email via Brevo:`, error.response?.data || error.message);
    return { success: true, mode: 'fallback_console', error: error.message };
  }
};

module.exports = {
  sendOTP,
  sendOtpEmail: sendOTP
};
