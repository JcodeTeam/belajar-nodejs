const express = require('express');
const methodOverride = require('method-override');
const expressLayouts = require('express-ejs-layouts');
const cors = require('cors');
const { body, validationResult, check } = require('express-validator');
const Contact = require('../models/contactsModel');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');


const Middleware = (app) => {
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(express.static("public"));
    app.set("view engine", "ejs");
    app.use(expressLayouts);
    app.use(methodOverride('_method'));
    app.use(cors());
    app.use(cookieParser('secret'));
    app.use(
        session({
            cookie: { maxAge: 6000 },
            secret: 'secret',
            resave: true,
            saveUninitialized: true,
        })
    );
    app.use(flash());
};

const validateContact = [
    body('nama').custom(async (value) => {
        const duplikat = await Contact.findOne({ nama: value }); // Cek duplikat nama
        if (duplikat) {
            throw new Error("Nama Contact sudah digunakan");
        }
        return true;
    }),
    check('email', 'Email tidak valid').isEmail(),
    check('noHP', 'Nomor HP tidak valid').isMobilePhone('id-ID'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.render('tambah', {
                layout: 'layouts/app',
                title: 'Form Tambah Data',
                errors: errors.array()
            });
        }
        next(); // Lanjut ke route handler jika tidak ada error
    }
];

const validateUpdate = [
    body('nama').custom(async (value, { req }) => {
        const contactLama = await Contact.findById(req.params.id);
        if (!contactLama) {
            throw new Error("Kontak tidak ditemukan");
        }

        // Cek apakah nama baru berbeda dengan nama lama
        if (value !== contactLama.nama) {
            const duplikat = await Contact.findOne({ nama: value });
            if (duplikat) {
                throw new Error("Nama Contact sudah digunakan");
            }
        } 
        // else if (value === contactLama.nama && req.body.email === contactLama.email && req.body.noHP === contactLama.noHP) {
        //     req.flash('msg', 'Nama kontak sama dengan sebelumnya');
        // }
        return true;
    }),
    check('email', 'Email tidak valid').isEmail(),
    check('noHP', 'Nomor HP tidak valid').isMobilePhone('id-ID'),

    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // Ambil kembali data kontak asli dari database
            //mengembalikan nilai yang diubah ke nilai asal
            const contact = await Contact.findById(req.params.id);
            return res.render('edit', {
                layout: 'layouts/app',
                title: 'Form Edit Data',
                errors: errors.array(),
                contact
            });
        }
        next();
    }
];

module.exports = { Middleware, validateContact, validateUpdate };