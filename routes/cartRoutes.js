const express=require("express")
const { getUserCart } = require("../controllers/cartController")

const router=express.Router()

router.get("/",getUserCart);


module.exports=router;