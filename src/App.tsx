import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Dashboard from './components/Dashboard';
import Codebase from './components/Codebase';
import History from './components/History';
import ThemeSelector from './components/ThemeSelector';
import AuthPanel from './components/AuthPanel';
import CommandPalette from './components/CommandPalette';
import { AuthProvider } from './context/AuthContext';

function PlaceholderView({ title, description, viewKey }: { title: string, description: string, viewKey: string }) {
  return (
    <div key={viewKey}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="p-8 max-w-7xl mx-auto flex flex-col items-center justify-center min-h-[80vh]"
      >
        <div className="vibe-card p-12 rounded-2xl text-center max-w-2xl w-full">
          <h2 className="text-4xl font-bold mb-4">{title}</h2>
          <p className="text-[var(--text-secondary)] font-mono">{description}</p>
        </div>
      </motion.div>
    </div>
  );
}

export default function App() {
  const [activeView, setActiveView] = useState('dashboard');

  return (
    <AuthProvider>
      <div className="min-h-screen relative selection:bg-[var(--accent-color)] selection:text-[var(--bg-color)]">
        {/* Subtle Background Grid */}
        <div 
          className="fixed inset-0 z-0 pointer-events-none opacity-[0.03] theme-royal-white:opacity-[0.05] theme-arctic-slate:opacity-[0.05]"
          style={{
            backgroundImage: `linear-gradient(var(--text-primary) 1px, transparent 1px), linear-gradient(90deg, var(--text-primary) 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}
        />
        
        <div className="relative z-10">
          <AnimatePresence mode="wait">
            {activeView === 'dashboard' && <Dashboard key="dashboard" />}
            {activeView === 'code' && <Codebase key="code" />}
            {activeView === 'history' && <History key="history" />}
            {activeView === 'team' && <PlaceholderView key="team" viewKey="team" title="Team" description="Active team members, online status, and recent activity." />}
            {activeView === 'settings' && <PlaceholderView key="settings" viewKey="settings" title="Settings" description="Application configuration and user preferences." />}
          </AnimatePresence>

          <ThemeSelector />
          <AuthPanel />
          <CommandPalette activeView={activeView} onViewChange={setActiveView} />
        </div>
      </div>
    </AuthProvider>
  );
}
