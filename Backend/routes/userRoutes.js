import express from "express";
import {createUser, loginUser } from "../controllers/userController.js";
import { validateUserRegister, validateUserLogin } from "../middlewares/validationMiddleware.js";

const userRouter = express.Router();


userRouter.post("/register", validateUserRegister, createUser);
userRouter.post("/login", validateUserLogin, loginUser);





export default userRouter;