const mongoose = require("mongoose");

const InventorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Inventory item name is required"],
        trim: true,
        unique: true
    },
    totalQty: {
        type: Number,
        required: [true, "Total quantity is required"],
        default: 0
    },
    usedQty: {
        type: Number,
        default: 0
    },
    unit: {
        type: String,
        required: [true, "Unit is required"],
        default: "kg"
    },
    price: {
        type: Number,
        required: [true, "Price is required"],
        default: 0
    },
    date: {
        type: String,
        default: () => new Date().toISOString().split('T')[0]
    },
    addedBy: {
        type: String,
        default: "Admin"
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Inventory", InventorySchema);
