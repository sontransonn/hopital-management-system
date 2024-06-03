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
            return res.status(400).json({ message: "Vui lòng điền đầy ffur thông tin!" });
        }

        const isRegistered = await USER.findOne({ email });

        if (isRegistered) {
            return res.status(400).json({ message: "Email đã tồn tại!" });
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

        res.status(200).json({
            success: true,
            message: "Đăng ký thành công!",
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
        const {
            email,
            password,
            confirmPassword,
            role
        } = req.body;

        if (!email || !password || !confirmPassword || !role) {
            return res.status(400).json({ message: "Vui lòng điền đầy đủ thông tin!" });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Xác nhận mật khẩu không khớp!" })
        }

        const user = await USER.findOne({ email }).select("+password");

        if (!user) {
            return res.status(400).json({ message: "Email hoặc mật khẩu không hợp lệ!" });
        }

        const isPasswordCorrect = bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Email hoặc mật khẩu không hợp lệ!" });
        }

        if (role !== user.role) {
            return res.status(400).json({ message: `Không tìm thấy người dùng với vai trò này!` });
        }

        const token = generateTokenAndSetCookie(user, res)

        res.status(201).json({
            success: true,
            message: "Đăng nhập thành công!",
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
            return res.json({ message: "Vui lòng điền đầy đủ thông tin!" });
        }

        const isRegistered = await USER.findOne({ email });

        if (isRegistered) {
            return res.json({ message: "Email đã tồn tại!" });
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
            message: "Admin mới đã được tạo thành công!",
            admin,
        });
    } catch (error) {
        console.log("Error in addNewAdmin controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }

}

export const addNewDoctor = async (req, res) => {
    try {
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.json({ message: "Cần có Avatar Bác sĩ!" });
        }

        const { docAvatar } = req.files;
        const allowedFormats = ["image/png", "image/jpeg", "image/webp"];

        if (!allowedFormats.includes(docAvatar.mimetype)) {
            return res.json({ message: "Định dạng file không được hỗ trợ!" });
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
            return res.json({ message: "Vui lòng điền đầy đủ thông tin!" });
        }

        const isRegistered = await USER.findOne({ email });

        if (isRegistered) {
            return res.json({ message: "Email đã tồn tại!" })
        }

        const cloudinaryResponse = await cloudinary.uploader.upload(
            docAvatar.tempFilePath
        );

        if (!cloudinaryResponse || cloudinaryResponse.error) {
            console.error("Cloudinary Error:", cloudinaryResponse.error || "Unknown Cloudinary error");

            return res.json({ message: "Không thể tải Avatar bác sĩ lên Cloudinary!" })
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
            message: "Bác sĩ mới đã được tạo!",
            doctor,
        });
    } catch (error) {
        console.log("Error in addNewDoctor controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }

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
            expires: new Date(0),
        })

        res.json({
            success: true,
            message: "Đăng xuất thành công!",
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
            expires: new Date(0),
        })

        res.json({
            success: true,
            message: "Đăng xuất thành công!",
        });
    } catch (error) {
        console.log("Error in logoutPatient controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}