import { useAuth } from '../context/AuthContext';
import { LogIn, LogOut } from 'lucide-react';

export default function AuthPanel() {
    const { user, signInWithGoogle, signOut } = useAuth();

    return (
        <div className="fixed bottom-6 left-6 z-40 vibe-card rounded-xl p-2 flex items-center gap-2 vibe-border">
            {user ? (
                <>
                    <img src={user.photoURL || undefined} alt="Avatar" className="w-8 h-8 rounded-full border border-[var(--border-color)]" />
                    <div className="flex flex-col">
                        <span className="text-sm font-medium">{user.displayName}</span>
                        <span className="text-[10px] text-[var(--text-secondary)]">{user.email}</span>
                    </div>
                    <button onClick={signOut} className="p-2 hover:bg-[var(--border-color)] rounded-lg transition-colors"><LogOut size={16}/></button>
                </>
            ) : (
                <button onClick={signInWithGoogle} className="flex items-center gap-2 text-xs text-[var(--text-primary)] px-3 py-1.5 hover:bg-[var(--border-color)] rounded-lg transition-colors">
                    <LogIn size={14}/> Sign In with Google
                </button>
            )}
        </div>
    );
}
