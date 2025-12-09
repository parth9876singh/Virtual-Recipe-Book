import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/axios";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  ChefHat,
  ImagePlus,
  Video,
  ListOrdered,
  Clock,
  Flame,
  Globe,
  Plus,
  Trash2,
  ArrowLeft,
  ArrowRight,
  Check,
  X,
  Upload,
  Link as LinkIcon
} from "lucide-react";
const Button = ({ className, variant = "default", size = "default", children, ...props }) => {
  const variants = {
    default: "bg-primary text-primary-foreground hover:opacity-90",
    destructive: "bg-destructive text-destructive-foreground hover:opacity-90",
    outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    link: "text-primary underline-offset-4 hover:underline",
  }
  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-11 rounded-md px-8",
    icon: "h-10 w-10",
  }
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

const Input = ({ className, type, ...props }) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

const Textarea = ({ className, ...props }) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

const Label = ({ className, ...props }) => (
  <label
    className={cn(
      "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
      className
    )}
    {...props}
  />
)
import { cn } from "../lib/utils";

const steps = [
  { id: 1, title: "Basics", icon: ChefHat, description: "Name your masterpiece" },
  { id: 2, title: "Media", icon: ImagePlus, description: "Add visuals" },
  { id: 3, title: "Ingredients", icon: ListOrdered, description: "List what you need" },
  { id: 4, title: "Instructions", icon: Flame, description: "Share the magic" },
  { id: 5, title: "Details", icon: Clock, description: "Final touches" },
];

const cuisineOptions = [
  "Italian", "Mexican", "Chinese", "Indian", "Japanese",
  "Thai", "French", "Mediterranean", "American", "Korean"
];

const difficultyOptions = [
  { value: "easy", label: "Easy", color: "from-green-500 to-emerald-500" }, // Keep semantic red/green/yellow for difficulty if desired, or switch to primary. 
  // User asked for "theme integration", but difficulty often implies semantic color (Green=Easy, Red=Hard). 
  // However, to strictly follow the theme, we could use primary with opacity. 
  // Let's stick to semantic for difficulty as it's standard UX, BUT let's match the style.
  { value: "medium", label: "Medium", color: "from-yellow-500 to-orange-500" },
  { value: "hard", label: "Hard", color: "from-red-500 to-rose-500" },
];

const menuOptions = [
  "Breakfast", "Lunch", "Dinner", "Dessert", "Health", "Quick Meal"
];



export default function CreateRecipe() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [videoType, setVideoType] = useState("url");
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    thumbnail: "",
    recipeVideo: "",
    cuisine: "",
    difficulty: "",
    cookingTime: "",
    menu: "", // <--- Added menu
  });

  const [ingredients, setIngredients] = useState([
    { name: "", quantity: "" }
  ]);

  const [recipeSteps, setRecipeSteps] = useState([
    { stepNumber: 1, instruction: "" }
  ]);

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addIngredient = () => {
    setIngredients(prev => [...prev, { name: "", quantity: "" }]);
  };

  const removeIngredient = (index) => {
    setIngredients(prev => prev.filter((_, i) => i !== index));
  };

  const updateIngredient = (index, field, value) => {
    setIngredients(prev => prev.map((ing, i) =>
      i === index ? { ...ing, [field]: value } : ing
    ));
  };

  const addStep = () => {
    setRecipeSteps(prev => [...prev, { stepNumber: prev.length + 1, instruction: "" }]);
  };

  const removeStep = (index) => {
    setRecipeSteps(prev => prev.filter((_, i) => i !== index).map((step, i) => ({
      ...step,
      stepNumber: i + 1
    })));
  };

  const updateStep = (index, instruction) => {
    setRecipeSteps(prev => prev.map((step, i) =>
      i === index ? { ...step, instruction } : step
    ));
  };

  /* Validation Logic */
  /* Validation Logic */
  const validateStep = (step) => {
    switch (step) {
      case 1: // Basics
        if (!formData.title.trim()) {
          toast.error("Please enter a recipe title.");
          return false;
        }
        if (!formData.description.trim()) {
          toast.error("Please enter a description.");
          return false;
        }
        return true;
      case 2: // Media
        // If user already has a thumbnail (edit mode or prev step), fine. 
        // But here we rely on local state mainly for new creates.
        // We check if either file is selected OR if there is a preview URL (which means file was selected)
        if (!thumbnailFile && !formData.thumbnail) {
          toast.error("Please upload a thumbnail image.");
          return false;
        }
        if ((videoType === 'upload' && !videoFile) || (videoType === 'url' && !formData.recipeVideo)) {
          toast.error("Please provide a recipe video.");
          return false;
        }
        return true;
      case 3: // Ingredients
        const validIngredients = ingredients.filter(ing => ing.name.trim() && ing.quantity.trim());
        if (validIngredients.length === 0) {
          toast.error("Please add at least one ingredient.");
          return false;
        }
        return true;
      case 4: // Instructions
        const validSteps = recipeSteps.filter(step => step.instruction.trim());
        if (validSteps.length === 0) {
          toast.error("Please add at least one instruction step.");
          return false;
        }
        return true;
      case 5: // Details
        if (!formData.menu) {
          toast.error("Please select a menu category.");
          return false;
        }
        if (!formData.cuisine) {
          toast.error("Please select a cuisine type.");
          return false;
        }
        if (!formData.difficulty) {
          toast.error("Please select a difficulty level.");
          return false;
        }
        if (!formData.cookingTime) {
          toast.error("Please enter cooking time.");
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 5) setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(prev => prev - 1);
  };

  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = async () => {
    if (!validateStep(5)) return;

    try {
      setIsLoading(true);
      const submissionData = new FormData();

      // Basic Fields
      submissionData.append("title", formData.title);
      submissionData.append("description", formData.description);
      submissionData.append("cuisine", formData.cuisine);
      submissionData.append("difficulty", formData.difficulty);
      submissionData.append("cookingTime", formData.cookingTime);
      submissionData.append("menu", formData.menu);

      // Media Handling
      if (thumbnailFile) {
        submissionData.append("thumbnail", thumbnailFile);
      }

      if (videoType === "upload" && videoFile) {
        submissionData.append("recipeVideo", videoFile);
        submissionData.append("videoType", "upload");
      } else if (videoType === "url" && formData.recipeVideo) {
        submissionData.append("videoUrl", formData.recipeVideo);
        submissionData.append("videoType", "url");
      }

      // JSON Fields
      const validIngredients = ingredients.filter(ing => ing.name && ing.quantity);
      submissionData.append("ingredients", JSON.stringify(validIngredients));

      const validSteps = recipeSteps.filter(step => step.instruction);
      submissionData.append("steps", JSON.stringify(validSteps));

      const res = await api.post("/recipe/create", submissionData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      console.log("Recipe Created:", res.data);
      toast.success("Recipe Published Successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error creating recipe:", error);
      toast.error(error.response?.data?.message || "Failed to create recipe");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/20">
      {/* Decorative Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 container max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </button>
          <div className="flex items-center gap-3">
            <ChefHat className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-display font-bold text-primary">
              Create Recipe
            </h1>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-between relative">
            {/* Progress Line */}
            <div className="absolute top-6 left-0 right-0 h-0.5 bg-border">
              <motion.div
                className="h-full bg-primary"
                initial={{ width: "0%" }}
                animate={{ width: `${((currentStep - 1) / 4) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>

            {steps.map((step) => (
              <div
                key={step.id}
                className="relative flex flex-col items-center z-10"
              >
                <motion.button
                  onClick={() => setCurrentStep(step.id)}
                  className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300",
                    currentStep >= step.id
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                      : "bg-card border-2 border-border text-muted-foreground"
                  )}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {currentStep > step.id ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <step.icon className="w-5 h-5" />
                  )}
                </motion.button>
                <span className={cn(
                  "mt-2 text-sm font-medium hidden md:block",
                  currentStep >= step.id ? "text-foreground" : "text-muted-foreground"
                )}>
                  {step.title}
                </span>
                <span className="text-xs text-muted-foreground hidden lg:block">
                  {step.description}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-card/50 backdrop-blur-xl rounded-3xl border border-border/50 shadow-2xl overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="p-8 md:p-12"
            >
              {/* Step 1: Basics */}
              {currentStep === 1 && (
                <div className="space-y-8">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-display font-bold mb-2">What's cooking?</h2>
                    <p className="text-muted-foreground">Give your recipe a name and description</p>
                  </div>

                  <div className="max-w-2xl mx-auto space-y-6">
                    <div className="space-y-3">
                      <Label htmlFor="title" className="text-lg font-medium">Recipe Title</Label>
                      <Input
                        id="title"
                        placeholder="e.g., Grandma's Secret Pasta"
                        value={formData.title}
                        onChange={(e) => updateFormData("title", e.target.value)}
                        className="h-14 text-lg rounded-xl border-2 focus:border-primary/50 transition-all"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="description" className="text-lg font-medium">Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Tell us the story behind this dish..."
                        value={formData.description}
                        onChange={(e) => updateFormData("description", e.target.value)}
                        className="min-h-[150px] text-lg rounded-xl border-2 focus:border-primary/50 transition-all resize-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Media */}
              {currentStep === 2 && (
                <div className="space-y-8">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-display font-bold mb-2">Show it off!</h2>
                    <p className="text-muted-foreground">Add photos and videos of your dish</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {/* Thumbnail Upload */}
                    <div className="space-y-4">
                      <Label className="text-lg font-medium flex items-center gap-2">
                        <ImagePlus className="w-5 h-5 text-primary" />
                        Thumbnail Image *
                      </Label>
                      <div className="relative group">
                        <label className="aspect-video rounded-2xl border-2 border-dashed border-border hover:border-primary/50 transition-all bg-accent/30 flex flex-col items-center justify-center cursor-pointer overflow-hidden relative">
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files[0];
                              if (file) {
                                setThumbnailFile(file);
                                updateFormData("thumbnail", URL.createObjectURL(file));
                              }
                            }}
                          />
                          {formData.thumbnail ? (
                            <div className="relative w-full h-full">
                              <img
                                src={formData.thumbnail}
                                alt="Thumbnail"
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-medium">
                                Change Image
                              </div>
                            </div>
                          ) : (
                            <>
                              <Upload className="w-10 h-10 text-muted-foreground mb-3" />
                              <span className="text-muted-foreground">Click to upload image</span>
                            </>
                          )}
                        </label>
                      </div>
                      <p className="text-sm text-muted-foreground text-center">Required for the recipe card</p>
                    </div>

                    {/* Video Upload */}
                    <div className="space-y-4">
                      <Label className="text-lg font-medium flex items-center gap-2">
                        <Video className="w-5 h-5 text-primary" />
                        Recipe Video
                      </Label>

                      {/* Video Type Toggle */}
                      <div className="flex gap-2 p-1 bg-accent/50 rounded-xl">
                        <button
                          onClick={() => setVideoType("url")}
                          className={cn(
                            "flex-1 py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-all",
                            videoType === "url"
                              ? "bg-card shadow-md text-foreground"
                              : "text-muted-foreground hover:text-foreground"
                          )}
                        >
                          <LinkIcon className="w-4 h-4" />
                          URL
                        </button>
                        <button
                          onClick={() => setVideoType("upload")}
                          className={cn(
                            "flex-1 py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-all",
                            videoType === "upload"
                              ? "bg-card shadow-md text-foreground"
                              : "text-muted-foreground hover:text-foreground"
                          )}
                        >
                          <Upload className="w-4 h-4" />
                          Upload
                        </button>
                      </div>

                      {videoType === "upload" ? (
                        <label className="aspect-video rounded-2xl border-2 border-dashed border-border hover:border-primary/50 transition-all bg-accent/30 flex flex-col items-center justify-center cursor-pointer overflow-hidden">
                          <input
                            type="file"
                            accept="video/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files[0];
                              if (file) {
                                setVideoFile(file);
                                updateFormData("recipeVideo", URL.createObjectURL(file));
                              }
                            }}
                          />
                          {videoFile ? (
                            <div className="text-center p-4">
                              <Video className="w-10 h-10 text-primary mb-2 mx-auto" />
                              <span className="text-foreground font-medium block truncate max-w-[200px]">{videoFile.name}</span>
                              <span className="text-xs text-muted-foreground">Click to change</span>
                            </div>
                          ) : (
                            <>
                              <Video className="w-10 h-10 text-muted-foreground mb-3" />
                              <span className="text-muted-foreground">Click to upload video</span>
                            </>
                          )}
                        </label>
                      ) : (
                        <>
                          <div className="aspect-video rounded-2xl border-2 border-dashed border-border bg-accent/30 flex flex-col items-center justify-center">
                            <Video className="w-10 h-10 text-muted-foreground mb-3" />
                            <span className="text-muted-foreground">Paste YouTube/Video URL</span>
                          </div>
                          <Input
                            type="url"
                            placeholder="https://youtube.com/watch?v=..."
                            value={formData.recipeVideo}
                            onChange={(e) => updateFormData("recipeVideo", e.target.value)}
                            className="mt-3 rounded-xl"
                          />
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Ingredients */}
              {currentStep === 3 && (
                <div className="space-y-8">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-display font-bold mb-2">What do you need?</h2>
                    <p className="text-muted-foreground">List all the ingredients</p>
                  </div>

                  <div className="max-w-3xl mx-auto space-y-4">
                    {ingredients.map((ingredient, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex gap-4 items-center group"
                      >
                        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold shrink-0">
                          {index + 1}
                        </div>
                        <Input
                          placeholder="Ingredient name"
                          value={ingredient.name}
                          onChange={(e) => updateIngredient(index, "name", e.target.value)}
                          className="flex-1 h-12 rounded-xl"
                        />
                        <Input
                          placeholder="Quantity"
                          value={ingredient.quantity}
                          onChange={(e) => updateIngredient(index, "quantity", e.target.value)}
                          className="w-32 h-12 rounded-xl"
                        />
                        {ingredients.length > 1 && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeIngredient(index)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="w-5 h-5" />
                          </Button>
                        )}
                      </motion.div>
                    ))}

                    <Button
                      variant="outline"
                      onClick={addIngredient}
                      className="w-full h-12 rounded-xl border-dashed border-2 hover:border-primary hover:bg-primary/5"
                    >
                      <Plus className="w-5 h-5 mr-2" />
                      Add Ingredient
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 4: Instructions */}
              {currentStep === 4 && (
                <div className="space-y-8">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-display font-bold mb-2">How to make it?</h2>
                    <p className="text-muted-foreground">Share your step-by-step instructions</p>
                  </div>

                  <div className="max-w-3xl mx-auto space-y-6">
                    {recipeSteps.map((step, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="relative group"
                      >
                        <div className="flex gap-4">
                          <div className="relative">
                            <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg shrink-0">
                              {step.stepNumber}
                            </div>
                            {index < recipeSteps.length - 1 && (
                              <div className="absolute top-14 left-1/2 -translate-x-1/2 w-0.5 h-8 bg-gradient-to-b from-primary/50 to-transparent" />
                            )}
                          </div>
                          <div className="flex-1 pb-6">
                            <Textarea
                              placeholder={`Step ${step.stepNumber}: Describe what to do...`}
                              value={step.instruction}
                              onChange={(e) => updateStep(index, e.target.value)}
                              className="min-h-[100px] rounded-xl border-2 focus:border-primary/50 transition-all resize-none"
                            />
                            {recipeSteps.length > 1 && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeStep(index)}
                                className="mt-2 text-destructive hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Remove step
                              </Button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}

                    <Button
                      variant="outline"
                      onClick={addStep}
                      className="w-full h-12 rounded-xl border-dashed border-2 hover:border-primary hover:bg-primary/5"
                    >
                      <Plus className="w-5 h-5 mr-2" />
                      Add Step
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 5: Details */}
              {currentStep === 5 && (
                <div className="space-y-8">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-display font-bold mb-2">Final touches!</h2>
                    <p className="text-muted-foreground">Add some extra details about your recipe</p>
                  </div>

                  <div className="max-w-2xl mx-auto space-y-8">
                    {/* Menu Selection */}
                    <div className="space-y-4">
                      <Label className="text-lg font-medium flex items-center gap-2">
                        <ListOrdered className="w-5 h-5 text-primary" />
                        Menu Category
                      </Label>
                      <div className="flex flex-wrap gap-2">
                        {menuOptions.map((menu) => (
                          <button
                            key={menu}
                            onClick={() => updateFormData("menu", menu)}
                            className={cn(
                              "px-4 py-2 rounded-full border-2 transition-all",
                              formData.menu === menu
                                ? "border-primary bg-primary/10 text-primary font-medium"
                                : "border-border hover:border-primary/50"
                            )}
                          >
                            {menu}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Cuisine Selection */}
                    <div className="space-y-4">
                      <Label className="text-lg font-medium flex items-center gap-2">
                        <Globe className="w-5 h-5 text-primary" />
                        Cuisine Type
                      </Label>
                      <div className="flex flex-wrap gap-2">
                        {cuisineOptions.map((cuisine) => (
                          <button
                            key={cuisine}
                            onClick={() => updateFormData("cuisine", cuisine)}
                            className={cn(
                              "px-4 py-2 rounded-full border-2 transition-all",
                              formData.cuisine === cuisine
                                ? "border-primary bg-primary/10 text-primary font-medium"
                                : "border-border hover:border-primary/50"
                            )}
                          >
                            {cuisine}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Difficulty Selection */}
                    <div className="space-y-4">
                      <Label className="text-lg font-medium flex items-center gap-2">
                        <Flame className="w-5 h-5 text-primary" />
                        Difficulty Level
                      </Label>
                      <div className="grid grid-cols-3 gap-4">
                        {difficultyOptions.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => updateFormData("difficulty", option.value)}
                            className={cn(
                              "p-4 rounded-2xl border-2 transition-all",
                              formData.difficulty === option.value
                                ? "border-transparent"
                                : "border-border hover:border-primary/50 bg-card"
                            )}
                          >
                            <div className={cn(
                              "w-full h-2 rounded-full mb-3",
                              formData.difficulty === option.value
                                ? `bg-gradient-to-r ${option.color}`
                                : "bg-accent"
                            )} />
                            <span className={cn(
                              "font-medium",
                              formData.difficulty === option.value && "text-foreground"
                            )}>
                              {option.label}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Cooking Time */}
                    <div className="space-y-4">
                      <Label className="text-lg font-medium flex items-center gap-2">
                        <Clock className="w-5 h-5 text-primary" />
                        Cooking Time
                      </Label>
                      <div className="flex items-center gap-4">
                        <Input
                          type="number"
                          placeholder="30"
                          value={formData.cookingTime}
                          onChange={(e) => updateFormData("cookingTime", e.target.value)}
                          className="w-24 h-14 text-center text-2xl font-bold rounded-xl"
                        />
                        <span className="text-lg text-muted-foreground">minutes</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="px-8 md:px-12 py-6 border-t border-border/50 bg-accent/20 flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </Button>

            {currentStep < 5 ? (
              <Button
                onClick={nextStep}
                className="gap-2 bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                className="gap-2 bg-primary text-primary-foreground hover:opacity-90 transition-opacity px-8"
              >
                <ChefHat className="w-4 h-4" />
                Publish Recipe
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}