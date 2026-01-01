import JWT from "jsonwebtoken";

// Protected routes using token
export const requiredSignIn = async(req, res, next) => {
    try {
        const token = req.cookies.access_token;
        
        if (!token) {
            return res.status(401).json({ 
                success: false, 
                message: "Access denied. No token provided." 
            });
        }

        const decode = JWT.verify(token, process.env.JWT_SECRET);
        req.user = decode;
        next();
    } catch (error) {
        console.error("Authentication error:", error);
        return res.status(401).json({ 
            success: false, 
            message: "Invalid or expired token" 
        });
    }
};


// Middleware to check if user is a Manager (role = 1)
export const isCustomer = (req, res, next) => {

    if (req.user.role !== 1) {
        return res.status(403).json({ 
            success: false, 
            message: "Access denied. token required" 
        });
    }
    next();
};

// Middleware to check if user is an Admin (role = 2)
export const isAdmin = (req, res, next) => {
    if (req.user.role !== 2) {
        return res.status(403).json({ 
            success: false, 
            message: "Access denied. Admin role required." 
        });
    }
    next();
};

// Middleware to check if user is customer or Admin (role = 1 or 2)
export const isCustomerOrAdmin = (req, res, next) => {

    if (req.user.role !== 1 && req.user.role !== 2) {
        return res.status(403).json({ 
            success: false, 
            message: "Access denied. Manager or Admin role required.." 
        });
    }
    next();
};
