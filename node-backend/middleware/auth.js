import jwt from "jsonwebtoken";

export const verifyToken = async (req, res, next) => {
    try {
        // frontend will set header --> backend can grab it
        let token = req.header("Authorization");

        if (!token) {
            return res.status(403).send("Access Denied");
        }
        // this is also set on frontend
        if (token.startsWith("Bearer ")) {
            // we take everything on right side of "Bearer " (token placed after)
            token = token.slice(7, token.length).trimLeft();
        }

        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next(); // we have to use this with middleware for the next to step to start

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}