const express = require('express');
const methodOverride = require('method-override');
const expressLayouts = require('express-ejs-layouts');
const cors = require('cors');
const { body, validationResult, check } = require('express-validator');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');


const Middleware = (app) => {
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

// const validateContact = [
//     body('nama').custom(async (value) => {
//         const duplikat = await Contact.findOne({ nama: value });
//         if (duplikat) {
//             throw new Error("Nama Contact sudah digunakan");
//         }
//         return true;
//     }),
//     body('email').isEmail().withMessage('Email tidak valid'),
//     body('nohp').isMobilePhone('id-ID').withMessage('Nomor HP tidak valid'),

//     (req, res, next) => {
//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//             return res.render('tambah', {
//                 layout: 'layouts/app',
//                 title: 'Form Tambah Data',
//                 msg: 'Form Tambah Data',
//                 errors: errors.array(),
//             });
//         }
//         next();
//     }
// ];


module.exports = { Middleware };