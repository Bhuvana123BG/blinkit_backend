const express = require("express");
const router = express.Router();
const { getAllCategories, getSubcategoryByCategorieId } = require("../controllers/categoryController");


// GET /api/categories
router.get("/", getAllCategories);

router.get("/:cid", getSubcategoryByCategorieId)

module.exports = router;