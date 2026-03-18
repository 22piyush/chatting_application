import jwt from "jsonwebtoken";

export const generateJWTToken = (user, message, statusCode, res) => {

    const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET_KEY,
        {
            expiresIn: process.env.JWT_EXPIRE
        }
    );

    const options = {
        maxAge: process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development" ? true : false,
        sameSite: "strict",
    };

    return res
        .status(statusCode)
        .cookie("token", token, options)
        .json({
            success: true,
            message,
            token,
        });
};