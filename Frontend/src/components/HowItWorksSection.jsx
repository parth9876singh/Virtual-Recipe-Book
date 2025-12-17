import { UserPlus, Search, BookmarkPlus, UtensilsCrossed } from "lucide-react";
import { motion } from "framer-motion";

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
      className="py-20 md:py-32 bg-muted/10 relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[100px] opacity-70" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-[100px] opacity-70" />
      </div>

      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm mb-4 border border-primary/20 backdrop-blur-sm"
          >
            Simple & Easy
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4"
          >
            How <span className="text-primary">RecipeVault</span> Works
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Get started in minutes and transform how you cook
          </motion.p>
        </div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connection line for desktop */}
          <div className="hidden lg:block absolute top-24 left-[12%] right-[12%] h-0.5 bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20" />

          {steps.map((step, index) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="relative text-center group"
            >
              {/* Icon Box */}
              <div className="relative inline-block mb-6">
                <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex items-center justify-center shadow-lg mx-auto relative z-10 transition-transform group-hover:scale-110 duration-500 group-hover:bg-primary group-hover:border-primary group-hover:shadow-primary/30">
                  <step.icon className="w-9 h-9 text-primary group-hover:text-primary-foreground transition-colors duration-500" />
                </div>

                <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-background border-2 border-primary text-foreground font-bold text-sm flex items-center justify-center z-20 shadow-sm relative">
                  {step.step}
                </span>
              </div>

              {/* Step Title */}
              <h3 className="font-display text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                {step.title}
              </h3>

              {/* Step Description */}
              <p className="text-muted-foreground">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
