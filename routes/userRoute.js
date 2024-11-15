import { Router } from "express";
import {
  registerUser,loginUser,logoutUser} from "../controllers/usercontroller.js";

import { upload } from "../middlewares/multer.js"; 

const router = Router(); // Define the router

router.post("/register", upload.fields([
  {
    name : 'ProfilePhoto',
    maxCount : 1
  }
]), registerUser);
router.post("/login", loginUser);
router.post('/logout',logoutUser
);


export default router;
