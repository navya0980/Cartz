import { User } from "../models/userModel.js";
import bcrypt from "bcrypt";
import { verifyEmail } from "../verifyEmail/verifyEmail.js";
import jwt from "jsonwebtoken";
import ExpressError from "../utils/ExpressError.js";
import dotenv from "dotenv";
dotenv.config();
import { Session } from "../models/sessionModel.js";
import { sendOTPMail } from "../verifyEmail/sendOTPMail.js";
import cloudinary from "../utils/cloudinary.js";


export const register = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return next(new ExpressError("All fields are required", 400));
    }
    const user = await User.findOne({ email });
    if (user) {
      return next(new ExpressError("User Already Exists!! Please Login", 400));
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });
    const token = jwt.sign({ id: newUser._id }, process.env.SECRET, {
      expiresIn: "10m",
    });
    await verifyEmail(token, email);
    newUser.token = token;
    await newUser.save();
    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: newUser,
    });
  } catch (error) {
    return next(new ExpressError(error.message, 500));
  }
};

export const verify = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(
        new ExpressError("Authorization token is missing or invalid", 400),
      );
    }
    const token = authHeader.split(" ")[1];

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.SECRET);
    } catch (err) {
      if (err.message === "TokenExpiredError") {
        return next(new ExpressError("Token has expired", 400));
      }
      return next(new ExpressError("Token verification failed", 400));
    }
    const user = await User.findById(decoded.id);
    if (!user) {
      return next(new ExpressError("User not found", 400));
    }
    user.token = null;
    user.isVerified = true;
    await user.save();
    return res
      .status(200)
      .json({ message: "Email verified successfully", success: true });
  } catch (err) {
    return next(new ExpressError(err.message, 500));
  }
};

export const reVerify = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return next(new ExpressError("User not found", 400));
    }
    const token = jwt.sign({ id: user._id }, process.env.SECRET, {
      expiresIn: "10m",
    });
    await verifyEmail(token, email);
    user.token = token;
    await user.save();
    return res.status(201).json({
      success: true,
      message: "Verification email sent again successfully",
      token: user.token,
    });
  } catch (err) {
    return next(new ExpressError(err.message, 500));
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new ExpressError("All fields are required", 400));
    }
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return next(new ExpressError("User not found", 400));
    }
    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password,
    );
    if (!isPasswordValid) {
      return next(new ExpressError("Password is invalid", 400));
    }
    if (existingUser.isVerified === false) {
      return next(new ExpressError("Verify and then login", 400));
    }
    //generate token
    const accessToken = jwt.sign({ id: existingUser._id }, process.env.SECRET, {
      expiresIn: "10d",
    });
    const refreshToken = jwt.sign(
      { id: existingUser._id },
      process.env.SECRET,
      { expiresIn: "30d" },
    );
    existingUser.isLoggedIn = true;
    await existingUser.save();
    //check for existing session before creating a new one
    const existingSession = await Session.findOne({ userId: existingUser._id });
    if (existingSession) {
      await Session.deleteOne({ userId: existingUser._id });
    }

    //create a new session
    const session = await Session.create({
      userId: existingUser._id,
    });
    await session.save();
    return res.status(200).json({
      success: true,
      message: `Welcome back ${existingUser.firstName}`,
      user: existingUser,
      accessToken,
      refreshToken,
    });
  } catch (err) {
    return next(new ExpressError(err.message, 500));
  }
};

export const logout = async (req, res, next) => {
  try {
    const userId = req.id;
    await Session.deleteMany({ userId: userId });
    await User.findByIdAndUpdate(userId, { isLoggedIn: false });
    return res.status(200).json({
      success: true,
      message: "User logged out successfully",
    });
  } catch (err) {
    return next(new ExpressError("Internal Server error", 500));
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return next(new ExpressError("User not found", 400));
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    user.otp = otp;
    user.otpExpiry = otpExpiry;

    await user.save();
    await sendOTPMail(otp, email);
    return res.status(200).json({
      success: true,
      message: "OTP sent to email successfully",
    });
  } catch (error) {
    return next(new ExpressError("Internal Server error", 500));
  }
};

export const verifyOtp = async (req, res, next) => {
  try {
    const { otp } = req.body;
    const { email } = req.params;

    if (!otp) {
      return next(new ExpressError("OTP is required", 400));
    }
    const user = await User.findOne({ email });
    if (!user) {
      return next(new ExpressError("User not found", 400));
    }
    if (!user.otp || !user.otpExpiry) {
      return next(
        new ExpressError("OTP is not generated or already verified", 400),
      );
    }
    if (user.otpExpiry < new Date()) {
      return next(
        new ExpressError("OTP has expired.Please request a new one!!", 400),
      );
    }
    if (otp !== user.otp) {
      return next(new ExpressError("OTP is invalid", 400));
    }
    user.otp = null;
    user.otpExpiry = null;
    await user.save();
    return res.status(200).json({
      success: true,
      message: "OTP is successfully verified",
    });
  } catch (error) {
    return next(new ExpressError("Internal Server error", 500));
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { newPassword, confirmPassword } = req.body;
    const { email } = req.params;
    const user = await User.findOne({ email });
    if (!user) {
      return next(new ExpressError("User not found", 400));
    }
    if (!newPassword || !confirmPassword) {
      return next(new ExpressError("Both fields are required", 400));
    }
    if (newPassword !== confirmPassword) {
      return next(new ExpressError("Passwords do not match", 400));
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    return res.status(200).json({
      message: "Password changed successfully",
      success: "true",
    });
  } catch (error) {
    return next(new ExpressError("Internal Server error", 500));
  }
};

export const allUser = async (_, res, next) => {
  try {
    const users = await User.find();
    return res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    return next(new ExpressError("Internal Server error", 500));
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select(
      "-password -otp -otpExpiry -token",
    );
    if (!user) {
      return next(new ExpressError("User not found", 404));
    }
    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return next(new ExpressError("Internal Server error", 500));
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const userIdToUpdate = req.params.id;
    const loggedInUser = req.user;
    
    const { firstName, lastName, address, city, zipCode, phoneNo ,role} =
      req.body;

    //users can only upadte their profile and admin
    //This is a common authorization pattern: users can update their own profiles, while administrators can update any user's profile.
    if (
      loggedInUser._id.toString()!== userIdToUpdate &&
      loggedInUser.role !== 'admin'
    ) {
      return next(
        new ExpressError("You are not allowed to update this profile", 403),
      );
    }

    let user = await User.findById(userIdToUpdate);
    if (!user) {
      return next(new ExpressError("User not found"), 404);
    }

    let profilePicUrl = user.profilePic;
    let profilePicPublicId = user.profilePicPublicId;

    //if a new file is uploaded
    if (req.file) {
      if (profilePicPublicId) {
        await cloudinary.uploader.destroy(profilePicPublicId);
      }
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "profiles" },
          (error, result) => {
            if (error) {
              console.log(error);
             return reject(error);
            }
            else resolve(result);
          },
        );
        stream.end(req.file.buffer);
      });
      profilePicUrl = uploadResult.secure_url;
      profilePicPublicId = uploadResult.public_id;
    }
   
    // Update fields
    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.address = address || user.address;
    user.city = city || user.city;
    user.zipCode = zipCode || user.zipCode;
    user.phoneNo = phoneNo || user.phoneNo;
    user.profilePic = profilePicUrl;
    user.profilePicPublicId = profilePicPublicId;
    if (loggedInUser.role === "admin" && req.body.role) {
    user.role = req.body.role;
}
    const updatedUser = await user.save();
   
    return res.status(200).json({
      success: true,
      message: "Profile Updated Successfully",
      user: updatedUser,
    });
  } catch (error) {
    return next(new ExpressError(error.message, 500));
  }
};

export const getCurrentUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.id).select("-password");

        res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {
        next(error);
    }
};