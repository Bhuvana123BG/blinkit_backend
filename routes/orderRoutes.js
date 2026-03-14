const express = require("express");
const placeOrder = require("../controllers/orderController");
const router = express.Router();




//Post api/order/place
router.post("/place",placeOrder)
module.exports = router;