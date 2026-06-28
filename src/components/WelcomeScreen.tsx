import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, ClipboardList, Flame, Droplet, Wind, Trees, Play, RefreshCw, Heart, Eye } from 'lucide-react';

interface WelcomeScreenProps {
  key?: string;
  onStart: () => void;
  history: Array<{
    date: string;
    title: string;
    icon: string;
    scores: { damavi: number; safravi: number; balghami: number; sawdawi: number };
  }>;
  onViewHistoryItem: (index: number) => void;
  onClearHistory: () => void;
}

export default function WelcomeScreen({ onStart, history, onViewHistoryItem, onClearHistory }: WelcomeScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto"
    >
      {/* Hero Welcome Banner */}
      <div className="text-center py-12 px-6 bg-gradient-to-br from-[#1B4332] to-[#2D6A4F] rounded-3xl text-white shadow-xl relative overflow-hidden mb-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(197,168,128,0.2),transparent_60%)] pointer-events-none" />
        <div className="relative z-10 flex flex-col items-center">
          <motion.div 
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            className="text-6xl mb-4"
          >
            🌿
          </motion.div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-3">
            طبیب حکیم
          </h2>
          <p className="text-base sm:text-lg opacity-90 max-w-2xl font-medium leading-relaxed">
            سامانه فوق‌تخصصی مزاج‌شناسی و خودارزیابی بر اساس مبانی طب سنتی ایرانی و آموزه‌های طب اسلامی
          </p>
          <p className="text-xs sm:text-sm text-[#C5A880] mt-3 font-semibold bg-white/10 px-4 py-1.5 rounded-full border border-white/20">
            برگرفته از مکتب بو علی سینا، زکریای رازی و حکیم جرجانی
          </p>
        </div>
      </div>

      {/* Intro & Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-2xl border-2 border-[#E8D5BC] shadow-sm">
            <h3 className="text-xl font-bold text-[#1B4332] mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#C5A880]" /> چرا باید مزاج خود را بشناسیم؟
            </h3>
            <p className="text-sm text-[#4A3B32] leading-8 text-justify">
              بر اساس طب اخلاطی ایرانی، سلامت هر فرد در گرو حفظ تعادل میان چهار خلط حیاتی جسم اوست: 
              <strong className="text-[#C0392B]"> دم (خون)</strong>، 
              <strong className="text-[#D4A017]"> صفرا (زرداب)</strong>، 
              <strong className="text-[#2E86AB]"> بلغم (لمف)</strong> و 
              <strong className="text-[#5D4E60]"> سودا (ملانکولیا)</strong>. 
              سبک زندگی مدرن، آلودگی‌ها و تغذیه صنعتی این تعادل را بر هم می‌زنند. با شناخت دقیق مزاج سرشتی (مجبول) و عارضه‌ها، می‌توانید سبک زندگی، خواب، تغذیه و حتی روابط عاطفی خود را مطابق طبیعتتان تنظیم کرده و از بروز بیماری‌ها پیشگیری نمایید.
            </p>
          </div>

          {/* Core Elements Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-white rounded-xl border border-[#E8D5BC] flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-[#C0392B]/10 flex items-center justify-center text-red-600 shrink-0">
                <Wind className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#1C251F]">دَم (گرم و تر)</h4>
                <p className="text-xs text-[#8B7355] mt-1">عنصر هوا، خون‌گرم، عضلانی، خوش‌رو</p>
              </div>
            </div>

            <div className="p-4 bg-white rounded-xl border border-[#E8D5BC] flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-[#D4A017]/10 flex items-center justify-center text-amber-600 shrink-0">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#1C251F]">صفرا (گرم و خشک)</h4>
                <p className="text-xs text-[#8B7355] mt-1">عنصر آتش، تیزهوش، لاغر، پرانرژی</p>
              </div>
            </div>

            <div className="p-4 bg-white rounded-xl border border-[#E8D5BC] flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-[#2E86AB]/10 flex items-center justify-center text-sky-600 shrink-0">
                <Droplet className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#1C251F]">بلغم (سرد و تر)</h4>
                <p className="text-xs text-[#8B7355] mt-1">عنصر آب، آرام، خونسرد، چاق موضعی</p>
              </div>
            </div>

            <div className="p-4 bg-white rounded-xl border border-[#E8D5BC] flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-[#5D4E60]/10 flex items-center justify-center text-purple-800 shrink-0">
                <Trees className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#1C251F]">سودا (سرد و خشک)</h4>
                <p className="text-xs text-[#8B7355] mt-1">عنصر خاک، دقیق، منظم، متفکر، وسواسی</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Column */}
        <div className="flex flex-col gap-6">
          <div className="bg-[#FAF3E0] p-6 rounded-2xl border-2 border-[#C5A880]/40 flex flex-col items-center text-center justify-between h-full">
            <div className="space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#1B4332] text-[#C5A880] flex items-center justify-center text-2xl mx-auto shadow-md">
                <ClipboardList className="w-7 h-7" />
              </div>
              <h4 className="text-lg font-bold text-[#1B4332]">آزمون تخصصی مزاج‌شناسی</h4>
              <p className="text-xs text-[#5C4A3A] leading-6">
                پاسخ به <strong className="text-[#1B4332]">۴۰ سوال دقیق</strong> در حوزه‌های ویژگی فیزیکی، روان‌شناختی، دفعیات، خواب و اشتها برای محاسبه مزاج‌های ترکیبی و سرشتی واقعی.
              </p>
            </div>

            <button
              onClick={onStart}
              className="mt-6 w-full py-4 px-6 bg-gradient-to-r from-[#1B4332] to-[#2D6A4F] hover:from-[#132A20] hover:to-[#1B4332] text-white font-bold rounded-xl shadow-md transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer group"
            >
              <Play className="w-5 h-5 fill-white group-hover:scale-110 transition-transform" />
              شروع ارزیابی تخصصی
            </button>
          </div>
        </div>
      </div>

      {/* History Section */}
      {history.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white p-6 rounded-2xl border-2 border-[#E8D5BC] shadow-sm"
        >
          <div className="flex justify-between items-center mb-4 border-b border-[#FAF6F0] pb-3">
            <h4 className="text-base font-bold text-[#1B4332] flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-500 fill-red-500" /> سوابق مزاج‌شناسی شما
            </h4>
            <button
              onClick={onClearHistory}
              className="text-xs text-red-600 hover:text-red-800 transition-colors cursor-pointer font-semibold"
            >
              پاک کردن تاریخچه
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[220px] overflow-y-auto pr-1">
            {history.map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 bg-[#FAF6F0] rounded-xl border border-[#E8D5BC] hover:border-[#1B4332] transition-all flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <h5 className="font-bold text-xs text-[#1B4332]">{item.title}</h5>
                    <p className="text-[10px] text-[#8B7355] mt-0.5">{item.date}</p>
                  </div>
                </div>
                <button
                  onClick={() => onViewHistoryItem(idx)}
                  className="p-2 bg-white rounded-lg border border-[#E8D5BC] text-[#1B4332] hover:bg-[#1B4332] hover:text-white transition-all cursor-pointer flex items-center gap-1 text-[10px] font-bold"
                >
                  <Eye className="w-3.5 h-3.5" /> مشاهده
                </button>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
