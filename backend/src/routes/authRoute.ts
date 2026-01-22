import { Router, type IRouter } from "express";
import { login } from "../controllers/authController.js";

const router: Router = Router();

// Endpoint: POST /api/login
router.post("/login", login);

export default router;