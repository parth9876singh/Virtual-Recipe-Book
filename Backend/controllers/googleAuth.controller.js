const { OAuth2Client } = require("google-auth-library");
const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

module.exports.googleLogin = async (req, res) => {
    try {
        const { idToken } = req.body;

        if (!idToken) {
            return res.status(400).json({ message: "Token missing!" });
        }

        // VERIFY GOOGLE TOKEN
        const ticket = await client.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID
        });

        const payload = ticket.getPayload();
        const { email, name, sub: googleId, picture } = payload;

        // CHECK IF USER EXISTS
        let user = await userModel.findOne({ email });

        // IF NEW USER → CREATE ACCOUNT
        if (!user) {
            user = await userModel.create({
                name,
                email,
                googleId,
                password: "google-signin", // dummy
            });
        }

        // GENERATE JWT
        const token = user.generateAuthToken();

        // SET COOKIE
        res.cookie("token", token, {
            httpOnly: true,
            secure: false, // true in production
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000,
        });

        user.password = undefined;

        res.status(200).json({
            message: "Google login successful",
            token,
            user,
        });

    } catch (err) {
        console.error("Google Login Error:", err);
        return res.status(500).json({ message: "Google Login Failed", error: err });
    }
};
