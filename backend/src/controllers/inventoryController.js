const Inventory = require("../models/Inventory");
const Recipe = require("../models/Recipe");

// Retrieve all inventory items
const getAllInventory = async (req, res) => {
    try {
        let items = await Inventory.find({}).sort({ createdAt: -1 });
        
        // Seed default items if the collection is empty
        if (items.length === 0) {
            const defaults = [
                { name: 'Paneer (Raw)', totalQty: 5, usedQty: 2, unit: 'kg', price: 350, date: new Date().toISOString().split('T')[0], addedBy: 'Admin' },
                { name: 'Tomatoes', totalQty: 10, usedQty: 4, unit: 'kg', price: 120, date: new Date().toISOString().split('T')[0], addedBy: 'Admin' },
                { name: 'Amul Butter', totalQty: 2, usedQty: 1, unit: 'kg', price: 520, date: new Date().toISOString().split('T')[0], addedBy: 'Admin' },
                { name: 'Fresh Cream', totalQty: 4, usedQty: 0, unit: 'Litre', price: 280, date: new Date().toISOString().split('T')[0], addedBy: 'Admin' }
            ];
            await Inventory.insertMany(defaults);
            items = await Inventory.find({}).sort({ createdAt: -1 });
        }

        return res.status(200).json({ success: true, data: items });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message || "Failed to fetch inventory" });
    }
};

// Add new inventory item
const addInventoryItem = async (req, res) => {
    try {
        const { name, totalQty, unit, price, date, addedBy } = req.body;
        if (!name || totalQty === undefined || price === undefined) {
            return res.status(400).json({ success: false, message: "Name, total quantity and price are required" });
        }

        const existing = await Inventory.findOne({ name: name.trim() });
        if (existing) {
            // If already exists, update the totalQty and price
            existing.totalQty += parseFloat(totalQty);
            existing.price += parseFloat(price);
            if (date) existing.date = date;
            const updated = await existing.save();
            return res.status(200).json({ success: true, message: "Inventory item updated successfully", data: updated });
        }

        const newItem = new Inventory({
            name: name.trim(),
            totalQty: parseFloat(totalQty),
            usedQty: 0,
            unit: unit || "kg",
            price: parseFloat(price),
            date: date || new Date().toISOString().split('T')[0],
            addedBy: addedBy || "Admin"
        });

        const saved = await newItem.save();
        return res.status(201).json({ success: true, message: "Inventory item added successfully", data: saved });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message || "Failed to add inventory item" });
    }
};

// Update existing inventory item (used quantity, total quantity, etc.)
const updateInventoryItem = async (req, res) => {
    try {
        const { id } = req.params;
        const { usedQty, totalQty, price, name } = req.body;

        const item = await Inventory.findById(id);
        if (!item) {
            return res.status(404).json({ success: false, message: "Inventory item not found" });
        }

        if (usedQty !== undefined) {
            // clamp usedQty between 0 and totalQty
            item.usedQty = Math.min(Math.max(0, parseFloat(usedQty)), item.totalQty);
        }
        if (totalQty !== undefined) item.totalQty = parseFloat(totalQty);
        if (price !== undefined) item.price = parseFloat(price);
        if (name !== undefined) item.name = name.trim();

        const updated = await item.save();
        return res.status(200).json({ success: true, message: "Inventory item updated", data: updated });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message || "Failed to update inventory item" });
    }
};

// Delete inventory item
const deleteInventoryItem = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Inventory.findByIdAndDelete(id);
        if (!deleted) {
            return res.status(404).json({ success: false, message: "Inventory item not found" });
        }
        return res.status(200).json({ success: true, message: "Inventory item deleted successfully" });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message || "Failed to delete inventory item" });
    }
};

// Retrieve all recipes
const getAllRecipes = async (req, res) => {
    try {
        const recipes = await Recipe.find({}).sort({ foodName: 1 });
        return res.status(200).json({ success: true, data: recipes });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message || "Failed to fetch recipes" });
    }
};

// Create or Update a Recipe mapping
const saveRecipe = async (req, res) => {
    try {
        const { foodName, ingredients } = req.body;
        if (!foodName || !Array.isArray(ingredients)) {
            return res.status(400).json({ success: false, message: "Food name and ingredients array are required" });
        }

        const savedRecipe = await Recipe.findOneAndUpdate(
            { foodName: foodName.trim() },
            { $set: { ingredients } },
            { new: true, upsert: true }
        );

        return res.status(200).json({ success: true, message: "Recipe mapping saved successfully", data: savedRecipe });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message || "Failed to save recipe" });
    }
};

module.exports = {
    getAllInventory,
    addInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
    getAllRecipes,
    saveRecipe
};
