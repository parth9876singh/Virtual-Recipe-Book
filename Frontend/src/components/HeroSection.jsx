import { useNavigate } from "react-router-dom";
import { Search, Sparkles, Clock, Users } from "lucide-react";

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
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl opacity-50 animate-pulse" />
        <div
          className="absolute bottom-20 left-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl opacity-50 animate-pulse"
          style={{ animationDelay: "2s" }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-primary/5 to-transparent rounded-full" />
      </div>

      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Left Content */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium font-sans text-sm mb-6 animate-in fade-in slide-in-from-bottom-3 duration-700">
              <Sparkles className="w-4 h-4" />
              <span>Your Personal Digital Cookbook</span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
              Discover &<br />
              <span className="text-primary">Save Recipes</span><br />
              You ll Love
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground font-sans max-w-xl mx-auto lg:mx-0 mb-8 animate-in fade-in slide-in-from-bottom-5 duration-700 delay-200">
              Your culinary journey starts here. Explore thousands of recipes, save your favorites, and create your personal cookbook.
            </p>

            {/* Search Bar */}
            <div className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto lg:mx-0 mb-10 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search for recipes..."
                  className="w-full h-14 pl-12 pr-4 rounded-xl border border-input bg-card/80 backdrop-blur-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
              </div>

              <button
                onClick={() => navigate("/signup")}
                className="h-14 px-8 bg-primary text-primary-foreground font-semibold shadow-lg shadow-primary/25 hover:opacity-90 hover:shadow-primary/40 transition-all rounded-xl transform hover:-translate-y-0.5"
              >
                Explore
              </button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-8 animate-in fade-in slide-in-from-bottom-7 duration-700 delay-400">
              {stats.map((stat, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <stat.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-display text-2xl font-bold text-foreground">
                      {stat.value}
                    </p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Video Grid */}
          <div className="relative hidden lg:block animate-in fade-in zoom-in duration-1000 delay-200">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="rounded-2xl overflow-hidden shadow-xl h-48 border border-border">
                  <video
                    src={video1}
                    className="w-full h-full object-cover"
                    autoPlay
                    muted
                    loop
                    playsInline
                  />
                </div>
                <div className="rounded-2xl overflow-hidden shadow-xl h-64 border border-border">
                  <video
                    src={video2}
                    className="w-full h-full object-cover"
                    autoPlay
                    muted
                    loop
                    playsInline
                  />
                </div>
              </div>

              <div className="space-y-4 pt-8">
                <div className="rounded-2xl overflow-hidden shadow-xl h-64 border border-border">
                  <video
                    src={video3}
                    className="w-full h-full object-cover"
                    autoPlay
                    muted
                    loop
                    playsInline
                  />
                </div>
                <div className="rounded-2xl overflow-hidden shadow-xl h-48 border border-border">
                  <video
                    src={video4}
                    className="w-full h-full object-cover"
                    autoPlay
                    muted
                    loop
                    playsInline
                  />
                </div>
              </div>
            </div>

            {/* Floating Badge */}
            <div className="absolute -left-8 top-1/2 -translate-y-1/2 bg-card/80 backdrop-blur-md border border-border rounded-2xl p-4 shadow-xl animate-bounce duration-[3000ms]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/25">
                  <span className="text-lg">👨‍🍳</span>
                </div>

                <div>
                  <p className="font-semibold text-foreground">Chef's Choice</p>
                  <p className="text-sm text-muted-foreground">New recipes daily</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
