import { Plus, Search, Filter, BookOpen, Heart, Bookmark, Home, HomeIcon } from "lucide-react";
import { StatsCard } from "./StatsCard";
import { RecipeCard } from "./RecipeCard";
import { RecipeModal } from "./RecipeModal"; // Import Modal
import { useState, useEffect } from "react";
import api from "../../lib/axios";
import { Link } from "react-router-dom";
import toast from "react-hot-toast"; // Import toast
import { motion, AnimatePresence } from "framer-motion";

export function DashboardContent({ user }) {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("My Recipes");
    const [selectedRecipe, setSelectedRecipe] = useState(null); // Modal State
    const [stats, setStats] = useState([
        { label: "My Recipes", value: "0", icon: BookOpen, color: "bg-orange-500", textColor: "text-white" },
        { label: "Saved Recipes", value: "0", icon: Bookmark, color: "bg-background", itemColor: "text-muted-foreground" },
        { label: "Liked Recipes", value: "0", icon: Heart, color: "bg-pink-500", textColor: "text-white" },
    ]);

    // Helper to refresh data
    const fetchTabRecipes = async () => {
        setLoading(true);
        try {
            if (activeTab === "My Recipes") {
                const res = await api.get("/recipe/my-recipes");
                setRecipes(res.data.recipes);
            } else if (activeTab === "Saved") {
                const res = await api.get("/recipe/saved-recipes");
                setRecipes(res.data.recipes);
            } else if (activeTab === "Liked") {
                const res = await api.get("/recipe/all");
                setRecipes(res.data);
            }
        } catch (error) {
            console.error("Error fetching tab recipes:", error);
            setRecipes([]);
        } finally {
            setLoading(false);
        }
    };

    // Initial Stats Fetch
    useEffect(() => {
        const fetchStatsData = async () => {
            try {
                const myRes = await api.get("/recipe/my-recipes");
                const myCount = myRes.data.count;

                const savedRes = await api.get("/recipe/saved-recipes");
                const savedCount = savedRes.data.count;

                setStats(prev => [
                    { ...prev[0], value: myCount.toString() },
                    { ...prev[1], value: savedCount.toString() },
                    { ...prev[2], value: "-" }
                ]);

            } catch (e) {
                console.error("Stats fetch error", e);
            }
        };
        if (user?._id) fetchStatsData();
    }, [user?._id, activeTab]);

    useEffect(() => {
        fetchTabRecipes();
    }, [activeTab]);


    // Filter Recipes logic
    const getFilteredRecipes = () => {
        switch (activeTab) {
            case "My Recipes":
                return recipes;
            case "Saved":
                return recipes;
            case "Liked":
                return recipes.filter(r => r.likes?.includes(user?._id));
            default:
                return recipes;
        }
    };

    const filteredRecipes = getFilteredRecipes();

    // Handlers
    const handleShare = async (recipeId) => {
        try {
            const loadingToast = toast.loading("Sharing recipe...");
            await api.post(`/recipe/${recipeId}/share`);
            toast.dismiss(loadingToast);
            toast.success("Recipe is now Public!");
            fetchTabRecipes();
        } catch (error) {
            toast.dismiss();
            toast.error("Failed to share.");
        }
    };

    const handleSave = async (recipeId) => {
        try {
            await api.post(`/recipe/${recipeId}/save`);
            toast.success("Saved status updated");
            fetchTabRecipes();
        } catch (error) {
            toast.error("Failed to update save.");
        }
    };

    const handleLike = async (recipeId) => {
        try {
            await api.post(`/recipe/${recipeId}/like`);
            const updatedRecipes = recipes.map(r => {
                if (r._id === recipeId) {
                    const isLiked = r.likes.includes(user._id);
                    const newLikes = isLiked ? r.likes.filter(id => id !== user._id) : [...r.likes, user._id];
                    return { ...r, likes: newLikes };
                }
                return r;
            });
            setRecipes(updatedRecipes);
        } catch (error) {
            console.error("Like error", error);
        }
    };


    const recipesData = filteredRecipes.map(r => ({
        ...r,
        _id: r._id,
        name: r.title,
        category: r.cuisine || "General",
        image: r.thumbnail,
        saved: user?.savedRecipes?.includes(r._id) || activeTab === "Saved",
        isSaved: activeTab === "Saved",
        isLiked: r.likes?.includes(user?._id) || false,
        description: r.description,
        likesCount: r.likes?.length || 0,
        isOwned: (r.createdBy?._id || r.createdBy) === user?._id,
        isPublic: r.isPublic,
        ingredients: r.ingredients,
        steps: r.steps,
        cookingTime: r.cookingTime,
        servings: 2,
        difficulty: r.difficulty
    }));

    return (
        <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 p-8 overflow-y-auto bg-background/50 relative"
        >
            {/* Background blobs for depth */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none -z-10" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-[100px] pointer-events-none -z-10" />

            <RecipeModal recipe={selectedRecipe} onClose={() => setSelectedRecipe(null)} />

            {/* Header */}
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-10">
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                >
                    <h1 className="text-3xl font-display font-bold text-foreground">
                        Welcome back, {user?.name || "Chef"}!
                    </h1>
                    <p className="text-muted-foreground mt-1 font-sans">
                        Manage your culinary creations
                    </p>
                </motion.div>
                <motion.div
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="flex gap-3"
                >
                    <Link to='/' className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold shadow-lg shadow-primary/20 hover:opacity-90 transition-all font-sans">
                        <HomeIcon className="w-4 h-4" />
                        Home
                    </Link>

                </motion.div>
            </div>

            {/* Stats Grid */}
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10"
            >
                {stats.map((stat, index) => (
                    <StatsCard
                        key={index}
                        title={stat.label}
                        value={stat.value}
                        icon={stat.icon}
                        color={stat.color}
                        textColor={stat.textColor}
                        itemColor={stat.itemColor}
                    />
                ))}
            </motion.div>

            {/* Search and Filter */}
            <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex gap-4 mb-8"
            >
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search recipes..."
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-sans placeholder:text-muted-foreground/70"
                    />
                </div>
                <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors font-medium text-foreground font-sans">
                    <Filter className="w-4 h-4" />
                    Filter
                </button>
            </motion.div>

            {/* Tabs */}
            <div className="flex gap-8 border-b border-white/10 mb-8 overflow-x-auto">
                {["My Recipes", "Saved", "Liked"].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`pb-3 text-sm font-medium transition-colors relative font-sans whitespace-nowrap ${activeTab === tab
                            ? "text-primary"
                            : "text-muted-foreground hover:text-foreground"
                            }`}
                    >
                        {tab}
                        {activeTab === tab && (
                            <motion.div
                                layoutId="activeTab"
                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                            />
                        )}
                    </button>
                ))}
            </div>

            {/* Recipe Grid */}
            <motion.div
                layout
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
                <AnimatePresence mode="popLayout">
                    {loading ? (
                        <p className="text-muted-foreground col-span-full text-center py-10">Loading recipes...</p>
                    ) : recipesData.length > 0 ? (
                        recipesData.map((recipe, index) => (
                            <motion.div
                                key={recipe._id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.2 }}
                            >
                                <RecipeCard
                                    recipe={recipe}
                                    onClick={() => setSelectedRecipe(recipe)} // Open Modal
                                    onLike={() => handleLike(recipe._id)}
                                    onSave={() => handleSave(recipe._id)}
                                    onShare={() => handleShare(recipe._id)} // Share Handler
                                    onEdit={() => { }}
                                    onDelete={() => { }}
                                />
                            </motion.div>
                        ))
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="col-span-full text-center py-12"
                        >
                            <div className="w-16 h-16 bg-white/5 border border-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
                                <BookOpen className="w-8 h-8 text-muted-foreground" />
                            </div>
                            <h3 className="text-lg font-semibold text-foreground mb-1">No recipes found</h3>
                            <p className="text-muted-foreground">
                                {activeTab === "My Recipes"
                                    ? "You haven't created any recipes yet."
                                    : activeTab === "Liked"
                                        ? "You haven't liked any recipes yet."
                                        : activeTab === "Saved"
                                            ? "You haven't saved any recipes yet."
                                            : "No recipes available."}
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </motion.main>
    );
}
