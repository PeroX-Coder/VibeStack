import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Activity, Cpu, Database, Network, Zap, Server, HardDrive, Clock } from 'lucide-react';

interface Metric {
  id: string;
  title: string;
  value: string | number;
  unit: string;
  icon: React.ElementType;
  trend: 'up' | 'down' | 'neutral';
  trendValue: string;
  pulse?: boolean;
}

const INITIAL_METRICS: Metric[] = [
  { id: 'cpu', title: 'CPU Usage', value: 42, unit: '%', icon: Cpu, trend: 'up', trendValue: '+2.4%', pulse: true },
  { id: 'mem', title: 'Memory', value: 16.4, unit: 'GB', icon: HardDrive, trend: 'up', trendValue: '+0.8%' },
  { id: 'net', title: 'Network I/O', value: '1.2/0.8', unit: 'GB/s', icon: Network, trend: 'neutral', trendValue: '0.0%' },
  { id: 'db', title: 'DB Queries', value: '4.2k', unit: '/s', icon: Database, trend: 'down', trendValue: '-1.2%' },
  { id: 'lat', title: 'API Latency', value: 45, unit: 'ms', icon: Activity, trend: 'down', trendValue: '-5ms', pulse: true },
  { id: 'up', title: 'Uptime', value: '99.99', unit: '%', icon: Clock, trend: 'neutral', trendValue: '0.0%' },
  { id: 'req', title: 'Requests', value: '12.5k', unit: '/min', icon: Server, trend: 'up', trendValue: '+12%' },
  { id: 'err', title: 'Error Rate', value: 0.01, unit: '%', icon: Zap, trend: 'down', trendValue: '-0.02%' },
];

export default function Dashboard() {
  const [metrics, setMetrics] = useState<Metric[]>(INITIAL_METRICS);

  // Simulate real-time data updates and reordering
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics((current) => {
        const updated = current.map(m => {
          if (m.id === 'cpu') return { ...m, value: Math.floor(Math.random() * 60) + 20 };
          if (m.id === 'lat') return { ...m, value: Math.floor(Math.random() * 30) + 30 };
          if (m.id === 'req') return { ...m, value: (Math.random() * 5 + 10).toFixed(1) + 'k' };
          return m;
        });
        
        // Randomly swap two items to demonstrate FLIP animation
        if (Math.random() > 0.7) {
          const idx1 = Math.floor(Math.random() * updated.length);
          const idx2 = Math.floor(Math.random() * updated.length);
          const temp = updated[idx1];
          updated[idx1] = updated[idx2];
          updated[idx2] = temp;
        }
        
        return updated;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <header className="mb-12 flex justify-between items-end">
        <div>
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-bold tracking-tighter mb-2"
          >
            VibeStack
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="flex items-center gap-2 text-[var(--text-secondary)] font-mono text-sm tracking-widest uppercase"
          >
            <span>System Status</span>
            <span className="text-[var(--border-color)]">//</span>
            <span className="flex items-center gap-1.5 text-[var(--accent-color)]">
              <motion.span 
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                className="w-2 h-2 rounded-full bg-current"
              />
              Live
            </span>
          </motion.div>
        </div>
      </header>

      <motion.div 
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <AnimatePresence>
          {metrics.map((metric) => (
            <MetricCard key={metric.id} metric={metric} />
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

function MetricCard({ metric }: { metric: Metric; key?: React.Key }) {
  const Icon = metric.icon;
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ 
        type: "spring", 
        stiffness: 400, 
        damping: 30,
        mass: 0.8
      }}
      className="vibe-card p-6 rounded-xl relative overflow-hidden group cursor-pointer"
    >
      {metric.pulse && (
        <motion.div
          animate={{
            opacity: [0.1, 0.3, 0.1],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -top-10 -right-10 w-32 h-32 bg-[var(--accent-color)] rounded-full blur-3xl opacity-20"
        />
      )}
      
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className="p-2 rounded-lg bg-[var(--bg-color)] vibe-border">
          <Icon size={18} className="vibe-text-accent" />
        </div>
        <div className={`text-xs font-mono px-2 py-1 rounded-full ${
          metric.trend === 'up' ? 'text-green-500 bg-green-500/10' : 
          metric.trend === 'down' ? 'text-red-500 bg-red-500/10' : 
          'text-gray-500 bg-gray-500/10'
        }`}>
          {metric.trendValue}
        </div>
      </div>
      
      <div className="relative z-10">
        <h3 className="text-[var(--text-secondary)] text-sm font-medium mb-1">{metric.title}</h3>
        <div className="flex items-baseline gap-1">
          <motion.span 
            key={metric.value}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold font-mono tracking-tight"
          >
            {metric.value}
          </motion.span>
          <span className="text-[var(--text-secondary)] text-sm font-mono">{metric.unit}</span>
        </div>
      </div>
      
      <div className="absolute inset-0 border border-[var(--accent-color)] opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-300 pointer-events-none" />
    </motion.div>
  );
}
