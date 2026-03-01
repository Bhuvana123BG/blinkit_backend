const { sequelize } = require('../models');
const { QueryTypes } = require('sequelize');

const getUserCart = async (req, res) => {
    try {
        const userId = req.user.id; // coming from middleware

        const cartItems = await sequelize.query(
            `
      SELECT 
        p.id AS productId,
        p.name,
        p.imgurl AS imageUrl,
        p.price AS originalPrice,
        p.discount,
        p.maxorderlimit,
        p.isavailable,
        p.description,
        c.quantity
      FROM cartItem c
      JOIN product p ON p.id = c.product_id
      WHERE c.user_id = :userId
      `,
            {
                replacements: { userId },   // safe parameter binding
                type: QueryTypes.SELECT
            }
        );

        // const buildResponse={}
        // products=[]
        // let totalWithoutDiscount=0;
        // let grandTotal=0;
        // let uniqueQuantity=0;
        // let totalQuantity=0;
        // cartItems.map(item=>({
        //     product:{
        //         productId:productId,
        //         name:name,



        //     }
        // }))
        // {
        //     "productId": 1,
        //     "name": "Detergent Powders Product 15",
        //     "imageUrl": "https://source.unsplash.com/400x400/?detergent-powders",
        //     "originalPrice": 302.36,
        //     "discount": 19,
        //     "maxorderlimit": 10,
        //     "isavailable": 1,
        //     "description": "High quality Detergent Powders item number 15",
        //     "quantity": 1
        // }

        const buildResponse = (cartItems) => {
            const products = []
            let totalWithoutDiscount = 0;
            let grandTotal = 0;
            let uniqueQuantity = 0;
            let totalQuantity = 0;

            cartItems.forEach(item => {
                // const discountedPrice = item.originalPrice - (item.originalPrice * item.discount) / 100;
                const discountedPrice = Number(
                    (
                      item.originalPrice -
                      (item.originalPrice * item.discount) / 100
                    ).toFixed(2)
                  );

                //push each product

                products.push({
                    productId: item.productId,
                    name: item.name,
                    imageUrl: item.imageUrl,
                    originalPrice: item.originalPrice,
                    discountedPrice: discountedPrice,
                    maxOrderLimit: item.maxorderlimit,
                    description: item.description,
                    quantity: item.quantity,
                    isAvailable: item.isavailable

                });

                //caluculation

                totalWithoutDiscount+=item.originalPrice*item.quantity;
                grandTotal+=discountedPrice*item.quantity;
                totalQuantity+=item.quantity;


            });

            uniqueQuantity=products.length;

        return{
            products,
            totalWithoutDiscount:parseInt(totalWithoutDiscount.toFixed(2)),
            grandTotal:parseInt(grandTotal.toFixed(2)),
            uniqueQuantity,
            totalQuantity

        }

        }

        const response=buildResponse(cartItems);
        res.status(200).json(response);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


module.exports = { getUserCart };