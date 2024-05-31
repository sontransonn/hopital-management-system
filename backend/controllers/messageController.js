import MESSAGE from "../models/messageModel.js";

export const sendMessage = async (req, res) => {

    try {
        const { firstName, lastName, email, phone, message } = req.body;

        if (!firstName || !lastName || !email || !phone || !message) {
            return res.status(500).json("Please Fill Full Form!");
        }

        await MESSAGE.create({ firstName, lastName, email, phone, message });

        res.status(200).json({
            success: true,
            message: "Message Sent!",
        });

    } catch (error) {
        console.log("Error in message controller", error.message);
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
        console.log("Error in message controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}