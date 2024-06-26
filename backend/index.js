import express from "express";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";

import "./configs/dotenvConfig.js"
import "./configs/cloudinaryConfig.js";
import corsConfig from "./configs/corsConfig.js"

import appointmentRoute from "./routes/appointmentRoute.js"
import messageRoute from "./routes/messageRoute.js"
import userRoute from "./routes/userRoute.js"

import connectToMongoDB from "./services/connectToMongoDB.js";

const app = express();

const PORT = process.env.PORT || 8080

app.use(corsConfig);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
}))

app.use("/api/v1/appointment", appointmentRoute);
app.use("/api/v1/message", messageRoute);
app.use("/api/v1/user", userRoute);

app.listen(PORT, () => {
    connectToMongoDB()
    console.log(`Server is running on port ${PORT}`);
})