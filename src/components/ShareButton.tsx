"use client";

import { useState } from 'react';
import { Share2, Check } from 'lucide-react';

export default function ShareButton() {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <button 
      onClick={handleShare}
      className="btn-secondary"
      style={{ 
        display: 'inline-flex', 
        alignItems: 'center', 
        gap: '0.5rem',
        padding: '0.5rem 1rem',
        fontSize: '0.875rem',
        backgroundColor: copied ? 'rgba(76, 175, 80, 0.1)' : 'var(--color-surface)',
        borderColor: copied ? '#4CAF50' : 'var(--color-border)',
        color: copied ? '#2E7D32' : 'inherit',
      }}
    >
      {copied ? <Check size={18} /> : <Share2 size={18} />}
      {copied ? 'Copied!' : 'Share Tree'}
    </button>
  );
}
