const mongoose = require("mongoose");

// Definisikan schema contact
const contactSchema = new mongoose.Schema({
    nama: { type: String, required: true },
    email: { type: String, required: false },
    noHP: { type: Number, required: true },
});

// Buat model berdasarkan schema
const Contact = mongoose.model("Contact", contactSchema);
// mongoose.model("Contact", contactSchema) membuat model bernama "Contact", 
// yang akan otomatis dikaitkan dengan koleksi "Contacts" di MongoDB(Mongoose otomatis mengubahnya menjadi bentuk jamak).

module.exports = Contact;
