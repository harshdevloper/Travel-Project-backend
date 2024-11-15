import jwt from 'jsonwebtoken';
import { User } from '../models/userSchema.js';

// Middleware to check if user is an admin// Middleware to check if user is an admin
const isAdmin = async (req, res, next) => {
    try {
      const token = req.cookies.accessToken;
      if (!token) return res.status(401).json({ message: "Access Denied, No Token Provided" });
  
      // Decode the token
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      console.log('Decoded Token:', decoded);
  
  
      // Fetch user from the database using the ID from the decoded token
      const user = await User.findById(decoded._id);
      console.log('User:', user);
      if (!user) {
        console.log('User not found with ID:', decoded._id); // Log the ID and error message
        return res.status(403).json({ message: "Access Denied, User Not Found" });
      }
  
    //   // Check if the user has admin role
      if (user.role !== "admin") {
        return res.status(403).json({ message: "Access Denied, Admin Privileges Required" });
      }
  
      req.user = user; // Attach user to the request for later use
      next(); // Proceed to the next middleware/controller
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
  

// Middleware to check if user is a regular user
const isUser = async (req, res, next) => {
  try {
    const token = req.cookies.accessToken; // Changed to accessToken (same as in the loginUser function)
    if (!token) return res.status(401).json({ message: "Access Denied, No Token Provided" });

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    
    const user = await User.findById(decoded.id);
    if (!user || user.role !== "user") {
      return res.status(403).json({ message: "Access Denied, User Privileges Required" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export { isAdmin, isUser };
