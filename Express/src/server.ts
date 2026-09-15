import "dotenv/config";
import Express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import studentRoutes from "./routes/students";
import teacherRoutes from "./routes/teachers";
import courseRoutes from "./routes/courses";
import markRoutes from "./routes/marks";
import userRoutes from "./routes/users";
import roleRoutes from "./routes/roles";
import authRoutes from "./auth/authRoutes";
import { requestLogger } from "./middleware/requestLogger";
import { errorHandler } from "./middleware/errorHandler";
import { connectDB } from "./config/mongoose";
const app = Express();

const PORT = process.env.PORT || 3000;

app.use(Express.json());
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:8000",
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(requestLogger);
app.use("/uploads", Express.static("uploads"));
// app.get('/', (req, res) => {
//     res.json({message:'Hello World'});
// });

app.use("/students", studentRoutes);
app.use("/teachers", teacherRoutes);
app.use("/courses", courseRoutes);
app.use("/marks", markRoutes);
app.use("/users", userRoutes);
app.use("/roles", roleRoutes);
app.use("/auth", authRoutes);
// app.get("/test", (req, res) => {
//   res.json({ message: "Server is working" });
// });
app.use(errorHandler);

async function startServer(): Promise<void> {
  await connectDB();
  app.listen(PORT, () => {
    console.log("Server is running on port http://localhost:3000");
  });
}

startServer();
