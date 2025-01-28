const { prisma } = require("../../Prisma-Client");

// Create a new product with image upload
const createProduct = async (req, res) => {
  const { productName, categoryId, subcategoryId, status, sequence } = req.body;

  // Check if the required fields and image are provided
  if (!productName || !req.file || !status || !sequence || !categoryId || !subcategoryId) {
    return res.status(400).json({ error: "productName, image, status, sequence, categoryId, and subcategoryId are required" });
  }

  try {
    console.log("Uploading image...");

    // Get the uploaded image URL
    const imageUrl = req.file.path || req.file.secure_url;

    console.log("Image uploaded successfully:", imageUrl);

    // Create the new product with image URL in the database
    const newProduct = await prisma.products.create({
      data: {
        product_name: productName,
        category_id: parseInt(categoryId),
        subcategory_id: parseInt(subcategoryId),
        image: imageUrl, // Save the image URL in the database
        status,
        sequence: parseInt(sequence),
      },
    });

    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get all products
const getAllProducts = async (req, res) => {
  try {
    const products = await prisma.products.findMany({
      include: {
        categories: true, // Include category details
        subcategories: true, // Include subcategory details
      },
    });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a product by ID
const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await prisma.products.findUnique({
      where: { id: parseInt(id) },
      include: {
        categories: true, // Include category details
        subcategories: true, // Include subcategory details
      },
    });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a product by ID with image upload
const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { productName, categoryId, subcategoryId, status, sequence } = req.body;
  let imageUrl = null;

  try {
    // If a new image is uploaded, upload it and get the URL
    if (req.file) {
      console.log("Uploading image...");
      imageUrl = req.file.path || req.file.secure_url;
      console.log("Image uploaded successfully:", imageUrl);
    }

    // Update the product, only updating fields that were provided
    const updatedProduct = await prisma.products.update({
      where: { id: parseInt(id) },
      data: {
        product_name: productName,
        category_id: parseInt(categoryId),
        subcategory_id: parseInt(subcategoryId),
        image: imageUrl || undefined, // Only update image if a new one is uploaded
        status,
        sequence: parseInt(sequence),
      },
    });

    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ error: error.message });
  }
};

// Delete a product by ID
const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.products.delete({
      where: { id: parseInt(id) },
    });
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
