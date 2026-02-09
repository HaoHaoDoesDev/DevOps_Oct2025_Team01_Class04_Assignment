import { Router } from "express";
import { createUserAccount, removeUserAccount,  } from "../controllers/user-controller.js";
import { authorizeAdmin } from "../middleware/role-middleware.js";

const router: Router = Router();
router.post("/users", authorizeAdmin, createUserAccount);
router.delete("/users/:id", authorizeAdmin, removeUserAccount);

export default router;