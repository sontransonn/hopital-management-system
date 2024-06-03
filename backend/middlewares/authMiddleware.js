import USER from "../models/userModel.js"
import jwt from "jsonwebtoken";

export const isAdminAuthenticated = async (req, res, next) => {

    try {
        const token = req.cookies.adminToken;

        if (!token) {
            return res.status(400).json("Dashboard User is not authenticated!")
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        req.user = await USER.findById(decoded.id);

        if (req.user.role !== "Admin") {
            return res.status(403).json(`${req.user.role} not authorized for this resource!`)
        }

        next()
    } catch (error) {
        console.log("Error in isAdminAuthenticated middleware", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }

}

export const isPatientAuthenticated = async (req, res, next) => {

    try {
        const token = req.cookies.patientToken;

        if (!token) {
            return res.status(400).json({ message: "User is not authenticated!" })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        req.user = await USER.findById(decoded.id);

        if (req.user.role !== "Patient") {
            return res.status(403).json(`${req.user.role} not authorized for this resource!`)
        }

        next()
    } catch (error) {
        console.log("Error in isPatientAuthenticated middleware", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}