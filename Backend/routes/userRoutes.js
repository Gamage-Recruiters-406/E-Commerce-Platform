import express from "express";
import {createUser, loginUser } from "../controllers/userController.js";

const userRouter = express.Router();


userRouter.post("/register", createUser);
userRouter.post("/login", loginUser);

//userRoutes.get("/getAllUsersq", getAllUsers);
//userRoutes.get("/getUserById:id", getUserById);



export default userRouter;