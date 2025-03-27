import { emailTemplates, resetPasswordTemplate } from './emailTemplate.js';
import dayjs from 'dayjs';
import { EMAIL } from '../config/env.js';
import transporter from '../config/nodemailer.js';

export const sendReminderEmail = async ({ to, type, subscription }) => {
    if (!to || !type) throw new Error('Missing required parameters');

    const template = emailTemplates.find((t) => t.label === type);

    if (!template) throw new Error('Invalid email type');

    const mailInfo = {
        userName: subscription.user.name,
        subscriptionName: subscription.name,
        renewalDate: dayjs(subscription.renewalDate).format('MMM D, YYYY'),
        planName: subscription.name,
        price: `${subscription.currency} ${subscription.price} (${subscription.frequency})`,
        paymentMethod: subscription.paymentMethod,
    }

    const message = template.generateBody(mailInfo);
    const subject = template.generateSubject(mailInfo);

    const mailOptions = {
        from: EMAIL,
        to: to,
        subject: subject,
        html: message,
        // attachments: [
        //     {
        //         filename: "loctrate_logo.jpg",
        //         path: "./public/img/loctrate_logo.jpg",
        //         cid: "logo",
        //     },
        // ],
    }

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) return console.log(error, 'Error sending email');

        console.log('Email sent: ' + info.response);
    })
};

export const sendResetPasswordEmail = async ({ name, email, resetLink, isSuccess = false }) => {
    try {

        // Ambil template email
        const template = isSuccess
            ? resetPasswordTemplate.resetPasswordSuccess({ name })
            : resetPasswordTemplate.resetPassword({ name, resetLink });

        const mailOptions = {
            from: EMAIL,
            to: email,
            subject: template.subject,
            html: template.body,
        };

        // Kirim email
        await transporter.sendMail(mailOptions);
        console.log(`✅ ${isSuccess ? "Reset password success" : "Reset password request"} email sent to ${email}`);


    } catch (error) {
        console.error(`❌ Error sending reset password email: ${error.message}`);
    }
};

