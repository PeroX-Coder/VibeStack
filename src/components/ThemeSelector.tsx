import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Palette } from 'lucide-react';

const THEMES = [
  { id: 'cyber-obsidian', name: 'Cyber Obsidian', class: '' },
  { id: 'royal-white', name: 'Royal White', class: 'theme-royal-white' },
  { id: 'arctic-slate', name: 'Arctic Slate', class: 'theme-arctic-slate' },
];

export default function ThemeSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTheme, setActiveTheme] = useState(THEMES[0]);

  useEffect(() => {
    // Remove all theme classes
    THEMES.forEach(t => {
      if (t.class) document.documentElement.classList.remove(t.class);
    });
    // Add active theme class
    if (activeTheme.class) {
      document.documentElement.classList.add(activeTheme.class);
    }
  }, [activeTheme]);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <motion.div
        initial={false}
        animate={isOpen ? "open" : "closed"}
        className="relative"
      >
        <motion.div
          variants={{
            open: { 
              opacity: 1, 
              y: 0, 
              pointerEvents: "auto",
              transition: { type: "spring", stiffness: 500, damping: 20 }
            },
            closed: { 
              opacity: 0, 
              y: 20, 
              pointerEvents: "none",
              transition: { type: "spring", stiffness: 400, damping: 30 }
            }
          }}
          className="absolute bottom-full right-0 mb-4 w-48 vibe-card rounded-xl p-2 vibe-shadow overflow-hidden"
        >
          {THEMES.map((theme) => (
            <motion.button
              key={theme.id}
              whileHover={{ x: 4 }}
              onClick={() => {
                setActiveTheme(theme);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-colors flex items-center justify-between ${
                activeTheme.id === theme.id 
                  ? 'vibe-bg-accent text-[var(--bg-color)] font-medium' 
                  : 'hover:bg-[var(--border-color)] text-[var(--text-primary)]'
              }`}
            >
              {theme.name}
              {activeTheme.id === theme.id && (
                <motion.div layoutId="activeThemeIndicator" className="w-2 h-2 rounded-full bg-current" />
              )}
            </motion.button>
          ))}
        </motion.div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className="w-12 h-12 rounded-full vibe-card vibe-border flex items-center justify-center vibe-shadow text-[var(--text-primary)] hover:vibe-text-accent transition-colors"
        >
          <Palette size={20} />
        </motion.button>
      </motion.div>
    </div>
  );
}
