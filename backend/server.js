import express from "express";
import { dbConnect } from "./config/db.js";
import dotenv from "dotenv";
import { ENV_VARS } from "./config/envVars.js";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.route.js";
dotenv.config();

const app = express();

const PORT = ENV_VARS.PORT;

app.use(express.json()); // will allow us to parse req.body
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));



app.use("/api/v1/auth", authRoutes);

app.listen(PORT, () => {
    dbConnect();
});

//GjHVkBONLSWfiCoP