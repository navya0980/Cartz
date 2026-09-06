import express from "express";
const router=express.Router();
import {allUser, changePassword, forgotPassword, getUserById, login,logout, register,reVerify,updateUser,verify, verifyOtp,getCurrentUser} from "../controllers/userController.js"
import { isAuthenticated,isAdmin } from "../middlewares/isAuthenticated.js";
import ExpressError from "../utils/ExpressError.js";
import { singleUpload } from "../middlewares/multer.js";


router.post("/register",register);
router.post("/verify",verify);
router.post("/reverify",reVerify);
router.post("/login",login);
router.post("/logout",isAuthenticated,logout);
router.post("/forgot-password",forgotPassword)
router.post("/verify-otp/:email",verifyOtp);
router.post("/change-password/:email",changePassword);
router.get("/all-users",isAuthenticated,isAdmin,allUser);
router.get("/get-user/:userId",isAuthenticated,isAdmin,getUserById);
router.put("/update/:id",isAuthenticated,singleUpload,updateUser);
router.get("/me", isAuthenticated, getCurrentUser);

export default router;