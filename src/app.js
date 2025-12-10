import express from "express";
import collegeRoutes from "./routes/collegeRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import cors from "cors";



const app = express();

app.use(cors({
  origin: [
    "http://localhost:4200",
    "https://pmd-college-frontend.vercel.app",   // change to your actual domain
    "https://pmd-college.vercel.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());
app.use('/uploads', express.static('uploads'));


// Authentication routes
app.use("/api/auth", authRoutes);

// College routes (protected)
app.use("/api/college", collegeRoutes);

//Events route
app.use("/api/events", eventRoutes);


app.get("/", (req, res) => {
  res.send("Backend running!");
});

export default app;
