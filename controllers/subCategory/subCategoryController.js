const prisma = require("../../Prisma-Client");

// Create a new subcategory with image upload
const createSubcategory = async (req, res) => {
    const { subcategoryName, status, sequence, categoryId } = req.body;

    // Check if the required fields and image are provided
    if (!subcategoryName || !req.file || !status || !sequence || !categoryId) {
        return res.status(400).json({ error: "subcategoryName, image, status, sequence, and categoryId are required" });
    }

    try {
        console.log("Uploading image...");

        // Get the uploaded image URL
        const imageUrl = req.file.path || req.file.secure_url;

        console.log("Image uploaded successfully:", imageUrl);

        // Create the new subcategory with image URL in the database
        const newSubcategory = await prisma.Subcategory.create({
            data: {
                subcategoryName,
                image: imageUrl, // Save the image URL in the database
                status,
                sequence: parseInt(sequence),
                categoryId: parseInt(categoryId),
            },
        });

        res.status(201).json(newSubcategory);
    } catch (error) {
        console.error("Error creating subcategory:", error);
        res.status(500).json({ error: error.message });
    }
};

// Get all subcategories
const getAllSubcategories = async (req, res) => {
    try {
        const subcategories = await prisma.Subcategory.findMany();
        res.status(200).json(subcategories);
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log(error);
    }
};

// Get a subcategory by ID
const getSubcategoryById = async (req, res) => {
    const { id } = req.params;
    try {
        const subcategory = await prisma.Subcategory.findUnique({
            where: { id: parseInt(id) },
            include: {
                category: true, // Include category details
            },
        });
        if (!subcategory) {
            return res.status(404).json({ message: "Subcategory not found" });
        }
        res.status(200).json(subcategory);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a subcategory by ID with image upload
const updateSubcategory = async (req, res) => {
    const { id } = req.params;
    const { subcategoryName, status, sequence, categoryId } = req.body;
    let imageUrl = null;

    try {
        // If a new image is uploaded, upload it and get the URL
        if (req.file) {
            console.log("Uploading image...");
            imageUrl = req.file.path || req.file.secure_url;
            console.log("Image uploaded successfully:", imageUrl);
        }

        // Update the subcategory, only updating fields that were provided
        const updatedSubcategory = await prisma.Subcategory.update({
            where: { id: parseInt(id) },
            data: {
                subcategoryName,
                status,
                sequence: parseInt(sequence),
                categoryId: parseInt(categoryId),
                image: imageUrl || undefined, // Only update image if a new one is uploaded
            },
        });

        res.status(200).json(updatedSubcategory);
    } catch (error) {
        console.error("Error updating subcategory:", error);
        res.status(500).json({ error: error.message });
    }
};

// Delete a subcategory by ID
const deleteSubcategory = async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.Subcategory.delete({
            where: { id: parseInt(id) },
        });
        res.status(200).json({ message: "Subcategory deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createSubcategory,
    getAllSubcategories,
    getSubcategoryById,
    updateSubcategory,
    deleteSubcategory,
};
