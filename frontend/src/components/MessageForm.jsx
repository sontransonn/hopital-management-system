import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";

import vectorImg from "../assets/vector.png"

const MessageForm = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [message, setMessage] = useState("");

    const handleMessage = async (e) => {
        e.preventDefault();
        try {
            await axios
                .post(
                    "http://localhost:8080/api/v1/message/send",
                    { firstName, lastName, email, phone, message },
                    {
                        withCredentials: true,
                        headers: { "Content-Type": "application/json" },
                    }
                )
                .then((res) => {
                    toast.success(res.data.message);
                    setFirstName("");
                    setLastName("");
                    setEmail("");
                    setPhone("");
                    setMessage("");
                });
        } catch (error) {
            toast.error(error.response.data.message);
        }
    }

    return (
        <>
            <div className="container form-component message-form">
                <h2>Send Us A Message</h2>
                <form onSubmit={handleMessage}>
                    <div>
                        <input
                            type="text"
                            placeholder="Họ"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Tên"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                        />
                    </div>
                    <div>
                        <input
                            type="text"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input
                            type="number"
                            placeholder="Số điện thoại"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </div>
                    <textarea
                        rows={7}
                        placeholder="Tin nhắn....."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                    <div style={{ justifyContent: "center", alignItems: "center" }}>
                        <button type="submit">Gửi</button>
                    </div>
                </form>
                <img src={vectorImg} alt="vector" />
            </div>
        </>
    )
}

export default MessageForm