const express = require("express");
const router = express.Router();
const inventoryController = require("../controllers/inventoryController");

// Stock/Inventory management routes
router.get("/", inventoryController.getAllInventory);
router.post("/", inventoryController.addInventoryItem);
router.put("/:id", inventoryController.updateInventoryItem);
router.delete("/:id", inventoryController.deleteInventoryItem);

// Recipe mapping routes
router.get("/recipes", inventoryController.getAllRecipes);
router.post("/recipes", inventoryController.saveRecipe);

module.exports = router;
