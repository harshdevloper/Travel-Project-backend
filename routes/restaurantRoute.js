import express from 'express';
import { createRestaurant, getAllRestaurants, getRestaurantById, updateRestaurant, deleteRestaurant } from '../controllers/restaurantcontoller.js';
import { upload } from '../middlewares/multer.js';

const router = express.Router();

router.post('/add', upload.fields([{

    name :'restaurantImage',
    maxCount : 1
}
   
]),createRestaurant);
router.get('/getAllrestaurants', getAllRestaurants);
router.get('/restaurants/:id', getRestaurantById);
router.put('/restaurants/:id', updateRestaurant);
router.delete('/restaurants/:id', deleteRestaurant);

export default router;
