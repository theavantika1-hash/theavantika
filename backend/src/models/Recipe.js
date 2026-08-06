const mongoose = require("mongoose");

const RecipeIngredientSchema = new mongoose.Schema({
    inventoryName: {
        type: String,
        required: [true, "Inventory ingredient name is required"],
        trim: true
    },
    qtyNeeded: {
        type: Number,
        required: [true, "Quantity needed is required"],
        default: 0
    }
}, { _id: false });

const RecipeSchema = new mongoose.Schema({
    foodName: {
        type: String,
        required: [true, "Food dish name is required"],
        trim: true,
        unique: true
    },
    ingredients: {
        type: [RecipeIngredientSchema],
        default: []
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Recipe", RecipeSchema);
