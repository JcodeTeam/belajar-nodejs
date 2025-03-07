import Contact from "../models/contactsModel.js";

export const index = async (req, res) => {
    try {
        const contact = await Contact.find();
        
        res.status(200).json(products); // Jika Menggunakan API
    } catch (err) {
        res.status(500).json({ error: "Terjadi kesalahan", details: err });
    }
};

export const store = async (req, res) => {
    try {
        const { nama, email, noHP } = req.body;
        await Contact.create({ nama, email, noHP });

        res.status(201).json({message: "Produk berhasil ditambahkan"}); 
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

        res.status(200).json(contact);
    } catch (err) {
        res.status(500).json({ error: "Terjadi kesalahan", details: err });
    }
};

export const update = async (req, res) => {
    try {
        const { id } = req.params;
        const { nama, email, noHP } = req.body;

        await Contact.findByIdAndUpdate(id, { nama, email, noHP }, { new: true });

        res.status(201).json({ message: "Produk berhasil diperbaharui" }); 
    } catch (err) {
        res.status(500).json({ error: "Terjadi kesalahan", details: err });
    }
};

export const destroy = async (req, res) => {
    try {
        const { id } = req.params;

        const produk = await Contact.findByIdAndDelete(id);

        if (!produk) {
            return res.status(404).json({ error: "Produk tidak ditemukan" });
        }

        
        res.status(201).json({ message: "Produk berhasil dihapus" }); 
    } catch (err) {
        res.status(500).json({ error: "Terjadi kesalahan", details: err });
    }
};


export default { index, store, show, update, destroy };
// Export semua fungsi yang ada di dalam controller agar bisa digunakan di file lain