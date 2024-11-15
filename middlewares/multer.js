import multer from 'multer';
import { v4 as uuidv4 } from 'uuid'; // To generate a unique suffix

// Set up multer for file storage and filtering
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/temp'); // Ensure this directory exists
  },
  filename: function (req, file, cb) {
  
    cb(null,  file.originalname); // Include original filename for traceability
  }
});

// File filter to allow PDF, JPG, JPEG, and PNG files
const fileFilter = (req, file, cb) => {
  // Allowed file extensions
  const filetypes = /pdf|jpg|jpeg|png/;
  const extname = filetypes.test(file.originalname.toLowerCase()); // Check extension
  const mimetype = filetypes.test(file.mimetype); // Check mimetype

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    return cb(new Error('Only PDF, JPG, JPEG, and PNG files are allowed!'), false);
  }
};

// Multer configuration
export const upload = multer({
  storage: storage,
 
});
