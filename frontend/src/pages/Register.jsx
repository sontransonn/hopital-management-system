import React, { useContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { authContext } from "../context/authContext"

const Register = () => {
    const {
        isAuthenticated,
        setIsAuthenticated
    } = useContext(authContext);

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [nic, setNic] = useState("");
    const [dob, setDob] = useState("");
    const [gender, setGender] = useState("");
    const [password, setPassword] = useState("");

    return (
        <div>Register</div>
    )
}

export default Register