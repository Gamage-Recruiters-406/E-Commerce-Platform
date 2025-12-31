import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();

// Configure environment
dotenv.config();

// Database config
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/products", productRoutes);

app.get("/", (req, res) => {
  res.send({
    message: "Welcome to E Commerce Platform",
  });
});

const PORT = process.env.PORT || 8085;

app.listen(PORT, () => {
  console.log(`Server Running on ${process.env.DEV_MODE} mode`.bgCyan.white);
  console.log(`Server is running on port ${PORT}`.bgCyan.white);
});
