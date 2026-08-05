const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");

// Cart endpoints
router.post("/add", cartController.addItemToCart);
router.get("/:userId", cartController.getUserCart);
router.get("/", cartController.getUserCart);
router.put("/item/:itemId", cartController.updateItemQuantity);
router.delete("/item/:itemId", cartController.removeItem);
router.delete("/clear/:userId", cartController.clearUserCart);
router.delete("/clear", cartController.clearUserCart);
router.delete("/:userId", cartController.deleteCart);
router.delete("/", cartController.deleteCart);

module.exports = router;

