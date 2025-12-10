import express from "express";
import {
  uploadEventImage,
  addEvent,
  getEvents,
  deleteEvent
} from "../controllers/eventController.js";

import { upload } from "../middlewares/upload.js";
import { isAuthenticated } from "../middlewares/authMiddleware.js";


const router = express.Router();

router.post("/upload-image", isAuthenticated, upload.single("image"), uploadEventImage);

router.post("/add", isAuthenticated, addEvent);

router.get("/all", getEvents);

router.delete("/delete/:id", isAuthenticated, deleteEvent);

export default router;
