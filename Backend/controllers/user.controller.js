const userModel = require('../models/user.model.js')
const { validationResult } = require('express-validator');

module.exports.userRegister = async (req, res, next) => {
    try {
        const error = validationResult(req);
        console.log(req.body);
        if (!error.isEmpty()) {
            return res.status(400).json({ error: error.array() });
        }
        const { name, email, password } = req.body;
        const isAlreadyEmail = await userModel.findOne({ email });
        if (isAlreadyEmail) {
            return res.status(401).json({ message: "Email already Exists!" });
        }
        const newUser = await userModel.create({
            name,
            email,
            password
        })

        const token = newUser.generateAuthToken();

        res.status(201).json({
            token,
            userModel: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                password: newUser.password,
                message: "Registered Successfully!"
            }
        });

    } catch (err) {
        next(err);
    }
}

module.exports.userLogin = async (req, res, next) => {
    try {
        const error = validationResult(req);
        if (!error.isEmpty()) {
            return res.status(401).json(({ error: error.array() }));
        }
        const { email, password } = req.body;
        const user = await userModel.findOne({ email }).select("+password");
        const isMatch = await user.comparePassword(password);

        if (!user || !isMatch) {
            return res.status(400).json({ message: "Invalid email or password!" })
        }
        const token = user.generateAuthToken();
        res.cookie("token", token, {
            httpOnly: true,
            secure: false, // true in production
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000,
        });
        res.status(200).json({
            token,
            user,
            mesaage: "Login Successfully!"
        })
    } catch (err) {
        next(err);
    }
}

module.exports.userProfile = async (req, res, next) => {
    try {
        res.status(200).json(req.user);
    } catch (err) {
        next(err);
    }
}

module.exports.userLogout = async (req, res, next) => {
    try {
        res.clearCookie("token");
        res.status(200).json({ message: "user logged out successfully" });
    }
    catch (err) {
        next(err);
    }
}


module.exports.toggleSavedRecipe = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const { recipeId } = req.params;

        const user = await userModel.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        const index = user.savedRecipes.indexOf(recipeId);

        if (index === -1) {
            user.savedRecipes.push(recipeId);
            await user.save();
            res.status(200).json({ message: "Recipe saved successfully", isSaved: true, savedRecipes: user.savedRecipes });
        } else {
            user.savedRecipes.splice(index, 1);
            await user.save();
            res.status(200).json({ message: "Recipe unsaved successfully", isSaved: false, savedRecipes: user.savedRecipes });
        }
    } catch (err) {
        next(err);
    }
};
