import mongoose from "mongoose";

export const dbConnect = async () => {
    try {
        const res = await mongoose.connect(process.env.MONGO_URI);
    } catch (error) {
        console.log("🚀 ~ dbConnect ~ error:", error);
    }
};
