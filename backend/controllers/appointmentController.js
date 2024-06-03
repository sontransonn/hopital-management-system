import APPOINTMENT from "../models/appointmentModel.js";
import USER from "../models/userModel.js"

export const postAppointment = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            phone,
            nic,
            dob,
            gender,
            appointment_date,
            department,
            doctor_firstName,
            doctor_lastName,
            hasVisited,
            address,
        } = req.body;

        if (!firstName || !lastName || !email || !phone || !nic || !dob || !gender || !appointment_date || !department || !doctor_firstName || !doctor_lastName || !address) {
            return res.status(400).json("Vui lòng điền đầy đủ thông tin!");
        }

        const isConflict = await USER.find({
            firstName: doctor_firstName,
            lastName: doctor_lastName,
            role: "Doctor",
            doctorDepartment: department,
        });

        if (isConflict.length === 0) {
            return res.status(404).json("Không tìm thấy bác sĩ!");
        }

        if (isConflict.length > 1) {
            return req.status(400).json("Xung đột! Vui lòng liên hệ qua email hoặc sô điện thoại")
        }

        const doctorId = isConflict[0]._id;
        const patientId = req.user._id;

        const appointment = new APPOINTMENT({
            firstName,
            lastName,
            email,
            phone,
            nic,
            dob,
            gender,
            appointment_date,
            department,
            doctor: {
                firstName: doctor_firstName,
                lastName: doctor_lastName,
            },
            hasVisited,
            address,
            doctorId,
            patientId,
        })

        appointment.save()

        res.status(200).json({
            success: true,
            appointment,
            message: "Cuộc hẹn đã được gửi!",
        });
    } catch (error) {
        console.log("Error in postAppointment controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const getAllAppointments = async (req, res) => {
    try {
        const appointments = await APPOINTMENT.find();

        res.status(200).json({
            success: true,
            appointments,
        });
    } catch (error) {
        console.log("Error in getAllAppointments controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const updateAppointmentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        let appointment = await APPOINTMENT.findById(id);

        if (!appointment) {
            return res.status(404).json("Không tìm thấy cuộc hẹn!");
        }

        appointment = await APPOINTMENT.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true,
            useFindAndModify: false,
        });

        res.status(200).json({
            success: true,
            message: "Trạng thái cuộc hẹn đã được cập nhật!",
        });
    } catch (error) {
        console.log("Error in updateAppointmentStatus controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const deleteAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        const appointment = await APPOINTMENT.findById(id);

        if (!appointment) {
            return res.status(404).json("Không tìm thấy cuộc hẹn!");
        }

        await appointment.deleteOne();

        res.status(200).json({
            success: true,
            message: "Xóa cuộc hẹn thành công!",
        });
    } catch (error) {
        console.log("Error in deleteAppointment controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}