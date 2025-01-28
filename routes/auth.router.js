const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth/authController");

router.post("/register", authController.registerUser);
// router.get("/get-users", userController.getAllUsers);
// router.get("/get-by-id/:id", subcategoryController.getSubcategoryById);
// router.put("/update/:id", subcategoryController.updateSubcategory);
// router.delete("/delete/:id", subcategoryController.deleteSubcategory);
router.post("/login", authController.loginUser);

module.exports = router;