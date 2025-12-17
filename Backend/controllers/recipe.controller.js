const Recipe = require("../models/recipe.model");
const cloudinary = require("../config/cloudinary.js");
const mongoose = require("mongoose");
const User = require("../models/user.model"); // Needed for saved recipes and population

module.exports.createRecipe = async (req, res) => {
    try {
        const {
            title,
            description,
            ingredients,
            steps,
            cuisine,
            difficulty,
            cookingTime,
            menu,
            videoUrl
        } = req.body;

        if (!req.files) {
            return res.status(400).json({
                message: "No files uploaded. Please use form-data and upload a thumbnail image."
            });
        }

        const thumbnailFile = req.files.thumbnail?.[0];
        const videoFile = req.files.recipeVideo?.[0];

        if (!thumbnailFile) {
            return res.status(400).json({
                message: "Thumbnail is required."
            });
        }

        // Upload thumbnail
        const thumbnailUpload = await cloudinary.uploader.upload(thumbnailFile.path, {
            folder: "recipe_thumbnails",
            resource_type: "image"
        });

        // VIDEO HANDLING
        let finalVideoUrl = null;
        let videoType = null;

        if (videoFile) {
            const videoUpload = await cloudinary.uploader.upload(videoFile.path, {
                folder: "recipe_videos",
                resource_type: "video"
            });
            finalVideoUrl = videoUpload.secure_url;
            videoType = "upload";

        } else if (videoUrl) {
            finalVideoUrl = videoUrl;
            videoType = "url";

        } else {
            return res.status(400).json({ message: "Please upload a video or provide a video URL" });
        }

        let ing = [];
        let stp = [];

        try {
            ing = ingredients ? JSON.parse(ingredients) : [];
            stp = steps ? JSON.parse(steps) : [];
        } catch (err) {
            return res.status(400).json({ message: "Invalid JSON format for ingredients or steps." });
        }

        const recipe = await Recipe.create({
            title,
            description,
            thumbnail: thumbnailUpload.secure_url,
            recipeVideo: finalVideoUrl,
            videoType,
            ingredients: ing,
            steps: stp,
            cuisine,
            difficulty,
            cookingTime: cookingTime ? parseInt(cookingTime) : null,
            menu: menu || "Quick Meal",
            createdBy: req.user._id,
            isPublic: true // Manual recipes are public by default
        });

        res.status(201).json({ message: "Recipe created successfully", recipe });

    } catch (err) {
        console.error("Create Recipe Error:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

module.exports.getAllRecipes = async (req, res) => {
    try {
        // Only return PUBLIC recipes
        const recipes = await Recipe.find({ isPublic: true }).sort({ createdAt: -1 });
        res.status(200).json(recipes);
    } catch (err) {
        res.status(500).json({ error: err });
    }
};

module.exports.getRecipeById = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "Invalid recipe ID format" });
        }
        const recipe = await Recipe.findById(req.params.id).populate("createdBy", "name email");
        if (!recipe) return res.status(404).json({ message: "Recipe not found" });

        // If private, only creator can view (simplified logic, usually shared link might work too?)
        // For now, if public OR it's mine, I can see it. But since this is public endpoint, 
        // we rely on frontend context or separate auth check middleware if strictly enforcing.
        // Let's allow fetching by ID generally if they have link, 
        // OR enforce: if (!recipe.isPublic && (!req.user || req.user._id !== recipe.createdBy)) -> 403
        // But getRecipeById is currently public. We'll leave it open for now or add check if needed.

        res.json(recipe);
    } catch (err) {
        res.status(500).json({ error: err });
    }
};

module.exports.updateRecipe = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "Invalid recipe ID format" });
        }
        const recipe = await Recipe.findById(req.params.id);
        if (!recipe) return res.status(404).json({ message: "Recipe not found" });

        if (recipe.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        const updatedRecipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json({ message: "Recipe updated", updatedRecipe });
    } catch (err) {
        res.status(500).json({ error: err });
    }
};

module.exports.deleteRecipe = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "Invalid recipe ID format" });
        }
        const recipe = await Recipe.findById(req.params.id);
        if (!recipe) return res.status(404).json({ message: "Recipe not found" });

        if (recipe.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        await Recipe.findByIdAndDelete(req.params.id);
        res.json({ message: "Recipe deleted" });
    } catch (err) {
        res.status(500).json({ error: err });
    }
};

module.exports.toggleLike = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "Invalid recipe ID format" });
        }
        const recipeId = req.params.id;
        const userId = req.user._id;

        const recipe = await Recipe.findById(recipeId);
        if (!recipe) return res.status(404).json({ message: "Recipe not found" });

        const index = recipe.likes.indexOf(userId);
        if (index === -1) {
            recipe.likes.push(userId);
        } else {
            recipe.likes.splice(index, 1);
        }
        await recipe.save();
        res.json({ message: "Like status updated", likes: recipe.likes.length });
    } catch (err) {
        res.status(500).json({ error: err });
    }
};

module.exports.addComment = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "Invalid recipe ID format" });
        }
        const recipe = await Recipe.findById(req.params.id);
        if (!recipe) return res.status(404).json({ message: "Recipe not found" });

        recipe.comments.push({
            userId: req.user._id,
            comment: req.body.comment
        });
        await recipe.save();
        res.json({ message: "Comment added", comments: recipe.comments });
    } catch (err) {
        res.status(500).json({ error: err });
    }
};

module.exports.getMyRecipes = async (req, res) => {
    try {
        const userId = req.user._id;
        const myRecipes = await Recipe.find({ createdBy: userId }).sort({ createdAt: -1 });
        res.status(200).json({
            message: "My recipes fetched successfully",
            count: myRecipes.length,
            recipes: myRecipes
        });
    } catch (error) {
        console.error("Error fetching my recipes:", error);
        res.status(500).json({ message: "Server error", error });
    }
};

// --- NEW FEATURES ---

module.exports.getSavedRecipes = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId).populate('savedRecipes');

        if (!user) return res.status(404).json({ message: "User not found" });

        res.status(200).json({
            message: "Saved recipes fetched",
            count: user.savedRecipes.length,
            recipes: user.savedRecipes
        });
    } catch (error) {
        console.error("Error getSavedRecipes:", error);
        res.status(500).json({ message: "Server error", error });
    }
};

module.exports.toggleSave = async (req, res) => {
    try {
        const recipeId = req.params.id;
        const userId = req.user._id;

        if (!mongoose.Types.ObjectId.isValid(recipeId)) {
            return res.status(400).json({ message: "Invalid recipe ID" });
        }

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        const index = user.savedRecipes.indexOf(recipeId);
        let isSaved = false;

        if (index === -1) {
            user.savedRecipes.push(recipeId);
            isSaved = true;
        } else {
            user.savedRecipes.splice(index, 1);
            isSaved = false;
        }

        await user.save();
        res.json({ message: isSaved ? "Recipe saved" : "Recipe removed from saved", isSaved });

    } catch (error) {
        console.error("Error toggleSave:", error);
        res.status(500).json({ message: "Server error", error });
    }
};

module.exports.shareRecipe = async (req, res) => {
    try {
        const recipeId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(recipeId)) {
            return res.status(400).json({ message: "Invalid recipe ID" });
        }

        const recipe = await Recipe.findById(recipeId);
        if (!recipe) return res.status(404).json({ message: "Recipe not found" });

        if (recipe.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Unauthorized to share this recipe" });
        }

        recipe.isPublic = true;
        await recipe.save();

        res.json({ message: "Recipe shared publicly!", recipe });

    } catch (error) {
        console.error("Error shareRecipe:", error);
        res.status(500).json({ message: "Server error", error });
    }
};
