import express from "express";
import {createUser, loginUser } from "../controllers/userController.js";
import { validateUserRegister, validateUserLogin } from "../middlewares/validationMiddleware.js";

const userRouter = express.Router();


userRouter.post("/register", validateUserRegister, createUser);
userRouter.post("/login", validateUserLogin, loginUser);

//userRoutes.get("/getAllUsersq", getAllUsers);
//userRoutes.get("/getUserById:id", getUserById);



export default userRouter;