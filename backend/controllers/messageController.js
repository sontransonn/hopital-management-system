import MESSAGE from "../models/messageModel.js";

export const sendMessage = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            phone,
            message
        } = req.body;

        if (!firstName || !lastName || !email || !phone || !message) {
            return res.status(400).json({ message: "Vui lòng điền đầy đủ thông tin!" });
        }

        const newMessage = new MESSAGE({
            firstName,
            lastName,
            email,
            phone,
            message
        })

        await newMessage.save()

        res.status(200).json({
            success: true,
            message: "Tin nhắn đã được gửi!",
        });

    } catch (error) {
        console.log("Error in sendMessage controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const getAllMessages = async (req, res) => {

    try {
        const messages = await MESSAGE.find();

        res.status(200).json({
            success: true,
            messages,
        });

    } catch (error) {
        console.log("Error in getAllMessages controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}