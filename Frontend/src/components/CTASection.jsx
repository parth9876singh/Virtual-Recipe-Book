import { useNavigate } from "react-router-dom";
import { ArrowRight, ChefHat } from "lucide-react";

const CTASection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="relative rounded-3xl overflow-hidden shadow-2xl">

          {/* Background */}
          <div className="absolute inset-0 bg-primary opacity-95" />
          <div
            className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRoLTJ2LTJoMnYyem0wLTRoLTJ2LTJoMnYyem0tNC00aC0ydi0yaDJ2MnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30"
          />

          {/* Content */}
          <div className="relative px-6 py-16 md:px-12 md:py-24 text-center">

            {/* Icon Box */}
            <div className="flex justify-center mb-6 animate-in fade-in slide-in-from-bottom-3 duration-700">
              <div className="w-20 h-20 rounded-2xl bg-primary-foreground/20 backdrop-blur-sm flex items-center justify-center">
                <ChefHat className="w-10 h-10 text-primary-foreground" />
              </div>
            </div>

            {/* Heading */}
            <h2 className="font-display text-3xl md:text-5xl font-bold text-primary-foreground mb-6 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
              Ready to Start Your Culinary Adventure?
            </h2>

            <p className="text-lg md:text-xl text-primary-foreground/90 max-w-2xl mx-auto mb-10 animate-in fade-in slide-in-from-bottom-5 duration-700 delay-200">
              Join thousands of home chefs who are discovering, saving, and sharing delicious recipes every day.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300">
              <button
                onClick={() => navigate("/signup")}
                className="h-14 px-10 bg-primary-foreground text-primary font-semibold hover:bg-primary-foreground/90 transition-all rounded-xl group flex items-center justify-center shadow-lg"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => navigate("/login")}
                className="h-14 px-10 border-2 border-primary-foreground/30 text-primary-foreground bg-transparent hover:bg-primary-foreground/10 font-semibold transition-all rounded-xl flex items-center justify-center"
              >
                Sign In
              </button>
            </div>

            {/* Trust Badges */}
            <div className="mt-12 flex flex-wrap justify-center gap-8 text-primary-foreground/80 animate-in fade-in slide-in-from-bottom-7 duration-700 delay-400">
              <div className="flex items-center gap-2">
                <span className="text-2xl">✨</span>
                <span className="text-sm font-medium">Free to use</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-2xl">🔒</span>
                <span className="text-sm font-medium">Secure & Private</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-2xl">📱</span>
                <span className="text-sm font-medium">Works on all devices</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
