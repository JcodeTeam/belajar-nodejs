import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import otpGenerator from 'otp-generator';
import User from "../models/userModel.js";
import { JWT_SECRET, JWT_EXPIRES_IN, SERVER_URL, FRONTEND_URL } from "../config/env.js";
import { sendResetPasswordEmail, sendOTPEmail, sendWelcomeEmail } from "../utils/sendEmail.js"


export const signup = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email: email });

        if (existingUser) {

            if (existingUser.isVerified) {
                return res.status(409).json({ success: false, message: "Akun sudah terverifikasi. Silakan login." });
            }
            
            // Jika OTP belum expired, jangan kirim OTP lagi
            if (existingUser.otpExpires && new Date() < existingUser.otpExpires) {
                return res.status(400).json({ success: false, message: "OTP masih berlaku, silakan periksa email Anda." });
            }

            // Generate OTP baru dan update
            const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false });
            existingUser.otp = otp;
            existingUser.otpExpires = new Date(Date.now() + 10 * 60000); // OTP berlaku 10 menit
            await existingUser.save();

            await sendOTPEmail(email, otp);

            return res.status(200).json({ success: true, message: "Kode OTP telah dikirim ulang ke email Anda. Silakan verifikasi." });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            specialChars: false
        });

        const otpExpires = new Date(Date.now() + 10 * 60000);

        const newUser = await User.create([{
            name, email, password: hashedPassword, 
            otp, otpExpires,
            isVerified: false }], 
            { session }
        );

        await sendOTPEmail(email, otp);

 
        await session.commitTransaction();
        session.endSession();

        res.status(201).json({ success: true, message: "Kode OTP telah dikirim ke email Anda. Silakan verifikasi.", data: { user: newUser[0] } });

    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        next(err);
    }
}

export const signin = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email })
        
        if (!user) {
            return res.status(401).json({ success: false, message: "User tidak ditemukan" });
        }

        if (!user.isVerified) {
            return res.status(400).json({ success: false, message: "Akun Anda belum diverifikasi. Silakan cek email untuk verifikasi." });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: "Password salah" });
        }

        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

        res.status(200).json({ 
            success: true, 
            message: "User berhasil login", 
            data: { user, token} 
        });

    } catch (err) { 
        next(err);
    }
}

export const signout = async (req, res, next) => {
    res.send("Signout Route");
}

export const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: "Email tidak ditemukan" });
        }

        // Buat token reset password
        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });

        // Buat link reset password
        const resetLink =`${SERVER_URL}/api/auth/reset-password/${token}`;

        // Simpan token di database
        await User.findByIdAndUpdate(user._id, { resetPasswordToken: token, resetTokenExpires: Date.now() + 3600000, });
        
        // Kirim email reset password
        await sendResetPasswordEmail({ name: user.name, email, userId: user._id, resetLink });

        res.status(200).json({ success: true, message: "Link reset password telah dikirim ke email Anda" });
    } catch (error) {
        next(error);
    }
};

export const resetPassword = async (req, res, next) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        // Verifikasi token
        const decoded = jwt.verify(token, JWT_SECRET);
        const userId = decoded.userId;
        
        const user = await User.findOne({ _id: userId, resetPasswordToken: token, resetTokenExpires: { $gt: Date.now() }, });
        if (!user) {
            return res.status(400).json({ success: false, message: "Token tidak valid atau sudah expired" });
        }

        // Hash password baru
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Update password user
        await User.findByIdAndUpdate(userId, { password: hashedPassword, resetPasswordToken: null, resetTokenExpires: null });

        // kirim email
        await sendResetPasswordEmail({ name: user.name, email: user.email, isSuccess: true, });


        res.status(200).json({ success: true, message: "Password berhasil direset" });
    } catch (error) {
        next(error);
    }
};

export const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ success: false, message: "User tidak ditemukan" });
        }

        if (user.otpExpires < Date.now()) {
            return res.status(400).json({ success: false, message: "Kode OTP telah kadaluarsa" });
        }

        if (user.otp !== otp) {
            return res.status(400).json({ success: false, message: "OTP salah atau sudah kedaluwarsa" });
        }

        // Verifikasi berhasil, update status user
        user.isVerified = true;
        user.otp = null;
        user.otpExpires = null;
        await user.save();

        // Generate token setelah verifikasi berhasil
        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

        await sendWelcomeEmail( user.email, user.name, );

        res.status(200).json({ success: true, message: "Verifikasi berhasil", token });

    } catch (error) {
        res.status(500).json({ success: false, message: "Terjadi kesalahan", details: error.message });
    }
};


// export const getResetPassword = async (req, res, next) => {
    
//     try {
//         const { token } = req.params;

//         // Verifikasi token
//         const decoded = jwt.verify(token, JWT_SECRET);

//         // Jika token valid, tampilkan halaman reset password
//         res.render("auth/reset-password", { userId: decoded.userId, token, layout: 'layouts/app.ejs', title: 'reset pw' });
//     } catch (error) {
//         console.error("❌ Invalid or expired token:", error.message);
//         res.status(400).send("<h2>Invalid or expired token</h2>");
//     }
// };

// export const getForgotPassword = async (req, res, next) => {
//         res.render("auth/forgot-password", { layout: 'layouts/app.ejs', title: 'forgot pw' });
// };

// export const getSignup = async (req, res, next) => {
//         res.render("auth/sign-up", { layout: 'layouts/app.ejs', title: 'signup' });
// };

// export const getSignin = async (req, res, next) => {
//         res.render("auth/sign-in", { layout: 'layouts/app.ejs', title: 'signin' });
// };

