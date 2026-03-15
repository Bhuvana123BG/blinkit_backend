const { sequelize } = require("../models");
const { QueryTypes } = require("sequelize");
const { Order, OrderItem } = require("../models");


const placeOrder = async (req, res) => {
    const t = await sequelize.transaction();

    try {
        const userId = req.user.id; // User from middleware

        //   const { addressId, timestamp, contactNumber } = req.body;
        const { addressId } = req.body;
        let { timestamp, contactNumber } = req.body;

        // 1. Validate input
        if (!addressId) {
            return res.status(400).json({ message: 'addressId is required' });
        }

        if (!timestamp) {
            timestamp = new Date(); // current server time
        }

        // 2. Get address
        const addressRows = await sequelize.query(
            `SELECT * FROM address WHERE id = :addressId AND user_id = :userId`,
            {
                replacements: { addressId, userId },
                type: QueryTypes.SELECT
            }
        );

        const address = addressRows[0];

        if (!address) return res.status(404).json({ message: 'Address not found' });

        if (!contactNumber) {
            contactNumber = address.phonenumber;
        }

        // 3. Get cart items
        const cartItems = await sequelize.query(
            `SELECT 
            c.product_id,
            c.quantity,
            p.price,
            p.discount
         FROM cartItem c
         JOIN product p ON c.product_id = p.id
         WHERE c.user_id = :userId`,
            {
                replacements: { userId },
                type: QueryTypes.SELECT
            }
        );

        if (!cartItems || cartItems.length === 0) {
            return res.status(400).json({ message: 'Your cart is empty' });
        }

        // 4. Calculate totals applying discount %
        let totalAmountPaid = 0;
        let totalSaved = 0;
        const items = cartItems.map(item => {

            const itemTotal = item.price * item.quantity;
            const discountAmount = itemTotal * ((item.discount || 0) / 100);
            const amountPaid = itemTotal - discountAmount;

            totalAmountPaid += amountPaid;
            totalSaved += discountAmount;

            return {
                product_id: item.product_id,
                quantity: item.quantity,
                amountpaid: amountPaid,
                discount: item.discount || 0
            };

        });

        //prepare data
        const data = {
            user_id: userId,
            address_id: addressId,
            timestamp,
            totalamountpaid: totalAmountPaid,
            amountsaved: totalSaved,
            phonenumber: contactNumber,
            orderedlatitude: address.latitude,
            orderedlongitude: address.longitude,
            deliverystatus: "pending",

            items
        };

        const order = await Order.create(data, {
            include: [
                {
                    model: OrderItem,
                    as: "items"
                }
            ],
            transaction: t
        });

        await t.commit();

        //clear cart
        await sequelize.query(
            `DELETE FROM cartItem WHERE user_id = :userId`,
            { replacements: { userId }, type: QueryTypes.DELETE }
        );

        //response
        return res.status(201).json({
            message: "Order created successfully",
            order:order.id
        });


    } catch (err) {

        await t.rollback();

        return res.status(500).json({
            message: "Order creation failed",
            error: err.message
        });
    }
};

module.exports = placeOrder;