import express from "express";
import {
  addFood,
  editFoodItem,
  getFoodById,
  listFood,
  removeFood,
} from "../controllers/foodControllers.js";
import multer from "multer";

const foodRouter = express.Router();

// Image Storage Engine
const storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => {
    return cb(null, `${Date.now()}${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

foodRouter.post("/add", upload.single("image"), addFood);
foodRouter.get("/list", listFood);
foodRouter.post("/remove", removeFood);
foodRouter.put("/edit", upload.single("image"), editFoodItem);
foodRouter.get("/:id", getFoodById);

export default foodRouter;
