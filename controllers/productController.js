const sequelize = require("../config/database");
const { QueryTypes } = require("sequelize");

const getProductDetail = async (req, res) => {
    try {

        const productId = req.params.pid;
        let cartQuantity = 0;

        // DB1 CALL (Product)
        const product = await sequelize.query(
            `SELECT 
        Id,
        Name,
        Description,
        Price,
        Discount,
        Imgurl,
        Maxorderlimit,
        isAvailable,
        Ingredients,
        Packagingtype,
        Keyfeatures,
        Metadata
      FROM product 
      WHERE Id = :productId`,
            {
                replacements: { productId },
                type: QueryTypes.SELECT
            }
        );

        if (!product.length) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        const productData = product[0];

      
        // DB2 CALL (Image Gallery)
        const ImgGallery = await sequelize.query(
            `SELECT imgurl FROM ImgGallery WHERE prodId = :productId`,
            {
                replacements: { productId },
                type: QueryTypes.SELECT
            }
        );

        // [
        //     { imgurl: "milk1.jpg" },
        //     { imgurl: "milk2.jpg" },
        //     { imgurl: "milk3.jpg" }
        //   ]

        const galleryUrls = ImgGallery.map(img => img.imgurl);

        // galleryUrls = [
        //     "milk1.jpg",
        //     "milk2.jpg",
        //     "milk3.jpg"
        //   ];

       
        // DB3 CALL (Cart Quantity)
 

        const userId = req.user?.id;

        if (userId) {

            const cart = await sequelize.query(
                `SELECT quantity 
                FROM cartItem 
                WHERE user_id = :userId AND product_id = :productId`,
                {
                    replacements: {
                        userId,
                        productId
                    },
                    type: QueryTypes.SELECT
                }
            );

            if (cart.length > 0) {
                cartQuantity = cart[0].quantity;
            }

        }

      
        // Final Response
        const response = {
            ...productData,
            cartQuantity,
            ImgGallery: galleryUrls
        };

        return res.status(200).json(response);

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Internal Server Error"
        });

    }
};


module.exports = getProductDetail