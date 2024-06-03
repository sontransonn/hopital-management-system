import cors from "cors";

const corsOptions = {
    origin: 'http://127.0.0.1:5173',
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 204
}

export default cors(corsOptions)