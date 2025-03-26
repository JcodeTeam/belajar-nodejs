import { EMAIL, SERVER_URL, JWT_SECRET } from '../config/env.js';
import transporter from '../config/nodemailer.js';
import jwt from 'jsonwebtoken';
import { emailTemplates } from './resetPasswordTemplate.js';

export const sendResetPasswordEmail = async ({ email, userId }) => {
    try {

        const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '1h' });

        // Buat link reset password
        const resetLink = `${SERVER_URL}/reset-password/${token}`;

        // Ambil template email
        const template = emailTemplates.resetPassword({ resetLink });

        const mailOptions = {
            from: EMAIL,
            to: email,
            subject: template.subject,
            html: template.body,
        };

        // Kirim email
        await transporter.sendMail(mailOptions);
        console.log(`✅ Reset password email sent to ${email}`);
        
    } catch (error) {
        console.error(`❌ Error sending reset password email: ${error.message}`);
    }
};
