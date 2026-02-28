const { Category, Subcategory } = require("../models");//this doubt
const { sequelize } = require("../models");
const { QueryTypes } = require("sequelize");



// GET all categories
const getAllCategories = async (req, res) => {
    try {
        const dbRes = await sequelize.query(
            `SELECT
                c.id AS id,
                c.title AS name,
                c.imgurl AS imgurl,
                s.id AS subcategory_id,
                s.title AS subcategory_name
            FROM category c
            LEFT JOIN subcategory s
                ON s.id = (
                    SELECT MIN(sc.id)
                    FROM subcategory sc
                    WHERE sc.category_id = c.id
                );`,
            {
                type: QueryTypes.SELECT
            }
        )


        const finalRes = dbRes.map(db => (
            {
                id: db.id,
                name: db.name,
                imgurl: db.imgurl,
                default_subcategory: {
                    subcategory_id: db.subcategory_id,
                    subcategory_name: db.subcategory_name
                }
            }
        ));




        res.status(200).json({
            success: true,
            count: finalRes.length,
            categories: finalRes
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


const getSubcategoryByCategorieId = async (req, res) => {
    try {
        const { cid } = req.params;

        // const dbRes = await sequelize.query(
        //     `SELECT
        //         s.id AS subcategory_id,
        //         s.title AS subcategory_name,
        //         s.imgurl AS imgurl
        //      FROM subcategory s
        //      WHERE s.category_id = :categoryId`,
        //     {
        //         replacements: { categoryId: parseInt(cid) },
        //         type: QueryTypes.SELECT
        //     }
        // );

        const subcategories = await Subcategory.findAll({
            where: {
                category_id: parseInt(cid)
            },
            attributes: [
                ['id', 'subcategory_id'],
                ['title', 'subcategory_name'],
                'imgurl'
            ],
            raw:true
        });


      

        const finalRes = subcategories.map(db => (
            {
                id: db.subcategory_id,
                name: db.subcategory_name,
                imgurl: db.imgurl,

            }
        ));




        res.status(200).json({
            success: true,
            count: finalRes.length,
            categories: finalRes
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

module.exports = { getAllCategories, getSubcategoryByCategorieId }