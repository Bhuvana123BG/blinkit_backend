const { sequelize } = require("../models");
const { QueryTypes } = require("sequelize");


const placeOrder = async (req, res) => {

    try {
        const userId = req.user.id; // User from middleware

        //   const { addressId, timestamp, contactNumber } = req.body;
        const { addressId } = req.body;
        let { timestamp } = req.body;
        let { contactNumber } = req.body;

        if (!timestamp) {
            timestamp = new Date(); // current server time
        }
        // 1. Validate input
        if (!addressId) {
            return res.status(400).json({ message: 'addressId is required' });
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

        cartItems.forEach(item => {
            const itemTotal = item.price * item.quantity;
            const discountAmount = itemTotal * ((item.discount || 0) / 100);
            totalAmountPaid += (itemTotal - discountAmount);
            totalSaved += discountAmount;
        });

        // 5. Insert order
        const insertOrder = await sequelize.query(
            `INSERT INTO orders
         (user_id, address_id, timestamp, totalamountpaid, amountsaved, orderedlatitude, orderedlongitude, phonenumber, deliverystatus)
         VALUES
         (:userId, :addressId, :timestamp, :totalAmountPaid, :totalSaved, :latitude, :longitude, :contactNumber, 'pending')`,
            {
                replacements: {
                    userId,
                    addressId,
                    timestamp,
                    totalAmountPaid,
                    totalSaved,
                    latitude: address.latitude,
                    longitude: address.longitude,
                    contactNumber
                },
                type: QueryTypes.INSERT
            }
        );


        const orderId = insertOrder[0]; // MySQL insertId

        // 6. Insert order items
        for (const item of cartItems) {
            const itemTotal = item.price * item.quantity;
            const discountAmount = itemTotal * ((item.discount || 0) / 100);
            const amountPaid = itemTotal - discountAmount;

            await sequelize.query(
                `INSERT INTO orderItem (order_id, product_id, quantity, amountpaid, discount)
             VALUES (:orderId, :prodId, :quantity, :amountPaid, :discount)`,
                {
                    replacements: {
                        orderId,
                        prodId: item.product_id,
                        quantity: item.quantity,
                        amountPaid,
                        discount: item.discount || 0
                    },
                    type: QueryTypes.INSERT
                }
            );
        }

        // 7. Clear cart
        await sequelize.query(
            `DELETE FROM cartItem WHERE user_id = :userId`,
            { replacements: { userId }, type: QueryTypes.DELETE }
        );

        // 8. Response
        return res.status(201).json({ orderId, message: 'Order placed successfully' });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Something went wrong' });
    }
};

module.exports = placeOrder;