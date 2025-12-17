import { useNavigate } from "react-router-dom";
import { Search, Sparkles, Clock, Users, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

import video1 from "../assets/video1.mp4";
import video2 from "../assets/video2.mp4";
import video3 from "../assets/video3.mp4";
import video4 from "../assets/video4.mp4";

const HeroSection = () => {
  const navigate = useNavigate();

  const stats = [
    { icon: Sparkles, value: "10K+", label: "Recipes" },
    { icon: Users, value: "50K+", label: "Home Chefs" },
    { icon: Clock, value: "5 min", label: "Avg. Prep Time" },
  ];

  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-background text-foreground">
      {/* Background Gradients */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-20 right-10 w-96 h-96 bg-primary/20 rounded-full blur-[100px] opacity-60"
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], x: [0, -50, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-20 left-10 w-[500px] h-[500px] bg-secondary/20 rounded-full blur-[120px] opacity-60"
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(var(--primary-rgb),0.05)_0%,transparent_70%)]" />
      </div>

      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Left Content */}
          <div className="text-center lg:text-left z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium font-sans text-sm mb-6 border border-primary/20 backdrop-blur-sm"
            >
              <Sparkles className="w-4 h-4" />
              <span>Your Personal Digital Cookbook</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight mb-6"
            >
              Discover &<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-500">Save Recipes</span><br />
              You'll Love
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg md:text-xl text-muted-foreground font-sans max-w-xl mx-auto lg:mx-0 mb-8"
            >
              Your culinary journey starts here. Explore thousands of recipes, save your favorites, and create your personal cookbook.
            </motion.p>

            {/* Search Bar - Glassy Effect */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto lg:mx-0 mb-10 p-2 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-2xl"
            >
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search for recipes..."
                  className="w-full h-12 pl-12 pr-4 rounded-xl bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-0"
                />
              </div>

              <button
                onClick={() => navigate("/recipes")}
                className="h-12 px-8 bg-primary text-primary-foreground font-semibold rounded-xl shadow-lg hover:bg-primary/90 transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
              >
                Explore <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-wrap justify-center lg:justify-start gap-8"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="flex items-center gap-3 bg-white/5 p-3 rounded-2xl border border-white/5 backdrop-blur-sm"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-display text-xl font-bold text-foreground">
                      {stat.value}
                    </p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Right Video Grid */}
          <div className="relative hidden lg:block">
            <div className="grid grid-cols-2 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="space-y-4 pt-12"
              >
                <div className="rounded-3xl overflow-hidden shadow-2xl h-56 border-4 border-white/10 rotate-[-3deg] hover:rotate-0 transition-transform duration-500 group">
                  <video src={video1} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" autoPlay muted loop playsInline />
                </div>
                <div className="rounded-3xl overflow-hidden shadow-2xl h-64 border-4 border-white/10 rotate-[2deg] hover:rotate-0 transition-transform duration-500 group">
                  <video src={video2} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" autoPlay muted loop playsInline />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="space-y-4"
              >
                <div className="rounded-3xl overflow-hidden shadow-2xl h-64 border-4 border-white/10 rotate-[3deg] hover:rotate-0 transition-transform duration-500 group">
                  <video src={video3} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" autoPlay muted loop playsInline />
                </div>
                <div className="rounded-3xl overflow-hidden shadow-2xl h-56 border-4 border-white/10 rotate-[-2deg] hover:rotate-0 transition-transform duration-500 group">
                  <video src={video4} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" autoPlay muted loop playsInline />
                </div>
              </motion.div>
            </div>

            {/* Floating Glass Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, x: -50 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ delay: 1, type: "spring" }}
              className="absolute top-1/2 -left-12 -translate-y-1/2 p-4 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-xl shadow-2xl z-20 flex items-center gap-4 animate-float"
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-primary to-orange-500 flex items-center justify-center text-2xl shadow-lg">
                👨‍🍳
              </div>
              <div>
                <p className="font-bold text-foreground">Chef's Choice</p>
                <div className="flex text-amber-500 text-xs">★★★★★</div>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
