import { BookOpen, Heart, Share2, Clock, ChefHat, Sparkles } from "lucide-react";

const features = [
  {
    icon: BookOpen,
    title: "Digital Cookbook",
    description: "Organize all your recipes in one beautiful, searchable collection",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: Heart,
    title: "Save Favorites",
    description: "Bookmark recipes you love and access them anytime, anywhere",
    color: "bg-pink-500/10 text-pink-500",
  },
  {
    icon: Share2,
    title: "Share & Discover",
    description: "Connect with home chefs and share your culinary creations",
    color: "bg-blue-500/10 text-blue-500",
  },
  {
    icon: Clock,
    title: "Meal Planning",
    description: "Plan your weekly meals and generate shopping lists instantly",
    color: "bg-orange-500/10 text-orange-500",
  },
  {
    icon: ChefHat,
    title: "Step-by-Step",
    description: "Follow easy instructions with photos and video guides",
    color: "bg-red-500/10 text-red-500",
  },
  {
    icon: Sparkles,
    title: "AI Suggestions",
    description: "Get personalized recipe recommendations based on your taste",
    color: "bg-yellow-500/10 text-yellow-500",
  },
];

const FeaturesSection = () => {
  return (
    <section id="recipes" className="py-20 md:py-32 bg-background border-t border-border">
      <div className="container mx-auto px-4">

        {/* Header */}
        <div className="text-center mb-12 md:mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm mb-4">
            Why RecipeVault?
          </span>

          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4">
            Everything You Need to<br />
            <span className="text-primary">Cook with Confidence</span>
          </h2>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From discovering new dishes to organizing your kitchen, we've got you covered
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group rounded-2xl p-8 border border-border bg-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-in fade-in zoom-in duration-500 fill-mode-both"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div
                className={`w-14 h-14 rounded-xl ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
              >
                <feature.icon className="w-7 h-7" />
              </div>

              <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                {feature.title}
              </h3>

              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default FeaturesSection;
