import mongoose from 'mongoose';

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  cuisine: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5 },
  priceRange: { type: String,  },
  contact: { type: String },
  restaurantImage: { type: String },
  description: { type: String }
}, { timestamps: true });

export default mongoose.model('Restaurant', restaurantSchema);
