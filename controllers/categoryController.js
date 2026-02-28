const { Category } = require("../models");
const { sequelize } = require("../models");
const { QueryTypes } = require("sequelize");

// GET all categories
exports.getAllCategories = async (req, res) => {
    try {
        // const categories = await Category.findAll();
        const categories = await sequelize.query(
            "SELECT * FROM category",
            {
                type: QueryTypes.SELECT,
            }
        );
        const subcategories = await sequelize.query(
            `SELECT s.id as default_subcategory_id, s.category_id, s.title
                FROM subcategory s
                JOIN(
                    SELECT category_id, MIN(id) AS min_id
                FROM subcategory
                GROUP BY category_id
                ) t
                ON s.id = t.min_id;
        `,
            {
                type: QueryTypes.SELECT,
            }
        );
        console.log(categories)
        console.log(subcategories)

        const finalresponse=categories.map(cat => ({
            category_id: cat.id,
            name: cat.title,
            image_url: cat.imgurl,
            default_subcategory:subcategories.filter(sub=>sub.category_id===cat.id)[0],
        }))     


        res.status(200).json({
            success: true,
            count: categories.length,
            categories:finalresponse
        
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching categories",
            error: error.message,
        });
    }
};