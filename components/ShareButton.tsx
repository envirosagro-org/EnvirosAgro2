import React, { useState } from 'react';
import { Share2, Check } from 'lucide-react';
import { useAppStore } from '../store';
import { ViewState } from '../types';

interface ShareButtonProps {
  title: string;
  text: string;
  url?: string;
  view?: ViewState;
  section?: string | null;
  id?: string | null;
  className?: string;
  iconSize?: number;
  label?: string;
}

export const ShareButton: React.FC<ShareButtonProps> = ({ 
  title, 
  text, 
  url, 
  view,
  section,
  id,
  className = '', 
  iconSize = 16, 
  label 
}) => {
  const [copied, setCopied] = useState(false);
  const generateShareUrl = useAppStore(state => state.generateShareUrl);

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    const shareUrl = url || generateShareUrl(view, section, id);
    
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url: shareUrl,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(`${title} - ${text} ${shareUrl}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy text: ', err);
      }
    }
  };

  return (
    <button
      onClick={handleShare}
      className={`flex items-center justify-center transition-all ${className}`}
      title="Share"
    >
      {copied ? <Check size={iconSize} className="text-emerald-400" /> : <Share2 size={iconSize} />}
      {label && <span className="ml-2">{label}</span>}
    </button>
  );
};

export default ShareButton;
