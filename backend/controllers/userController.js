import USER from "../models/userModel.js";
import cloudinary from "../configs/cloudinaryConfig.js";
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
    try {
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
    } catch (error) {
        console.log("Error in login controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const addNewAdmin = async (req, res) => {
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
            return res.json("Admin With This Email Already Exists!");
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const admin = new USER({
            firstName,
            lastName,
            email,
            phone,
            nic,
            dob,
            gender,
            password: hashedPassword,
            role: "Admin",
        })

        await admin.save()

        res.status(200).json({
            success: true,
            message: "New Admin Registered",
            admin,
        });
    } catch (error) {
        console.log("Error in addNewAdmin controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }

}

export const addNewDoctor = async (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.json("Doctor Avatar Required!");
    }

    const { docAvatar } = req.files;
    const allowedFormats = ["image/png", "image/jpeg", "image/webp"];

    if (!allowedFormats.includes(docAvatar.mimetype)) {
        return res.json("File Format Not Supported!");
    }

    const {
        firstName,
        lastName,
        email,
        phone,
        nic,
        dob,
        gender,
        password,
        doctorDepartment,
    } = req.body;

    if (!firstName || !lastName || !email || !phone || !nic || !dob || !gender || !password || !doctorDepartment || !docAvatar) {
        return res.json("Please Fill Full Form!");
    }

    const isRegistered = await USER.findOne({ email });

    if (isRegistered) {
        return res.json("Doctor With This Email Already Exists!")
    }

    const cloudinaryResponse = await cloudinary.uploader.upload(
        docAvatar.tempFilePath
    );

    if (!cloudinaryResponse || cloudinaryResponse.error) {
        console.error("Cloudinary Error:", cloudinaryResponse.error || "Unknown Cloudinary error");

        return res.json("Failed To Upload Doctor Avatar To Cloudinary")
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const doctor = new USER({
        firstName,
        lastName,
        email,
        phone,
        nic,
        dob,
        gender,
        password: hashedPassword,
        role: "Doctor",
        doctorDepartment,
        docAvatar: {
            public_id: cloudinaryResponse.public_id,
            url: cloudinaryResponse.secure_url,
        },
    })

    await doctor.save()

    res.status(200).json({
        success: true,
        message: "New Doctor Registered",
        doctor,
    });
}

export const getAllDoctors = async (req, res) => {
    try {
        const doctors = await USER.find({ role: "Doctor" });

        res.status(200).json({
            success: true,
            doctors,
        });
    } catch (error) {
        console.log("Error in getAllDoctors controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const getUserDetails = async (req, res) => {
    try {
        const user = req.user;
        res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {
        console.log("Error in getUserDetails controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const logoutAdmin = async (req, res) => {
    try {
        res.cookie("adminToken", "", {
            httpOnly: true,
            expires: new Date(Date.now()),
        })

        res.json({
            success: true,
            message: "Admin Logged Out Successfully.",
        });
    } catch (error) {
        console.log("Error in logoutAdmin controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const logoutPatient = async (req, res) => {
    try {
        res.cookie("patientToken", "", {
            httpOnly: true,
            expires: new Date(Date.now()),
        })

        res.json({
            success: true,
            message: "Patient Logged Out Successfully.",
        });
    } catch (error) {
        console.log("Error in logoutPatient controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}