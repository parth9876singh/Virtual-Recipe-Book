import { useState, useEffect, createContext, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import api from "../lib/axios";
import {
  ArrowLeft,
  Clock,
  Flame,
  Heart,
  Bookmark,
  Share2,
  Play,
  ChefHat,
  Check,
  MessageCircle,
  ThumbsUp,
  Loader2,
  X,
  Send
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

/* -------------------- SIMPLE UI COMPONENTS -------------------- */
// Button, Badge, Avatar, Separator... (kept inline as requested/existing)

const Button = ({ children, className = "", variant = "default", size = "default", ...props }) => {
  let base =
    "inline-flex items-center justify-center text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-xl";
  let variantClasses = "";
  let sizeClasses = "";

  switch (variant) {
    case "ghost":
      variantClasses = "bg-transparent hover:bg-muted/30 text-foreground";
      break;
    case "outline":
      variantClasses = "border border-border bg-transparent hover:bg-muted/30 text-foreground";
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
    <button className={`${base} ${variantClasses} ${sizeClasses} ${className}`} {...props}>
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

const Avatar = ({ children, className = "" }) => {
  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-full overflow-hidden bg-muted ${className}`}
    >
      {children}
    </div>
  );
};

const AvatarImage = ({ src, alt = "", className = "" }) => {
  if (!src) return null;
  return <img src={src} alt={alt} className={`w-full h-full object-cover ${className}`} />;
};

const AvatarFallback = ({ children, className = "" }) => {
  return (
    <div className={`w-full h-full flex items-center justify-center text-sm font-medium ${className}`}>
      {children}
    </div>
  );
};

const Separator = ({ orientation = "horizontal", className = "" }) => {
  const isVertical = orientation === "vertical";
  return (
    <div
      className={`${isVertical ? "w-px h-full" : "h-px w-full"} bg-border ${className}`}
    />
  );
};

/* -------------------- TABS SYSTEM (CUSTOM) -------------------- */

const TabsContext = createContext(null);

const Tabs = ({ value, onValueChange, className = "", children }) => {
  return (
    <TabsContext.Provider value={{ value, onValueChange }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
};

const TabsList = ({ children, className = "" }) => {
  return <div className={className}>{children}</div>;
};

const TabsTrigger = ({ value, className = "", children }) => {
  const ctx = useContext(TabsContext);
  const isActive = ctx?.value === value;

  const activeClasses = isActive
    ? "bg-primary text-primary-foreground"
    : "text-foreground hover:bg-muted/60";

  return (
    <button
      type="button"
      onClick={() => ctx?.onValueChange && ctx.onValueChange(value)}
      className={`${className} ${activeClasses}`}
    >
      {children}
    </button>
  );
};

const TabsContent = ({ value, className = "", children }) => {
  const ctx = useContext(TabsContext);
  if (!ctx || ctx.value !== value) return null;
  return <div className={className}>{children}</div>;
};

/* -------------------- MAIN COMPONENT -------------------- */
export default function RecipeDetail() {
  const { id } = useParams();
  const { user: authUser } = useAuth(); // Assuming AuthContext provides user info
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [activeTab, setActiveTab] = useState("ingredients");

  const [newComment, setNewComment] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await api.get(`/recipe/${id}`);
        setRecipe(response.data);

        // Initialize like state
        const likes = response.data.likes || [];
        setLikeCount(likes.length);
        if (authUser && likes.includes(authUser._id)) {
          setIsLiked(true);
        }

        setError(null);
      } catch (err) {
        console.error("Error fetching recipe:", err);
        setError("Failed to load recipe details. It may have been removed.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchRecipe();
    }
  }, [id, authUser]);

  const toggleStep = (stepNumber) => {
    setCompletedSteps((prev) =>
      prev.includes(stepNumber)
        ? prev.filter((s) => s !== stepNumber)
        : [...prev, stepNumber]
    );
  };

  const handleLike = async () => {
    if (!authUser) {
      toast.error("Please login to like recipes");
      return;
    }

    // Optimistic UI update
    const previousIsLiked = isLiked;
    const previousLikeCount = likeCount;

    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);

    try {
      await api.post(`/recipe/${id}/like`);
    } catch (error) {
      console.error("Error toggling like:", error);
      // Revert on error
      setIsLiked(previousIsLiked);
      setLikeCount(previousLikeCount);
      toast.error("Failed to update like");
    }
  };

  const handleSave = async () => {
    if (!authUser) {
      toast.error("Please login to save recipes");
      return;
    }

    // Optimistic UI
    const previousIsSaved = isSaved;
    setIsSaved(!isSaved);

    try {
      const res = await api.post(`/user/save/${id}`);
      // Ideally we should update the auth context with new savedRecipes, 
      // but for now local state is enough for this view.
      if (res.data.isSaved) {
        toast.success("Recipe saved to your collection");
      } else {
        toast.success("Recipe removed from your collection");
      }
    } catch (error) {
      console.error("Error toggling save:", error);
      setIsSaved(previousIsSaved);
      toast.error("Failed to update save status");
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy link:", err);
      toast.error("Failed to copy link");
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!authUser) {
      toast.error("Please login to comment");
      return;
    }
    if (!newComment.trim()) return;

    setSubmittingComment(true);
    try {
      const res = await api.post(`/recipe/${id}/comment`, { comment: newComment });

      // Update local recipe state with new comments array from response
      setRecipe(prev => ({
        ...prev,
        comments: res.data.comments
      }));

      setNewComment("");
      toast.success("Comment added!");
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Failed to add comment");
    } finally {
      setSubmittingComment(false);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Easy": return "bg-emerald-500/20 text-emerald-600 border-emerald-500/30";
      case "Medium": return "bg-amber-500/20 text-amber-600 border-amber-500/30";
      case "Hard": return "bg-rose-500/20 text-rose-600 border-rose-500/30";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getEmbedUrl = (url) => {
    if (!url) return null;
    let videoId = null;

    // Handle standard YouTube URLs
    if (url.includes("youtube.com/watch")) {
      const urlParams = new URLSearchParams(new URL(url).search);
      videoId = urlParams.get("v");
    }
    // Handle short YouTube URLs
    else if (url.includes("youtu.be/")) {
      videoId = url.split("youtu.be/")[1]?.split("?")[0];
    }

    return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1` : url;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <p className="text-red-500 text-lg">{error || "Recipe not found"}</p>
        <Link to="/recipes">
          <Button>Back to Recipes</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with Video/Image */}
      <div className="relative h-[60vh] min-h-[400px] overflow-hidden">
        <AnimatePresence mode="wait">
          {isVideoPlaying && recipe.recipeVideo ? (
            recipe.videoType === "url" ? (
              <motion.iframe
                key="video-iframe"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                src={getEmbedUrl(recipe.recipeVideo)}
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <motion.video
                key="video-player"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                src={recipe.recipeVideo}
                className="absolute inset-0 w-full h-full object-cover"
                autoPlay
                controls
                onEnded={() => setIsVideoPlaying(false)}
              />
            )
          ) : (
            <motion.div
              key="image"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0"
            >
              <img
                src={recipe.thumbnail}
                alt={recipe.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Top Navigation - Only show when NOT playing video */}
        <AnimatePresence>
          {!isVideoPlaying && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-0 left-0 right-0 z-20 p-4"
            >
              <div className="container mx-auto flex items-center justify-between">
                <Link to="/recipes">
                  <Button
                    variant="ghost"
                    className="bg-black/30 backdrop-blur-sm text-white hover:bg-black/50 rounded-xl"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                </Link>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="bg-black/30 backdrop-blur-sm text-white hover:bg-black/50 rounded-xl"
                    onClick={handleLike}
                  >
                    <Heart
                      className={`w-5 h-5 transition-colors ${isLiked ? "fill-rose-500 text-rose-500" : ""}`}
                    />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="bg-black/30 backdrop-blur-sm text-white hover:bg-black/50 rounded-xl"
                    onClick={handleSave}
                  >
                    <Bookmark
                      className={`w-5 h-5 transition-colors ${isSaved ? "fill-primary text-primary" : ""}`}
                    />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="bg-black/30 backdrop-blur-sm text-white hover:bg-black/50 rounded-xl"
                    onClick={handleShare}
                  >
                    <Share2 className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Close Video Button - Only show WHEN playing video */}
        <AnimatePresence>
          {isVideoPlaying && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={() => setIsVideoPlaying(false)}
              className="absolute top-6 right-6 z-30 p-2 rounded-full bg-black/50 text-white backdrop-blur-md hover:bg-black/70 transition-colors"
            >
              <X className="w-6 h-6" />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Play Video Button */}
        {!isVideoPlaying && recipe.recipeVideo && (
          <motion.button
            type="button"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 }}
            onClick={() => setIsVideoPlaying(true)}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-20 h-20 rounded-full bg-primary/90 flex items-center justify-center hover:bg-primary transition-colors shadow-2xl"
          >
            <Play className="w-8 h-8 text-primary-foreground ml-1" fill="currentColor" />
          </motion.button>
        )}

        {/* Title Overlay - Only show when NOT playing video */}
        <AnimatePresence>
          {!isVideoPlaying && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute bottom-0 left-0 right-0 z-10 p-6"
            >
              <div className="container mx-auto">
                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge className={`${getDifficultyColor(recipe.difficulty)} border`}>
                    <Flame className="w-3 h-3 mr-1" />
                    {recipe.difficulty}
                  </Badge>
                  <Badge className="bg-white/20 backdrop-blur-sm text-white border-0">
                    {recipe.cuisine}
                  </Badge>
                </div>
                <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-2">
                  {recipe.title}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-white/80">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {recipe.cookingTime} min
                  </span>
                  <span className="flex items-center gap-1">
                    <Heart
                      className="w-4 h-4 text-rose-500"
                      fill="currentColor"
                    />
                    {likeCount} Likes
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="p-6 rounded-3xl bg-card border border-border/50"
            >
              <h2 className="font-display text-xl font-bold text-foreground mb-3">
                About This Recipe
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {recipe.description}
              </p>
            </motion.div>

            {/* Tabs: Ingredients / Steps */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="w-full rounded-2xl bg-muted/50 p-1 h-auto flex">
                  <TabsTrigger
                    value="ingredients"
                    className="flex-1 rounded-xl py-3 text-sm font-medium"
                  >
                    Ingredients ({recipe.ingredients?.length || 0})
                  </TabsTrigger>
                  <TabsTrigger
                    value="steps"
                    className="flex-1 rounded-xl py-3 text-sm font-medium"
                  >
                    Steps ({recipe.steps?.length || 0})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="ingredients" className="mt-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {recipe.ingredients?.map((ingredient, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-center gap-3 p-4 rounded-2xl bg-card border border-border/50 hover:border-primary/30 transition-colors"
                      >
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                          <ChefHat className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">
                            {ingredient.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {ingredient.quantity}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="steps" className="mt-6">
                  <div className="space-y-4">
                    {recipe.steps?.map((step, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => toggleStep(index + 1)}
                        className={`relative p-5 rounded-2xl border cursor-pointer transition-all duration-300 ${completedSteps.includes(index + 1)
                          ? "bg-primary/10 border-primary/30"
                          : "bg-card border-border/50 hover:border-primary/30"
                          }`}
                      >
                        <div className="flex items-start gap-4">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors ${completedSteps.includes(index + 1)
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground"
                              }`}
                          >
                            {completedSteps.includes(index + 1) ? (
                              <Check className="w-5 h-5" />
                            ) : (
                              <span className="font-bold">
                                {index + 1}
                              </span>
                            )}
                          </div>
                          <p
                            className={`flex-1 leading-relaxed ${completedSteps.includes(index + 1)
                              ? "text-muted-foreground line-through"
                              : "text-foreground"
                              }`}
                          >
                            {step.instruction || step}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  {/* Progress bar logic could be here */}
                </TabsContent>
              </Tabs>
            </motion.div>

            {/* Comments Section - UPDATED */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="p-6 rounded-3xl bg-card border border-border/50"
            >
              <h2 className="font-display text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                Comments ({recipe.comments?.length || 0})
              </h2>

              {/* Add Comment Input */}
              <form onSubmit={handleCommentSubmit} className="mb-8 flex gap-3">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Share your thoughts..."
                  className="flex-1 bg-muted/50 border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
                <Button type="submit" disabled={submittingComment || !newComment.trim()} className="rounded-xl px-6">
                  {submittingComment ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </Button>
              </form>

              <div className="space-y-4">
                {recipe.comments?.length > 0 ? recipe.comments.map((comment) => (
                  <div
                    key={comment._id}
                    className="flex gap-3 p-4 rounded-2xl bg-muted/30"
                  >
                    <Avatar className="w-10 h-10">
                      <AvatarImage src="" />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {comment.userId?.name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-foreground">
                          {comment.userId?.name || "User"}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {comment.comment}
                      </p>
                    </div>
                  </div>
                )) : (
                  <p className="text-muted-foreground text-center py-4">No comments yet. Be the first to share your thoughts!</p>
                )}
              </div>
            </motion.div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Author Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="p-6 rounded-3xl bg-card border border-border/50"
            >
              <div className="flex items-center gap-4 mb-4">
                <Avatar className="w-16 h-16 border-2 border-primary/20">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-primary/10 text-primary text-xl">
                    {recipe.createdBy?.name?.charAt(0) || "C"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-display font-bold text-foreground">
                    {recipe.createdBy?.name || "Chef"}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Recipe Author
                  </p>
                </div>
              </div>
              <Button className="w-full rounded-xl" disabled>Follow Chef (Coming Soon)</Button>
            </motion.div>

            {/* Stats Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="p-6 rounded-3xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20"
            >
              <div className="grid grid-cols-1 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-primary">
                    {likeCount}
                  </p>
                  <p className="text-xs text-muted-foreground">Likes</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
