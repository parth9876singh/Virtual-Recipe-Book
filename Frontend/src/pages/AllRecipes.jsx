import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import api from "../lib/axios";
import {
  Search,
  Filter,
  Clock,
  ChefHat,
  Flame,
  Play,
  Heart,
  Bookmark,
  Star,
  ArrowLeft,
  Grid3X3,
  LayoutList,
  Loader2
} from "lucide-react";

/* ---------------- FILTER OPTIONS ---------------- */
const cuisines = ["All", "Indian", "Italian", "Japanese", "Mexican", "Thai", "French", "Chinese"];
const difficulties = ["All", "Easy", "Medium", "Hard"];

/* ---------------- MAIN COMPONENT ---------------- */
export default function AllRecipes() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCuisine, setSelectedCuisine] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [viewMode, setViewMode] = useState("grid");
  const [hoveredCard, setHoveredCard] = useState(null);

  /* ---------------- FETCH DATA ---------------- */
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await api.get("/recipe/all");
        // Backend returns an array of recipes directly
        setRecipes(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching recipes:", err);
        setError("Failed to load recipes. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  /* ---------------- FILTER LOGIC ---------------- */
  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch =
      recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (recipe.description && recipe.description.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCuisine = selectedCuisine === "All" || recipe.cuisine === selectedCuisine;
    const matchesDifficulty = selectedDifficulty === "All" || recipe.difficulty === selectedDifficulty;

    return matchesSearch && matchesCuisine && matchesDifficulty;
  });

  /* ---------------- UTIL ---------------- */
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Easy": return "bg-emerald-500/20 text-emerald-600 border border-emerald-500/30";
      case "Medium": return "bg-amber-500/20 text-amber-600 border border-amber-500/30";
      case "Hard": return "bg-rose-500/20 text-rose-600 border border-rose-500/30";
      default: return "bg-muted text-muted-foreground";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <p className="text-red-500">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-primary text-white rounded-lg"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">

      {/* ---- Header ---- */}
      <header className="sticky top-0 backdrop-blur-xl bg-background/80 border-b border-border/50 z-20">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Link to="/">
            <button className="p-2 rounded-xl hover:bg-muted/30">
              <ArrowLeft className="w-5 h-5" />
            </button>
          </Link>

          <div className="flex-1">
            <h1 className="text-2xl font-display font-bold">Recipe Explorer</h1>
            <p className="text-sm text-muted-foreground">Discover recipes from around the world</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              className={`p-2 rounded-xl ${viewMode === "grid" ? "bg-primary/20" : "hover:bg-muted/30"}`}
              onClick={() => setViewMode("grid")}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>

            <button
              className={`p-2 rounded-xl ${viewMode === "list" ? "bg-primary/20" : "hover:bg-muted/30"}`}
              onClick={() => setViewMode("list")}
            >
              <LayoutList className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* ---- Filters ---- */}
      <div className="container mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap gap-4 items-center p-4 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50"
        >
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search recipes..."
              className="w-full pl-10 pr-4 py-2 border rounded-xl bg-background/50 border-border/50 focus:outline-none focus:ring-1 focus:ring-primary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Cuisine Select */}
          <select
            className="p-2 rounded-xl border border-border/50 bg-background/50 focus:outline-none focus:ring-1 focus:ring-primary"
            value={selectedCuisine}
            onChange={(e) => setSelectedCuisine(e.target.value)}
          >
            {cuisines.map(c => <option key={c}>{c}</option>)}
          </select>

          {/* Difficulty Select */}
          <select
            className="p-2 rounded-xl border border-border/50 bg-background/50 focus:outline-none focus:ring-1 focus:ring-primary"
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
          >
            {difficulties.map(d => <option key={d}>{d}</option>)}
          </select>

          {/* Filter Button */}
          <button className="p-2 px-4 rounded-xl border border-border/50 flex items-center gap-2 hover:bg-muted/20">
            <Filter className="w-4 h-4" /> More Filters
          </button>
        </motion.div>

        {/* Count */}
        <p className="mt-6 mb-4 text-sm text-muted-foreground">
          Showing <span className="font-semibold text-foreground">{filteredRecipes.length}</span> recipes
        </p>

        {/* ---- Recipes Grid/List ---- */}
        <AnimatePresence mode="wait">
          <motion.div
            key={viewMode}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "flex flex-col gap-4"
            }
          >
            {filteredRecipes.map((recipe, index) => (
              <motion.div
                key={recipe._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onMouseEnter={() => setHoveredCard(recipe._id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <Link to={`/recipe/${recipe._id}`}>

                  {/* -------------------------------- GRID VIEW -------------------------------- */}
                  {viewMode === "grid" ? (
                    <div className="group relative rounded-3xl overflow-hidden bg-card border border-border/50 hover:border-primary/30 transition-all duration-500">

                      {/* Image */}
                      <div className="relative h-56 overflow-hidden">
                        <motion.img
                          src={recipe.thumbnail}
                          alt={recipe.title}
                          className="w-full h-full object-cover"
                          animate={{ scale: hoveredCard === recipe._id ? 1.1 : 1 }}
                          transition={{ duration: 0.6 }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                        {/* Difficulty */}
                        <span className={`absolute top-3 left-3 px-3 py-1 text-xs rounded-lg ${getDifficultyColor(recipe.difficulty)}`}>
                          <Flame className="inline w-3 h-3 mr-1" />
                          {recipe.difficulty}
                        </span>

                        {/* Cuisine */}
                        <span className="absolute top-3 right-3 px-3 py-1 text-xs rounded-lg bg-black/40 text-white">
                          {recipe.cuisine}
                        </span>

                        {/* Play button */}
                        {recipe.recipeVideo && (
                          <motion.div
                            className="absolute inset-0 flex items-center justify-center"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: hoveredCard === recipe._id ? 1 : 0 }}
                          >
                            <div className="w-16 h-16 bg-primary/90 rounded-full flex items-center justify-center">
                              <Play className="w-6 h-6 text-white ml-1" />
                            </div>
                          </motion.div>
                        )}

                        {/* Title */}
                        <div className="absolute bottom-3 left-3 right-3 text-white">
                          <h3 className="text-xl font-bold line-clamp-1">{recipe.title}</h3>
                          <p className="text-sm text-white/70 line-clamp-1">{recipe.description}</p>
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="p-4">
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" /> {recipe.cookingTime} min
                          </span>

                          <span className="flex items-center gap-1">
                            <Heart className="w-4 h-4 text-rose-500" /> {recipe.likes?.length || 0}
                          </span>
                        </div>

                        <div className="flex justify-between items-center mt-3">
                          <span className="text-xs text-muted-foreground flex items-center gap-2">
                            <ChefHat className="w-4 h-4 text-primary" /> by {recipe.createdBy?.name || "Chef"}
                          </span>

                          <div className="flex gap-2">
                            <button className="p-2 rounded-full hover:bg-rose-500/10 hover:text-rose-500">
                              <Heart className="w-4 h-4" />
                            </button>

                            <button className="p-2 rounded-full hover:bg-primary/10 hover:text-primary">
                              <Bookmark className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (

                    /* ----------------------------- LIST VIEW -------------------------------- */
                    <div className="flex gap-4 p-4 rounded-2xl bg-card border border-border/50 hover:border-primary/30">
                      <div className="relative w-40 h-32 rounded-xl overflow-hidden">
                        <img src={recipe.thumbnail} className="w-full h-full object-cover" />
                      </div>

                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="text-lg font-bold">{recipe.title}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">{recipe.description}</p>
                        </div>

                        <div className="flex justify-between text-sm text-muted-foreground">
                          <div className="flex gap-4">
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" /> {recipe.cookingTime} min
                            </span>
                            <span className="flex items-center gap-1">
                              <Heart className="w-4 h-4" /> {recipe.likes?.length || 0}
                            </span>
                          </div>
                          <span className="text-xs">by {recipe.createdBy?.name || "Chef"}</span>
                        </div>
                      </div>
                    </div>
                  )}

                </Link>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
