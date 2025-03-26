import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import { JWT_SECRET, JWT_EXPIRES_IN } from "../config/env.js";
import { sendResetPasswordEmail } from "../utils/sendResetPassword.js"


export const signup = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email: email });

        if (existingUser) {
            return res.status(409).json({ success: false, message: "Email sudah digunakan" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = await User.create([{ name, email, password: hashedPassword }], { session });
 
        const token = jwt.sign({ userId: newUser[0]._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

        await session.commitTransaction();
        session.endSession();

        res.status(201).json({ success: true, message: "User berhasil ditambahkan",data: { user: newUser[0], token } });

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
        
        // Kirim email reset password
        await sendResetPasswordEmail({ email, userId: user._id });

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

        // Hash password baru
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Update password user
        await User.findByIdAndUpdate(userId, { password: hashedPassword });

        res.status(200).json({ success: true, message: "Password berhasil direset" });
    } catch (error) {
        next(error);
    }
};

