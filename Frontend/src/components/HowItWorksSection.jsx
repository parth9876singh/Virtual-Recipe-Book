import { UserPlus, Search, BookmarkPlus, UtensilsCrossed } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    step: "01",
    title: "Create Account",
    description: "Sign up in seconds with email or Google",
  },
  {
    icon: Search,
    step: "02",
    title: "Discover Recipes",
    description: "Browse thousands of curated recipes",
  },
  {
    icon: BookmarkPlus,
    step: "03",
    title: "Save Favorites",
    description: "Build your personal recipe collection",
  },
  {
    icon: UtensilsCrossed,
    step: "04",
    title: "Start Cooking",
    description: "Follow step-by-step instructions",
  },
];

const HowItWorksSection = () => {
  return (
    <section
      id="how-it-works"
      className="py-20 md:py-32 bg-muted/30 relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-secondary/10 rounded-full blur-3xl opacity-50" />
      </div>

      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm mb-4">
            Simple & Easy
          </span>

          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4">
            How <span className="text-primary">RecipeVault</span> Works
          </h2>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get started in minutes and transform how you cook
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connection line for desktop */}
          <div className="hidden lg:block absolute top-24 left-[12%] right-[12%] h-0.5 bg-gradient-to-r from-primary/30 via-secondary/30 to-primary/30" />

          {steps.map((step, index) => (
            <div
              key={step.step}
              className="relative text-center animate-in fade-in zoom-in duration-500 fill-mode-both"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {/* Icon Box */}
              <div className="relative inline-block mb-6">
                <div className="w-20 h-20 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/25 mx-auto relative z-10 transition-transform hover:scale-110 duration-300">
                  <step.icon className="w-9 h-9 text-primary-foreground" />
                </div>

                <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-background border-2 border-primary text-foreground font-bold text-sm flex items-center justify-center z-20 shadow-sm">
                  {step.step}
                </span>
              </div>

              {/* Step Title */}
              <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                {step.title}
              </h3>

              {/* Step Description */}
              <p className="text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
