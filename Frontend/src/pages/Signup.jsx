import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, User } from "lucide-react";
import foodImage from "../assets/food-image.jpg";
import { useNavigate } from "react-router-dom";
import api from "../lib/axios";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";

export default function Signup() {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);

    // Form states
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isLogin) {
                // LOGIN
                const res = await api.post(`/user/login`, { email, password });
                localStorage.setItem("token", res.data.token);
                localStorage.setItem("user", JSON.stringify(res.data.user || res.data.userModel));
                toast.success("Welcome back!");
                navigate("/dashboard");
            } else {
                // SIGNUP
                const res = await api.post(`/user/register`, { name, email, password });
                localStorage.setItem("token", res.data.token);
                localStorage.setItem("user", JSON.stringify(res.data.user || res.data.userModel));
                toast.success("Account created successfully!");
                navigate("/dashboard");
            }
        } catch (error) {
            console.error("Auth Error:", error);
            const msg = error.response?.data?.message || "Something went wrong";
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            const res = await api.post(`/auth/google-login`, {
                idToken: credentialResponse.credential
            });

            localStorage.setItem("token", res.data.token);
            localStorage.setItem("user", JSON.stringify(res.data.user));
            toast.success("Logged in with Google!");
            navigate("/dashboard");
        } catch (error) {
            console.error("Google Auth Error:", error);
            toast.error("Google Login Failed");
        }
    };

    return (
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID"}>
            <div className="flex min-h-screen w-full">
                {/* LEFT SIDE */}
                <div
                    className="hidden lg:flex flex-1 flex-col justify-end items-start text-left p-12 pb-18 relative bg-cover bg-center text-white"
                    style={{
                        backgroundImage: `url(${foodImage})`,
                    }}
                >
                    <div className="absolute inset-0 bg-linear-to-b via-orange-300/30" /> {/* Darker overlay for better contrast */}
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-8">
                            <span className="bg-primary/20 p-3 rounded-full backdrop-blur-sm border border-white/10">
                                <span className="text-2xl">🍳</span>
                            </span>
                            <h1 className="text-3xl font-semibold tracking-tight">RecipeVault</h1>
                        </div>

                        <h2 className="text-5xl md:text-5xl font-medium mb-4 leading-tight font-serif">
                            Your Personal <br />
                            <span className="text-primary">Recipe Collection</span>
                        </h2>

                        <p className="text-md md:text-md max-w-lg text-white/80 font-serif font-medium">
                            Discover, save, and share your favorite recipes. Create your culinary
                            journey with our beautiful recipe book.
                        </p>
                    </div>
                </div>

                {/* RIGHT SIDE */}
                <div className="flex-1 flex items-center justify-center p-8 bg-background">
                    <div className="w-full max-w-md space-y-8">
                        <div className="text-center">
                            <h2 className="text-3xl font-bold tracking-tight text-foreground">
                                {isLogin ? "Welcome Back" : "Join RecipeVault"}
                            </h2>
                            <p className="mt-2 text-sm text-muted-foreground">
                                {isLogin
                                    ? "Sign in to access your recipe collection"
                                    : "Create an account to start your culinary journey"}
                            </p>
                        </div>

                        <div className="space-y-6">
                            {/* GOOGLE BUTTON */}
                            <div className="flex justify-center w-full">
                                <GoogleLogin
                                    onSuccess={handleGoogleSuccess}
                                    onError={() => {
                                        console.log('Login Failed');
                                        toast.error("Google Login Failed");
                                    }}
                                    useOneTap
                                    theme="outline"
                                    size="large"
                                    width="100%"
                                />
                            </div>

                            {/* DIVIDER */}
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t border-border" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-background px-2 text-muted-foreground font-serif tracking-wider">
                                        Or continue with email
                                    </span>
                                </div>
                            </div>

                            {/* FORM */}
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* FULL NAME */}
                                {!isLogin && (
                                    <div className="space-y-1">
                                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                            Full Name
                                        </label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                                            <input
                                                type="text"
                                                placeholder="John Doe"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                required
                                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-input bg-muted/30 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* EMAIL */}
                                <div className="space-y-1">
                                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                        Email
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                                        <input
                                            type="email"
                                            placeholder="you@example.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-input bg-muted/30 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                                        />
                                    </div>
                                </div>

                                {/* PASSWORD */}
                                <div className="space-y-1">
                                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            className="w-full pl-10 pr-10 py-3 rounded-xl border border-input bg-muted/30 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
                                        >
                                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                        </button>
                                    </div>
                                </div>

                                {/* SUBMIT BUTTON */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-3.5 px-4 bg-primary text-primary-foreground font-semibold rounded-xl hover:opacity-90 shadow-lg shadow-primary/20 transition-all duration-300 transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? "Processing..." : (isLogin ? "Sign In" : "Create Account")}
                                </button>
                            </form>
                        </div>

                        {/* SWITCH MODE */}
                        <div className="text-center text-sm">
                            <span className="text-muted-foreground">
                                {isLogin ? "Don't have an account? " : "Already have an account? "}
                            </span>
                            <button
                                onClick={() => setIsLogin(!isLogin)}
                                className="font-semibold text-primary hover:underline transition-all"
                            >
                                {isLogin ? "Sign up" : "Sign in"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </GoogleOAuthProvider>
    );
}
