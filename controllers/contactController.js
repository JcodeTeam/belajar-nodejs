import Contact from "../models/contactsModel.js";

export const index = async (req, res) => {
    try {
        const contact = await Contact.find();
        res.render("contact", {
            layout: 'layouts/app.ejs', title: 'Daftar Kontak', msg: req.flash('msg'), contact 
        }); // Render tampilan EJS
    } catch (err) {
        res.status(500).json({ error: "Terjadi kesalahan", details: err });
    }
};

export const create = (req, res) => {
    res.render("tambah", { layout: 'layouts/app.ejs', title: 'Tambah Kontak' });
};

export const store = async (req, res) => {
    try {
        const { nama, email, noHP } = req.body;
        await Contact.create({ nama, email, noHP });

        req.flash('msg', 'Kontak berhasil ditambahkan!');
        res.redirect("/contact");
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

        res.render("detail", { layout: 'layouts/app.ejs', title: 'detail', contact });
    } catch (err) {
        res.status(500).json({ error: "Terjadi kesalahan", details: err });
    }
};

export const edit = async (req, res) => {
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

export const update = async (req, res) => {
    try {
        const { id } = req.params;
        const { nama, email, noHP } = req.body;

        await Contact.findByIdAndUpdate(id, { nama, email, noHP }, { new: true });

        req.flash('msg', 'Kontak berhasil diubah!');
        res.redirect("/contact");
    } catch (err) {
        res.status(500).json({ error: "Terjadi kesalahan", details: err });
    }
};

export const destroy = async (req, res) => {
    try {
        const { id } = req.params;

        const contact = await Contact.findByIdAndDelete(id);

        if (!contact) {
            return res.status(404).json({ error: "contact tidak ditemukan" });
        }

        req.flash('msg', 'Kontak berhasil Hapus!');
        res.redirect("/contact");
    } catch (err) {
        res.status(500).json({ error: "Terjadi kesalahan", details: err });
    }
};
