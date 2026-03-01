const express=require("express")
const { getUserCart, updateCart } = require("../controllers/cartController")

const router=express.Router()

router.get("/",getUserCart);

router.put("/update",updateCart)

module.exports=router;