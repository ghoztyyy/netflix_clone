import { User } from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { generateTokenAndSetCookie } from "../utils/generateToken.js";

export const signup = async (req, res) => {
    try {
        const { email, password, username } = req.body;
        if (!email || !password || !username) {
            return res
                .status(400)
                .json({ success: false, message: "all feilds are required" });
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return res
                .status(400)
                .json({ success: false, message: "Invalid email" });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters",
            });
        }

        const existedUser = await User.findOne({ email: email });
        if (existedUser) {
            return res
                .status(400)
                .json({ success: false, message: "email already exists" });
        }
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);
        const PROFILE_PICS = ["/avatar1.png", "/avatar2.png", "/avatar3.png"];

        const image =
            PROFILE_PICS[Math.floor(Math.random() * PROFILE_PICS.length)];

        const newUser = new User({
            email,
            username,
            password: hashedPassword,
            image,
        });
        generateTokenAndSetCookie(newUser._id, res);
        await newUser.save();

        res.status(201).json({
            success: true,
            user: {
                ...newUser._doc,
                password: "",
            },
        });
    } catch (error) {
        console.log("Error in signup controller", error.message);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res
                .status(400)
                .json({ success: false, message: "all fields are required" });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res
                .status(404)
                .json({ success: false, message: "user not found" });
        }
        if (!(await bcryptjs.compare(password, user.password))) {
            return res.json({ success: false, message: "incorrect password" });
        }
        generateTokenAndSetCookie(user._id, res);
        res.status(200).json({
            success: true,
            user: {
                ...user._doc,
                password: "",
            },
        });
    } catch (error) {
        console.log("Error in login controller", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export const logout = async (req, res) => {
    try {
        res.clearCookie("jwt-netflix");
        res.status(200).json({
            success: true,
            message: "Logged out successfully",
        });
    } catch (error) {
        console.log("Error in logout controller", error.message);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export const authCheck = async (req, res) => {
    try {
        console.log("req.user:", req.user);
        res.status(200).json({ success: true, user: req.user });
    } catch (error) {
        console.log("Error in authCheck controller", error.message);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
