import express from 'express';
import expressLayouts from 'express-ejs-layouts';
import cors from 'cors';
import { body, validationResult, check } from 'express-validator';
import Contact from '../models/contactsModel.js';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import flash from 'connect-flash';
import methodOverride from 'method-override';
import { RedisStore } from 'connect-redis';
import redisClient from '../config/redis.js';


(async () => {
    try {
        await redisClient.connect();
        console.log("✅ Redis Connected!");
    } catch (err) {
        console.error("❌ Connection Redis Failed:", err);
    }
})();

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
            store: new RedisStore ({ client: redisClient }),
            secret: 'supersecretkey',
            resave: false,
            saveUninitialized: false,
            cookie: { 
                secure: false, // set true jika https
                httpOnly: true,
                maxAge: 1000 * 60 * 60 * 24,
            }
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

export default { Middleware, validateContact, validateUpdate };