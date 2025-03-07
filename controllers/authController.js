import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";


export const signup = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email: email });

        if (existingUser) {
            const error = new Error("Email sudah digunakan");
            error.statusCode = 409;
            throw error;
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = await User.create([{ name, email, password: hashedPassword }], { session });
 
        const token = jwt.sign({ userId: newUser[0]._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

        await session.commitTransaction();
        session.endSession();

        res.status(201).json({ succes: true, message: "User berhasil ditambahkan",data: { user: newUser[0], token } });

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
            const error = new Error("User tidak ditemukan");
            error.statusCode = 401;
            throw error;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            const error = new Error("Password salah");
            error.statusCode = 401;
            throw error;
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

        res.status(200).json({ 
            succes: true, 
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
