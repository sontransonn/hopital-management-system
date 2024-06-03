import jwt from "jsonwebtoken";
import cookieConfig from "../configs/cookieConfig.js";

export const generateTokenAndSetCookie = (user, res) => {
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRE,
    });

    const cookieName = user.role === 'Admin' ? 'adminToken' : 'patientToken';

    res.cookie(cookieName, token, cookieConfig)

    return token
}