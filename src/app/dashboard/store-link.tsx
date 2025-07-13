"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Copy, Check, ExternalLink } from 'lucide-react';

export function StoreLink({ storeSlug }: { storeSlug: string | null }) {
  const [isCopied, setIsCopied] = useState(false);
  const [origin, setOrigin] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setOrigin(window.location.origin);
    }
  }, []);

  if (!storeSlug) {
    return null;
  }

  const copyToClipboard = () => {
    if (!origin) return;
    const url = `${origin}/${storeSlug}`;
    navigator.clipboard.writeText(url);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const storeUrl = origin ? `${origin.replace(/^(https?:\/\/)/, '')}/${storeSlug}` : `your-store/${storeSlug}`;

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center h-10 pl-3 pr-1 rounded-lg bg-card/80 border border-magic-accent">
        <span className="text-sm font-mono text-muted-foreground">
          {storeUrl}
        </span>
        <Button variant="ghost" size="icon" onClick={copyToClipboard} title="Copy URL">
          {isCopied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
        </Button>
      </div>
      <HoverCard>
        <HoverCardTrigger asChild>
          <a
            href={`/${storeSlug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="h-10 w-10 flex items-center justify-center rounded-lg bg-magic-primary/20 hover:bg-magic-primary/30 transition-colors"
          >
            <ExternalLink className="h-5 w-5 text-magic-primary" />
          </a>
        </HoverCardTrigger>
        <HoverCardContent className="w-auto px-3 py-1">
          <p className="text-sm">Visit store</p>
        </HoverCardContent>
      </HoverCard>
    </div>
  );
}