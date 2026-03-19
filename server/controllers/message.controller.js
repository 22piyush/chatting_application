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

    const receiverId = req.params.id;
    const myId = req.user._id;

    const receiver = await User.findById(receiverId);
    if (!receiver) {
        return res.status(400).json({
            success: false,
            message: "Receiver ID Invalid."
        });
    }

    const messages = await Message.find({
        $or: [
            { senderId: myId, receiverId: receiverId },
            { senderId: receiverId, receiverId: myId }
        ]
    })
        // .populate("senderId", "fullName avatar")
        // .populate("receiverId", "fullName avatar")
        .sort({ createdAt: 1 });

    return res.status(200).json({
        success: true,
        messages
    });
});

export const sendMessages = catchAsyncError(async (req, res, next) => {

    const {text} = req.body;

    

});