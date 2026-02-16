
import React from 'react';
import { StoryPage } from '../types';

interface StoryCardProps {
  page: StoryPage;
  theme: string;
}

const StoryCard: React.FC<StoryCardProps> = ({ page, theme }) => {
  const getThemeStyles = () => {
    switch (theme) {
      case 'magical': return 'bg-purple-50 border-purple-200 text-purple-900';
      case 'dark': return 'bg-slate-900 border-slate-700 text-slate-100';
      case 'minimal': return 'bg-white border-gray-100 text-gray-800';
      default: return 'bg-amber-50 border-amber-200 text-amber-900';
    }
  };

  return (
    <div className={`flex flex-col md:flex-row gap-6 p-8 rounded-3xl border-4 shadow-xl mb-12 transition-all hover:scale-[1.01] ${getThemeStyles()} story-page`}>
      <div className="md:w-1/2 flex items-center justify-center">
        {page.imageUrl ? (
          <img 
            src={page.imageUrl} 
            alt="Page Illustration" 
            className="rounded-2xl shadow-lg border-4 border-white object-cover w-full h-[300px] md:h-[400px]"
          />
        ) : (
          <div className="w-full h-[300px] bg-gray-200 animate-pulse rounded-2xl flex items-center justify-center">
            <span className="text-gray-400">ছবি তৈরি হচ্ছে...</span>
          </div>
        )}
      </div>
      <div className="md:w-1/2 flex flex-col justify-center">
        <span className="text-xs font-bold uppercase tracking-widest opacity-60 mb-2">পৃষ্ঠা {page.id}</span>
        <p className="text-xl md:text-2xl leading-relaxed font-tiro whitespace-pre-line">
          {page.text}
        </p>
      </div>
    </div>
  );
};

export default StoryCard;
