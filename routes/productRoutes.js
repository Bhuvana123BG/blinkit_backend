const express = require("express");
const getProductDetail = require("../controllers/productController");
const router = express.Router();



// GET /api/product/:id
router.get("/detail/:pid",getProductDetail);
module.exports = router;