require('dotenv').config();
const express = require('express');
const contactRoutes = require('./routes/contactRoutes');
const connectDB = require("./config/db");
const Middleware = require('./middleware/middleware');
const Swal = require('sweetalert2')

const app = express();
const port = process.env.PORT || 5000;

connectDB();

// Middleware
Middleware.Middleware(app);



//route
app.use("/contact", contactRoutes);

app.get("/", (req, res) => {
    res.redirect("/contact");
});

// Jalankan server
app.listen(port, () => {
    console.log(`🚀 Server berjalan di http://localhost:${port}`);
});
