import Restaurant from '../models/restaurantSchema.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import { ApiError } from '../utils/ApiError.js'; // Assuming ApiError is a custom error handling class

// Create a new restaurant
export const createRestaurant = async (req, res, next) => {
  try {
    const { name, location, cuisine, rating, priceRange, contact, description } = req.body;

    // Create a restaurant object with the incoming data
    const restaurant = new Restaurant({
      name,
      location,
      cuisine,
      rating,
      priceRange,
      contact,
      description
    });

    // Handle restaurant image upload
    const restaurantImageLocalPath = req.files?.restaurantImage?.[0]?.path;
    if (!restaurantImageLocalPath) {
      return next(new ApiError(400, 'Restaurant image is required'));
    }

    // Upload restaurant image to Cloudinary
    const restaurantImage = await uploadOnCloudinary(restaurantImageLocalPath);
    if (!restaurantImage) {
      return next(new ApiError(500, 'Error uploading restaurant image'));
    }

    // Save Cloudinary URL in the restaurant object
    restaurant.restaurantImage = restaurantImage.secure_url;

    // Save the restaurant data into the database
    await restaurant.save();
    res.status(201).json({ message: 'Restaurant created successfully', restaurant });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all restaurants
export const getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    res.status(200).json(restaurants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get restaurant by ID
export const getRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });
    res.status(200).json(restaurant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update restaurant
export const updateRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });
    res.status(200).json({ message: 'Restaurant updated successfully', restaurant });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete restaurant
export const deleteRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findByIdAndDelete(req.params.id);
    if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });
    res.status(200).json({ message: "Restaurant deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
