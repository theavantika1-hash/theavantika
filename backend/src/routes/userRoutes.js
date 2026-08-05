const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// User endpoints
router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);
router.get("/", userController.getAllUsers);
router.get("/all", userController.getAllUsers);
router.get("/customers", userController.getAllUsers);

// User address endpoints
router.get("/address", userController.getUserAddresses);
router.get("/address/:userId", userController.getUserAddresses);
router.get("/:userId/address", userController.getUserAddresses);

router.post("/address", userController.addAddress);
router.post("/address/:userId", userController.addAddress);
router.post("/:userId/address", userController.addAddress);

router.put("/address/:addressId", userController.updateAddress);
router.put("/:userId/address/:addressId", userController.updateAddress);

router.delete("/address/:addressId", userController.deleteAddress);
router.delete("/:userId/address/:addressId", userController.deleteAddress);

module.exports = router;



