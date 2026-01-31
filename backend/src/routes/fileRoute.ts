import { Router, type IRouter } from "express";
import { FileController } from "../controllers/fileController.js";

const router: Router = Router();

router.post("/upload", FileController.uploadFile);

export default router;