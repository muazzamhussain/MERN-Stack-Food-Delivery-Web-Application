import React, { useEffect, useState } from "react";
import "./edit.css";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { assets } from "../../assets/admin_assets/assets";

const Edit = ({ url }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [foodData, setFoodData] = useState({
    name: "",
    category: "",
    description: "",
    image: "",
    price: "",
  });

  const fetchFoodDetails = async () => {
    try {
      const response = await axios.get(url + "/api/food/" + id);
      if (response.data.success) {
        setFoodData(response.data.data);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to load food item");
    }
  };

  const onChangeHandler = (event) => {
    setFoodData({ ...foodData, [event.target.name]: event.target.value });
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("id", id);
    formData.append("name", foodData.name);
    formData.append("description", foodData.description);
    formData.append("price", foodData.price);
    formData.append("category", foodData.category);

    if (foodData.image instanceof File) {
      // New image uploaded
      formData.append("image", foodData.image);
    }

    try {
      const response = await axios.put(url + "/api/food/edit", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        toast.success("Food item updated!");
        navigate("/list"); //
      }
    } catch (error) {
      toast.error("Error updating item");
    }
  };

  useEffect(() => {
    fetchFoodDetails();
  }, []);

  return (
    <div className="edit-food-container">
      <h2>Edit Food Item</h2>
      <form className="flex-col" onSubmit={onSubmitHandler}>
        {/* Image Upload */}
        <div className="add-img-upload flex-col">
          <p>Upload Image</p>
          <label htmlFor="image">
            <img
              src={
                foodData.image instanceof File
                  ? URL.createObjectURL(foodData.image)
                  : foodData.image
                  ? `${url}/images/${foodData.image}`
                  : assets.upload_area
              }
              alt="Preview"
            />
          </label>
          <input
            type="file"
            id="image"
            hidden
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              setFoodData((prev) => ({ ...prev, image: file }));
            }}
          />
        </div>

        {/* Name */}
        <div className="add-product-name flex-col">
          <p>Product name</p>
          <input
            type="text"
            name="name"
            value={foodData.name}
            onChange={onChangeHandler}
            placeholder="Type name here"
            required
          />
        </div>

        {/* Description */}
        <div className="addproduct-description flex-col">
          <p>Product description</p>
          <textarea
            name="description"
            value={foodData.description}
            onChange={onChangeHandler}
            rows={6}
            placeholder="Write description here"
            required
          />
        </div>

        {/* Category & Price */}
        <div className="add-category-price">
          <div className="add-category flex-col">
            <p>Product category</p>
            <select
              name="category"
              value={foodData.category}
              onChange={onChangeHandler}
              required
            >
              <option value="">-- Select Category --</option>
              <option value="Salad">Salad</option>
              <option value="Rolls">Rolls</option>
              <option value="Desserts">Desserts</option>
              <option value="Sandwich">Sandwich</option>
              <option value="Cake">Cake</option>
              <option value="Vegetables">Vegetables</option>
              <option value="Pasta">Pasta</option>
              <option value="Noodles">Noodles</option>
            </select>
          </div>

          <div className="add-price flex-col">
            <p>Product price</p>
            <input
              type="number"
              name="price"
              value={foodData.price}
              onChange={onChangeHandler}
              placeholder="Price e.g. 15"
              required
            />
          </div>
        </div>

        {/* Submit Button */}
        <button type="submit" className="add-btn">
          Save Edit
        </button>
      </form>
    </div>
  );
};

export default Edit;
