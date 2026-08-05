const mongoose = require("mongoose");

const FoodIngredientSchema = new mongoose.Schema({
    name: {
        type: String,
        default: ""
    },
    quantity: {
        type: String,
        default: ""
    }
}, { _id: false });

const FoodSchema = new mongoose.Schema({
    foodName: {
        type: String,
        required: [true, "Food name is required"],
        trim: true
    },
    foodPrice: {
        type: Number,
        required: [true, "Food price is required"]
    },
    foodType: {
        type: String,
        default: "Vegetarian",
        trim: true
    },
    foodCategory: {
        type: String,
        required: [true, "Food category is required"],
        trim: true
    },
    foodSubCategory: {
        type: String,
        trim: true,
        default: ""
    },
    foodSecondSubCategory: {
        type: String,
        trim: true,
        default: ""
    },
    foodImage: {
        type: String,
        default: ""
    },
    subImages: {
        type: [String],
        default: []
    },
    foodDescription: {
        type: String,
        trim: true,
        default: ""
    },
    foodItems: {
        type: [FoodIngredientSchema],
        default: []
    },
    preparationTime: {
        type: String,
        default: "15 mins"
    },
    rating: {
        type: Number,
        default: 5.0
    },
    visibility: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Food", FoodSchema);

