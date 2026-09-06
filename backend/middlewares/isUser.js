import { User } from "../models/userModel.js";
import ExpressError from "../utils/ExpressError.js";

export const isUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.id);

        if (!user) {
            return next(new ExpressError("User not found", 404));
        }

        if (user.role !== "user") {
            return next(
                new ExpressError("Access denied. Users only.", 403)
            );
        }

        next();
    } catch (error) {
        next(new ExpressError(error.message, 500));
    }
};