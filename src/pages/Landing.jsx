import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkling, ArrowRight, Sun, Moon } from 'lucide-react';

const AnimatedText = ({ text }) => {
  const words = text.split(" ");
  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.04 * i },
    }),
  };
  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", damping: 12, stiffness: 100 },
    },
    hidden: {
      opacity: 0,
      y: 20,
      transition: { type: "spring", damping: 12, stiffness: 100 },
    },
  };
  return (
    <motion.div
      style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", overflow: "hidden" }}
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {words.map((word, index) => (
        <motion.span
          variants={child}
          style={{ marginRight: "12px", marginBottom: "10px" }}
          key={index}
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
};

const TravelPlannerLanding = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  return (
    <div className={isDarkMode ? "dark" : ""}>
      <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0b0f19] font-sans relative overflow-hidden flex flex-col transition-colors duration-500">
        
        {/* Dynamic Background Gradients */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[700px] h-[700px] rounded-full bg-indigo-200/50 dark:bg-indigo-900/30 mix-blend-multiply dark:mix-blend-screen blur-[120px] animate-blob"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-pink-200/50 dark:bg-pink-900/20 mix-blend-multiply dark:mix-blend-screen blur-[120px] animate-blob animation-delay-2000"></div>
          <div className="absolute top-[30%] left-[50%] translate-x-[-50%] w-[800px] h-[800px] rounded-full bg-sky-200/40 dark:bg-sky-900/20 mix-blend-multiply dark:mix-blend-screen blur-[120px] animate-blob animation-delay-4000"></div>
        </div>

        {/* Theme Toggle Button (Top Right) */}
        <div className="absolute top-8 right-8 z-50">
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-3 rounded-full bg-white/40 dark:bg-white/10 backdrop-blur-xl border border-white/60 dark:border-white/10 shadow-lg hover:scale-110 transition-all duration-300"
          >
            {isDarkMode ? (
              <Sun className="w-6 h-6 text-yellow-400" />
            ) : (
              <Moon className="w-6 h-6 text-indigo-950" />
            )}
          </button>
        </div>

        {/* Main Hero Section */}
        <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6">
          <div className="max-w-[1200px] w-full mx-auto text-center flex flex-col items-center">
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/60 dark:bg-white/10 backdrop-blur-md text-indigo-700 dark:text-indigo-300 font-semibold mb-8 border border-indigo-100 dark:border-indigo-500/30 shadow-sm"
            >
              <Sparkling className="w-4 h-4" />
              <span className="text-sm tracking-wide uppercase">The Future of Travel is Here</span>
            </motion.div>

            <h1 className="text-7xl md:text-8xl lg:text-9xl font-extrabold text-slate-950 dark:text-white tracking-tighter leading-[1] mb-8 w-full transition-colors duration-500">
              <AnimatedText text="Plan Your Dream Trip Smartly." />
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 mb-14 max-w-2xl mx-auto leading-relaxed font-light transition-colors duration-500"
            >
              VoyageAI uses advanced intelligence to craft personalized itineraries, find hidden gems, and optimize your budget.
            </motion.p>

            {/* Central Glowing Explore Button */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="relative group"
            >
              {/* Animated Glow Effect */}
              <div className="absolute -inset-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full blur-lg opacity-60 group-hover:opacity-100 transition duration-500 group-hover:duration-200 animate-pulse"></div>
              
              {/* The Actual Button */}
              <button className="relative flex items-center gap-4 px-12 py-5 sm:px-16 sm:py-6 bg-slate-950 dark:bg-white text-white dark:text-slate-950 rounded-full font-bold text-xl sm:text-2xl hover:bg-slate-900 dark:hover:bg-slate-100 transition-all duration-300 transform group-hover:scale-[1.02]">
                Start Exploring
                <ArrowRight className="w-7 h-7 group-hover:translate-x-2 transition-transform duration-300" />
              </button>
            </motion.div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default TravelPlannerLanding;
