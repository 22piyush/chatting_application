import { catchAsyncError } from "../middlewares/catchAsyncError.middleware.js";
import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import { generateJWTToken } from "../utils/jwtToken.js";
import { v2 as cloudinary } from "cloudinary";

export const signup = catchAsyncError(async (req, res, next) => {

    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
        return res.status(400).json({
            success: false,
            message: "Please provide all required fields"
        });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({
            success: false,
            message: "Invalid email format"
        });
    }

    if (password.length < 6) {
        return res.status(400).json({
            success: false,
            message: "Password must be at least 6 characters"
        });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({
            success: false,
            message: "User already exists with this email"
        });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        fullName,
        email,
        password: hashedPassword,
        avatar: {
            public_id: "",
            url: ""
        }
    });

    // return res.status(201).json({
    //     success: true,
    //     message: "User registered successfully",
    //     user
    // });

    generateJWTToken(user, "User registered successfully", 201, res);

});


export const signin = catchAsyncError(async (req, res, next) => {

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Please provide email and password"
        });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        return res.status(400).json({
            success: false,
            message: "Invalid email or password"
        });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        return res.status(400).json({
            success: false,
            message: "Invalid email or password"
        });
    }

    generateJWTToken(
        user,
        "Login successful",
        200,
        res
    );

});


export const signout = catchAsyncError(async (req, res, next) => {

    res.status(200)
        .cookie("token", "", {
            httpOnly: true,
            expires: new Date(0)
        })
        .json({
            success: true,
            message: "Logged out successfully"
        });

});


export const getUser = catchAsyncError(async (req, res, next) => {

    const user = req.user;

    return res.status(200).json({
        success: true,
        user
    });

});


export const updateProfile = catchAsyncError(async (req, res, next) => {

    const { fullName, email } = req.body;
    const avatar = req.files?.avatar;

    let user = await User.findById(req.user._id);

    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found"
        });
    }

    if (fullName) user.fullName = fullName;

    if (email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Invalid email format"
            });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser && existingUser._id.toString() !== user._id.toString()) {
            return res.status(400).json({
                success: false,
                message: "Email already in use"
            });
        }

        user.email = email;
    }

    if (avatar) {

        if (user.avatar?.public_id) {
            await cloudinary.uploader.destroy(user.avatar.public_id);
        }

        const uploaded = await cloudinary.uploader.upload(
            avatar.tempFilePath,
            {
                folder: "avatars",
                width: 300,
                height: 300,
                crop: "fill"
            }
        );

        user.avatar = {
            public_id: uploaded.public_id,
            url: uploaded.secure_url
        };
    }
    await user.save();
    user = await User.findById(user._id).select("-password");

    return res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        user
    });

});