const { response } = require('express');
const { sequelize, CartItem, Product } = require('../models');
const { QueryTypes, Op } = require('sequelize');


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

        //calculation

        totalWithoutDiscount += item.originalPrice * item.quantity;
        grandTotal += discountedPrice * item.quantity;
        totalQuantity += item.quantity;


    });

    uniqueQuantity = products.length;

    return {
        products,
        totalWithoutDiscount: parseInt(totalWithoutDiscount.toFixed(2)),
        grandTotal: parseInt(grandTotal.toFixed(2)),
        uniqueQuantity,
        totalQuantity

    }

}

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

        const response = buildResponse(cartItems);
        res.status(200).json(response);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



const updateCart = async (req, res) => {

    try {
        // const { items } = req.body || {};
        const { items = [] } = req.body || {};
        // validateItems
        // {
        //     items:[
        //         {},{},{},{}
        //     ]
        // }

        const productsIds = []
        const productVSQuantity = {}

        for (const item of items) {

            // 1.Check given quantities less than equals to zero
            if (item.quantity <= 0) {
                return res.status(404).json({
                    message: "quantity should be positive value (>0)"
                });
            }

            // 2.Duplicate product id not allowed
            if (productsIds.includes(item.productId)) {
                return res.status(404).json({
                    message: "Duplicate product id found"
                });

            }

            productsIds.push(item.productId);
            productVSQuantity[item.productId] = item.quantity;
        }


        const user_id = req.user.id;

        if (productsIds.length === 0) {
            //delete cart for given user


            //2.db call ---If not give items then  delete entire cart for given user
            await CartItem.destroy({
                where: { user_id: user_id }
            });


            return res.status(200).json(buildResponse([]))
        }


        //1 db call
        const productidVSmaxorderlimit = await sequelize.query(
            `
            SELECT
                id,
                maxorderlimit
            FROM product
            WHERE id IN (:productIds)
        `,
            {
                replacements: { productIds: productsIds },
                type: QueryTypes.SELECT
            }

        );

        //4.if product id's not in products table
        if (productidVSmaxorderlimit.length !== productsIds.length) {
            return res.status(404).json({
                message: "Invalid product ids found"
            });

        }

        // 3.Each given product quantity less maxorderlimit

        for (const pVSm of productidVSmaxorderlimit) {


            if (pVSm.maxorderlimit < productVSQuantity[pVSm.id]) {
                return res.status(404).json({
                    message: `max order limit exceed for product id ${pVSm.id}`
                });
            }

        }

        // const user_id = req.user.id;

        // if (productsIds.length === 0) {
        //     //delete cart for given user


        //     //2.db call ---If not give items then  delete entire cart for given user
        //     await CartItem.destroy({
        //         where: { user_id: user_id }
        //     });


        //     return res.status(200).json(buildResponse([]))
        // }



        //Remove not existing products from cart for given user
        //3.db call
        await CartItem.destroy({
            where: {
                user_id: user_id,
                product_id: {
                    [Op.notIn]: productsIds
                }
            }
        });

        //4.db call----get db cart and sync

        const dbCartItems = await CartItem.findAll({
            where: { user_id: user_id }
        });

        //convert db cart to map
        const dbCartMap = {};

        for (const cartItem of dbCartItems) {
            dbCartMap[cartItem.product_id] = cartItem;
        }

        // dbCartMap = {
        //     101: CartItemObject,
        //     102: CartItemObject
        //  }


        //preparing data for insert/update
        const itemsToInsert = [];
        const updatePromises = [];

        for (const productId of productsIds) {

            const requestedQuantity = productVSQuantity[productId];



            // All Sequelize DB methods are async:create(),update(),destroy(),findAll(),findOne(),bulkCreate() They all return Promises.
            // Product already exists in DB → UPDATE
            if (dbCartMap[productId]) {

                updatePromises.push(
                    CartItem.update(
                        { quantity: requestedQuantity },
                        {
                            where: {
                                user_id: user_id,
                                product_id: productId
                            }
                        }
                    )
                );

            } else {
                // Product not in DB → INSERT
                itemsToInsert.push({
                    user_id: user_id,
                    product_id: productId,
                    quantity: requestedQuantity
                });
            }
        }

        // Insert new products
        if (itemsToInsert.length > 0) {
            await CartItem.bulkCreate(itemsToInsert);
        }

        // Update existing products
        await Promise.all(updatePromises);//"Wait until all those update queries are finished."


        //fetch updated cart with product details
        // const updatedCartItems = await CartItem.findAll({
        //     where: { user_id: user_id },
        //     include: [
        //         {
        //             model: Product,
        //             attributes: ["id", "name", "price", "discount"]
        //         }
        //     ]
        // });


        const updatedCartItems = await sequelize.query(
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
                replacements: { userId: user_id },   // safe parameter binding
                type: QueryTypes.SELECT
            }
        );
        result = buildResponse(updatedCartItems)
        return res.status(200).json(result)

    }
    catch (error) {
        return res.status(500).json({ message: error.message })
    }

}



module.exports = { getUserCart, updateCart };