const express = require("express");
const router = express.Router();
const {
  createOrder,
  fetchOrderById,
  updateOrderToPaid,
  createPaypalOrder,
  capturePayment,
  cancelOrder,
  generatePdf,
  getInvoice
} = require("../controllers/orderController");
const authMiddleware = require("../middlewares/authMiddleware");

// @desc Create an order
// @route POST /api/orders
// @access Private
router.post("/", authMiddleware, createOrder);

// @desc Get order by ID
// @route GET /api/orders/:id
// @access Private
router.get("/:id", authMiddleware, fetchOrderById);

// @desc Update order to paid
// @route PUT /api/orders/:id
// @access Private
router.put("/:id", authMiddleware, updateOrderToPaid);

// @desc Update order to paid
// @route PUT /api/orders/:id
// @access Private
router.put("/:id", authMiddleware, updateOrderToPaid);

// @desc create an order
// @route POST /api/orders/create-order
// @access Private
router.post("/create-order", authMiddleware, createPaypalOrder);

// @desc capture payment
// @route POST /api/orders/:orderID/capture
// @access Public
router.post("/:orderID/capture", capturePayment);

// @desc cancel Order
// @route PUT /api/orders/:orderID/cancel
// @access Private
router.put("/:orderID/cancel", authMiddleware, cancelOrder);

// @desc create Invoice
// @route GET /api/orders/create-invoice/:id
// @access Public
router.get('/create-invoice/:id', generatePdf);

// @desc get Invoice
// @route GET /api/orders/get-invoice
// @access Private
router.get('/invoices/get', getInvoice);

module.exports = router;
