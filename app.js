import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import userRouter from './routes/userRoute.js';
import adminRouter from './routes/AdminRoute.js';
import weatherRouter from './routes/weatherRoute.js';
import restaurantRouter from './routes/restaurantRoute.js';


import { config } from 'dotenv';
import { corsOptions } from './origin/corsOptions.js';

// Correct usage of dotenv config
config({ path: './.env' });

const app = express();



// Enable CORS with custom options
app.use(cors(corsOptions));

// Middleware setup
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());


// Route setup
app.use('/api/v1/user', userRouter);  // Assuming user management routes
app.use('/api/v1/admin', adminRouter);  // Assuming admin management routes
app.use('/api/v1/weather', weatherRouter);
app.use('/api/v1/restaurants', restaurantRouter);
export { app };
