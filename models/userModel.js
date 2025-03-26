import mongoose from "mongoose";

// Definisikan schema 
const userSchema = new mongoose.Schema({
    name: { type: String, required: [true, "username is requaired"], trim: true, minLenght: 5, maxLenght: 50 },
    email: { 
        type: String, 
        required: [true, "email is requaired"], 
        trim: true, 
        //trim menghapus spasi di awal dan akhir string
        lowercase: true,
        unique: true,
        match: [/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/, "email is not valid"]
    },
    password: { 
        type: String, 
        required: [true, "password is requaired"], 
        minLength: 3, 
    },
    resetPasswordToken: { type: String },
    resetTokenExpires: { type: Date },
}, { timestamps: true } );

// Buat model berdasarkan schema
const User = mongoose.model("User", userSchema);

export default User;