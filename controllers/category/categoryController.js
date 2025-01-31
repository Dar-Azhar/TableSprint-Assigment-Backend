const prisma = require("../../Prisma-Client");
const createCategory = async (req, res) => {
    const { categoryName, sequence } = req.body;
    if (!categoryName || !req.file || !sequence) {
        return res.status(400).json({ error: "categoryName, image, and sequence are required" });
    }
    try {
        const imageUrl = req.file.path || req.file.secure_url;
        const newCategory = await prisma.category.create({
            data: {
                categoryName,
                image: imageUrl,
                sequence: parseInt(sequence),
            },
        });

        return res.status(201).json(newCategory);
    } catch (error) {
        console.error("Error creating category:", error);
        return res.status(500).json({ error: error.message });
    }
};

const getAllCategories = async (req, res) => {
    try {
        const categories = await prisma.category.findMany();
        return res.status(200).json(categories);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const getCategoryById = async (req, res) => {
    const { id } = req.params;
    try {
        const category = await prisma.category.findUnique({
            where: { id: parseInt(id) },
        });
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }
        return res.status(200).json(category);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const updateCategory = async (req, res) => {
    const { id } = req.params;
    const { categoryName, status, sequence } = req.body;
    let imageUrl = null;

    try {
        if (req.file) {
            imageUrl = req.file.path || req.file.secure_url;
        }
       
        const updatedCategory = await prisma.category.update({
            where: { id: parseInt(id) },
            data: {
                categoryName,
                status,
                sequence: parseInt(sequence),
                image: imageUrl || undefined,
            },
        });

        return res.status(200).json(updatedCategory);
    } catch (error) {
        console.error("Error updating category:", error);
        return res.status(500).json({ error: error.message });
    }
};

const deleteCategory = async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.product.deleteMany({
            where: { categoryId: parseInt(id) }
        });

        await prisma.subcategory.deleteMany({
            where: { categoryId: parseInt(id) }
        });
        await prisma.category.delete({
            where: { id: parseInt(id) }
        });

        return res.status(200).json({ message: "Category and related products/subcategories deleted successfully" });
    } catch (error) {
        console.error("Error deleting category:", error);
        return res.status(500).json({ error: error.message });
    }
};


module.exports = {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
};
