import { log } from "console";
import foodModel from "../models/foodModel.js";
import fs from "fs";

// add food item
const addFood = async (req, res) => {
  let image_filename = `${req.file.filename}`;

  const food = new foodModel({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    category: req.body.category,
    image: image_filename,
  });
  try {
    await food.save();
    res.json({ success: true, message: "Food Added" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error saving Food" });
  }
};

// All food list
const listFood = async (req, res) => {
  try {
    const foods = await foodModel.find({});
    res.json({ success: true, data: foods });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "error fetching foods" });
  }
};

// Remove food item
const removeFood = async (req, res) => {
  try {
    const food = await foodModel.findById(req.body.id);
    fs.unlink(`uploads/${food.image}`, () => {});

    await foodModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Food removed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "error removing food" });
  }
};

// GET /api/food/:id
const getFoodById = async (req, res) => {
  try {
    const food = await foodModel.findById(req.params.id);
    res.json({ success: true, data: food });
  } catch (error) {
    res.status(500).json({ success: false, message: "Item not found" });
  }
};

// Edit food item
const editFoodItem = async (req, res) => {
  try {
    const { id, name, category, price, description } = req.body;

    let updatedFields = {
      name,
      category,
      price,
      description,
    };

    if (req.file) {
      updatedFields.image = req.file.filename;
    }

    const updatedFood = await foodModel.findByIdAndUpdate(id, updatedFields, {
      new: true,
    });

    res.json({ success: true, message: "Food item updated successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error updating food item" });
  }
};

export { addFood, listFood, removeFood, editFoodItem, getFoodById };
