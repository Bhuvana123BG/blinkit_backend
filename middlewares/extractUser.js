const jwt = require("jsonwebtoken");


const extractUser = (req, res, next) => {
   try {
       // Get token from header
       const authHeader = req.headers["authorization"];


       if (!authHeader) {
           return next();
       }

       // Format: Bearer token
       const token = authHeader.split(" ")[1];


       if (!token) {
           return res.status(401).json({ message: "Invalid token format" });
       }


       // Verify token
       const decoded = jwt.verify(token, process.env.JWT_SECRET);

       // Attach user info to request
       req.user = decoded;


       next(); // go to next middleware or controller


   } catch (error) {
       return res.status(403).json({ message: "Invalid or expired token" });
   }
};


module.exports = extractUser;