import mongoose from "mongoose";

// Definisikan schema contact
const contactSchema = new mongoose.Schema({
    nama: {
        type: String,
        required: [true, "name is requaired"],
        minLength: 5,
        maxLength: 100,
        trim: true
    },
    email: {
        type: String,
        required: [true, "email is requaired"],
        trim: true,
        lowercase: true,
        match: [/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/, "email is not valid"]
    },
    noHP: {
        type: String,
        required: [true, "no. HP is requaired"],
        trim: true,
        unique: true
    },
});

// Buat model berdasarkan schema
const Contact = mongoose.model("Contact", contactSchema);
// mongoose.model("Contact", contactSchema) membuat model bernama "Contact", 
// yang akan otomatis dikaitkan dengan koleksi "Contacts" di MongoDB(Mongoose otomatis mengubahnya menjadi bentuk jamak).

export default Contact;
