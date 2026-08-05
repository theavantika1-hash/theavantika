const express = require("express");
const router = express.Router();
const foodController = require("../controllers/foodController");

// Route paths mapped to controller functions
router.post("/", foodController.addFoodItem);
router.get("/", foodController.getFoodItems);
router.get("/:id", foodController.getSingleFoodItem);
router.put("/:id", foodController.updateFoodItem);
router.delete("/:id", foodController.removeFoodItem);

module.exports = router;
