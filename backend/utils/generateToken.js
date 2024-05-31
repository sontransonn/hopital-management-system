import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (user, res) => {
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRE,
    });

    const cookieName = user.role === 'Admin' ? 'adminToken' : 'patientToken';

    res.cookie(cookieName, token, {
        expires: new Date(
            Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
    })

    return token
}