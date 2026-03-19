import { catchAsyncError } from "../middlewares/catchAsyncError.middleware.js";
import { User } from "../models/user.model.js";
import { Message } from "../models/message.model.js";
import { v2 as cloudinary } from "cloudinary";
import { getIO, getReceiverSocketId } from "../utils/socket.js";


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

    const { text } = req.body;
    const mediaFile = req?.files?.media;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    // check receiver
    const receiver = await User.findById(receiverId);
    if (!receiver) {
        return res.status(400).json({
            success: false,
            message: "Receiver not found"
        });
    }

    // validate message
    if (!text && !mediaFile) {
        return res.status(400).json({
            success: false,
            message: "Message cannot be empty"
        });
    }

    let mediaUrl = "";

    // upload media
    if (mediaFile) {
        const uploaded = await cloudinary.uploader.upload(
            mediaFile.tempFilePath,
            { folder: "chat_media" }
        );
        mediaUrl = uploaded.secure_url;
    }

    // save message
    const message = await Message.create({
        senderId,
        receiverId,
        text: text || "",
        media: mediaUrl
    });

    // SOCKET PART (REAL-TIME)
    const io = getIO();
    const receiverSocketId = getReceiverSocketId(receiverId);

    if (receiverSocketId) {
        io.to(receiverSocketId).emit("newMessage", message);
    }

    return res.status(201).json({
        success: true,
        message: "Message sent successfully",
        data: message
    });
});