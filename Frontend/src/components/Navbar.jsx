import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ChefHat, Menu, X, LogOut, LayoutDashboard } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const navLinks = [
        { name: "Home", href: "/" },
        { name: "Categories", href: "/categories" },
        { name: "Recipes", href: "/recipes" },
    ];

    const handleLogout = () => {
        logout();
        setIsMenuOpen(false);
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50 transition-all duration-300">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16 md:h-20">

                    {/* Logo */}
                    <div
                        className="flex items-center gap-2 cursor-pointer group"
                        onClick={() => navigate("/")}
                    >
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
                            <ChefHat className="w-5 h-5 md:w-6 md:h-6 text-primary-foreground" />
                        </div>
                        <span className="font-display text-xl md:text-2xl font-bold text-foreground">
                            Recipe<span className="text-primary">Vault</span>
                        </span>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.href}
                                className="text-muted-foreground hover:text-foreground font-medium transition-colors duration-200 relative group"
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
                                    className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-foreground hover:bg-muted font-medium transition-colors"
                                >
                                    <LayoutDashboard className="w-5 h-5" />
                                    Dashboard
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold shadow-lg shadow-primary/25 hover:opacity-90 hover:shadow-primary/40 transition-all duration-300 transform hover:-translate-y-0.5 flex items-center gap-2"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Sign Out
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={() => navigate("/signup")}
                                className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold shadow-lg shadow-primary/25 hover:opacity-90 hover:shadow-primary/40 transition-all duration-300 transform hover:-translate-y-0.5"
                            >
                                Get Started
                            </button>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
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
                {isMenuOpen && (
                    <div className="md:hidden py-4 border-t border-border/50 animate-in slide-in-from-top-2 duration-200">
                        <div className="flex flex-col gap-3">

                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.href}
                                    className="text-muted-foreground hover:text-foreground font-medium py-2 px-3 rounded-lg hover:bg-muted transition-all"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {link.name}
                                </Link>
                            ))}

                            {/* Mobile Auth Buttons */}
                            <div className="flex flex-col gap-2 pt-4 border-t border-border/50">
                                {user ? (
                                    <>
                                        <button
                                            onClick={() => {
                                                navigate("/dashboard");
                                                setIsMenuOpen(false);
                                            }}
                                            className="w-full py-2.5 rounded-lg border border-input bg-background hover:bg-muted text-foreground font-medium transition-colors flex items-center justify-center gap-2"
                                        >
                                            <LayoutDashboard className="w-5 h-5" />
                                            Dashboard
                                        </button>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold shadow-lg shadow-primary/25 flex items-center justify-center gap-2"
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
                                            className="w-full py-2.5 rounded-lg border border-input bg-background hover:bg-muted text-foreground font-medium transition-colors"
                                        >
                                            Sign In
                                        </button>

                                        <button
                                            onClick={() => {
                                                navigate("/signup");
                                                setIsMenuOpen(false);
                                            }}
                                            className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold shadow-lg shadow-primary/25"
                                        >
                                            Get Started
                                        </button>
                                    </>
                                )}
                            </div>

                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
