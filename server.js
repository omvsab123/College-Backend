
import "./src/config/env.js";   // Load env FIRST before any other import

import app from "./src/app.js";


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
