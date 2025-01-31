const prisma = require("../../Prisma-Client");

const createSubcategory = async (req, res) => {
    const { subcategoryName, sequence, categoryId } = req.body;

    if (!subcategoryName || !req.file || !sequence || !categoryId) {
        return res.status(400).json({ error: "subcategoryName, image, sequence, and categoryId are required" });
    }

    try {
        const imageUrl = req.file.path || req.file.secure_url;
        const newSubcategory = await prisma.subcategory.create({
            data: {
                subcategoryName,
                image: imageUrl,
                sequence: parseInt(sequence),
                categoryId: parseInt(categoryId),
            },
        });

        return res.status(201).json(newSubcategory);
    } catch (error) {
        console.error("Error creating subcategory:", error);
        return res.status(500).json({ error: error.message });
    }
};


const getAllSubcategories = async (req, res) => {
    try {
        const subcategories = await prisma.subcategory.findMany({
            include: {
                category: {
                    select: {
                        id: true,  
                        categoryName: true, 
                    },
                },
            },
        });

        return res.status(200).json(subcategories);
    } catch (error) {
        console.error("Error fetching subcategories:", error);
        return res.status(500).json({ error: error.message });
    }
};


const getSubcategoryById = async (req, res) => {
    const { id } = req.params;
    try {
        const subcategory = await prisma.Subcategory.findUnique({
            where: { id: parseInt(id) },
            include: {
                category: true,
            },
        });
        if (!subcategory) {
            return res.status(404).json({ message: "Subcategory not found" });
        }
        return res.status(200).json(subcategory);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const updateSubcategory = async (req, res) => {
    const { id } = req.params;
    const { subcategoryName, status, sequence, categoryId, imageUrl } = req.body;
    let image = null;

    try {
        if (req.file) {
            image = req.file.path || req.file.secure_url;
        }

        if (!image && imageUrl) {
            image = imageUrl; 
        }

        if (!subcategoryName || !status || !sequence || !image || !categoryId) {
            return res.status(400).json({ error: "subcategoryName, status, sequence, image, and categoryId are required" });
        }

        const updatedSubcategory = await prisma.subcategory.update({
            where: { id: parseInt(id) },
            data: {
                subcategoryName,
                status,
                sequence: parseInt(sequence),
                category: {
                    connect: {
                        id: parseInt(categoryId), 
                    }
                },
                image: image || undefined, 
            },
        });

        return res.status(200).json(updatedSubcategory);
    } catch (error) {
        console.error("Error updating subcategory:", error);
        return res.status(500).json({ error: error.message });
    }
};




const deleteSubcategory = async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.subcategory.delete({
            where: { id: parseInt(id) },
        });
        return res.status(200).json({ message: "Subcategory deleted successfully" });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createSubcategory,
    getAllSubcategories,
    getSubcategoryById,
    updateSubcategory,
    deleteSubcategory,
};
