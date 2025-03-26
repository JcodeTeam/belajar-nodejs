export const emailTemplates = {
    resetPassword: ({ resetLink }) => ({
        subject: "Reset Password Request",
        body: `
            <p>Halo,</p>
            <p>Kami menerima permintaan untuk mereset password akun Anda.</p>
            <p>Klik link berikut untuk mereset password Anda:</p>
            <a href="${resetLink}" target="_blank" style="display: inline-block; padding: 10px 15px; background-color: #007BFF; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
            <p>Jika Anda tidak meminta reset password, abaikan email ini.</p>
            <p>Link ini berlaku selama 1 jam.</p>
        `,
    })
};
