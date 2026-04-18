import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal, LayoutDashboard, Settings, Users, Code, History } from 'lucide-react';

const MENU_ITEMS = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { id: 'history', icon: History, label: 'History' },
  { id: 'code', icon: Code, label: 'Codebase' },
  { id: 'team', icon: Users, label: 'Team' },
  { id: 'settings', icon: Settings, label: 'Settings' },
];

interface CommandPaletteProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

export default function CommandPalette({ activeView, onViewChange }: CommandPaletteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filteredItems = MENU_ITEMS.filter(item => 
    item.label.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
        setSearch('');
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const radius = 120;

  return (
    <>
      <div className="fixed top-6 right-6 z-40">
        <button 
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full vibe-card vibe-border text-xs font-mono text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
        >
          <Terminal size={14} />
          <span>⌘K</span>
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[var(--bg-color)]/90 backdrop-blur-md"
              onClick={() => setIsOpen(false)}
            />
            
            <div className="relative z-10 flex flex-col items-center h-full w-full pt-12" onClick={(e) => e.stopPropagation()}>
              <motion.input
                autoFocus
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search command..."
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="px-4 py-2 rounded-full vibe-card vibe-border font-mono text-sm outline-none w-64 text-center"
              />

              <div className="flex-1 flex items-center justify-center">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  className="w-20 h-20 rounded-full vibe-bg-accent flex items-center justify-center shadow-[0_0_40px_var(--shadow-color)]"
                >
                  <Terminal size={32} className="text-[var(--bg-color)]" />
                </motion.div>

                {filteredItems.map((item, index) => {
                  const angle = (index * (360 / Math.max(1, filteredItems.length)) - 90) * (Math.PI / 180);
                  const x = Math.cos(angle) * (filteredItems.length === 1 ? 0 : radius);
                  const y = Math.sin(angle) * (filteredItems.length === 1 ? 0 : radius);

                  return (
                    <motion.button
                      key={item.id}
                      onClick={() => {
                        onViewChange(item.id);
                        setIsOpen(false);
                      }}
                      initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
                      animate={{ x, y, opacity: 1, scale: 1 }}
                      exit={{ x: 0, y: 0, opacity: 0, scale: 0 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25, delay: index * 0.05 }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className={`absolute w-14 h-14 rounded-full vibe-card vibe-border flex items-center justify-center transition-colors group shadow-lg ${
                        activeView === item.id 
                          ? 'vibe-bg-accent text-[var(--bg-color)]' 
                          : 'text-[var(--text-primary)] hover:vibe-text-accent'
                      }`}
                    >
                      <item.icon size={20} />
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
