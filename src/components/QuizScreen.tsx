import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ChevronLeft, ArrowLeft, Check } from 'lucide-react';
import { Question } from '../types';

interface QuizScreenProps {
  key?: string;
  questions: Question[];
  currentQuestionIdx: number;
  selectedAnswers: Record<number, number>;
  onSelectOption: (optionIdx: number) => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function QuizScreen({
  questions,
  currentQuestionIdx,
  selectedAnswers,
  onSelectOption,
  onNext,
  onPrev,
}: QuizScreenProps) {
  const currentQuestion = questions[currentQuestionIdx];
  const progressPercent = ((currentQuestionIdx + 1) / questions.length) * 100;
  const isAnswered = selectedAnswers[currentQuestionIdx] !== undefined;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-3xl mx-auto"
    >
      {/* Sticky Progress Indicator Header */}
      <div className="bg-white p-5 rounded-2xl border-2 border-[#E8D5BC] shadow-sm mb-6 sticky top-4 z-20">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-[#1B4332] text-white flex items-center justify-center font-bold text-sm">
              {currentQuestionIdx + 1}
            </span>
            <span className="text-sm font-bold text-[#1B4332]">
              سوال {currentQuestionIdx + 1} از {questions.length}
            </span>
          </div>
          <span className="text-xs font-semibold px-3 py-1 bg-[#FAF3E0] text-[#1B4332] rounded-full border border-[#E8D5BC]">
            {currentQuestion.category}
          </span>
        </div>

        {/* Progress bar background */}
        <div className="w-full h-2 bg-[#FAF6F0] rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-[#C5A880] to-[#1B4332]"
          />
        </div>
      </div>

      {/* Question Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestionIdx}
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 15 }}
          transition={{ duration: 0.3 }}
          className="bg-white p-6 sm:p-8 rounded-2xl border-2 border-[#E8D5BC] shadow-md mb-6"
        >
          {/* Question Text */}
          <h3 className="text-lg sm:text-xl font-bold text-[#1C251F] leading-9 mb-6 border-r-4 border-[#C5A880] pr-3">
            {currentQuestion.q}
          </h3>

          {/* Options list */}
          <div className="space-y-3.5">
            {currentQuestion.opts.map((option, idx) => {
              const isSelected = selectedAnswers[currentQuestionIdx] === idx;
              return (
                <label
                  key={idx}
                  onClick={() => onSelectOption(idx)}
                  className={`group relative flex items-center gap-3.5 p-4 sm:p-5 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                    isSelected
                      ? 'bg-gradient-to-l from-white to-[#FAF6F0] border-[#1B4332] shadow-sm'
                      : 'bg-white border-[#E8D5BC] hover:border-[#C5A880] hover:bg-[#FAF6F0]/50 hover:translate-x-[-2px]'
                  }`}
                >
                  {/* Styled Checklist Circle */}
                  <div
                    className={`w-5.5 h-5.5 rounded-full flex items-center justify-center border-2 transition-all shrink-0 ${
                      isSelected
                        ? 'border-[#1B4332] bg-[#1B4332] text-white scale-110'
                        : 'border-[#E8D5BC] bg-white text-transparent group-hover:border-[#C5A880]'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>

                  {/* Option Text */}
                  <span
                    className={`text-sm sm:text-base leading-7 transition-colors ${
                      isSelected ? 'font-bold text-[#1B4332]' : 'text-[#4A3B32]'
                    }`}
                  >
                    {option}
                  </span>
                </label>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Footer Buttons */}
      <div className="flex justify-between gap-4">
        <button
          onClick={onPrev}
          disabled={currentQuestionIdx === 0}
          className="flex-1 py-3 px-4 bg-white hover:bg-[#FAF6F0] disabled:bg-[#FAF6F0]/50 disabled:text-gray-300 border-2 border-[#E8D5BC] text-[#1B4332] font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:cursor-not-allowed text-sm"
        >
          <ChevronRight className="w-4 h-4" />
          سوال قبلی
        </button>

        <button
          onClick={onNext}
          disabled={!isAnswered}
          className={`flex-1 py-3 px-4 font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer text-sm ${
            isAnswered
              ? 'bg-gradient-to-r from-[#1B4332] to-[#2D6A4F] hover:from-[#132A20] hover:to-[#1B4332] text-white shadow-md hover:-translate-y-0.5'
              : 'bg-gray-200 border-2 border-gray-300 text-gray-400 cursor-not-allowed'
          }`}
        >
          {currentQuestionIdx === questions.length - 1 ? (
            <>
              محاسبه مزاج نهایی
              <Check className="w-4 h-4" />
            </>
          ) : (
            <>
              سوال بعدی
              <ChevronLeft className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}
