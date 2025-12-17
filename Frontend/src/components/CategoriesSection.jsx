const categories = [
  { name: "Breakfast", emoji: "🥞", color: "from-orange-500/20 to-yellow-500/5", border: "border-orange-500/20", recipes: "1.2K" },
  { name: "Lunch", emoji: "🥪", color: "from-green-500/20 to-emerald-500/5", border: "border-green-500/20", recipes: "2.5K" },
  { name: "Dinner", emoji: "🍝", color: "from-red-500/20 to-orange-500/5", border: "border-red-500/20", recipes: "3.1K" },
  { name: "Desserts", emoji: "🍰", color: "from-pink-500/20 to-purple-500/5", border: "border-pink-500/20", recipes: "1.8K" },
  { name: "Healthy", emoji: "🥗", color: "from-teal-500/20 to-green-500/5", border: "border-teal-500/20", recipes: "2.2K" },
  { name: "Quick Meals", emoji: "⚡", color: "from-yellow-500/20 to-orange-500/5", border: "border-yellow-500/20", recipes: "1.5K" },
];

import { motion } from "framer-motion";

const CategoriesSection = () => {
  return (
    <section id="categories" className="py-20 md:py-32 bg-muted/10 relative overflow-hidden">
      {/* Background blobs for depth */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4">

        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm mb-4 border border-primary/20 backdrop-blur-sm"
          >
            Browse by Category
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4"
          >
            What's on Your <span className="text-primary">Menu</span>?
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Explore recipes organized by meal type, cuisine, and dietary preferences
          </motion.p>
        </div>

        {/* Category Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="group cursor-pointer"
            >
              <div
                className={`relative h-full rounded-2xl p-6 bg-gradient-to-br ${category.color} ${category.border} border backdrop-blur-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-300`}
              >
                <div className="text-center">
                  <span className="text-5xl md:text-6xl block mb-4 filter drop-shadow-lg group-hover:scale-110 transition-transform duration-300">
                    {category.emoji}
                  </span>

                  <h3 className="font-display text-lg font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>

                  <p className="text-sm text-muted-foreground/80 font-medium bg-white/10 rounded-full py-1 px-3 inline-block backdrop-blur-md">
                    {category.recipes}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default CategoriesSection;
