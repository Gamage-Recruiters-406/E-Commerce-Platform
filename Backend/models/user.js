import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstname: { 
        type: String, 
        required: [true, "First Name is required"],
        trim: true
    },
    lastname: { 
        type: String, 
        required: [true, "Last Name is required"],
        trim: true
    },
    role: { 
        type: Number, 
        required: [true, "Role is required"],
        enum: {
            values: [1, 2],
            message: "Role must be 1 (customer), 2 (Admin)"
        },
        default: 1  
    },
    phone: { 
        type: String, 
        required: [true, "Phone is required"],
        unique: true,
        trim: true,
        match: [/^\d{10}$/, "Please provide a valid phone number"]
    },
    email: { 
        type: String, 
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Please provide a valid email"]
    },
    password: { 
        type: String, 
        required: [true, "Password is required"],
        minlength: [6, "Password must be at least 6 characters"]
    },
   
}, { 
    timestamps: true,

});



export default mongoose.model("User", userSchema);
