const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const {
  createSubscription,
  createPlan,
  productDetails,
  activateSubscription,
  webhooks,
  createAnSubscription,
} = require("../controllers/subscriptionController");

// @desc Create an product subscription
// @route Get /api/subscriptions/create
// @access Public
// router.get("/create", authMiddleware, createSubscription);

// @desc show details of a product subscription
// @route get /api/subscriptions/product/:id
// @access Admin
router.get("/product/:id", authMiddleware, productDetails);

// @desc Create an plan
// @route Get /api/subscriptions/create-plan
// @access Admin
router.post("/create-plan", authMiddleware, createPlan);

// @desc Create an subscription
// @route Get /api/subscriptions/create-plan
// @access Admin
router.post("/create-subscription", authMiddleware, createAnSubscription);

// @desc activate an subscription
// @route Put /api/subscriptions/:id/activate
// @access Private
router.put("/:id/activate", authMiddleware, activateSubscription);

// @desc webhooks subscription
// @route Post /api/subscriptions/webhooks
// @access Public
router.post("/webhooks", webhooks);

module.exports = router;
