const express = require("express");
const router = express.Router();
const subcategoryController = require("../controllers/subCategory/subCategoryController");
const authenticateToken = require('../middlewares/authentication');
const { upload } = require("../utils/uploadImage");

router.post("/create", authenticateToken,upload.single('image'), subcategoryController.createSubcategory);
router.get("/get", authenticateToken, subcategoryController.getAllSubcategories);
router.get("/get-by-id/:id", authenticateToken, subcategoryController.getSubcategoryById);
router.put("/update/:id", authenticateToken,upload.single('image'), subcategoryController.updateSubcategory);
router.delete("/delete/:id", authenticateToken, subcategoryController.deleteSubcategory);

module.exports = router;
