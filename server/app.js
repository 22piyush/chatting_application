import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import fileUpload from 'express-fileupload';
import cors from 'cors';
import connectDB from './config/db.js';
import userRouter from "./routes/user.routes.js"
import { connectCloudinary } from "./config/cloudinary.js";

const app = express();

// Load environment variables
dotenv.config();
// connect cloudinary
connectCloudinary();

// Middlewares
app.use(cors({
    origin: process.env.FRONTEND_URL, // your frontend URL
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// File upload middleware
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/"
}));


app.use("/api/v1/user", userRouter)

connectDB();

// Test route
app.get('/', (req, res) => {
    res.send("API is running...");
});

export default app;