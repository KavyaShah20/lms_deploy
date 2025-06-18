import express from "express";
import isAuthenticated from "../Middlewares/isAuthenticated.js"
import { createCheckoutSession, getAllPurchasedCourse, getCourseDetailWithPurchaseStatus, stripewebhook } from "../controllers/coursePurchase.controller.js";
const router = express.Router();
router.route('/checkout/create-checkout-session').post(isAuthenticated, createCheckoutSession)
router.route('/webhook').post(express.raw({ type: 'application/json' }), stripewebhook);
router.route("/course/:courseId/detail-with-status").get(isAuthenticated, getCourseDetailWithPurchaseStatus);
router.route('/').get(isAuthenticated, getAllPurchasedCourse);

export default router;