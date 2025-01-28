const prisma = require("../../Prisma-Client");
const createCategory = async (req, res) => {
    const { categoryName, status, sequence } = req.body;
    // Check for missing fields
    if (!categoryName || !req.file || !status || !sequence) {
        return res.status(400).json({ error: "categoryName, image, status, and sequence are required" });
    }

    try {
        console.log("Uploading image...");

        // Upload the image to Supabase
        const imageUrl = req.file.path || req.file.secure_url;

        // Create a new category in the database
        const newCategory = await prisma.category.create({
            data: {
                categoryName,
                image: imageUrl, // Save the image URL in the database
                status,
                sequence: parseInt(sequence), // Ensure sequence is an integer
            },
        });

        return res.status(201).json(newCategory);
    } catch (error) {
        console.error("Error creating category:", error);
        return res.status(500).json({ error: error.message });
    }
};


// Get all categories
const getAllCategories = async (req, res) => {
    try {
        const categories = await prisma.category.findMany();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a category by ID
const getCategoryById = async (req, res) => {
    const { id } = req.params;
    try {
        const category = await prisma.category.findUnique({
            where: { id: parseInt(id) },
        });
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }
        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a category by ID
const updateCategory = async (req, res) => {
    const { id } = req.params;
    const { categoryName, status, sequence } = req.body;
    let imageUrl = null;

    try {
        // If an image is uploaded, upload it and get the URL
        if (req.file) {
            console.log("Uploading image...");
            // Assuming the uploaded image is stored in Cloudinary, otherwise, adapt for your provider
            imageUrl = req.file.path || req.file.secure_url;
            console.log("Image uploaded successfully:", imageUrl);
        }

        // Update the category, only updating fields that were provided
        const updatedCategory = await prisma.category.update({
            where: { id: parseInt(id) },
            data: {
                categoryName,
                status,
                sequence: parseInt(sequence),
                image: imageUrl || undefined, // If there's no image, don't change the current one
            },
        });

        res.status(200).json(updatedCategory);
    } catch (error) {
        console.error("Error updating category:", error);
        res.status(500).json({ error: error.message });
    }
};

// Delete a category by ID
const deleteCategory = async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.category.delete({
            where: { id: parseInt(id) },
        });
        res.status(200).json({ message: "Category deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
};
