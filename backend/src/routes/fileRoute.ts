import { Router, type IRouter } from "express";
import multer from 'multer'; // Import multer here
import { FileController } from '../controllers/fileController.js';

const router: Router = Router();

const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, 
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf', 'text/plain'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, PDF, and TXT are allowed.'));
    }
  }
});

router.post(
  '/upload', 
  upload.single('file'), 
  FileController.uploadFile
);

export default router;