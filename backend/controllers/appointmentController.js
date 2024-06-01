import APPOINTMENT from "../models/appointmentModel.js";
import USER from "../models/userModel.js"

export const postAppointment = async (req, res) => {
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
        return res.json("Please Fill Full Form!");
    }


    const isConflict = await USER.find({
        firstName: doctor_firstName,
        lastName: doctor_lastName,
        role: "Doctor",
        doctorDepartment: department,
    });

    if (isConflict.length === 0) {
        return res.json("Doctor not found");
    }

    if (isConflict.length > 1) {
        return req.json("Doctors Conflict! Please Contact Through Email Or Phone!")
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
        message: "Appointment Send!",
    });
}

export const getAllAppointments = async (req, res) => {
    const appointments = await APPOINTMENT.find();

    res.status(200).json({
        success: true,
        appointments,
    });
}

export const updateAppointmentStatus = async (req, res) => {
    const { id } = req.params;
    let appointment = await APPOINTMENT.findById(id);

    if (!appointment) {
        return res.json("Appointment not found!");
    }

    appointment = await APPOINTMENT.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });

    res.status(200).json({
        success: true,
        message: "Appointment Status Updated!",
    });
}

export const deleteAppointment = async (req, res) => {
    const { id } = req.params;
    const appointment = await APPOINTMENT.findById(id);

    if (!appointment) {
        return res.json("Appointment Not Found!");
    }

    await appointment.deleteOne();

    res.status(200).json({
        success: true,
        message: "Appointment Deleted!",
    });
}