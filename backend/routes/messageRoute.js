import express from "express";
import {
    sendMessage,
    getAllMessages
} from "../controllers/messageController.js"
import { isAdminAuthenticated } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/send", sendMessage);
router.get("/getall", isAdminAuthenticated, getAllMessages);

export default router;