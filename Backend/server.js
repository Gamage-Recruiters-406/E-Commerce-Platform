import express from 'express';

const app = express();

// Configure environment
dotenv.config();

// Database config
connectDB();

// Middlewares


// Routes


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