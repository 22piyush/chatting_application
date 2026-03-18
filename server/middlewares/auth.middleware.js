import jwt from "jsonwebtoken";
import { catchAsyncError } from "../middlewares/catchAsyncError.middleware.js";
import { User } from "../models/user.model.js";

export const isAuthenticated = catchAsyncError(async (req, res, next) => {

    const { token } = req.cookies;

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "User not authenticated"
        });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!decoded) {
        return res.status(401).json({
            success: false,
            message: "Token verification failed"
        });
    }

    const user = await User.findById(decoded.id);

    if (!user) {
        return res.status(401).json({
            success: false,
            message: "User not found"
        });
    }
    req.user = user;

    next();
});