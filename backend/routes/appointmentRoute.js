import express from "express";
import {
    postAppointment,
    getAllAppointments,
    updateAppointmentStatus,
    deleteAppointment
} from "../controllers/appointmentController.js"
import {
    isAdminAuthenticated,
    isPatientAuthenticated,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/post", isPatientAuthenticated, postAppointment);
router.get("/getall", isAdminAuthenticated, getAllAppointments);
router.put("/update/:id", isAdminAuthenticated, updateAppointmentStatus);
router.delete("/delete/:id", isAdminAuthenticated, deleteAppointment);

export default router;