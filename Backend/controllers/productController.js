import Product from "../models/product.js";

// Create Product
export const createProductController = async (req, res) => {
  try {
    const { name, description, price, quantity, category } = req.body;

    // Basic Validation
    if (!name || !description || !price || !quantity || !category) {
      return res.status(400).send({ error: "All fields are required" });
    }

    const product = new Product({
      name,
      description,
      price,
      quantity,
      category,
    });
    await product.save();

    res.status(201).send({
      success: true,
      message: "Product Created Successfully",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in creating product",
    });
  }
};

// Update Product
export const updateProductController = async (req, res) => {
  try {
    const { name, description, price, quantity, category } = req.body;
    const { id } = req.params;

    const product = await Product.findByIdAndUpdate(
      id,
      { name, description, price, quantity, category },
      { new: true, runValidators: true } // Returns the updated document
    );

    res.status(200).send({
      success: true,
      message: "Product Updated Successfully",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while updating product",
    });
  }
};

// Delete Product
export const deleteProductController = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).send({
      success: true,
      message: "Product Deleted Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while deleting product",
      error,
    });
  }
};

// Get All Products with Filtering, Sorting, and Pagination
export const getProductsController = async (req, res) => {
  try {
    // 1. Filtering (by category)
    const queryObj = { ...req.query };
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);

    // 2. Sorting (by price)
    let queryStr = JSON.stringify(queryObj);
    let query = Product.find(JSON.parse(queryStr));

    if (req.query.sort) {
      // e.g., ?sort=price for ascending, ?sort=-price for descending
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    // 3. Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);

    const products = await query;

    res.status(200).send({
      success: true,
      count: products.length,
      message: "All Products ",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in getting products",
      error: error.message,
    });
  }
};
