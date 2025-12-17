import { BookOpen, Heart, Share2, Clock, ChefHat, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

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
    <section id="recipes" className="py-20 md:py-32 bg-background relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      <div className="container mx-auto px-4">

        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm mb-4 border border-primary/20 backdrop-blur-sm"
          >
            Why RecipeVault?
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4"
          >
            Everything You Need to<br />
            <span className="text-primary">Cook with Confidence</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            From discovering new dishes to organizing your kitchen, we've got you covered
          </motion.p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="group rounded-2xl p-8 border border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-300"
            >
              <div
                className={`w-14 h-14 rounded-xl ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
              >
                <feature.icon className="w-7 h-7" />
              </div>

              <h3 className="font-display text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                {feature.title}
              </h3>

              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default FeaturesSection;
