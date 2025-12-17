import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    Sparkles,
    ChefHat,
    Utensils,
    BookOpen,
    Globe,
    Zap,
    Send,
    Loader2,
    Leaf,
    Save,
    RefreshCw,
    ArrowLeft,
    Clock,
    Users,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../lib/axios";
import Navbar from "../components/Navbar";

/* ---------------- PROMPT TYPES ---------------- */

const promptTypes = [
    {
        id: "ingredients",
        label: "What's in my fridge?",
        icon: Utensils,
        description: "List ingredients you have",
        placeholder: "I have chicken, garlic, lemon, olive oil...",
        gradient: "from-amber-500 to-orange-600",
    },
    {
        id: "cuisine",
        label: "Explore Cuisine",
        icon: Globe,
        description: "Pick a cuisine style",
        placeholder: "Make me an authentic Thai curry...",
        gradient: "from-emerald-500 to-teal-600",
    },
    {
        id: "dietary",
        label: "Dietary Needs",
        icon: Leaf,
        description: "Specify restrictions",
        placeholder: "High-protein vegan breakfast...",
        gradient: "from-green-500 to-lime-600",
    },
    {
        id: "quick",
        label: "Quick & Easy",
        icon: Zap,
        description: "Under 30 minutes",
        placeholder: "Quick dinner for two...",
        gradient: "from-yellow-500 to-amber-600",
    },
];

/* ---------------- MOCK AI GENERATION ---------------- */



/* ---------------- MAIN COMPONENT ---------------- */

export default function AIRecipeMaker() {
    const navigate = useNavigate();
    const [selectedType, setSelectedType] = useState(null);
    const [prompt, setPrompt] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedRecipe, setGeneratedRecipe] = useState(null);

    const handleGenerate = async () => {
        if (!prompt || !selectedType) {
            toast.error("Please select a prompt type and enter a request");
            return;
        }

        setIsGenerating(true);
        setGeneratedRecipe(null);

        try {
            const response = await api.post("/ai/generate", {
                prompt,
                type: selectedType
            });
            setGeneratedRecipe(response.data);
            toast.success("Recipe generated!");
        } catch (error) {
            console.error("AI Generation Error:", error);
            toast.error(error.response?.data?.message || "Failed to generate recipe. Please try again.");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleReset = () => {
        setSelectedType(null);
        setPrompt("");
        setGeneratedRecipe(null);
    };

    const handleSaveRecipe = async (isPublic = false) => {
        if (!generatedRecipe) return;

        try {
            const loadingToast = toast.loading(isPublic ? "Publishing recipe..." : "Saving recipe...");
            // Pass isPublic flag to backend
            await api.post("/ai/save", { ...generatedRecipe, isPublic });

            toast.dismiss(loadingToast);
            toast.success(isPublic ? "Recipe published to All Recipes!" : "Recipe saved to your dashboard!");

            // Optional: Navigate to dashboard after short delay
            setTimeout(() => {
                navigate("/dashboard");
            }, 1000);

        } catch (error) {
            console.error("Save Error:", error);
            toast.error("Failed to save recipe");
        }
    };

    const handleVideoSelect = (videoUrl) => {
        setGeneratedRecipe(prev => ({
            ...prev,
            recipeVideo: videoUrl
        }));
    };

    const difficultyColor = (level) => {
        if (level === "Easy") return "bg-green-500/20 text-green-400";
        if (level === "Medium") return "bg-yellow-500/20 text-yellow-400";
        if (level === "Hard") return "bg-red-500/20 text-red-400";
        return "bg-muted";
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-background to-primary/5 px-4 py-10 mt-12">
            <Navbar />
            {/* ... header ... */}
            <div className="max-w-5xl mx-auto text-center mb-10 relative">
                <div className="flex justify-center items-center gap-3 mb-4">
                    <Sparkles className="w-8 h-8 text-primary" />
                    <h1 className="text-4xl font-bold">AI Recipe Maker</h1>
                </div>
                <p className="text-muted-foreground">
                    Describe what you want and let AI cook for you
                </p>
            </div>

            <AnimatePresence mode="wait">
                {!generatedRecipe ? (
                    // ... input form ...
                    <motion.div
                        key="input"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="max-w-4xl mx-auto"
                    >
                        {/* Prompt Types */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            {promptTypes.map((type) => (
                                <button
                                    key={type.id}
                                    onClick={() => setSelectedType(type.id)}
                                    className={`p-5 rounded-xl border text-left transition-all duration-200 ${selectedType === type.id
                                        ? "border-primary bg-primary/10 shadow-md transform scale-[1.02]"
                                        : "border-border/50 bg-card hover:border-primary/50"
                                        }`}
                                >
                                    <type.icon className={`w-6 h-6 mb-2 ${selectedType === type.id ? "text-primary" : "text-muted-foreground"}`} />
                                    <h3 className="font-semibold">{type.label}</h3>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {type.description}
                                    </p>
                                </button>
                            ))}
                        </div>

                        {/* Prompt Input */}
                        {selectedType && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-card p-6 rounded-2xl border border-border shadow-sm"
                            >
                                <textarea
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    placeholder={
                                        promptTypes.find((t) => t.id === selectedType)?.placeholder
                                    }
                                    className="w-full min-h-[140px] p-4 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none transition-all"
                                />
                                <div className="flex justify-end mt-4">
                                    <button
                                        onClick={handleGenerate}
                                        className="px-6 py-2 rounded-xl bg-primary text-primary-foreground font-medium flex items-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
                                        disabled={isGenerating}
                                    >
                                        {isGenerating ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" /> Generating
                                            </>
                                        ) : (
                                            <>
                                                <Send className="w-4 h-4" /> Generate
                                            </>
                                        )}
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </motion.div>
                ) : (
                    /* RESULT */
                    <motion.div
                        key="result"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-5xl mx-auto bg-card p-8 rounded-3xl border border-border shadow-lg"
                    >
                        <div className="flex justify-between mb-6">
                            <button
                                onClick={handleReset}
                                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <RefreshCw className="w-4 h-4" /> New Recipe
                            </button>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => handleSaveRecipe(false)}
                                    className="flex items-center gap-2 text-sm px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors font-medium"
                                >
                                    <Save className="w-4 h-4" /> Save Private
                                </button>
                                <button
                                    onClick={() => handleSaveRecipe(true)}
                                    className="flex items-center gap-2 text-sm px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium shadow-lg shadow-primary/20"
                                >
                                    <Globe className="w-4 h-4" /> Save & Publish
                                </button>
                            </div>
                        </div>

                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold mb-2">
                                {generatedRecipe.title}
                            </h2>
                            <p className="text-muted-foreground">
                                {generatedRecipe.description}
                            </p>
                            <div className="flex items-center justify-center gap-3 mt-4">
                                <span className={`px-2 py-1 rounded text-xs font-medium ${difficultyColor(generatedRecipe.difficulty)}`}>
                                    {generatedRecipe.difficulty}
                                </span>
                                <span className="flex items-center gap-1 text-xs text-muted-foreground bg-secondary px-2 py-1 rounded">
                                    <Clock className="w-3 h-3" /> {generatedRecipe.cookingTime} min
                                </span>
                                <span className="flex items-center gap-1 text-xs text-muted-foreground bg-secondary px-2 py-1 rounded">
                                    <Users className="w-3 h-3" /> {generatedRecipe.servings} servings
                                </span>
                            </div>
                        </div>

                        {/* Video Section */}
                        {generatedRecipe.recipeVideo && (
                            <div className="mb-8 space-y-4">
                                <div className="rounded-2xl overflow-hidden aspect-video relative bg-black/5 border border-border/50 shadow-inner">
                                    <iframe
                                        src={(() => {
                                            const url = generatedRecipe.recipeVideo;
                                            let videoId = null;
                                            if (url.includes("youtube.com/watch")) {
                                                videoId = new URLSearchParams(new URL(url).search).get("v");
                                            } else if (url.includes("youtu.be/")) {
                                                videoId = url.split("youtu.be/")[1]?.split("?")[0];
                                            }
                                            return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
                                        })()}
                                        className="w-full h-full"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                        title="Recipe Video"
                                    />
                                </div>
                                {/* Alternative Videos List */}
                                {generatedRecipe.relatedVideos && generatedRecipe.relatedVideos.length > 1 && (
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground mb-2">Similar Videos (Select to default)</p>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                            {generatedRecipe.relatedVideos.map((vid, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => handleVideoSelect(vid.url)}
                                                    className={`relative rounded-xl overflow-hidden aspect-video border-2 transition-all group ${generatedRecipe.recipeVideo === vid.url
                                                        ? 'border-primary ring-2 ring-primary/20 opacity-100'
                                                        : 'border-transparent hover:border-primary/50 opacity-70 hover:opacity-100'
                                                        }`}
                                                >
                                                    <img src={vid.thumbnail} alt={vid.title} className="w-full h-full object-cover" />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="grid md:grid-cols-2 gap-8">
                            {/* Ingredients */}
                            <div className="bg-secondary/20 p-6 rounded-2xl">
                                <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-primary">
                                    <Utensils className="w-5 h-5" /> Ingredients
                                </h3>
                                <ul className="space-y-3">
                                    {generatedRecipe.ingredients.map((i, idx) => (
                                        <li key={idx} className="flex gap-3 items-start p-2 rounded-lg hover:bg-background/50 transition-colors">
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                                            <div>
                                                <span className="font-semibold">{i.quantity}</span> <span className="text-muted-foreground">{i.name}</span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Steps */}
                            <div>
                                <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-primary">
                                    <BookOpen className="w-5 h-5" /> Instructions
                                </h3>
                                <ol className="space-y-4">
                                    {generatedRecipe.steps.map((s) => (
                                        <li key={s.stepNumber} className="flex gap-4">
                                            <span className="flex-none w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                                                {s.stepNumber}
                                            </span>
                                            <p className="pt-1 text-muted-foreground">{s.instruction}</p>
                                        </li>
                                    ))}
                                </ol>
                            </div>
                        </div>

                        {/* Nutrition Hint */}
                        <div className="mt-8 p-4 border border-border/50 rounded-xl bg-background/50 text-center">
                            <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
                                <Zap className="w-4 h-4 text-yellow-500" />
                                <span>Contains approx. <span className="font-semibold text-foreground">{generatedRecipe.nutrition.calories}</span> per serving</span>
                            </p>
                        </div>
                    </motion.div >
                )
                }
            </AnimatePresence >
        </div >
    );
}
