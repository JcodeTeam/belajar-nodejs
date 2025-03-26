export const generateEmailTemplate = ({
    userName,
    subscriptionName,
    renewalDate,
    planName,
    price,
    paymentMethod,
    accountSettingsLink,
    supportLink,
    daysLeft,
}) => `
<div style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f8f9fa;">
    <table width="100%" cellspacing="0" cellpadding="0" style="background-color: #ffffff; max-width: 600px; margin: auto; border-radius: 10px; box-shadow: 0px 4px 8px rgba(0,0,0,0.1);">

        <!-- Animated Banner -->
        <tr>
            <td style="text-align: center;">
                    <img src="https://media1.tenor.com/m/plCfeoo1bg4AAAAd/marsha-jkt48-marsha.gif" alt="BANNER" style="width: 100%; border-radius: 10px;">
            </td>
        </tr>

        <!-- Email Content -->
        <tr>
            <td style="padding: 30px;">
                <h2 style="color: #333; text-align: center;">Hey <span style="color: #007bff;">${userName}</span>,</h2>
                <p style="font-size: 16px; text-align: center;">Your <strong>${subscriptionName}</strong> subscription will renew on <strong style="color: #007bff;">${renewalDate}</strong>.</p>
                
                <table width="100%" cellspacing="0" cellpadding="10" style="background-color: #f1f1f1; border-radius: 10px; margin-top: 20px;">
                    <tr>
                        <td><strong>Plan:</strong> ${planName}</td>
                    </tr>
                    <tr>
                        <td><strong>Price:</strong> ${price}</td>
                    </tr>
                    <tr>
                        <td><strong>Payment Method:</strong> ${paymentMethod}</td>
                    </tr>
                </table>
                
                <p style="text-align: center; margin-top: 20px;">Want to update your plan? <a href="${accountSettingsLink}" style="color: #007bff; text-decoration: none;">Manage Subscription</a></p>
                
                <p style="text-align: center; margin-top: 10px;">Need assistance? <a href="${supportLink}" style="color: #007bff; text-decoration: none;">Contact Support</a></p>
                
                <p style="text-align: center; margin-top: 30px; font-size: 14px; color: #555;">Best Regards,<br><strong>The SUBSCRIPTION Team</strong></p>
            </td>
        </tr>
        
        <!-- Footer -->
        <tr>
            <td style="background-color: #f1f1f1; padding: 15px; text-align: center; font-size: 12px;">
                <p>SUBSCRIPTION Inc. | 123 Business St, City, Country</p>
                <p><a href="#" style="color: #007bff; text-decoration: none;">Unsubscribe</a> | <a href="#" style="color: #007bff; text-decoration: none;">Privacy Policy</a></p>
            </td>
        </tr>
    </table>
</div>
`;

export const emailTemplates = [
    {
        label: "7 days before reminder",
        generateSubject: (data) =>
            `📅 Reminder: Your ${data.subscriptionName} Subscription Renews in 7 Days!`,
        generateBody: (data) => generateEmailTemplate({ ...data, daysLeft: 7 }),
    },
    {
        label: "5 days before reminder",
        generateSubject: (data) =>
            `⏳ ${data.subscriptionName} Renews in 5 Days – Stay Subscribed!`,
        generateBody: (data) => generateEmailTemplate({ ...data, daysLeft: 5 }),
    },
    {
        label: "2 days before reminder",
        generateSubject: (data) =>
            `🚀 2 Days Left!  ${data.subscriptionName} Subscription Renewal`,
        generateBody: (data) => generateEmailTemplate({ ...data, daysLeft: 2 }),
    },
    {
        label: "1 days before reminder",
        generateSubject: (data) =>
            `⚡ Final Reminder: ${data.subscriptionName} Renews Tomorrow!`,
        generateBody: (data) => generateEmailTemplate({ ...data, daysLeft: 1 }),
    },
];

export const resetPasswordTemplate = {
    resetPassword: ({ name, resetLink }) => ({
        subject: "Reset Password Request",
        body: `
            <p>Halo, ${name}</p>
            <p>Kami menerima permintaan untuk mereset password akun Anda.</p>
            <p>Klik link berikut untuk mereset password Anda:</p>
            <a href="${resetLink}" target="_blank" style="display: inline-block; padding: 10px 15px; background-color: #007BFF; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
            <p>Jika Anda tidak meminta reset password, abaikan email ini.</p>
            <p>Link ini berlaku selama 1 jam.</p>
        `,
    }),

    resetPasswordSuccess: ({ name }) => ({
        subject: "Password Successfully Changed",
        body: `
            <p>Halo, ${name},</p>
            <p>Password akun Anda telah berhasil diubah.</p>
            <p>Jika ini bukan Anda, segera hubungi tim dukungan kami.</p>
            <p>Terima kasih,</p>
            <p>Tim Support</p>
        `,
    }),
    
};


