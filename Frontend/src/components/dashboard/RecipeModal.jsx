import { X, Clock, Users, Utensils, BookOpen, User, Lock, Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function RecipeModal({ recipe, onClose }) {
    if (!recipe) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    onClick={(e) => e.stopPropagation()}
                    className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-card rounded-3xl shadow-2xl border border-border"
                >
                    {/* Header Image */}
                    <div className="relative h-64 md:h-80">
                        <img
                            src={recipe.image}
                            alt={recipe.name}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="absolute bottom-6 left-6 right-6 text-white">
                            <div className="flex gap-2 mb-2">
                                <span className="px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-xs font-medium border border-white/10">
                                    {recipe.category}
                                </span>
                                {recipe.isOwned && (
                                    <span className="px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-xs font-medium border border-white/10 flex items-center gap-1">
                                        {recipe.isPublic ? <Globe className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                                        {recipe.isPublic ? "Public" : "Private"}
                                    </span>
                                )}
                            </div>
                            <h2 className="text-3xl font-display font-bold mb-1">{recipe.name}</h2>
                            <p className="text-white/80 text-sm line-clamp-2">{recipe.description}</p>
                        </div>
                    </div>

                    <div className="p-6 md:p-8 space-y-8">
                        {/* Meta Tags */}
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                            {recipe.cookingTime && (
                                <div className="flex items-center gap-2 bg-secondary/50 px-3 py-1.5 rounded-full">
                                    <Clock className="w-4 h-4" />
                                    <span>{recipe.cookingTime} min</span>
                                </div>
                            )}
                            {recipe.servings && (
                                <div className="flex items-center gap-2 bg-secondary/50 px-3 py-1.5 rounded-full">
                                    <Users className="w-4 h-4" />
                                    <span>{recipe.servings} people</span>
                                </div>
                            )}
                            {recipe.difficulty && (
                                <div className="flex items-center gap-2 bg-secondary/50 px-3 py-1.5 rounded-full">
                                    <div className={`w-2 h-2 rounded-full ${recipe.difficulty === "Easy" ? "bg-green-500" :
                                            recipe.difficulty === "Medium" ? "bg-yellow-500" : "bg-red-500"
                                        }`} />
                                    <span>{recipe.difficulty}</span>
                                </div>
                            )}
                        </div>

                        {/* Ingredients */}
                        {recipe.ingredients && recipe.ingredients.length > 0 && (
                            <div>
                                <h3 className="text-lg font-bold flex items-center gap-2 mb-4 text-primary">
                                    <Utensils className="w-5 h-5" /> Ingredients
                                </h3>
                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {recipe.ingredients.map((ing, idx) => (
                                        <li key={idx} className="flex gap-3 p-3 rounded-xl bg-secondary/20 items-start">
                                            <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                                            <span className="text-foreground text-sm">
                                                <span className="font-semibold">{ing.quantity}</span> {ing.name}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Instructions */}
                        {recipe.steps && recipe.steps.length > 0 && (
                            <div>
                                <h3 className="text-lg font-bold flex items-center gap-2 mb-4 text-primary">
                                    <BookOpen className="w-5 h-5" /> Instructions
                                </h3>
                                <div className="space-y-4">
                                    {recipe.steps.map((step, idx) => (
                                        <div key={idx} className="flex gap-4">
                                            <div className="flex-none w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm border border-primary/20">
                                                {step.stepNumber || idx + 1}
                                            </div>
                                            <p className="pt-1 text-muted-foreground text-sm leading-relaxed">
                                                {step.instruction}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
