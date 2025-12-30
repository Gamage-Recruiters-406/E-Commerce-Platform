import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import colors from 'colors';
import userRoutes from './routes/userRoutes.js';

const app = express();

// Configure environment
dotenv.config();

// Database config
connectDB();

// Middlewares
app.use(express.json())

// Routes
app.use("/api/v1/users", userRoutes);





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