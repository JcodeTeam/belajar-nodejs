import dotenv from 'dotenv';
import express from 'express';
import contactRoutes from './routes/contactRoutes.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import connectDB from './config/db.js';
import Middleware from './middleware/middleware.js';
import errorMiddleware from './middleware/errorMiddleware.js';
import arjectMiddleware from './middleware/arjectMiddleware.js';
import subsriptionRoutes from './routes/subscriptionRoutes.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

connectDB();

// Middleware
Middleware.Middleware(app);
app.use(errorMiddleware);
app.use(arjectMiddleware);


//route
app.use("/contact", contactRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/subs", subsriptionRoutes);

app.get("/", (req, res) => {
    res.redirect("/contact");
});

// Jalankan server
app.listen(port, () => {
    console.log(`🚀 Server berjalan di http://localhost:${port}`);
});
