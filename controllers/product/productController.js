const prisma = require("../../Prisma-Client");

const createProduct = async (req, res) => {
  const { productName, categoryId, categoryName, subcategoryName, subcategoryId } = req.body;
  console.log(req.body);
  // if (!productName || !req.file || !status || !sequence || !categoryId || !subcategoryId) {
  //   return res.status(400).json({ error: "productName, categoryId, categoryName, subcategoryName, subcategoryId, status, sequence are required" });
  // }

  try {
    const imageUrl = req.file.path || req.file.secure_url;
    const newProduct = await prisma.product.create({
      data: {
        productName: productName,
        categoryId: parseInt(categoryId),
        subcategoryId: parseInt(subcategoryId),
        image: imageUrl,
        categoryName,
        subcategoryName,
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
    const products = await prisma.product.findMany({

      include: {
        category: {
          select: {
            id: true,
            categoryName: true, l
          },
        },
        subcategory: {
          select: {
            id: true,
            subcategoryName: true,
          },
        },
      }
    });

    return res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return res.status(500).json({ error: error.message });
  }
};


const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
      include: {
        category: true,
        subcategory: true,
      },
    });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.status(200).json(product);
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: error.message });
  }
};

const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { productName, categoryId, subcategoryId, status } = req.body;
  let imageUrl = null;
  console.log(req.body);

  try {

    const updatedProduct = await prisma.product.update({
      where: { id: parseInt(id) },
      data: {
        productName: productName,
        categoryId: parseInt(categoryId),
        subcategoryId: parseInt(subcategoryId),
        image: imageUrl || undefined,
        status,
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
    await prisma.product.delete({
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
