// import express from "express";
// import dotenv from "dotenv";
// import connectDB from "./database/db.js";
// import userRoute from "./routes/user.route.js";
// import cors from "cors";
// import cookieParser from "cookie-parser";
// import courseRoute from "./routes/course.route.js";
// import mediaRoute from "./routes/media.route.js";
// import purchaseRoute from "./routes/purchaseCourse.route.js"
// import courseProgressRoute from "./routes/courseProgress.route.js"
// dotenv.config({});
// connectDB();

// const app= express();

// const port = process.env.PORT || 3000;
// //middlewares
// app.use(express.json());
// app.use(cookieParser());
// app.use(cors({
//     origin: "http://localhost:5173",
//     credentials: true
// }))

// //apis
// app.use('/api/v1/media' , mediaRoute);
// app.use("/api/v1/user", userRoute);
// app.use("/api/v1/course", courseRoute);
// app.use('/api/v1/purchase', purchaseRoute);
// app.use('/api/v1/progress', courseProgressRoute); 

// app.listen(8080, ()=> {
//     console.log(`Server listen at port ${port}`);
// });

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
app.use(cors({
  origin: 'https://lms-deploy-te62.vercel.app',
  credentials: true
}));



// API's 
app.use("/api/v1/media", mediaRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/course", courseRoute);
app.use("/api/v1/purchase", purchaseRoute);
app.use("/api/v1/progress", courseProgressRoute);
app.use("/api/v1/certificate", certificateRoute);

// // Serve the certificates folder statically
const __dirname = path.resolve();
// app.use("/api/v1/certificate", express.static(path.join(__dirname, "certificates")));

// Serve the certificates directory statically
app.use("/api/v1/certificate", express.static(path.join(__dirname, "certificates")));

// Use certificate routes
app.use("/api/v1/certificate", certificateRoute);

app.listen(port, () => {
    console.log(`Server listening at port ${port}`);
});