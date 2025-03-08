import Contact from "../../models/contactsModel.js";

export const index = async (req, res) => {
    try {
        const contact = await Contact.find();

        res.status(200).json({ succes: true, data: { contact }}); // Jika Menggunakan API
    } catch (err) {
        res.status(500).json({ error: "Terjadi kesalahan", details: err });
    }
};

export const store = async (req, res) => {
    try {
        const { nama, email, noHP } = req.body;
        const contact = await Contact.create({ nama, email, noHP });

        res.status(201).json({ succes: true, message: "Produk berhasil ditambahkan", data: { contact }}); // Jika Menggunakan API
    } catch (err) {
        res.status(500).json({ error: "Terjadi kesalahan", details: err });
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
