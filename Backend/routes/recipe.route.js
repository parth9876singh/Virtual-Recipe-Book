const express = require("express");
const router = express.Router();
const recipeController = require("../controllers/recipe.controller");
const { authUser } = require("../middlewares/authUser.js");
const upload = require('../middlewares/multer.js');

// Multer error handler
const handleMulterError = (err, req, res, next) => {
  if (err) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: "File too large. Maximum size is 500MB." });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ message: "Too many files uploaded." });
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({ message: "Unexpected file field. Use 'thumbnail' and 'recipeVideo'." });
    }
    return res.status(400).json({ message: "File upload error", error: err.message });
  }
  next();
};

router.post(
  "/create",
  authUser,
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "recipeVideo", maxCount: 1 },
  ]),
  handleMulterError,
  recipeController.createRecipe
);

router.get("/my-recipes", authUser, recipeController.getMyRecipes);
router.get("/saved-recipes", authUser, recipeController.getSavedRecipes); // Moved up
router.get("/all", recipeController.getAllRecipes);

// Parameterized routes come last
router.get("/:id", recipeController.getRecipeById);
router.put("/update/:id", authUser, recipeController.updateRecipe);
router.delete("/delete/:id", authUser, recipeController.deleteRecipe);

router.post("/:id/save", authUser, recipeController.toggleSave);
router.post("/:id/share", authUser, recipeController.shareRecipe); // New share route

// Extra routes with parameters
router.post("/:id/like", authUser, recipeController.toggleLike);
router.post("/:id/comment", authUser, recipeController.addComment);

module.exports = router;
