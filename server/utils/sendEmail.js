const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'rjagathe@drillmasters.in',       // your Google Workspace main email
    pass: 'kdcnpvrmfhewptaw'                // your App Password from Google
  }
});

function sendConfirmationEmail(toEmail, confirmationUrl) {
  return transporter.sendMail({
    from: '"Acharya108 Admin" <admin@acharya108.com>', // Your desired visible sender (alias)
    to: toEmail,
    subject: "Confirm your Acharya108 account",
    html: `
      <h2>Welcome to Acharya108 LMS!</h2>
      <p>Click below to confirm your email address:</p>
      <a href="${confirmationUrl}">${confirmationUrl}</a>
      <p>If you did not request this, please ignore.</p>
    `
  });
}

module.exports = sendConfirmationEmail;
