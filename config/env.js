import { config } from "dotenv";

config({ path: `.env.${ process.env.NODE_ENV || 'production' }.local` });
export const { 
    SERVER_URL, FRONTEND_URL, PORT, NODE_ENV, MONGO_URI, DATABASE_NAME,
    ARCJET_KEY, ARCJET_ENV,
    JWT_SECRET, JWT_EXPIRES_IN,
    QSTASH_URL, QSTASH_TOKEN,
    EMAIL_PASSWORD, EMAIL,
    REDIS_URL, REDIS_TOKEN,
} = process.env;
