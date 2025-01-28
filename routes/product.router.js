const express = require("express");
const router = express.Router();
const productController = require("../controllers/product/productController");
const authenticateToken = require('../middlewares/authentication');
const { upload } = require("../utils/uploadImage");

router.post("/create", authenticateToken, upload.single('image'), productController.createProduct);
router.get("/get", authenticateToken, productController.getAllProducts);
router.get("/get-by-id/:id", authenticateToken, productController.getProductById);
router.put("/update/:id", authenticateToken, upload.single('image'), productController.updateProduct);
router.delete("/delete/:id", authenticateToken, productController.deleteProduct);

module.exports = router;
