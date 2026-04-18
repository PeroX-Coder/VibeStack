import { useState, useRef, useEffect } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import { motion, AnimatePresence } from 'motion/react';
import { Wand2, Search, Sparkles, Check, X } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenAI } from '@google/genai';
import * as Diff from 'diff';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null;

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

const DEFAULT_HTML = `
<div class="container">
  <h1>Hello VibeStack</h1>
  <p>Edit this code to see real-time updates!</p>
</div>
<style>
  .container { font-family: sans-serif; padding: 2rem; }
  h1 { color: #eab308; }
</style>
`;

export default function Codebase() {
  const [code, setCode] = useState(DEFAULT_HTML);
  const [proposedCode, setProposedCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const editorRef = useRef<any>(null);

  const SUGGESTIONS = [
    "Add a responsive navigation bar",
    "Style this to be dark mode",
    "Add a form with validation",
    "Include a glassmorphism effect"
  ];

  useEffect(() => {
    if (!supabase) return;
    const channel = supabase.channel('code_sync').on(
      'broadcast',
      { event: 'code_update' },
      ({ payload }) => setCode(payload.code)
    ).subscribe();
    return () => { channel.unsubscribe(); };
  }, []);

  const handleUpdate = (newCode: string) => {
    setCode(newCode);
    if (supabase) {
      supabase.channel('code_sync').send({
        type: 'broadcast',
        event: 'code_update',
        payload: { code: newCode },
      });
    }
  };

  const handleEditorDidMount: OnMount = (editor) => { editorRef.current = editor; };
  const runCommand = (actionId: string) => {
    editorRef.current?.focus();
    const action = editorRef.current?.getAction(actionId);
    if (action) {
      action.run();
    }
  };

  const handleAI = async () => {
    if (!prompt.trim()) return;
    setIsLoading(true);
    setPrompt('');
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Update this HTML code based on: ${prompt}. Return only the updated HTML code block.\n${code}`,
      });
      const text = response.text!.replace(/```html|```/g, '');
      setProposedCode(text);
    } finally {
      setIsLoading(false);
    }
  };

  const changes = proposedCode ? Diff.diffLines(code, proposedCode) : [];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8 max-w-7xl mx-auto h-[calc(100vh-2rem)] flex gap-4">
      <div className="flex-1 vibe-card rounded-xl overflow-hidden vibe-border flex flex-col">
        <div className="flex items-center justify-end p-2 vibe-border-b">
          <button onClick={() => runCommand('actions.find')} className="p-1.5 rounded hover:bg-[var(--border-color)]"><Search size={14}/></button>
        </div>
        
        {proposedCode ? (
          <div className="flex-1 overflow-auto p-4 font-mono text-xs">
            {changes.map((part, i) => (
              <div key={i} className={part.added ? 'bg-green-900/30 text-green-400' : part.removed ? 'bg-red-900/30 text-red-400' : 'text-[var(--text-secondary)]'}>
                {part.added ? '+ ' : part.removed ? '- ' : '  '}{part.value}
              </div>
            ))}
            <div className="flex gap-2 mt-4">
              <button onClick={() => { handleUpdate(proposedCode); setProposedCode(null); }} className="px-3 py-1 bg-green-600 rounded flex items-center gap-1"><Check size={14}/> Accept</button>
              <button onClick={() => setProposedCode(null)} className="px-3 py-1 bg-red-600 rounded flex items-center gap-1"><X size={14}/> Reject</button>
            </div>
          </div>
        ) : (
          <Editor
            height="100%"
            defaultLanguage="html"
            theme="vs-dark"
            value={code}
            onChange={(value) => handleUpdate(value || '')}
            onMount={handleEditorDidMount}
            options={{ fontSize: 14, minimap: { enabled: false } }}
          />
        )}

        <div className="p-3 vibe-border-t bg-[var(--card-bg)] flex flex-col gap-2">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input 
                value={prompt} 
                onChange={(e) => setPrompt(e.target.value)} 
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                placeholder="Describe your desired code changes... (e.g., 'Make the button blue')" 
                className="w-full bg-[var(--bg-color)] px-3 py-2 rounded-lg text-sm outline-none border border-[var(--border-color)] focus:vibe-border-accent"
              />
              {showSuggestions && (
                <div className="absolute bottom-full left-0 mb-2 w-full vibe-card vibe-border rounded-lg p-1 shadow-xl z-30">
                  {SUGGESTIONS.map(s => (
                    <button key={s} onClick={() => setPrompt(s)} className="block w-full text-left px-3 py-1.5 text-xs rounded hover:bg-[var(--border-color)]">
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button onClick={handleAI} className="px-3 py-2 rounded-lg vibe-bg-accent disabled:opacity-50" disabled={!prompt.trim() || isLoading}>
              <Sparkles size={16} className="text-[var(--bg-color)]" />
            </button>
          </div>
          <div className="text-[10px] text-[var(--text-secondary)] font-mono text-right">
            {prompt.length} / 500 characters
          </div>
        </div>
      </div>
      
      <div className="flex-1 vibe-card rounded-xl overflow-hidden vibe-border relative">
        <AnimatePresence>
          {isLoading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-20 bg-[var(--bg-color)]/50 backdrop-blur-sm flex items-center justify-center">
              <motion.div animate={{ x: [-100, 100] }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }} className="w-32 h-2 bg-white/20 rounded blur-xl" />
            </motion.div>
          )}
        </AnimatePresence>
        <iframe key={code} srcDoc={code} title="preview" className="w-full h-full bg-white" />
      </div>
    </motion.div>
  );
}
