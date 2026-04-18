import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { History as HistoryIcon, Loader2 } from 'lucide-react';

interface HistoryLog {
    id: string;
    feature: string;
    description: string;
    timestamp: any;
}

export default function History() {
    const [logs, setLogs] = useState<HistoryLog[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const logsRef = collection(db, 'history');
                const q = query(logsRef, orderBy('timestamp', 'desc'));
                const snapshot = await getDocs(q);
                const data = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as HistoryLog[];
                setLogs(data);
            } catch (error) {
                console.error("Error fetching history:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchLogs();
    }, []);

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8 max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
                <HistoryIcon className="text-[var(--accent-color)]" size={32} />
                <h2 className="text-3xl font-bold">Feature History</h2>
            </div>

            {loading ? (
                <div className="flex justify-center p-12">
                     <Loader2 className="animate-spin text-[var(--text-secondary)]" size={32} />
                </div>
            ) : logs.length === 0 ? (
                <div className="vibe-card p-8 rounded-xl text-center text-[var(--text-secondary)] font-mono">
                    No history logs found.
                </div>
            ) : (
                <div className="space-y-4">
                    {logs.map(log => (
                        <div key={log.id} className="vibe-card p-4 rounded-xl flex items-center justify-between border border-[var(--border-color)]">
                            <div>
                                <h3 className="font-semibold">{log.feature}</h3>
                                <p className="text-sm text-[var(--text-secondary)]">{log.description}</p>
                            </div>
                            <span className="text-xs font-mono text-[var(--text-secondary)]">
                                {log.timestamp?.toDate().toLocaleDateString()}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </motion.div>
    );
}
