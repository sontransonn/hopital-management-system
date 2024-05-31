import USER from "../models/userModel.js"
import jwt from "jsonwebtoken";

export const isAdminAuthenticated = async (req, res, next) => {
    const token = req.cookies.adminToken;

    if (!token) {
        return res.json("Dashboard User is not authenticated!")
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    req.user = await USER.findById(decoded.id);

    if (req.user.role !== "Admin") {
        return res.json(`${req.user.role} not authorized for this resource!`)
    }

    next()
}

export const isPatientAuthenticated = async (req, res, next) => {
    const token = req.cookies.patientToken;

    if (!token) {
        return res.json("User is not authenticated!")
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    console.log(decoded);

    req.user = await USER.findById(decoded.id);

    if (req.user.role !== "Patient") {
        return res.json(`${req.user.role} not authorized for this resource!`)
    }

    next()
}