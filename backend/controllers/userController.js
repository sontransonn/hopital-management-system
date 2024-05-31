import USER from "../models/userModel.js";
import cloudinary from "cloudinary";
import bcrypt from "bcrypt"
import { generateTokenAndSetCookie } from "../utils/generateToken.js";

export const patientRegister = async (req, res) => {

    try {
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
            return res.json("User already exist!");
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new USER({
            firstName,
            lastName,
            email,
            phone,
            nic,
            dob,
            gender,
            password: hashedPassword,
            role: "Patient",
        })

        await user.save()

        const token = generateTokenAndSetCookie(user, res)

        res.json({
            success: true,
            message: "User Registered",
            user,
            token,
        })
    } catch (error) {
        console.log("Error in patientRegister controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const login = async (req, res) => {

    const { email, password, confirmPassword, role } = req.body;

    if (!email || !password || !confirmPassword || !role) {
        return res.json("Please Fill Full Form!");
    }

    if (password !== confirmPassword) {
        return res.json("Password & Confirm Password Do Not Match!")
    }

    const user = await USER.findOne({ email }).select("+password");

    if (!user) {
        return res.json("Invalid Email Or Password!");
    }

    const isPasswordCorrect = bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
        return res.json("Invalid Email Or Password!");
    }

    if (role !== user.role) {
        return res.json(`User Not Found With This Role!`);
    }

    const token = generateTokenAndSetCookie(user, res)

    res.json({
        success: true,
        message: "Login Successfully!",
        user,
        token,
    })
}
