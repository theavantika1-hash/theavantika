const mongoose = require("mongoose");

const choiceOfCrustSchema = new mongoose.Schema({
    name: {
        type: String,
        default: ""
    },
    price: {
        type: Number,
        default: 0
    }
}, { _id: false });

const toppingSchema = new mongoose.Schema({
    name: {
        type: String,
        default: ""
    },
    price: {
        type: Number,
        default: 0
    }
}, { _id: false });

const cartItemSchema = new mongoose.Schema({
    foodId: {
        type: mongoose.Schema.Types.Mixed,
        default: ""
    },
    foodName: {
        type: String,
        required: [true, "Food name is required"],
        trim: true
    },
    foodImage: {
        type: String,
        default: ""
    },
    foodPrice: {
        type: Number,
        required: [true, "Food base price is required"]
    },
    foodType: {
        type: String,
        default: ""
    },
    choiceOfCrust: {
        type: choiceOfCrustSchema,
        default: () => ({ name: "", price: 0 })
    },
    extraToppings: {
        type: [toppingSchema],
        default: []
    },
    quantity: {
        type: Number,
        required: true,
        min: [1, "Quantity must be at least 1"],
        default: 1
    },
    itemTotalPrice: {
        type: Number,
        required: true,
        default: 0
    },
    specialInstructions: {
        type: String,
        default: "",
        trim: true
    }
}, { timestamps: true });

const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.Mixed,
        required: [true, "User ID is required"]
    },
    items: [cartItemSchema],
    totalItems: {
        type: Number,
        default: 0
    },
    totalAmount: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

module.exports = mongoose.model("Cart", cartSchema);

