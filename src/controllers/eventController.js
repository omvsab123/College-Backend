import { db } from "../config/db.js";
import cloudinary from "../config/cloudinary.js";

// UPLOAD EVENT IMAGE (Cloudinary)
export const uploadEventImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image uploaded!"
      });
    }

    // Cloudinary URL comes from multer storage
    return res.json({
      success: true,
      imageUrl: req.file.path
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ADD EVENT
export const addEvent = async (req, res) => {
  try {
    const { title } = req.body;
    const imageUrl = req.body.image; // Cloudinary URL from frontend

    if (!title || !imageUrl) {
      return res.status(400).json({
        success: false,
        message: "Title & image are required!"
      });
    }

    const query = `
      INSERT INTO events (title, image)
      VALUES (?, ?)
    `;

    const [result] = await db.execute(query, [title, imageUrl]);

    const [saved] = await db.execute(
      "SELECT * FROM events WHERE id = ?", 
      [result.insertId]
    );

    res.json({
      success: true,
      data: saved[0]
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// GET EVENTS
export const getEvents = async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT * FROM events ORDER BY id DESC"
    );

    res.json({ success: true, data: rows });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE EVENT
export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.execute(
      "DELETE FROM events WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Event not found!"
      });
    }

    res.json({
      success: true,
      message: "Event deleted successfully!"
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
