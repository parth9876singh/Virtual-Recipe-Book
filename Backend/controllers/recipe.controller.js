const Recipe = require("../models/recipe.model");
const cloudinary = require("../config/cloudinary.js");
const mongoose = require("mongoose");

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
            videoUrl   // <-- if user gives manual URL
        } = req.body;

        // Check if files were uploaded
        if (!req.files) {
            return res.status(400).json({ 
                message: "No files uploaded. Please use form-data and upload a thumbnail image." 
            });
        }

        const thumbnailFile = req.files.thumbnail?.[0];
        const videoFile = req.files.recipeVideo?.[0];

        if (!thumbnailFile) {
            return res.status(400).json({ 
                message: "Thumbnail is required. Please upload an image file with field name 'thumbnail'." 
            });
        }

        // Upload thumbnail
        const thumbnailUpload = await cloudinary.uploader.upload(thumbnailFile.path, {
            folder: "recipe_thumbnails",
            resource_type: "image"
        });

        //----------------------------------------------------------
        // VIDEO HANDLING: Choose between UPLOAD or URL input
        //----------------------------------------------------------
        let finalVideoUrl = null;
        let videoType = null;

        if (videoFile) {
            // User UPLOADED a video → push to Cloudinary
            const videoUpload = await cloudinary.uploader.upload(videoFile.path, {
                folder: "recipe_videos",
                resource_type: "video"
            });

            finalVideoUrl = videoUpload.secure_url;
            videoType = "upload";

        } else if (videoUrl) {
            // User PROVIDED a direct URL (YouTube etc.)
            finalVideoUrl = videoUrl;
            videoType = "url";

        } else {
            // Neither uploaded nor provided
            return res.status(400).json({ message: "Please upload a video or provide a video URL" });
        }

        //----------------------------------------------------------
        // Parse JSON fields (because form-data can't handle arrays)
        //----------------------------------------------------------
        let ing = [];
        let stp = [];

        try {
            ing = ingredients ? JSON.parse(ingredients) : [];
        } catch (err) {
            return res.status(400).json({ message: "Invalid ingredients format. Must be valid JSON array." });
        }

        try {
            stp = steps ? JSON.parse(steps) : [];
        } catch (err) {
            return res.status(400).json({ message: "Invalid steps format. Must be valid JSON array." });
        }

        // Convert cookingTime to number
        const cookingTimeNum = cookingTime ? parseInt(cookingTime) : null;

        //----------------------------------------------------------
        // SAVE RECIPE
        //----------------------------------------------------------
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
            cookingTime: cookingTimeNum,
            createdBy: req.user._id
        });

        res.status(201).json({
            message: "Recipe created successfully",
            recipe
        });

    } catch (err) {
        console.error("Error creating recipe:", err);
        res.status(500).json({ 
            message: "Error creating recipe", 
            error: err.message || "Internal server error" 
        });
    }
};


module.exports.getAllRecipes = async (req, res) => {
    try {
        const recipes = await Recipe.find().populate("createdBy", "name email");
        res.json(recipes);
    } catch (err) {
        res.status(500).json({ error: err });
    }
};

module.exports.getRecipeById = async (req, res) => {
    try {
        // Validate ObjectId format
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "Invalid recipe ID format" });
        }

        const recipe = await Recipe.findById(req.params.id)
            .populate("createdBy", "name")
            .populate("comments.userId", "name");

        if (!recipe) return res.status(404).json({ message: "Recipe not found" });

        res.json(recipe);
    } catch (err) {
        res.status(500).json({ error: err });
    }
};

module.exports.updateRecipe = async (req, res) => {
    try {
        // Validate ObjectId format
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "Invalid recipe ID format" });
        }

        const recipe = await Recipe.findById(req.params.id);

        if (!recipe) return res.status(404).json({ message: "Recipe not found" });

        // Only creator can update
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
        // Validate ObjectId format
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
        // Validate ObjectId format
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
        // Validate ObjectId format
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
