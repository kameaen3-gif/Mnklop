import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { questions } from './data/questions';
import { temperaments } from './data/temperaments';
import { TemperamentKey } from './types';
import WelcomeScreen from './components/WelcomeScreen';
import QuizScreen from './components/QuizScreen';
import ResultScreen from './components/ResultScreen';
import { Heart, ShieldCheck, Github } from 'lucide-react';

interface HistoryItem {
  date: string;
  title: string;
  icon: string;
  scores: {
    damavi: number;
    safravi: number;
    balghami: number;
    sawdawi: number;
  };
  temperamentKey: TemperamentKey;
}

export default function App() {
  const [step, setStep] = useState<'welcome' | 'quiz' | 'result'>('welcome');
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [calculatedKey, setCalculatedTemperamentKey] = useState<TemperamentKey | null>(null);
  const [computedScores, setComputedScores] = useState({
    damavi: 0,
    safravi: 0,
    balghami: 0,
    sawdawi: 0,
  });
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Load history from local storage on mount
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('tabib_hakim_history');
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch (e) {
      console.error("Failed to load history from localStorage:", e);
    }
  }, []);

  const handleStartQuiz = () => {
    setSelectedAnswers({});
    setCurrentQuestionIdx(0);
    setStep('quiz');
  };

  const handleSelectOption = (optionIdx: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestionIdx]: optionIdx,
    }));
  };

  const handleNext = () => {
    if (currentQuestionIdx < questions.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
    } else {
      calculateResult();
    }
  };

  const handlePrev = () => {
    if (currentQuestionIdx > 0) {
      setCurrentQuestionIdx(prev => prev - 1);
    }
  };

  const calculateResult = () => {
    // Initialize scores
    let damavi = 0;
    let safravi = 0;
    let balghami = 0;
    let sawdawi = 0;

    // Sum scores from questions
    Object.entries(selectedAnswers).forEach(([qIdxStr, optIdx]) => {
      const qIdx = parseInt(qIdxStr, 10);
      const question = questions[qIdx];
      const optionScores = question.scores[optIdx as 0 | 1 | 2 | 3];

      damavi += optionScores[0];
      safravi += optionScores[1];
      balghami += optionScores[2];
      sawdawi += optionScores[3];
    });

    const finalScores = { damavi, safravi, balghami, sawdawi };
    setComputedScores(finalScores);

    // Dynamic Clinical-Grade Mixed Temperaments Calculation Algorithm
    const humorsList: Array<{ id: 'damavi' | 'safravi' | 'balghami' | 'sawdawi'; score: number }> = [
      { id: 'damavi', score: damavi },
      { id: 'safravi', score: safravi },
      { id: 'balghami', score: balghami },
      { id: 'sawdawi', score: sawdawi },
    ];

    // Sort humors in descending order of their scores
    humorsList.sort((a, b) => b.score - a.score);

    const h1 = humorsList[0]; // Highest humor
    const h2 = humorsList[1]; // Second highest humor
    const h4 = humorsList[3]; // Lowest humor

    let finalKey: TemperamentKey = 'motedal';

    // 1. Check for Balanced Temperament (معتدل حقیقی)
    // If the difference between highest and lowest is extremely narrow, they are balanced!
    if (h1.score - h4.score <= 12) {
      finalKey = 'motedal';
    } 
    // 2. Check for Mixed Temperament (مزاج ترکیبی)
    // If the difference between first and second highest is narrow, they co-dominate!
    else if (h1.score - h2.score <= 12) {
      const topTwo = [h1.id, h2.id];

      if (topTwo.includes('damavi') && topTwo.includes('safravi')) {
        finalKey = 'damavi_safravi'; // Sanguine-Choleric / Hot dominant
      } else if (topTwo.includes('safravi') && topTwo.includes('sawdawi')) {
        finalKey = 'safravi_sawdawi'; // Choleric-Melancholic / Dry dominant
      } else if (topTwo.includes('balghami') && topTwo.includes('sawdawi')) {
        finalKey = 'balghami_sawdawi'; // Phlegmatic-Melancholic / Cold dominant
      } else if (topTwo.includes('damavi') && topTwo.includes('balghami')) {
        finalKey = 'damavi_balghami'; // Sanguine-Phlegmatic / Wet dominant
      } else {
        // If they are direct opposites (Sanguine/Melancholic or Choleric/Phlegmatic)
        // Opposites rarely co-dominate healthily; fallback to the primary highest
        finalKey = h1.id;
      }
    } 
    // 3. Simple Temperament (مزاج مفرده)
    else {
      finalKey = h1.id;
    }

    setCalculatedTemperamentKey(finalKey);

    // Save to history & LocalStorage
    const temperamentData = temperaments[finalKey];
    if (temperamentData) {
      const persianDate = new Date().toLocaleDateString('fa-IR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });

      const newHistoryItem: HistoryItem = {
        date: persianDate,
        title: temperamentData.title,
        icon: temperamentData.icon,
        scores: finalScores,
        temperamentKey: finalKey,
      };

      const updatedHistory = [newHistoryItem, ...history].slice(0, 10); // Keep last 10 entries
      setHistory(updatedHistory);
      try {
        localStorage.setItem('tabib_hakim_history', JSON.stringify(updatedHistory));
      } catch (e) {
        console.error("Failed to save history to localStorage:", e);
      }
    }

    setStep('result');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewHistoryItem = (index: number) => {
    const item = history[index];
    if (item) {
      setCalculatedTemperamentKey(item.temperamentKey);
      setComputedScores(item.scores);
      setStep('result');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem('tabib_hakim_history');
    } catch (e) {
      console.error(e);
    }
  };

  const handleRestart = () => {
    setStep('welcome');
    setCalculatedTemperamentKey(null);
    setCurrentQuestionIdx(0);
    setSelectedAnswers({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#FAF6F0] flex flex-col justify-between selection:bg-[#1B4332] selection:text-[#C5A880]">
      {/* Premium Application Top Header */}
      <header className="border-b border-[#E8D5BC] bg-white sticky top-0 z-40 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={handleRestart}>
            <span className="text-3xl filter drop-shadow-sm select-none">🌿</span>
            <div>
              <h1 className="text-lg font-black text-[#1B4332] tracking-tight">طبیب حکیم</h1>
              <p className="text-[10px] text-[#8B7355] font-semibold -mt-0.5">مزاج‌شناسی تخصصی طب سنتی ایرانی</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="hidden sm:flex items-center gap-1 text-[11px] text-[#1B4332] font-semibold bg-[#FAF3E0] px-3 py-1.5 rounded-full border border-[#E8D5BC]">
              <ShieldCheck className="w-4 h-4 text-[#1B4332]" />
              پایگاه داده معتبر کتب خمسه طبی
            </span>
          </div>
        </div>
      </header>

      {/* Main Dynamic View Content Container */}
      <main className="flex-1 py-8 px-4 sm:px-6">
        <AnimatePresence mode="wait">
          {step === 'welcome' && (
            <WelcomeScreen
              key="welcome"
              onStart={handleStartQuiz}
              history={history}
              onViewHistoryItem={handleViewHistoryItem}
              onClearHistory={handleClearHistory}
            />
          )}

          {step === 'quiz' && (
            <QuizScreen
              key="quiz"
              questions={questions}
              currentQuestionIdx={currentQuestionIdx}
              selectedAnswers={selectedAnswers}
              onSelectOption={handleSelectOption}
              onNext={handleNext}
              onPrev={handlePrev}
            />
          )}

          {step === 'result' && calculatedKey && (
            <ResultScreen
              key="result"
              temperamentKey={calculatedKey}
              scores={computedScores}
              onRestart={handleRestart}
            />
          )}
        </AnimatePresence>
      </main>

      {/* Premium Craft Footer */}
      <footer className="bg-white border-t border-[#E8D5BC] py-8 text-center text-xs text-[#8B7355] mt-12 space-y-3">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-semibold leading-relaxed max-w-md text-right md:text-justify text-[11px]">
            «تندرستی تاج طلایی است بر سر افراد سالم که جز بیماران کسی آن را نمی‌بیند.» 
            <span className="block text-[#1B4332] font-black mt-1">حکیم ابو علی سینا - کتاب قانون در طب</span>
          </p>
          <div className="flex items-center gap-1.5 text-[10px] font-semibold bg-[#FAF6F0] border border-[#E8D5BC] px-4 py-2 rounded-full">
            <span>حقوق مادی و معنوی برای سامانه طبیب حکیم محفوظ است</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 animate-pulse" />
          </div>
        </div>
      </footer>
    </div>
  );
}
