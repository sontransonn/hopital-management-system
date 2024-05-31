import USER from "../models/userModel";
import cloudinary from "cloudinary";
import { generateToken } from "../utils/generateToken";

export const patientRegister = async (req, res) => {
    const {
        firstName,
        lastName,
        email,
        phone,
        nic,
        dob,
        gender,
        password
    } = req.body;

    if (!firstName || !lastName || !email || !phone || !nic || !dob || !gender || !password) {
        return res.json("Please Fill Full Form!");
    }

    const isRegistered = await USER.findOne({ email });

    if (isRegistered) {
        return res.json("User already Registered!");
    }

    const user = await USER.create({
        firstName,
        lastName,
        email,
        phone,
        nic,
        dob,
        gender,
        password,
        role: "Patient",
    });

    const token = generateToken(user, res)

    res.json({
        success: true,
        user,
        token,
    })
}
