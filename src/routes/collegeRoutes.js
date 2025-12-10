import express from "express";
import { addCollege, getCollege } from "../controllers/collegeController.js";
import { isAuthenticated } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/add", isAuthenticated, addCollege);
router.get("/info", isAuthenticated, getCollege);

export default router;  
