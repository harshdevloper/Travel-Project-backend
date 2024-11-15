import dotenv from 'dotenv';
import {app} from './app.js';

import dbConnect from '../backend/db/database.js';
dotenv.config({
    path:"./.env"
});


import {v2 as cloudinary} from 'cloudinary'
import fs from 'fs'


          
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});


dbConnect()
        .then(() => {
            console.log('MongoDB Connected')
            app.listen(process.env.PORT || 5000 , () => {
                console.log(`Server is Running at ${process.env.PORT || 4000}`)
            })
        })
        .catch((err)=>{
            console.log("MongoDB Connection Failed",err);
        })