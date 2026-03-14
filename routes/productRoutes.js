const express = require("express");
const getProductDetail = require("../controllers/productController");
const router = express.Router();
const extractUser=require("../middlewares/extractUser")



// GET /api/product/:id
router.get("/detail/:pid",extractUser,getProductDetail);
module.exports = router;