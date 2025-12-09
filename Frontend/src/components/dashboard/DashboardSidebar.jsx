import { useNavigate } from "react-router-dom";
import { Book, Heart, Bookmark, LogOut, Plus, ChefHat } from "lucide-react";

export function DashboardSidebar({ user, onLogout }) {
    const navigate = useNavigate();

    return (
        <aside className="w-72 bg-card border-r border-border/60 hidden md:flex flex-col h-screen sticky top-0">
            {/* Logo */}
            <div className="p-8 pb-6">
                <div className="flex items-center gap-3 mb-1">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                        <ChefHat className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="font-display font-bold text-xl leading-none text-foreground">RecipeVault</h1>
                        <p className="text-xs text-muted-foreground mt-1 font-sans">Your culinary space</p>
                    </div>
                </div>
            </div>

            {/* Menu Section */}
            <div className="px-6 py-2">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-2 font-sans">Menu</h3>
                <nav className="space-y-1">
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-primary/10 text-primary font-medium transition-colors font-sans">
                        <Book className="w-5 h-5" />
                        My Recipes
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground font-medium transition-colors font-sans">
                        <Bookmark className="w-5 h-5" />
                        Saved Recipes
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground font-medium transition-colors font-sans">
                        <Heart className="w-5 h-5" />
                        Liked Recipes
                    </button>
                </nav>
            </div>

            {/* Actions Section */}
            <div className="px-6 py-6">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-2 font-sans">Actions</h3>
                <button
                    onClick={() => navigate('/create-recipe')}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary text-primary-foreground font-semibold shadow-lg shadow-primary/25 hover:opacity-90 transition-all active:scale-95 font-sans"
                >
                    <Plus className="w-5 h-5" />
                    Create Recipe
                </button>
            </div>

            <div className="flex-1" />

            {/* User Profile */}
            <div className="p-6 border-t border-border/60">
                <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-muted/50 transition-colors group cursor-pointer">
                    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg font-display">
                        {user?.name?.[0] || "S"}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate font-sans">
                            {user?.email || "singhparth2318.com"}
                        </p>
                        <p className="text-xs text-muted-foreground truncate font-sans">
                            Manage Account
                        </p>
                    </div>
                    <button onClick={onLogout} className="text-muted-foreground hover:text-destructive transition-colors">
                        <LogOut className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </aside>
    );
}
