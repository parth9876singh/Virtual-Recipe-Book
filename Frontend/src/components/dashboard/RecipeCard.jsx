import { useState } from "react";
import { Heart, Bookmark, Clock, Users, MoreVertical, Pencil, Trash2 } from "lucide-react";

export function RecipeCard({ recipe, onLike, onSave, onEdit, onDelete }) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="group relative rounded-3xl overflow-hidden shadow-md bg-card border border-border/50 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={recipe.image}
          alt={recipe.title || recipe.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90" />

        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 rounded-full bg-white/90 text-xs font-semibold text-black backdrop-blur-sm">
            {recipe.category}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="absolute top-4 right-4 flex gap-2">
          {/* Save */}
          <button
            onClick={onSave}
            className={`p-2 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/40 transition-colors ${recipe.isSaved ? "text-primary" : "text-white"
              }`}
          >
            <Bookmark className={`w-4 h-4 ${recipe.isSaved ? "fill-current" : ""}`} />
          </button>

          {/* Like */}
          <button
            onClick={onLike}
            className={`p-2 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/40 transition-colors ${recipe.isLiked ? "text-rose-500" : "text-white"
              }`}
          >
            <Heart className={`w-4 h-4 ${recipe.isLiked ? "fill-current" : ""}`} />
          </button>

          {/* Edit/Delete Menu Trigger */}
          {recipe.isOwned && (
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-2 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/40 text-white transition-colors"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {/* Simple Custom Dropdown */}
              {showMenu && (
                <div className="absolute right-0 mt-2 w-32 bg-card rounded-xl shadow-xl border border-border py-1 z-20">
                  <button
                    onClick={() => { onEdit(); setShowMenu(false); }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-muted"
                  >
                    <Pencil className="w-4 h-4" /> Edit
                  </button>
                  <button
                    onClick={() => { onDelete(); setShowMenu(false); }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="absolute bottom-6 left-6 right-6">
          <h3 className="font-display font-bold text-2xl text-white mb-1 line-clamp-1">
            {recipe.title || recipe.name}
          </h3>
          <p className="text-white/80 text-sm line-clamp-2">
            {recipe.description}
          </p>
        </div>
      </div>

      {/* Footer Info if description isn't enough or want to show stats outside image */}
      {/* 
      <div className="p-4 flex items-center gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <Clock className="w-4 h-4" />
          <span>{recipe.cookingTime || "30"} min</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Users className="w-4 h-4" />
          <span>{recipe.servings || "2"} servings</span>
        </div>
      </div>
      */ }
    </div>
  );
}
