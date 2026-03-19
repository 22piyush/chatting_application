import { catchAsyncError } from "../middlewares/catchAsyncError.middleware.js";
import { User } from "../models/user.model.js";
import { Message } from "../models/message.model.js";


export const getAllUsers = catchAsyncError(async (req, res, next) => {

    const userId = req.user._id;

    const users = await User.find({
        _id: { $ne: userId } //exclude current user
    }).select("-password");

    return res.status(200).json({
        success: true,
        users
    });

});


export const getMessages = catchAsyncError(async (req, res, next) => {
    
    

});

export const sendMessages = catchAsyncError(async (req, res, next) => {

});