const categories = [
  { name: "Breakfast", emoji: "🥞", color: "from-orange-500/40 to-yellow-500/20", recipes: "1.2K" },
  { name: "Lunch", emoji: "🥪", color: "from-green-500/40 to-emerald-500/20", recipes: "2.5K" },
  { name: "Dinner", emoji: "🍝", color: "from-red-500/40 to-orange-500/20", recipes: "3.1K" },
  { name: "Desserts", emoji: "🍰", color: "from-pink-500/40 to-purple-500/20", recipes: "1.8K" },
  { name: "Healthy", emoji: "🥗", color: "from-teal-500/40 to-green-500/20", recipes: "2.2K" },
  { name: "Quick Meals", emoji: "⚡", color: "from-yellow-500/40 to-orange-500/20", recipes: "1.5K" },
];

const CategoriesSection = () => {
  return (
    <section id="categories" className="py-20 md:py-32 bg-muted/30">
      <div className="container mx-auto px-4">

        {/* Header */}
        <div className="text-center mb-12 md:mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm mb-4">
            Browse by Category
          </span>

          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4">
            What's on Your <span className="text-primary">Menu</span>?
          </h2>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore recipes organized by meal type, cuisine, and dietary preferences
          </p>
        </div>

        {/* Category Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {categories.map((category, index) => (
            <div
              key={category.name}
              className="group cursor-pointer animate-in fade-in zoom-in duration-500 fill-mode-both"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div
                className={`relative rounded-2xl p-6 bg-gradient-to-br ${category.color} border border-border/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-2`}
              >
                <div className="text-center">
                  <span className="text-5xl md:text-6xl block mb-3 group-hover:scale-110 transition-transform duration-300">
                    {category.emoji}
                  </span>

                  <h3 className="font-display text-lg font-semibold text-foreground mb-1">
                    {category.name}
                  </h3>

                  <p className="text-sm text-muted-foreground">
                    {category.recipes} recipes
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default CategoriesSection;
