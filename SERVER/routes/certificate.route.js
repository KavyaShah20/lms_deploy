import { Router } from "express";
import isAuthenticated from "../Middlewares/isAuthenticated.js";
import generateCertificate from "../controllers/certificate.controller.js";

const router = Router();

router.post("/generate", isAuthenticated, generateCertificate);

export default router;