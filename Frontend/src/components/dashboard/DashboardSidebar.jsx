import { useNavigate } from "react-router-dom";
import { Book, Heart, Bookmark, LogOut, Plus, ChefHat } from "lucide-react";
import { motion } from "framer-motion";

export function DashboardSidebar({ user, onLogout }) {
    const navigate = useNavigate();

    return (
        <motion.aside
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="w-72 bg-card/50 backdrop-blur-xl border-r border-white/10 hidden md:flex flex-col h-screen sticky top-0"
        >
            {/* Logo */}
            <div className="p-8 pb-6">
                <div className="flex items-center gap-3 mb-1">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-sm">
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
                    {[
                        { icon: Book, label: "My Recipes", active: true },
                        { icon: Bookmark, label: "Saved Recipes", active: false },
                        { icon: Heart, label: "Liked Recipes", active: false }
                    ].map((item, index) => (
                        <motion.button
                            key={item.label}
                            whileHover={{ x: 5 }}
                            whileTap={{ scale: 0.98 }}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all font-sans ${item.active
                                    ? "bg-primary/10 text-primary"
                                    : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                                }`}
                        >
                            <item.icon className="w-5 h-5" />
                            {item.label}
                        </motion.button>
                    ))}
                </nav>
            </div>

            {/* Actions Section */}
            <div className="px-6 py-6">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-2 font-sans">Actions</h3>
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate('/create-recipe')}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary text-primary-foreground font-semibold shadow-lg shadow-primary/25 hover:opacity-90 transition-all font-sans"
                >
                    <Plus className="w-5 h-5" />
                    Create Recipe
                </motion.button>
            </div>

            <div className="flex-1" />

            {/* User Profile */}
            <div className="p-6 border-t border-white/10">
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors group cursor-pointer"
                >
                    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg font-display">
                        {user?.name?.[0] || "S"}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate font-sans">
                            {user?.email || "user@example.com"}
                        </p>
                        <p className="text-xs text-muted-foreground truncate font-sans">
                            Manage Account
                        </p>
                    </div>
                    <button onClick={onLogout} className="text-muted-foreground hover:text-destructive transition-colors">
                        <LogOut className="w-5 h-5" />
                    </button>
                </motion.div>
            </div>
        </motion.aside>
    );
}
