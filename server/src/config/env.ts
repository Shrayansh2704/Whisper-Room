import dotenv from "dotenv";

dotenv.config();

export const env = {
    PORT: Number(process.env.PORT),
    NODE_ENV: process.env.NODE_ENV,
    CLIENT_URL: process.env.CLIENT_URL,
};