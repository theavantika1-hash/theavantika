const Food = require("../models/Food");

/**
 * Normalizes incoming data (from admin frontend or external API) into Food schema format.
 */
const normalizeFoodInput = (data) => {
    if (!data) return {};

    let rawType = (data.foodType || data.type || "veg").toString().toLowerCase();
    let foodTypeVal = "Vegetarian";
    if (rawType === "veg" || rawType === "vegetarian") foodTypeVal = "Vegetarian";
    else if (rawType === "non-veg" || rawType === "non-vegetarian") foodTypeVal = "Non-Vegetarian";
    else if (rawType === "vegan") foodTypeVal = "Vegan";
    else if (rawType === "egg") foodTypeVal = "Egg";

    let cleanFoodItems = [];
    if (Array.isArray(data.foodItems)) {
        cleanFoodItems = data.foodItems
            .filter(item => item && (item.name || item.quantity))
            .map(item => ({
                name: String(item.name || ""),
                quantity: String(item.quantity || "")
            }));
    }

    return {
        foodName: data.foodName || data.name || "Untitled Dish",
        foodPrice: data.foodPrice !== undefined ? Number(data.foodPrice) : (data.price !== undefined ? Number(data.price) : 0),
        foodType: foodTypeVal,
        foodCategory: data.foodCategory || data.category || "General",
        foodSubCategory: data.foodSubCategory || data.subcategory || "",
        foodSecondSubCategory: data.foodSecondSubCategory || data.secondSubCategory || "",
        foodImage: data.foodImage || data.image || "",
        subImages: Array.isArray(data.subImages) ? data.subImages : (data.image ? [data.image] : []),
        foodDescription: data.foodDescription || data.description || "",
        foodItems: cleanFoodItems,
        preparationTime: data.preparationTime || data.prepTime || "15 mins",
        rating: data.rating !== undefined ? Number(data.rating) : 5.0,
        visibility: data.visibility !== undefined ? Boolean(data.visibility) : true
    };
};

/**
 * Formats database Food document so it contains both schema field names and frontend field names.
 */
const formatFoodOutput = (food) => {
    if (!food) return null;
    const doc = food.toObject ? food.toObject() : food;
    const isVeg = doc.foodType === "Vegetarian" || doc.foodType === "Vegan" || doc.foodType === "veg" || doc.foodType === "vegan";
    const mappedFoodType = doc.foodType === "Vegetarian" ? "veg" : (doc.foodType === "Non-Vegetarian" ? "non-veg" : doc.foodType.toLowerCase());

    return {
        ...doc,
        id: doc._id.toString(),
        _id: doc._id.toString(),
        name: doc.foodName || doc.name,
        foodName: doc.foodName || doc.name,
        price: doc.foodPrice !== undefined ? doc.foodPrice : doc.price,
        foodPrice: doc.foodPrice !== undefined ? doc.foodPrice : doc.price,
        category: doc.foodCategory || doc.category,
        foodCategory: doc.foodCategory || doc.category,
        subcategory: doc.foodSubCategory || doc.subcategory || "",
        foodSubCategory: doc.foodSubCategory || doc.subcategory || "",
        description: doc.foodDescription || doc.description || "",
        foodDescription: doc.foodDescription || doc.description || "",
        foodType: mappedFoodType,
        veg: isVeg,
        image: doc.foodImage || doc.image || "",
        foodImage: doc.foodImage || doc.image || "",
        prepTime: doc.preparationTime || doc.prepTime || "15 mins",
        preparationTime: doc.preparationTime || doc.prepTime || "15 mins",
        foodItems: doc.foodItems || [],
        subImages: doc.subImages || [],
        visibility: doc.visibility !== undefined ? doc.visibility : true,
        rating: doc.rating || 5.0
    };
};

// Add new food item
const createFood = async (rawFoodData) => {
    const foodData = normalizeFoodInput(rawFoodData);
    const newFood = new Food(foodData);
    const saved = await newFood.save();
    return formatFoodOutput(saved);
};

// Get all food items with optional filters
const getAllFoods = async (filters = {}) => {
    const {
        category,
        subCategory,
        secondSubCategory,
        type,
        foodCategory,
        foodSubCategory,
        foodSecondSubCategory,
        foodType,
        search
    } = filters;

    const filter = {};

    const targetType = type || foodType;
    if (targetType) {
        let rawType = targetType.toString().toLowerCase();
        if (rawType === "veg" || rawType === "vegetarian") filter.foodType = "Vegetarian";
        else if (rawType === "non-veg" || rawType === "non-vegetarian") filter.foodType = "Non-Vegetarian";
        else if (rawType === "vegan") filter.foodType = "Vegan";
        else if (rawType === "egg") filter.foodType = "Egg";
        else filter.foodType = targetType;
    }

    const targetCategory = category || foodCategory;
    if (targetCategory && targetCategory !== "All") {
        filter.foodCategory = targetCategory;
    }

    const targetSubCategory = subCategory || foodSubCategory;
    if (targetSubCategory) {
        filter.foodSubCategory = targetSubCategory;
    }

    if (search) {
        filter.foodName = { $regex: search, $options: "i" };
    }

    const foods = await Food.find(filter).sort({ createdAt: -1 });
    return foods.map(formatFoodOutput);
};

// Get single food item by ID
const getFoodById = async (id) => {
    const food = await Food.findById(id);
    return formatFoodOutput(food);
};

// Update food item details
const updateFood = async (id, rawUpdateData) => {
    let updateFields = {};
    if (rawUpdateData.foodName || rawUpdateData.name || rawUpdateData.foodPrice || rawUpdateData.price) {
        updateFields = normalizeFoodInput(rawUpdateData);
    } else {
        updateFields = { ...rawUpdateData };
        if (rawUpdateData.image) updateFields.foodImage = rawUpdateData.image;
        if (rawUpdateData.name) updateFields.foodName = rawUpdateData.name;
        if (rawUpdateData.price !== undefined) updateFields.foodPrice = Number(rawUpdateData.price);
        if (rawUpdateData.category) updateFields.foodCategory = rawUpdateData.category;
        if (rawUpdateData.subcategory !== undefined) updateFields.foodSubCategory = rawUpdateData.subcategory;
        if (rawUpdateData.description !== undefined) updateFields.foodDescription = rawUpdateData.description;
        if (rawUpdateData.prepTime) updateFields.preparationTime = rawUpdateData.prepTime;
    }

    const updated = await Food.findByIdAndUpdate(
        id,
        { $set: updateFields },
        { new: true, runValidators: true }
    );
    return formatFoodOutput(updated);
};

// Delete food item
const deleteFood = async (id) => {
    const deleted = await Food.findByIdAndDelete(id);
    return formatFoodOutput(deleted);
};

module.exports = {
    createFood,
    getAllFoods,
    getFoodById,
    updateFood,
    deleteFood
};

