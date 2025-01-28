const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/category/categoryController");
const authenticateToken = require('../middlewares/authentication');
const {upload} = require('../utils/uploadImage')


router.post("/create", authenticateToken, upload.single('image'), categoryController.createCategory);
router.get("/get", authenticateToken, categoryController.getAllCategories);
router.get("/get-by-id/:id", authenticateToken, categoryController.getCategoryById);
router.put("/update/:id",authenticateToken, upload.single('image'), categoryController.updateCategory);
router.delete("/delete/:id", authenticateToken, categoryController.deleteCategory);

module.exports = router;
