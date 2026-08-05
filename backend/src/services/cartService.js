const Cart = require("../models/cartModel");
const Food = require("../models/Food");
const mongoose = require("mongoose");

/**
 * Helper to calculate price of a single item unit (base price + crust + toppings)
 */
const calculateUnitPrice = (basePrice, crust = {}, toppings = []) => {
    const crustPrice = Number(crust?.price) || 0;
    const toppingsPrice = Array.isArray(toppings)
        ? toppings.reduce((sum, t) => sum + (Number(t?.price) || 0), 0)
        : 0;

    return Number(basePrice) + crustPrice + toppingsPrice;
};

/**
 * Helper to check if two cart items have identical customizations
 */
const areCustomizationsEqual = (itemA, itemB) => {
    const foodA = String(itemA.foodId?._id || itemA.foodId || itemA.foodName || "");
    const foodB = String(itemB.foodId?._id || itemB.foodId || itemB.foodName || "");

    if (foodA !== foodB) return false;

    const crustA = itemA.choiceOfCrust?.name || "";
    const crustB = itemB.choiceOfCrust?.name || "";
    if (crustA !== crustB) return false;

    const toppingsA = Array.isArray(itemA.extraToppings)
        ? itemA.extraToppings.map(t => `${t.name}:${t.price}`).sort().join("|")
        : "";
    const toppingsB = Array.isArray(itemB.extraToppings)
        ? itemB.extraToppings.map(t => `${t.name}:${t.price}`).sort().join("|")
        : "";

    return toppingsA === toppingsB;
};

// Add item to cart
const addToCart = async (userId, itemData) => {
    let {
        foodId,
        foodName,
        foodImage,
        foodPrice,
        foodType,
        choiceOfCrust,
        extraToppings,
        quantity,
        specialInstructions
    } = itemData;

    quantity = Math.max(1, Number(quantity) || 1);

    // If food details not provided, attempt fetch from Food model if foodId is valid ObjectId
    if (!foodName || foodPrice === undefined) {
        if (foodId && mongoose.Types.ObjectId.isValid(foodId)) {
            const foodItem = await Food.findById(foodId);
            if (foodItem) {
                foodName = foodName || foodItem.foodName;
                foodImage = foodImage || foodItem.foodImage || "";
                foodPrice = foodPrice !== undefined ? foodPrice : foodItem.foodPrice;
                foodType = foodType || foodItem.foodType || foodItem.foodCategory || "";
            }
        }
    }

    foodName = foodName || "Food Item";
    foodPrice = Number(foodPrice) || 0;

    const unitPrice = calculateUnitPrice(foodPrice, choiceOfCrust, extraToppings);
    const itemTotalPrice = unitPrice * quantity;

    let cart = await Cart.findOne({ userId });

    if (!cart) {
        cart = new Cart({
            userId,
            items: [],
            totalItems: 0,
            totalAmount: 0
        });
    }

    const newItemTemp = {
        foodId: foodId || foodName,
        foodName,
        choiceOfCrust: choiceOfCrust || { name: "", price: 0 },
        extraToppings: extraToppings || []
    };

    const existingIndex = cart.items.findIndex(item => areCustomizationsEqual(item, newItemTemp));

    if (existingIndex > -1) {
        const existingItem = cart.items[existingIndex];
        existingItem.quantity += quantity;
        const currentUnitPrice = calculateUnitPrice(existingItem.foodPrice, existingItem.choiceOfCrust, existingItem.extraToppings);
        existingItem.itemTotalPrice = currentUnitPrice * existingItem.quantity;
        if (specialInstructions) {
            existingItem.specialInstructions = specialInstructions;
        }
    } else {
        cart.items.push({
            foodId: foodId || foodName,
            foodName,
            foodImage: foodImage || "",
            foodPrice: Number(foodPrice),
            foodType: foodType || "",
            choiceOfCrust: choiceOfCrust || { name: "", price: 0 },
            extraToppings: extraToppings || [],
            quantity,
            itemTotalPrice,
            specialInstructions: specialInstructions || ""
        });
    }

    cart.totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    cart.totalAmount = cart.items.reduce((sum, item) => sum + item.itemTotalPrice, 0);

    return await cart.save();
};

// Get cart for user
const getCart = async (userId) => {
    let cart = await Cart.findOne({ userId });
    if (!cart) {
        return {
            userId,
            items: [],
            totalItems: 0,
            totalAmount: 0
        };
    }
    return cart;
};

// Update quantity of specific cart item
const updateCartItemQuantity = async (userId, itemId, quantity) => {
    const cart = await Cart.findOne({ userId });
    if (!cart) {
        throw new Error("Cart not found");
    }

    const item = cart.items.id(itemId);
    if (!item) {
        throw new Error("Cart item not found");
    }

    const newQty = Number(quantity);
    if (newQty <= 0) {
        cart.items.pull({ _id: itemId });
    } else {
        item.quantity = newQty;
        const unitPrice = calculateUnitPrice(item.foodPrice, item.choiceOfCrust, item.extraToppings);
        item.itemTotalPrice = unitPrice * newQty;
    }

    cart.totalItems = cart.items.reduce((sum, i) => sum + i.quantity, 0);
    cart.totalAmount = cart.items.reduce((sum, i) => sum + i.itemTotalPrice, 0);

    return await cart.save();
};

// Remove single item from cart
const removeCartItem = async (userId, itemId) => {
    const cart = await Cart.findOne({ userId });
    if (!cart) {
        throw new Error("Cart not found");
    }

    cart.items.pull({ _id: itemId });

    cart.totalItems = cart.items.reduce((sum, i) => sum + i.quantity, 0);
    cart.totalAmount = cart.items.reduce((sum, i) => sum + i.itemTotalPrice, 0);

    return await cart.save();
};

// Clear entire cart
const clearCart = async (userId) => {
    let cart = await Cart.findOne({ userId });
    if (!cart) {
        return { userId, items: [], totalItems: 0, totalAmount: 0 };
    }

    cart.items = [];
    cart.totalItems = 0;
    cart.totalAmount = 0;

    return await cart.save();
};

// Completely delete cart document for user
const deleteCart = async (userId) => {
    return await Cart.findOneAndDelete({ userId });
};

module.exports = {
    addToCart,
    getCart,
    updateCartItemQuantity,
    removeCartItem,
    clearCart,
    deleteCart
};

