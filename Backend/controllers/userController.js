import User from "../models/User.js";
import bcrypt from "bcrypt";

//register user
export const createUser = async(req, res) => {
    console.log("xxxxxxxxxx",req.body);
    try {
        const {firstname, lastname, role, phone, email, password } = req.body;
           

        //validate
        if(!firstname || !lastname || !phone || !email || !password){
            return res.status(400).json({
                success: false,
                message: "Please fill all fields"
            })
        }

        //check if user exists
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(500).send({
                success: false,
                message: "User Already Exists"
            })
        }

        //hash password
        const hashPassword = await bcrypt.hash(password, 10);
        //create user
        const user = await User.create({
            firstname,
            lastname,
            role,
            phone,
            email,
            password: hashPassword
        })

        res.status(201).send({
            success: true,
            message: "User Created Successfully",
            user
        })
        
    } 
    catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in Registration",
            error
        })
    }
}