import dotenv from 'dotenv';
import express from 'express';
import connectDB from './config/db.js';
import contactRoutes from './routes/contactRoutes.js';
import apiContactRoutes from './routes/Api/contactRoutes.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import Middleware from './middleware/middleware.js';
import errorMiddleware from './middleware/errorMiddleware.js';
import arcjetMiddleware from './middleware/arcjetMiddleware.js';
import subsriptionRoutes from './routes/subscriptionRoutes.js';
import workflowRoutes from './routes/workflowRoutes.js';
import { PORT } from './config/env.js';

dotenv.config();


const app = express();
const port = PORT || 5000;

connectDB();

// Middleware
Middleware.Middleware(app);
app.use(errorMiddleware);
app.use(arcjetMiddleware);


//route
app.use("/contact", contactRoutes);
app.use("/api/contact", apiContactRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/subs", subsriptionRoutes);
app.use("/api/workflows", workflowRoutes);

app.get("/", (req, res) => {
    res.redirect("/contact");
});

// Jalankan server
app.listen(port, () => {
    console.log(`🚀 Server berjalan di http://localhost:${port}`);
});
