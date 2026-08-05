const foodService = require("../services/foodService");

/**
 * Controller to handle HTTP requests/responses and delegate business logic to foodService.
 */

// Add new food item
const addFoodItem = async (req, res) => {
    try {
        const savedFood = await foodService.createFood(req.body);
        return res.status(201).json({
            success: true,
            message: "Food item created successfully",
            data: savedFood
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message || "Failed to create food item"
        });
    }
};

// Get all food items with optional filters
const getFoodItems = async (req, res) => {
    try {
        const foods = await foodService.getAllFoods(req.query);
        return res.status(200).json({
            success: true,
            count: foods.length,
            data: foods
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Server Error fetching food items"
        });
    }
};

// Get single food item by ID
const getSingleFoodItem = async (req, res) => {
    try {
        const food = await foodService.getFoodById(req.params.id);
        if (!food) {
            return res.status(404).json({
                success: false,
                message: "Food item not found"
            });
        }
        return res.status(200).json({
            success: true,
            data: food
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message || "Invalid ID format or server error"
        });
    }
};

// Update food item details
const updateFoodItem = async (req, res) => {
    try {
        const id = req.params.id || req.params._id;
        const food = await foodService.updateFood(id, req.body);

        if (!food) {
            return res.status(404).json({
                success: false,
                message: "Food item not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Food item updated successfully",
            data: food
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message || "Failed to update food item"
        });
    }
};

// Delete food item
const removeFoodItem = async (req, res) => {
    try {
        const food = await foodService.deleteFood(req.params.id);

        if (!food) {
            return res.status(404).json({
                success: false,
                message: "Food item not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Food item deleted successfully"
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message || "Failed to delete food item"
        });
    }
};

module.exports = {
    addFoodItem,
    getFoodItems,
    getSingleFoodItem,
    updateFoodItem,
    removeFoodItem
};
