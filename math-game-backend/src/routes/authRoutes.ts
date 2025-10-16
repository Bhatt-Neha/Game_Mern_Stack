import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import { body, validationResult } from "express-validator";
import User from "../models/User";

const router = Router();

router.post(
    "/register",
    [
        body("firstName").notEmpty().withMessage("First name required"),
        body("lastName").notEmpty().withMessage("Last name required"),
        body("email").isEmail().withMessage("Valid email required"),
        body("profilePicture").notEmpty().withMessage("Profile picture required").isURL().withMessage("Must be a valid URL"),
        body("birthdate").isISO8601().withMessage("Valid birthdate required"),
        body("phoneNumber").matches(/^[0-9]{7,15}$/).withMessage("Phone must be 7–15 digits"),
        body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 chars"),
    ],
    async (req: Request, res: Response): Promise<Response> => {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(400).json({ message: "Validation failed", errors: errors.array() });

        const { firstName, lastName, email, profilePicture, birthdate, phoneNumber, password } =
            req.body;

        try {
            const existingUser = await User.findOne({ email });
            if (existingUser)
                return res.status(400).json({ message: "User already exists" });

            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser = new User({
                firstName,
                lastName,
                email,
                profilePicture,
                birthdate,
                phoneNumber,
                password: hashedPassword,
            });

            await newUser.save();
            return res.status(201).json({
                message: "User registered successfully",
                user: {
                    id: newUser._id,
                    firstName: newUser.firstName,
                    lastName: newUser.lastName,
                    email: newUser.email,
                    profilePicture: newUser.profilePicture,
                    birthdate: newUser.birthdate,
                    phoneNumber: newUser.phoneNumber,
                },
            });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: "Server error" });
        }
    }
);

router.post(
    "/login",
    [
        body("email").isEmail().withMessage("Valid email required"),
        body("password").notEmpty().withMessage("Password required"),
    ],
    async (req: Request, res: Response): Promise<Response> => {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(400).json({ message: "Validation failed", errors: errors.array() });

        const { email, password } = req.body;

        try {
            const user = await User.findOne({ email });
            if (!user) return res.status(400).json({ message: "Invalid credentials" });

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch)
                return res.status(400).json({ message: "Invalid credentials" });

            return res.json({
                message: "Login successful",
                user: {
                    id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    profilePicture: user.profilePicture,
                    birthdate: user.birthdate,
                    phoneNumber: user.phoneNumber,
                },
            });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: "Server error" });
        }
    }
);

export default router;
