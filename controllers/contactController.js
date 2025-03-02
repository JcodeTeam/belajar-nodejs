const Contact = require("../models/contactsModel");

exports.index = async (req, res) => {
    try {
        const contact = await Contact.find();
        res.render("contact", {
            layout: 'layouts/app.ejs', title: 'Daftar Kontak', msg: req.flash('msg'), contact 
        }); // Render tampilan EJS
        // res.status(200).json(products); // Jika Menggunakan API
    } catch (err) {
        res.status(500).json({ error: "Terjadi kesalahan", details: err });
    }
};

exports.create = (req, res) => {
    res.render("tambah", { layout: 'layouts/app.ejs', title: 'Tambah Kontak' });
};

exports.store = async (req, res) => {
    try {
        const { nama, email, noHP } = req.body;
        await Contact.create({ nama, email, noHP });

        req.flash('msg', 'Kontak berhasil ditambahkan!');
        res.redirect("/contact");
        // res.status(201).json({message: "Produk berhasil ditambahkan"}); 
    } catch (err) {
        res.status(500).json({ error: "Terjadi kesalahan", details: err });
    }
};

exports.show = async (req, res) => {
    try {
        const { id } = req.params;
        const contact = await Contact.findById(id);

        if (!contact)
            return res.status(404).json({ error: "contact tidak ditemukan" });

        res.render("detail", { layout: 'layouts/app.ejs', title: 'detail', contact });
    } catch (err) {
        res.status(500).json({ error: "Terjadi kesalahan", details: err });
    }
};

exports.edit = async (req, res) => {
    try {
        const { id } = req.params;
        const contact = await Contact.findById(id);

        if (!contact)
            return res.status(404).json({ error: "contact tidak ditemukan" });

        res.render("edit", { layout: 'layouts/app.ejs', title: 'detail', contact });
    } catch (err) {
        res.status(500).json({ error: "Terjadi kesalahan", details: err });
    }
};

exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const { nama, email, noHP } = req.body;

        const contact = await Contact.findByIdAndUpdate(id, { nama, email, noHP }, { new: true });

        if (!contact) {
            return res.status(404).json({ error: "contact tidak ditemukan" });
        }

        req.flash('msg', 'Kontak berhasil diubah!');
        res.redirect("/contact");
        // res.status(201).json({ message: "Produk berhasil diperbaharui" }); 
    } catch (err) {
        res.status(500).json({ error: "Terjadi kesalahan", details: err });
    }
};

exports.destroy = async (req, res) => {
    try {
        const { id } = req.params;

        const produk = await Contact.findByIdAndDelete(id);

        if (!produk) {
            return res.status(404).json({ error: "Produk tidak ditemukan" });
        }

        req.flash('msg', 'Kontak berhasil Hapus!');
        res.redirect("/contact");
        // res.status(201).json({ message: "Produk berhasil dihapus" }); 
    } catch (err) {
        res.status(500).json({ error: "Terjadi kesalahan", details: err });
    }
};
