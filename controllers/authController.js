const { sequelize } = require("../models");
const { QueryTypes } = require("sequelize");
const { User } = require("../models");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");

const signUp = async (req, res) => {
    try {
        const { name, email, phonenumber, password } = req.body || {};


        //name,passowrd,email,phonenumber cannot be empty
        if (!name || !email || !phonenumber || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        //password must be atleast 8 characters long
        if (password.length < 8) {
            return res.status(400).json({
                message: "Password must be at least 8 characters long"
            });
        }

        //invalid email format
        if (!email.includes("@") || !email.includes(".")) {
            return res.status(400).json({
                message: "Invalid email format"
            });
        }

        //unique email
        existing_user = await User.findOne({
            where: { email: email }
        });

        if (existing_user) {
            return res.status(400).json({ message: "Email already exists" })
        }


        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            name,
            email,
            phonenumber,
            password: hashedPassword
        })

        return res.status(201).json({ message: "user created succesfully" })

    }
    catch (error) {
        return res.status(500).json({ message: error.message })
    }
}


const login = async (req, res) => {
    try {
        const { email, password } = req.body || {}


        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }


        const user = await User.findOne({
            where: { email: email }
        });

        if (!user) {
            return res.status(400).json({ message: "invalid email or password" })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return res.status(400).json({ message: "invalid email or password" })

        }

        const token = jwt.sign(
            {
                id: user.id,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRES
            })

        return res.status(200).json({
            token,
            message: "login successful"
        })
    }
    catch (error) {
        return res.status(500).json({ message: error.message })
    }
}
module.exports = { signUp, login }