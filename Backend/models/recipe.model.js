const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },

    thumbnail: { type: String, required: true }, // Cloudinary Image URL
    recipeVideo: { type: String, required: true }, // Cloudinary Video URL
    videoType: {
      type: String, // "upload" or "url"
      default: "url",
    },

    isPublic: {
      type: Boolean,
      default: true, // Default true for manual creation, but we'll override for AI
    },

    ingredients: [{ name: String, quantity: String }],
    steps: [{ stepNumber: Number, instruction: String }],

    cuisine: String,
    difficulty: String,
    cookingTime: Number,

    menu: {
      type: String,
      enum: ["Breakfast", "Lunch", "Dinner", "Dessert", "Health", "Quick Meal"],
      required: true,
    },

    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],

    comments: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
        comment: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Recipe", recipeSchema);
