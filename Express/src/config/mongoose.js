"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = connectDB;
const mongoose_1 = __importDefault(require("mongoose"));
async function connectDB() {
    const mongoURI = process.env.MONGO_URI;
    if (!mongoURI) {
        console.error("MONGO_URI is not defined in the environment variables");
        process.exit();
    }
    try {
        await mongoose_1.default.connect(mongoURI);
        console.log("MongoDB connected successfully");
    }
    catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit();
    }
}
