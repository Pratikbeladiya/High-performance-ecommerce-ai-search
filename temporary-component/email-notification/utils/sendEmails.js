const transporter = require("../config/emailConfig");

const sendEmail = async (to, subject, html) => {
    try {
        const info = await transporter.sendMail({
            from: `"VectorCommerce" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html,
        });

        console.log("Email Sent:", info.messageId);

    } catch (err) {
        console.log(err);
    }
};

module.exports = sendEmail;