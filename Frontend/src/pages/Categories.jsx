import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Clock, Users, ChefHat, X, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../lib/axios";

// Inline UI Components to replace @/components/ui
const Button = ({
  children,
  className = "",
  variant = "default",
  size = "default",
  ...props
}) => {
  let base =
    "inline-flex items-center justify-center text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-xl disabled:opacity-50 disabled:pointer-events-none";
  let variantClasses = "";
  let sizeClasses = "";

  switch (variant) {
    case "ghost":
      variantClasses = "bg-transparent hover:bg-muted/30 text-foreground";
      break;
    case "outline":
      variantClasses =
        "border border-border bg-transparent hover:bg-muted/30 text-foreground";
      break;
    default:
      variantClasses = "bg-primary text-primary-foreground hover:bg-primary/90";
  }

  switch (size) {
    case "icon":
      sizeClasses = "h-10 w-10 p-0";
      break;
    default:
      sizeClasses = "h-10 px-4 py-2";
  }

  return (
    <button
      className={`${base} ${variantClasses} ${sizeClasses} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

const Badge = ({ children, className = "", ...props }) => {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

// Categories matching Backend 'menu' enum
// Enum: ["Breakfast", "Lunch", "Dinner", "Dessert", "Health", "Quick Meal"]
const categories = [
  {
    id: "Breakfast",
    name: "Breakfast",
    emoji: "🍳",
    description: "Start your day right",
    gradient: "from-amber-400 to-orange-500",
    bgImage:
      "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=800",
  },
  {
    id: "Lunch",
    name: "Lunch",
    emoji: "🥗",
    description: "Midday delights",
    gradient: "from-emerald-400 to-teal-500",
    bgImage: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800",
  },
  {
    id: "Dinner",
    name: "Dinner",
    emoji: "🍝",
    description: "Evening feasts",
    gradient: "from-purple-400 to-pink-500",
    bgImage:
      "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=800",
  },
  {
    id: "Dessert",
    name: "Desserts",
    emoji: "🍰",
    description: "Sweet indulgences",
    gradient: "from-pink-400 to-rose-500",
    bgImage: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=800",
  },
  {
    id: "Quick Meal",
    name: "Quick Meals",
    emoji: "⚡",
    description: "Fast & easy",
    gradient: "from-yellow-400 to-amber-500",
    bgImage:
      "https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=800",
  },
  {
    id: "Health",
    name: "Healthy",
    emoji: "🥑",
    description: "Nutritious choices",
    gradient: "from-green-400 to-emerald-500",
    bgImage:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800",
  },
];

const Categories = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await api.get("/recipe/all");
        setRecipes(response.data);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipes();
  }, []);

  const filteredRecipes = selectedCategory
    ? recipes.filter((r) => r.menu === selectedCategory)
    : [];

  const selectedCategoryData = categories.find(
    (c) => c.id === selectedCategory
  );

  // Count recipes per category for display
  const getCategoryCount = (catId) => {
    return recipes.filter((r) => r.menu === catId).length;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Categories</h1>
              <p className="text-sm text-muted-foreground">
                Explore recipes by meal type
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="container mx-auto px-4 py-8">
        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.1 },
            },
          }}
        >
          {categories.map((category) => (
            <motion.div
              key={category.id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedCategory(category.id)}
              className="cursor-pointer group"
            >
              <div className="relative h-48 md:h-56 rounded-2xl overflow-hidden shadow-lg border border-border/50">
                {/* Background Image */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                  style={{ backgroundImage: `url(${category.bgImage})` }}
                />

                {/* Gradient Overlay */}
                <div
                  className={`absolute inset-0 bg-gradient-to-t ${category.gradient} opacity-70`}
                />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4">
                  <span className="text-5xl mb-2 drop-shadow-lg">
                    {category.emoji}
                  </span>
                  <h3 className="text-xl font-bold drop-shadow-md">
                    {category.name}
                  </h3>
                  <p className="text-sm opacity-90 drop-shadow-sm">
                    {category.description}
                  </p>
                  <Badge className="mt-2 bg-white/20 backdrop-blur-sm border-white/30 text-white">
                    {getCategoryCount(category.id)} recipes
                  </Badge>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Recipe Modal */}
      <AnimatePresence>
        {selectedCategory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
            onClick={() => setSelectedCategory(null)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="absolute bottom-0 left-0 right-0 max-h-[85vh] bg-card rounded-t-3xl shadow-2xl overflow-hidden ring-1 ring-border"
            >
              {/* Modal Header */}
              <div className={`relative h-32 bg-gradient-to-r ${selectedCategoryData?.gradient}`}>
                <div className="absolute inset-0 flex items-center justify-center gap-3">
                  <span className="text-5xl">
                    {selectedCategoryData?.emoji}
                  </span>
                  <div className="text-white">
                    <h2 className="text-2xl font-bold">
                      {selectedCategoryData?.name}
                    </h2>
                    <p className="text-white/80">
                      {filteredRecipes.length} recipes found
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full"
                  onClick={() => setSelectedCategory(null)}
                >
                  <X className="h-6 w-6" />
                </Button>

                {/* Drag Handle */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-12 h-1 bg-white/50 rounded-full" />
              </div>

              {/* Recipe List */}
              <div className="p-6 overflow-y-auto max-h-[calc(85vh-8rem)]">
                {filteredRecipes.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredRecipes.map((recipe, index) => (
                      <motion.div
                        key={recipe._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Link to={`/recipe/${recipe._id}`}>
                          <div className="group bg-background rounded-xl overflow-hidden border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
                            <div className="relative h-40 overflow-hidden">
                              <img
                                src={recipe.thumbnail}
                                alt={recipe.title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                              <Badge className="absolute top-3 right-3 bg-background/90 text-foreground">
                                <ChefHat className="h-3 w-3 mr-1" />
                                {recipe.difficulty}
                              </Badge>
                            </div>
                            <div className="p-4">
                              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                                {recipe.title}
                              </h3>
                              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  {recipe.cookingTime} min
                                </span>
                                {/* Servings removed as not in backend schema, checking likes instead */}
                                <span className="flex items-center gap-1">
                                  <Users className="h-4 w-4" />
                                  {recipe.likes?.length || 0}
                                </span>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <span className="text-6xl mb-4 block">🍽️</span>
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      No recipes yet
                    </h3>
                    <p className="text-muted-foreground">
                      Be the first to add a{" "}
                      {selectedCategoryData?.name.toLowerCase()} recipe!
                    </p>
                    <Link to="/dashboard/create">
                      <Button className="mt-4">Create Recipe</Button>
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Categories;
