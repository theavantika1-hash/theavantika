const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

// Order endpoints
router.post("/place", orderController.placeOrder);
router.post("/", orderController.placeOrder);
router.get("/all", orderController.getAllOrders);
router.get("/user/:userId", orderController.getUserOrders);
router.get("/:userId", orderController.getUserOrders);
router.get("/", orderController.getAllOrders);
router.put("/status/:orderId", orderController.updateOrderStatus);
router.put("/:orderId", orderController.updateOrderStatus);

module.exports = router;
