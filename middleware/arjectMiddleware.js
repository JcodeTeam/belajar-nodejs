import aj from "../config/arject.js";

const arjectMiddleware = async (req, res, next) => {
    try {
        const decision = await aj.protect(req, { requested: 1});

        if (decision.isDenied()) {
            if (decision.reason.isRateLimit) return res.status(429).json({ success: false, message: "Too many requests" });
            
            if (decision.reason.isBot()) return res.status(403).json({ success: false, message: "You are a bot" });
            
            return res.status(403).json({ success: false, message: "Access Denied" });
        }
        next();
    } catch (err) {
        console.log(`arjectMiddleware Error: ${err}`);
        next(err);
    }
}

export default arjectMiddleware;