import { useNavigate } from "react-router-dom";
import { ArrowRight, ChefHat } from "lucide-react";
import { motion } from "framer-motion";

const CTASection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 md:py-32">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10"
        >

          {/* Background */}
          <div className="absolute inset-0 bg-primary" />
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-black/30" />
          {/* Abstract shapes */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-black/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

          <div
            className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0aC0ydi0yaDJ2MnptMC00aC0ydi0yaDJ2MnptLTQtNGgtMnYtMmgydjJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-50"
          />

          {/* Content */}
          <div className="relative px-6 py-16 md:px-12 md:py-24 text-center z-10">

            {/* Icon Box */}
            <div className="flex justify-center mb-8">
              <div className="w-24 h-24 rounded-3xl bg-white/10 backdrop-blur-md flex items-center justify-center shadow-xl border border-white/20">
                <ChefHat className="w-12 h-12 text-white" />
              </div>
            </div>

            {/* Heading */}
            <h2 className="font-display text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6 max-w-4xl mx-auto leading-tight">
              Ready to Start Your<br /> Culinary Adventure?
            </h2>

            <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-10 font-sans">
              Join thousands of home chefs who are discovering, saving, and sharing delicious recipes every day.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/signup")}
                className="h-14 px-10 bg-white text-primary font-bold hover:bg-white/90 transition-colors rounded-xl flex items-center justify-center shadow-lg"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/login")}
                className="h-14 px-10 border-2 border-white/30 text-white bg-transparent hover:bg-white/10 font-semibold transition-colors rounded-xl flex items-center justify-center backdrop-blur-sm"
              >
                Sign In
              </motion.button>
            </div>

            {/* Trust Badges */}
            <div className="mt-12 flex flex-wrap justify-center gap-8 text-white/70">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10">
                <span className="text-xl">✨</span>
                <span className="text-sm font-medium">Free to use</span>
              </div>

              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10">
                <span className="text-xl">🔒</span>
                <span className="text-sm font-medium">Secure & Private</span>
              </div>

              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10">
                <span className="text-xl">📱</span>
                <span className="text-sm font-medium">Works on all devices</span>
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
