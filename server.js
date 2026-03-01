const express=require("express")
require("dotenv").config()


const { sequelize } = require("./models");



PORT=process.env.PORT || 3000

const app=express()

app.use(express.json())

const categoryRoutes = require("./routes/categoryRoutes");
const authRoutes=require("./routes/authRoutes");
const cartRoutes=require("./routes/cartRoutes")
const authMiddleware = require("./middlewares/authMiddleware");

// app.use("/",(req,res)=>{
//     return res.send("app is running")
// })

// app.listen(PORT,()=>{
//     console.log(`server is running at http://localhost:${PORT}`)
// })

// Use category routes
app.use("/api/categories", categoryRoutes);
app.use("/api/auth",authRoutes);

// app.use("/private",authMiddleware,(req,res)=>{
//     res.send("middleware connected succesfully")
// })

app.use("/api/cart",authMiddleware,cartRoutes);

sequelize.sync()
  .then(() => {
    console.log("Database synced");
    app.listen(PORT, () =>console.log(`server is running at http://localhost:${PORT}`));
  })
  .catch(err => console.error(err));