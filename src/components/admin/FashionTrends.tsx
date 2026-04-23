import React, { useState, useEffect } from 'react';
import { Sparkles, TrendingUp, ExternalLink, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Trend {
  id: string;
  topic: string;
  description: string;
  relevance: string;
}

export function FashionTrends() {
  const [trends, setTrends] = useState<Trend[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTrends = async () => {
    setLoading(true);
    setError(null);
    try {
      const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
      if (!apiKey) {
        throw new Error('Intelligence engine not configured.');
      }

      const response = await fetch('/api/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'You are a fashion trend analyst. Generate 3 current trending fashion insights relevant to artisanal, crochet, or sustainable fashion. Format your response as a JSON array of objects with id, topic, description, and relevance (e.g. HIGH, EMERGING).'
            },
            {
              role: 'user',
              content: 'Analyze current global fashion trends for the studio dashboard.'
            }
          ],
          response_format: { type: 'json_object' }
        })
      });

      if (!response.ok) throw new Error('Failed to connect to trend engine.');
      
      const data = await response.json();
      const content = JSON.parse(data.choices[0].message.content);
      // Expected format: { "trends": [ ... ] }
      setTrends(content.trends || content.items || []);
    } catch (err: any) {
      setError(err.message);
      // Fallback trends
      setTrends([
        { id: '1', topic: 'Sustainable Minimalism', description: 'Emphasis on high-quality, undyed natural fibers in structured silhouettes.', relevance: 'HIGH' },
        { id: '2', topic: 'Artisanal Textures', description: 'Hand-crocheted elements integrated into classic tailored pieces.', relevance: 'EMERGING' },
        { id: '3', topic: 'Circular Design', description: 'Design concepts focused on repairability and end-of-life recycling.', relevance: 'HIGH' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrends();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <TrendingUp className="w-6 h-6 text-secondary" />
          <h3 className="text-xl font-bold uppercase tracking-widest">Global Trends</h3>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={fetchTrends} 
          disabled={loading}
          className="rounded-full hover:bg-secondary/10 hover:text-secondary"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      <div className="space-y-6">
        {trends.map((trend) => (
          <div key={trend.id} className="p-5 bg-secondary/5 rounded-xl border border-secondary/10 group hover:border-secondary/30 transition-all">
            <div className="flex justify-between items-start mb-3">
              <h4 className="font-bold text-sm uppercase tracking-tight text-foreground group-hover:text-secondary transition-colors">{trend.topic}</h4>
              <Badge className="bg-secondary/10 text-secondary border-secondary/20 text-[8px] font-black tracking-widest">
                {trend.relevance}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground italic leading-relaxed mb-4">
              {trend.description}
            </p>
            <div className="flex items-center gap-2 text-[8px] font-bold text-secondary uppercase tracking-[0.2em] opacity-60 group-hover:opacity-100 transition-opacity">
              <Sparkles className="w-3 h-3" /> Intelligence Engine Insight
            </div>
          </div>
        ))}
      </div>

      <Button variant="ghost" className="w-full rounded-full border border-black/5 font-bold uppercase tracking-widest text-[10px] h-12 hover:bg-black/5">
        Explore Fashion Ledger <ExternalLink className="w-3 h-3 ml-2" />
      </Button>
    </div>
  );
}
