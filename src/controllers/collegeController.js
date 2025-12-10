import { db } from "../config/db.js";

export const addCollege = async (req, res) => {
  try {
    const { name, address, pincode, contact, email, website } = req.body;

    const query = `
      INSERT INTO college (name, address, pincode, contact, email, website)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.execute(query, [
      name,
      address,
      pincode,
      contact,
      email,
      website,
    ]);

    // Fetch the newly inserted row
    const [savedData] = await db.execute(
      "SELECT * FROM college WHERE id = ?",
      [result.insertId]
    );

    res.json({
      success: true,
      data: savedData[0],
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const getCollege = async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM college LIMIT 1");

    res.json({ success: true, data: rows[0] });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
