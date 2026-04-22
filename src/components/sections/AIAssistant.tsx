/// <reference types="vite/client" />
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, Sparkles, User, Bot, Loader2, Minimize2, Maximize2, Eraser, Quote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

// OpenAI API Configuration (Using fetch to avoid extra dependencies)
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

const SYSTEM_PROMPT = `
You are the "Studio Intelligence" for Brenda Crochet Designs. 
Brenda Designs is a high-end, artisanal crochet couture studio based in Nairobi, Kenya.
Personality: Professional, sophisticated, architectural, and deeply artistic.

Context:
- Founder: Brenda.
- Location: Lavington, Nairobi.
- Philosophy: "Fiber Reality" - where structural integrity meets avant-garde silhouette.
- Materials: GOTS organic cotton, bamboo silk, locally sourced recycled raffia.
- Offerings: Bespoke couture (40-200 hours per piece), ready-to-wear, digital patterns.

Directives:
- Be concise but poetic. 
- Refer to garments as "sculptures" or "milestones".
- Refer to clients as "collectors" or "muses".
- If asked about custom work, suggest the Inquiry form.
- Use elegant, sophisticated language.
`;

const SUGGESTIONS = [
  "Bespoke commission process",
  "Sustainability manifesto",
  "Nairobi studio location",
  "Care instructions for silk"
];

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([
    { role: 'assistant', content: "Welcome to the Studio Intelligence. I am here to help you navigate our fiber sculptures and artisanal vision. How shall we begin?" }
  ]);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen, isMinimized]);

  const handleSend = async (customText?: string) => {
    const textToSend = customText || input.trim();
    if (!textToSend || isLoading) return;

    setInput('');
    const newMessages = [...messages, { role: 'user', content: textToSend }];
    setMessages(newMessages as any);
    setIsLoading(true);

    try {
      if (!OPENAI_API_KEY) {
        toast.error("OpenAI API Key Missing in .env");
        setIsLoading(false);
        return;
      }

      const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            ...newMessages.map(m => ({
              role: m.role === 'user' ? 'user' : 'assistant',
              content: m.content
            }))
          ]
        })
      });

      if (!openAIResponse.ok) {
        const errorData = await openAIResponse.json();
        throw new Error(errorData.error?.message || openAIResponse.statusText);
      }
      
      const data = await openAIResponse.json();
      const aiText = data.choices[0].message.content;
      setMessages(prev => [...prev, { role: 'assistant', content: aiText }]);
    } catch (error) {
      console.error('AI error:', error);
      toast.error("Studio Intelligence link interrupted.");
      setMessages(prev => [...prev, { role: 'assistant', content: "I apologize, Collector. My connection to the studio archives has been severed. Please try again shortly." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearHistory = () => {
    setMessages([{ role: 'assistant', content: "Archives cleared. I am ready for a new conversation." }]);
    toast.success("History redacted.");
  };

  return (
    <>
      {/* Floating Toggle */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.1, rotate: 10 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-32 right-8 z-[100] w-14 h-14 bg-black text-white rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.3)] flex items-center justify-center border border-white/20 group overflow-hidden"
      >
        <div className="absolute inset-0 bg-secondary/30 opacity-0 group-hover:opacity-100 transition-opacity" />
        <Sparkles className="w-6 h-6 relative z-10" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 100 }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              y: 0,
              height: isMinimized ? '80px' : '650px',
            }}
            exit={{ opacity: 0, scale: 0.9, y: 100 }}
            className={`fixed bottom-8 right-8 z-[110] w-[calc(100vw-4rem)] md:w-[450px] glass-panel rounded-[2rem] shadow-[0_40px_100px_rgba(0,0,0,0.4)] overflow-hidden flex flex-col border-white/20 bg-white/90 backdrop-blur-3xl transition-all duration-500`}
          >
            {/* Header */}
            <div className="p-6 bg-black text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center border border-secondary/40 artisanal-float">
                  <Bot className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <h3 className="font-black text-[10px] uppercase tracking-[0.3em]">Studio Intelligence</h3>
                  <p className="text-[8px] text-white/40 uppercase tracking-widest flex items-center gap-2">
                    <span className="w-1 h-1 bg-green-500 rounded-full animate-pulse" /> Connected /// v1.5
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={() => setIsMinimized(!isMinimized)} className="w-8 h-8 rounded-full text-white/40 hover:text-white hover:bg-white/10">
                  {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                </Button>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="w-8 h-8 rounded-full text-white/40 hover:text-white hover:bg-white/10">
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Messages */}
                <div 
                  ref={scrollRef}
                  className="flex-1 overflow-y-auto p-8 space-y-8 bg-[url('https://www.transparenttextures.com/patterns/pinstripe.png')] bg-opacity-5"
                >
                  {messages.map((msg, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} items-start gap-4`}
                    >
                      {msg.role === 'assistant' && (
                        <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center flex-shrink-0 mt-1 shadow-lg border border-white/10">
                          <Bot className="w-4 h-4 text-white" />
                        </div>
                      )}
                      <div className={`relative max-w-[85%] p-5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                        msg.role === 'user' 
                          ? 'bg-secondary text-white rounded-tr-none font-bold' 
                          : 'bg-white border border-black/5 text-foreground rounded-tl-none font-medium italic'
                      }`}>
                        {msg.role === 'assistant' && <Quote className="absolute -top-3 -left-3 w-6 h-6 text-secondary/10 rotate-180" />}
                        {msg.content}
                      </div>
                    </motion.div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                      <div className="bg-white border border-black/5 p-4 rounded-2xl rounded-tl-none flex gap-1">
                        <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0 }} className="w-1.5 h-1.5 bg-secondary rounded-full" />
                        <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }} className="w-1.5 h-1.5 bg-secondary rounded-full" />
                        <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }} className="w-1.5 h-1.5 bg-secondary rounded-full" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Suggestions */}
                <div className="px-8 py-4 border-t border-black/5 flex gap-2 overflow-x-auto no-scrollbar">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => handleSend(s)}
                      className="whitespace-nowrap px-4 py-2 rounded-full bg-black/5 hover:bg-secondary hover:text-white transition-all text-[10px] font-bold uppercase tracking-widest border border-black/5"
                    >
                      {s}
                    </button>
                  ))}
                </div>

                {/* Input */}
                <div className="p-8 bg-white border-t border-black/5">
                  <div className="relative flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={clearHistory} className="rounded-full w-12 h-12 text-muted-foreground hover:text-secondary">
                      <Eraser className="w-5 h-5" />
                    </Button>
                    <form 
                      onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                      className="relative flex-1 group"
                    >
                      <Input 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Inquire within the studio..."
                        className="w-full h-14 pl-6 pr-14 rounded-full border-black/5 bg-black/[0.03] focus:bg-white focus:ring-secondary/20 transition-all font-medium italic text-base placeholder:text-muted-foreground/50"
                      />
                      <Button 
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        className="absolute right-2 top-1.5 rounded-full w-11 h-11 p-0 bg-black hover:bg-secondary text-white transition-all shadow-lg"
                      >
                        <Send className="w-5 h-5" />
                      </Button>
                    </form>
                  </div>
                  <p className="text-[8px] text-center text-muted-foreground uppercase tracking-[0.4em] mt-6 font-black opacity-30">
                    Artisanal Intelligence Matrix /// DeepMind
                  </p>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
