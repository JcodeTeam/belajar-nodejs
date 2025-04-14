import Contact from "../../models/contactsModel.js";
import User from "../../models/userModel.js";

export const index = async (req, res) => {
    try {
        const userId = req.user.id; 

        // Cari user dan ambil hanya kontak yang dia miliki
        const user = await User.findById(userId).populate("contacts");

        if (!user) {
            return res.status(404).json({ success: false, message: "User tidak ditemukan" });
        }

        if (!user.contacts || user.contacts.length === 0) {
            return res.status(200).json({ success: true, message: "Kontak kosong", data: { contacts: [] } });
        }

        res.status(200).json({ success: true, data: { contacts: user.contacts } });

    } catch (err) {
        res.status(500).json({ success: false, message: "Terjadi kesalahan", details: err.message });
    }
};

export const store = async (req, res) => {
    try {
        const { nama, email, noHP } = req.body;
        const userId = req.user.id; // Ambil ID user dari token (middleware autentikasi)

        // Cari user
        const user = await User.findById(userId).populate("contacts").populate("subscription");
;

        if (!user) {
            return res.status(404).json({ success: false, message: "User tidak ditemukan" });
        }

        // Cek apakah user memiliki subscription aktif
        const hasActiveSubscription = user.subscription && user.subscription.status === "active";

        // Tentukan batas maksimal kontak berdasarkan subscription
        const maxContacts = hasActiveSubscription ? Infinity : 5;

        // Cek apakah user sudah mencapai batas maksimal kontak
        if (user.contacts.length >= maxContacts) {
            return res.status(400).json({
                success: false,
                message: `Anda hanya bisa menyimpan maksimal ${maxContacts} kontak. Upgrade atau perpanjang subscription untuk menyimpan lebih banyak.`
            });
        }

        // Buat kontak baru
        const contact = await Contact.create({ nama, email, noHP, user: userId });

        // Tambahkan kontak ke dalam daftar kontak user
        user.contacts.push(contact._id);
        await user.save();

        res.status(201).json({ success: true, message: "Kontak berhasil ditambahkan", data: { contact } });

    } catch (err) {
        res.status(500).json({ success: false, message: "Terjadi kesalahan", details: err.message });
    }
};

export const show = async (req, res) => {
    try {
        const { id } = req.params;
        const contact = await Contact.findById(id);

        if (!contact)
            return res.status(404).json({ error: "contact tidak ditemukan" });

        res.status(200).json({ succes: true, data: { contact }}); // Jika Menggunakan API

    } catch (err) {
        res.status(500).json({ error: "Terjadi kesalahan", details: err });
    }
};

export const update = async (req, res) => {
    try {
        const { id } = req.params;
        const { nama, email, noHP } = req.body;

        const contact = await Contact.findByIdAndUpdate(id, { nama, email, noHP }, { new: true });

        res.status(201).json({ succes: true, message: "Produk berhasil diperbaharui", data: { contact }}); // Jika Menggunakan API
    } catch (err) {
        res.status(500).json({ error: "Terjadi kesalahan", details: err });
    }
};

export const destroy = async (req, res) => {
    try {
        const { id } = req.params;

        const contact = await Contact.findByIdAndDelete(id);

        if (!contact) {
            return res.status(404).json({ error: "Produk tidak ditemukan" });
        }

        res.status(201).json({ message: "Produk berhasil dihapus", data: { contact } }); 
    } catch (err) {
        res.status(500).json({ error: "Terjadi kesalahan", details: err });
    }
};
