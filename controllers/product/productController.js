const { prisma } = require("../../Prisma-Client");

const createProduct = async (req, res) => {
  const { productName, categoryId, subcategoryId, status, sequence } = req.body;

  if (!productName || !req.file || !status || !sequence || !categoryId || !subcategoryId) {
    return res.status(400).json({ error: "productName, image, status, sequence, categoryId, and subcategoryId are required" });
  }

  try {
    const imageUrl = req.file.path || req.file.secure_url;
    const newProduct = await prisma.products.create({
      data: {
        product_name: productName,
        category_id: parseInt(categoryId),
        subcategory_id: parseInt(subcategoryId),
        image: imageUrl,
        status,
        sequence: parseInt(sequence),
      },
    });

    return res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error creating product:", error);
    return res.status(500).json({ error: error.message });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const products = await prisma.products.findMany({
      include: {
        categories: true,
        subcategories: true,
      },
    });
    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await prisma.products.findUnique({
      where: { id: parseInt(id) },
      include: {
        categories: true,
        subcategories: true,
      },
    });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.status(200).json(product);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { productName, categoryId, subcategoryId, status, sequence } = req.body;
  let imageUrl = null;

  try {
    if (req.file) {
      imageUrl = req.file.path || req.file.secure_url;
    }
    const updatedProduct = await prisma.products.update({
      where: { id: parseInt(id) },
      data: {
        product_name: productName,
        category_id: parseInt(categoryId),
        subcategory_id: parseInt(subcategoryId),
        image: imageUrl || undefined,
        status,
        sequence: parseInt(sequence),
      },
    });

    return res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    return res.status(500).json({ error: error.message });
  }
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.products.delete({
      where: { id: parseInt(id) },
    });
    return res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
