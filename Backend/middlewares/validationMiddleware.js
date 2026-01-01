// Helper function to validate email
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Validate User Register
export const validateUserRegister = (req, res, next) => {
    const { firstname, lastname, email, password, phone } = req.body;

    if (!firstname) {
        return res.status(400).send({ success: false, message: "First Name is required" });
    }
    if (!lastname) {
        return res.status(400).send({ success: false, message: "Last Name is required" });
    }
    if (!email) {
        return res.status(400).send({ success: false, message: "Email is required" });
    }
    if (!isValidEmail(email)) {
        return res.status(400).send({ success: false, message: "Invalid email format" });
    }
    if (!password) {
        return res.status(400).send({ success: false, message: "Password is required" });
    }
    if (password.length < 6) {
        // Optional: length check
        return res.status(400).send({ success: false, message: "Password must be at least 6 characters long" });
    }
    if (!phone) {
        return res.status(400).send({ success: false, message: "Phone number is required" });
    }
    if (phone.length !== 10) {
        return res.status(400).send({ success: false, message: "Phone number must be 10 digits" });
    }

    next();
};

// Validate User Login
export const validateUserLogin = (req, res, next) => {
    const { email, password } = req.body;

    if (!email) {
        return res.status(400).send({ success: false, message: "Email is required" });
    }
    if (!isValidEmail(email)) {
        return res.status(400).send({ success: false, message: "Invalid email format" });
    }
    if (!password) {
        return res.status(400).send({ success: false, message: "Password is required" });
    }

    next();
};

// Validate Product (Create and Update)
export const validateProduct = (req, res, next) => {
    const { name, description, price, quantity, category } = req.body;

    if (!name) {
        return res.status(400).send({ success: false, error: "Name is required" });
    }
    if (!description) {
        return res.status(400).send({ success: false, error: "Description is required" });
    }
    if (!price) {
        return res.status(400).send({ success: false, error: "Price is required" });
    }
    if (price <= 0) {
        return res.status(400).send({ success: false, error: "Price must be greater than 0" });
    }
    if (!quantity) {
        return res.status(400).send({ success: false, error: "Quantity is required" });
    }
    if (quantity <= 1) {
        return res.status(400).send({ success: false, error: "Quantity must be greater than 1" });
    }
    if (!category) {
        return res.status(400).send({ success: false, error: "Category is required" });
    }
    
    const allowedCategories = ["Electronics", "Fashion", "Sports", "Home", "Toys"];
    if (!allowedCategories.includes(category)) {
        return res.status(400).send({ success: false, error: `Invalid category. Allowed categories are: ${allowedCategories.join(", ")}` });
    }

    next();
};
