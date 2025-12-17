import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ChefHat, Menu, X, LogOut, LayoutDashboard } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const navLinks = [
        { name: "Home", href: "/" },
        { name: "Categories", href: "/categories" },
        { name: "Recipes", href: "/recipes" },
        { name: "Generate Recipe", href: "/ai-chef" },
    ];

    const handleLogout = () => {
        logout();
        setIsMenuOpen(false);
    };

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="fixed top-0 left-0 right-0 z-50 bg-background/60 backdrop-blur-xl border-b border-white/10 transition-all duration-300 supports-[backdrop-filter]:bg-background/60"
        >
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16 md:h-20">

                    {/* Logo */}
                    <div
                        className="flex items-center gap-2 cursor-pointer group"
                        onClick={() => navigate("/")}
                    >
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform duration-300">
                            <ChefHat className="w-5 h-5 md:w-6 md:h-6 text-primary-foreground" />
                        </div>
                        <span className="font-display text-xl md:text-2xl font-bold text-foreground tracking-tight">
                            Recipe<span className="text-primary">Vault</span>
                        </span>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.href}
                                className="text-muted-foreground hover:text-foreground font-medium transition-colors duration-200 relative group text-sm lg:text-base"
                            >
                                {link.name}
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
                            </Link>
                        ))}
                    </div>

                    {/* Auth Buttons */}
                    <div className="hidden md:flex items-center gap-3">
                        {user ? (
                            <>
                                <button
                                    onClick={() => navigate("/dashboard")}
                                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-foreground hover:bg-white/10 font-medium transition-all"
                                >
                                    <LayoutDashboard className="w-5 h-5" />
                                    Dashboard
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold shadow-lg shadow-primary/25 hover:opacity-90 hover:shadow-primary/40 transition-all duration-300 transform hover:-translate-y-0.5 flex items-center gap-2"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Sign Out
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={() => navigate("/signup")}
                                className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold shadow-lg shadow-primary/25 hover:opacity-90 hover:shadow-primary/40 transition-all duration-300 transform hover:-translate-y-0.5"
                            >
                                Get Started
                            </button>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? (
                            <X className="w-6 h-6 text-foreground" />
                        ) : (
                            <Menu className="w-6 h-6 text-foreground" />
                        )}
                    </button>
                </div>

                {/* Mobile Dropdown Menu */}
                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="md:hidden overflow-hidden"
                        >
                            <div className="py-4 border-t border-white/10 space-y-4">
                                <div className="flex flex-col gap-2">
                                    {navLinks.map((link) => (
                                        <Link
                                            key={link.name}
                                            to={link.href}
                                            className="text-muted-foreground hover:text-foreground font-medium py-3 px-4 rounded-xl hover:bg-white/5 transition-all"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            {link.name}
                                        </Link>
                                    ))}
                                </div>

                                {/* Mobile Auth Buttons */}
                                <div className="flex flex-col gap-3 pt-4 border-t border-white/10">
                                    {user ? (
                                        <>
                                            <button
                                                onClick={() => {
                                                    navigate("/dashboard");
                                                    setIsMenuOpen(false);
                                                }}
                                                className="w-full py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-foreground font-medium transition-colors flex items-center justify-center gap-2"
                                            >
                                                <LayoutDashboard className="w-5 h-5" />
                                                Dashboard
                                            </button>
                                            <button
                                                onClick={handleLogout}
                                                className="w-full py-3 rounded-xl bg-primary/10 text-primary font-semibold hover:bg-primary/20 transition-colors flex items-center justify-center gap-2"
                                            >
                                                <LogOut className="w-4 h-4" />
                                                Sign Out
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                onClick={() => {
                                                    navigate("/signup");
                                                    setIsMenuOpen(false);
                                                }}
                                                className="w-full py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-foreground font-medium transition-colors"
                                            >
                                                Sign In
                                            </button>

                                            <button
                                                onClick={() => {
                                                    navigate("/signup");
                                                    setIsMenuOpen(false);
                                                }}
                                                className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold shadow-lg shadow-primary/25"
                                            >
                                                Get Started
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.nav>
    );
};

export default Navbar;
