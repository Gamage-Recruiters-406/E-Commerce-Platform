import User from "../models/User.js";
import bcrypt from "bcrypt";
import JWT from "jsonwebtoken";

//register user
export const createUser = async(req, res) => {
    try {
        const {firstname, lastname, role, phone, email, password } = req.body;
           

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

//loging user

export const loginUser = async(req, res) => {
    try {
        const {email, password } = req.body;

        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({
                success: false,
                message: "User Not Found pleas enter valide email or register"
            })
        }

        //check password
        const isPasswordMatched = await bcrypt.compare(password, user.password);
        if(!isPasswordMatched){
            return res.status(400).json({
                success: false,
                message: "Invalid Password"
            })
        }

        //generate token
        const token = JWT.sign(
            { 
                userid: user._id,
                role: user.role,
                email: user.email
            },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.cookie('access_token', token, {
            httpOnly: true
        }).status(200).json({
            success: true,
            message: "Login successful",
            data: {
                userid: user._id,
                firstname: user.firstname,
                lastname: user.lastname,
                role: user.role,
                email: user.email,
                phone: user.phone
            },
            token
        });

        
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in Login",
            error
        })
        
    }
}