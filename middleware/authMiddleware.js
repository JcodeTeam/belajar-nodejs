import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import { JWT_SECRET } from '../config/env.js';

const authorize = async (req, res, next) => {
    try{

        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({ success: false, message: "Not authorized to access this route" });
        }

        const decoded = jwt.verify(token, JWT_SECRET);

        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(404).json({ success: false, message: "User tidak ditemukan" });
        }

        req.user = user;

        next();

    } catch (err) {
        res.status(401).json({ success: false, message: "Not authorized to access this route" });
    }
};

export default authorize;