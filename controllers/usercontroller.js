import { asyncHandler } from '../utils/asyncHandler.js';
import { User } from '../models/userSchema.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';

// @desc    Register a new user
export const registerUser = asyncHandler(async (req, res, next) => {
  try {
    const { fullName, email, password, phonenumber, address, role } = req.body;

    // Check if all required fields are filled
    if (!fullName || !email || !password || !phonenumber || !address || !role) {
      return next(new ApiError(400, 'Please fill all fields'));
    }

    // Check if the user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return next(new ApiError(400, 'User already exists'));
    }

    // Handle profile photo upload
    const ProfilePhotoLocalPath = req.files?.ProfilePhoto?.[0]?.path;
    if (!ProfilePhotoLocalPath) {
      return next(new ApiError(400, 'Profile photo is required'));
    }

    // Upload profile photo to Cloudinary
    const ProfilePhoto = await uploadOnCloudinary(ProfilePhotoLocalPath);
    if (!ProfilePhoto) {
      return next(new ApiError(500, 'Error uploading profile photo'));
    }

    // Create new user in the database
    const newUser = await User.create({
      fullName,
      email,
      password,
      phonenumber,
      address,
      role,
      ProfilePhoto: ProfilePhoto.secure_url, // Store the Cloudinary URL
    });

    // Return the created user (excluding sensitive information like password and refreshToken)
    const createdUser = await User.findById(newUser._id).select('-password -refreshToken');
    if (!createdUser) {
      return next(new ApiError(500, 'Error creating user'));
    }

    res.status(201).json(new ApiResponse(201, 'User registered successfully', createdUser));
  } catch (error) {
    console.error(error);
    return next(new ApiError(500, error.message)); // Pass error to the global error handler
  }
});
// @desc    Login user
export const loginUser = asyncHandler(async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
      return next(new ApiError(400, 'Please fill all fields'));
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return next(new ApiError(400, 'User not found'));
    }

    // Check if the password is correct
    const isPasswordCorrect = await user.isPasswordCorrect(password);
    if (!isPasswordCorrect) {
      return next(new ApiError(400, 'Invalid credentials'));
    }

    // Generate access token
    const accessToken = user.generateAccessToken();

    // Set the token in cookies
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Use HTTPS in production
      maxAge: 3600000, // 1 hour
      sameSite: 'Strict', // Improve CSRF protection
    });

    res.status(200).json(new ApiResponse(200, 'Login successful', user, accessToken));
  } catch (error) {
    console.error(error);
    return next(new ApiError(500, error.message)); // Pass error to the global error handler
  }
});


// @desc    Logout user
export const logoutUser = asyncHandler(async (req, res, next) => {
  try {
    // Clear the access token from cookies
    res.clearCookie('accessToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Use HTTPS in production
      sameSite: 'Strict', // Improve CSRF protection
    });
    res.status(200).json(new ApiResponse(200, 'Logout successful', null));
  } catch (error) {
    console.error(error);
    return next(new ApiError(500, error.message)); // Pass error to the global error handler
  }
});
