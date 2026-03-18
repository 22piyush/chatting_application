import jwt from "jsonwebtoken";

export const generateJWTToken = (user, message, statusCode, res) => {

    const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET_KEY,
        {
            expiresIn: process.env.JWT_EXPIRE
        }
    );

    // ✅ Cookie options
    const options = {
        httpOnly: true,
        secure: false, // true in production (HTTPS)
        sameSite: "strict",
        maxAge: process.env.COOKIE_EXPIRE
    };

    return res
        .status(statusCode)
        .cookie("token", token, options)
        .json({
            success: true,
            message,
            token,
            user
        });
};