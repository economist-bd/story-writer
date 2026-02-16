
import React, { useState, useRef, useEffect } from 'react';
import { GeminiService } from './services/geminiService';
import { extractTextFromFile } from './services/fileUtils';
import { Story, AppState, StoryPage } from './types';
import StoryCard from './components/StoryCard';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('input');
  const [inputText, setInputText] = useState('');
  const [story, setStory] = useState<Story | null>(null);
  const [isGeneratingImages, setIsGeneratingImages] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  
  const gemini = useRef(new GeminiService());

  const handleStart = async () => {
    if (!inputText.trim()) return;
    
    try {
      setAppState('processing');
      setLoadingStep('আপনার গল্পটি বিশ্লেষণ করা হচ্ছে...');
      
      const structuredStory = await gemini.current.structureStory(inputText);
      setStory(structuredStory);
      setAppState('viewing');
      
      // Start generating images in background
      setLoadingStep('গল্পের জন্য আকর্ষণীয় ছবি তৈরি করা হচ্ছে...');
      setIsGeneratingImages(true);
      
      const updatedPages: StoryPage[] = [...structuredStory.pages];
      
      for (let i = 0; i < updatedPages.length; i++) {
        setLoadingStep(`পৃষ্ঠা ${i + 1}-এর চিত্র তৈরি হচ্ছে...`);
        const imageUrl = await gemini.current.generateIllustration(updatedPages[i].imageDescription);
        updatedPages[i] = { ...updatedPages[i], imageUrl };
        setStory(prev => prev ? { ...prev, pages: [...updatedPages] } : null);
      }
      
      setIsGeneratingImages(false);
    } catch (error) {
      console.error(error);
      alert("দুঃখিত, কোনো সমস্যা হয়েছে। আবার চেষ্টা করুন।");
      setAppState('input');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const text = await extractTextFromFile(file);
      setInputText(text);
    }
  };

  const handleDownloadPDF = () => {
    window.print();
  };

  if (appState === 'input') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#fdf6e3]">
        <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl p-8 border-t-8 border-amber-600">
          <h1 className="text-4xl font-bold text-center text-amber-800 mb-2 font-tiro">গল্পের কারিগর</h1>
          <p className="text-center text-gray-600 mb-8">আপনার সাধারণ লেখাকে দিন জাদুকরী রূপ</p>
          
          <div className="space-y-4">
            <textarea
              className="w-full h-64 p-4 rounded-xl border-2 border-amber-100 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all text-lg font-tiro"
              placeholder="এখানে আপনার গল্পটি লিখুন বা কপি পেস্ট করুন..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            
            <div className="flex flex-col sm:flex-row gap-4">
              <label className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-amber-50 text-amber-800 rounded-xl cursor-pointer hover:bg-amber-100 transition-colors border-2 border-dashed border-amber-200">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                ফাইল আপলোড করুন (.txt/docx)
                <input type="file" accept=".txt,.docx" className="hidden" onChange={handleFileUpload} />
              </label>
              
              <button
                onClick={handleStart}
                disabled={!inputText.trim()}
                className="flex-[2] py-4 bg-amber-600 text-white rounded-xl font-bold text-lg hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg transition-all"
              >
                ম্যাজিক শুরু করুন
              </button>
            </div>
          </div>
          
          <div className="mt-8 text-xs text-center text-gray-400">
            Powered by Gemini AI • সুন্দর স্টোরিবুক মেকার
          </div>
        </div>
      </div>
    );
  }

  if (appState === 'processing') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-amber-50">
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 border-8 border-amber-200 border-t-amber-600 rounded-full animate-spin mb-6"></div>
          <h2 className="text-2xl font-bold text-amber-800 animate-pulse font-tiro">{loadingStep}</h2>
          <p className="mt-4 text-gray-500 italic">কিছুক্ষণ অপেক্ষা করুন, আপনার গল্পটি সাজানো হচ্ছে...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdf6e3] pb-20">
      {/* Top Navigation */}
      <header className="no-print sticky top-0 bg-white/80 backdrop-blur-md border-b border-amber-100 p-4 z-50 flex justify-between items-center px-4 md:px-20">
        <h1 className="text-2xl font-bold text-amber-800 font-tiro">গল্পের কারিগর</h1>
        <div className="flex gap-4">
          <button 
            onClick={() => setAppState('input')}
            className="px-4 py-2 text-amber-800 hover:bg-amber-50 rounded-lg font-medium"
          >
            নতুন গল্প
          </button>
          <button 
            onClick={handleDownloadPDF}
            className="flex items-center gap-2 px-6 py-2 bg-amber-600 text-white rounded-lg font-bold shadow-md hover:bg-amber-700 transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            PDF ডাউনলোড
          </button>
        </div>
      </header>

      {/* Story Content */}
      <main className="max-w-5xl mx-auto mt-12 px-6">
        {story && (
          <>
            <div className="text-center mb-16 space-y-4 print:mb-20">
              <h2 className="text-5xl md:text-7xl font-bold text-amber-900 font-tiro">{story.title}</h2>
              <p className="text-xl text-amber-700 italic">লিখেছেন - {story.author}</p>
              <div className="w-24 h-1 bg-amber-300 mx-auto rounded-full mt-4"></div>
            </div>

            <div className="space-y-16">
              {story.pages.map((page) => (
                <StoryCard key={page.id} page={page} theme={story.theme} />
              ))}
            </div>

            <div className="text-center mt-20 pt-10 border-t border-amber-200">
              <p className="text-amber-800/40 font-tiro">সমাপ্ত</p>
            </div>
          </>
        )}
      </main>

      {/* Floating Status Indicator */}
      {isGeneratingImages && (
        <div className="no-print fixed bottom-6 right-6 bg-white shadow-2xl rounded-2xl p-4 border-2 border-amber-500 flex items-center gap-4 animate-bounce">
          <div className="w-5 h-5 border-2 border-amber-200 border-t-amber-500 rounded-full animate-spin"></div>
          <span className="text-amber-800 text-sm font-medium">{loadingStep}</span>
        </div>
      )}
    </div>
  );
};

export default App;
