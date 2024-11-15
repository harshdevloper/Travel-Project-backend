// C:\Users\harsh\Downloads\Travel_project\backend\routes\userRoute.js
import express from 'express';
import { Router } from 'express';
import { getuser } from '../controllers/admincontroller.js';
import { isAdmin } from '../middlewares/auth.js';
const router = Router();

// Define a sample route
router.get('/getuser',isAdmin, getuser);

export default router;
