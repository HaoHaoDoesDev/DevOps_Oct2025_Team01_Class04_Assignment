import { Router } from "express";
import multer from "multer";
import { FileController } from "../controllers/file-controller.js";
import { authenticateToken } from "../middleware/auth-middleware.js";

const router: Router = Router();

const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "application/pdf",
      "text/plain",
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Invalid file type. Only JPEG, PNG, PDF, and TXT are allowed.",
        ),
      );
    }
  },
});

router.post("/upload",authenticateToken, upload.single("file"), FileController.uploadFile);
router.get("/download/:fileId", authenticateToken, FileController.downloadFile);
router.get("/", authenticateToken, FileController.getAllFiles);
router.delete("/delete/:fileId", authenticateToken, FileController.deleteFile);
export default router;
