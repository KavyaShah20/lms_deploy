import express from "express"
import dotenv from "dotenv";
import connectDB from "./database/db.js";
import userRoute from "./routes/user.route.js"
import courseRoute from './routes/course.route.js'
import mediaRoute from './routes/media.route.js'
import purchaseRoute from './routes/purchaseCourse.route.js'
import courseProgressRoute from './routes/courseProgress.route.js'
import certificateRoute from './routes/certificate.route.js'
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

dotenv.config({});

// call Database for connectivity`
connectDB();
const app = express();

const port = process.env.PORT || 8080;

//default middleware
app.use(express.json());
app.use(cookieParser());

// Fixed CORS configuration
const allowedOrigins = [
  "http://localhost:5173",
  "https://client.vercel.app", // Add your frontend URL here
  process.env.FRONTEND_URL
].filter(Boolean); // Remove any undefined values

app.use(cors({
   origin: function (origin, callback) {
     // Allow requests with no origin (like mobile apps or curl requests)
     if (!origin) return callback(null, true);
     
     if (allowedOrigins.indexOf(origin) !== -1) {
       callback(null, true);
     } else {
       callback(new Error('Not allowed by CORS'));
     }
   },
   credentials: true,
   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
   allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}));

// API's 
app.use("/api/v1/media", mediaRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/course", courseRoute);
app.use("/api/v1/purchase", purchaseRoute);
app.use("/api/v1/progress", courseProgressRoute);
app.use("/api/v1/certificate", certificateRoute);

// Serve the certificates folder statically
const __dirname = path.resolve();
app.use("/api/v1/certificate", express.static(path.join(__dirname, "certificates")));

app.listen(port, () => {
    console.log(`Server listening at port ${port}`);
});