import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Info, Utensils, BookOpen, Calendar, Leaf, Heart, Search, 
  Sparkles, Stethoscope, RotateCcw, CheckCircle2, XCircle, 
  Compass, ShieldAlert, HeartHandshake, HelpCircle, ChevronLeft, ArrowRight
} from 'lucide-react';
import { TemperamentKey, Humor } from '../types';
import { temperaments } from '../data/temperaments';
import RadarChart from './RadarChart';
import HakeemConsultation from './HakeemConsultation';

interface ResultScreenProps {
  key?: string;
  temperamentKey: TemperamentKey;
  scores: {
    damavi: number;
    safravi: number;
    balghami: number;
    sawdawi: number;
  };
  onRestart: () => void;
}

type TabType = 'overview' | 'foods' | 'recipes' | 'mealplan' | 'treatments' | 'lifestyle' | 'remedies' | 'spouse';

export default function ResultScreen({ temperamentKey, scores, onRestart }: ResultScreenProps) {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [foodType, setFoodType] = useState<'helpful' | 'harmful'>('helpful');
  const [searchQuery, setSearchQuery] = useState('');

  const data = temperaments[temperamentKey];

  if (!data) {
    return (
      <div className="text-center p-12 bg-white rounded-3xl border border-red-200">
        <p className="text-red-600 font-bold">خطا: داده‌های طبع شما یافت نشد.</p>
        <button onClick={onRestart} className="btn mt-4">شروع مجدد</button>
      </div>
    );
  }

  // Get total points for percentages
  const totalPoints = scores.damavi + scores.safravi + scores.balghami + scores.sawdawi;
  const getPercentage = (score: number) => {
    if (totalPoints === 0) return 0;
    return Math.round((score / totalPoints) * 100);
  };

  const pctDam = getPercentage(scores.damavi);
  const pctSafra = getPercentage(scores.safravi);
  const pctBalgham = getPercentage(scores.balghami);
  const pctSawda = getPercentage(scores.sawdawi);

  // Available symptoms for search
  const symptoms = Object.keys(data.remedies);

  // Filter remedies based on search query
  const filteredSymptoms = searchQuery.trim() === ''
    ? symptoms
    : symptoms.filter(s => s.toLowerCase().includes(searchQuery.toLowerCase().trim()));

  const tabItems: Array<{ id: TabType; label: string; icon: React.ReactNode }> = [
    { id: 'overview', label: 'معرفی طبع', icon: <Info className="w-4 h-4" /> },
    { id: 'foods', label: 'تغذیه', icon: <Utensils className="w-4 h-4" /> },
    { id: 'recipes', label: 'دستور پخت', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'mealplan', label: 'برنامه هفتگی', icon: <Calendar className="w-4 h-4" /> },
    { id: 'treatments', label: 'تدابیر طبیعی', icon: <Leaf className="w-4 h-4" /> },
    { id: 'lifestyle', label: 'سبک زندگی', icon: <Compass className="w-4 h-4" /> },
    { id: 'remedies', label: 'درمان عوارض', icon: <Stethoscope className="w-4 h-4" /> },
    { id: 'spouse', label: 'سازگاری ازدواج', icon: <Heart className="w-4 h-4" /> },
  ];

  // Specific background styles based on temperament for the hero card
  const getHeroBg = () => {
    switch (temperamentKey) {
      case 'damavi': return 'from-[#801313] via-[#a32222] to-[#b33636]';
      case 'safravi': return 'from-[#b38600] via-[#d4a017] to-[#e6b800]';
      case 'balghami': return 'from-[#1a5f7a] via-[#2a86ab] to-[#3ca0c5]';
      case 'sawdawi': return 'from-[#423846] via-[#5d4e60] to-[#78697b]';
      case 'damavi_safravi': return 'from-[#801313] via-[#b35013] to-[#d4a017]';
      case 'safravi_sawdawi': return 'from-[#b37013] via-[#785446] to-[#5d4e60]';
      case 'balghami_sawdawi': return 'from-[#2a6b86] via-[#4d5c66] to-[#5d4e60]';
      case 'damavi_balghami': return 'from-[#802244] via-[#526390] to-[#2e7da2]';
      default: return 'from-[#1B4332] via-[#2D6A4F] to-[#40916C]';
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Result Hero Card */}
      <div className={`relative overflow-hidden rounded-3xl text-white shadow-xl bg-gradient-to-br ${getHeroBg()} p-6 sm:p-10`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(255,255,255,0.15),transparent_50%)] pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 text-center md:text-right">
          {/* Large Icon / Avatar */}
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-white/15 backdrop-blur-md border-2 border-white/30 flex items-center justify-center text-5xl sm:text-6xl shadow-md shrink-0">
            {data.icon}
          </div>
          {/* Main Info */}
          <div className="flex-1 space-y-3">
            <span className="text-xs sm:text-sm font-bold bg-white/20 px-3 py-1 rounded-full border border-white/20 inline-block">
              تشخیص نهایی سامانه هوشمند
            </span>
            <h2 className="text-2xl sm:text-3xl font-black">{data.title}</h2>
            <p className="text-sm sm:text-base font-semibold opacity-90">{data.subtitle}</p>
            <p className="text-xs sm:text-sm opacity-85 leading-7 text-justify font-medium max-w-3xl">
              {data.desc}
            </p>
          </div>
        </div>
      </div>

      {/* Visual Analysis Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Radar Chart */}
        <RadarChart scores={scores} />

        {/* Humors Progress Breakdown */}
        <div className="bg-white p-6 rounded-3xl border-2 border-[#E8D5BC] shadow-sm space-y-5 h-full flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-bold text-[#1C251F] mb-4 flex items-center gap-1.5 border-b border-[#FAF6F0] pb-2">
              <Sparkles className="w-4 h-4 text-[#C5A880]" /> نسبت اخلاط بدنی شما (غلظت درصدی)
            </h4>
            
            <div className="space-y-4">
              {/* Sanguine */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-[#4A3B32]">
                  <span>🩸 دَموی (گرم و تر)</span>
                  <span className="font-mono text-[#C0392B]">{pctDam}%</span>
                </div>
                <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#C0392B] rounded-full" style={{ width: `${pctDam}%` }} />
                </div>
              </div>

              {/* Choleric */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-[#4A3B32]">
                  <span>🔥 صفراوی (گرم و خشک)</span>
                  <span className="font-mono text-[#D4A017]">{pctSafra}%</span>
                </div>
                <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#D4A017] rounded-full" style={{ width: `${pctSafra}%` }} />
                </div>
              </div>

              {/* Phlegmatic */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-[#4A3B32]">
                  <span>💧 بلغمی (سرد و تر)</span>
                  <span className="font-mono text-[#2E86AB]">{pctBalgham}%</span>
                </div>
                <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#2E86AB] rounded-full" style={{ width: `${pctBalgham}%` }} />
                </div>
              </div>

              {/* Melancholic */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-[#4A3B32]">
                  <span>🍂 سوداوی (سرد و خشک)</span>
                  <span className="font-mono text-[#5D4E60]">{pctSawda}%</span>
                </div>
                <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#5D4E60] rounded-full" style={{ width: `${pctSawda}%` }} />
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-[#FAF6F0] pt-4 mt-4">
            <h5 className="text-xs font-bold text-[#1B4332] mb-2">💡 کلید واژه‌های سلامت مزاج شما:</h5>
            <div className="flex flex-wrap gap-1.5">
              {data.traits.map((trait, index) => (
                <span key={index} className="text-[10px] sm:text-xs bg-[#FAF6F0] text-[#1B4332] font-semibold py-1 px-2.5 rounded-full border border-[#E8D5BC] flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#1B4332]" /> {trait}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Symptom and AI Hakeem Consultation Section */}
      <HakeemConsultation temperamentKey={temperamentKey} scores={scores} />

      {/* Tabs Menu Navigation */}
      <div className="bg-white rounded-2xl border-2 border-[#E8D5BC] shadow-sm p-2 overflow-x-auto">
        <div className="flex min-w-[700px] sm:min-w-0 md:grid md:grid-cols-8 gap-1.5">
          {tabItems.map((tab) => {
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 px-2 rounded-xl text-xs font-bold transition-all flex flex-col sm:flex-row items-center justify-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-[#1B4332] text-white shadow-md'
                    : 'text-[#5C4A3A] hover:bg-[#FAF6F0] hover:text-[#1B4332]'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Contents Area */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-[#E8D5BC] shadow-sm">
        
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex justify-between items-center border-b border-[#FAF6F0] pb-4">
              <h3 className="text-xl font-bold text-[#1B4332] flex items-center gap-2">
                <Info className="w-5 h-5 text-[#C5A880]" /> کالبدشناسی و آناتومی مزاج {data.title}
              </h3>
            </div>
            
            <p className="text-sm text-[#4A3B32] leading-8 text-justify">
              بر اساس فصول گوناگون کتاب شریف <strong>«قانون در طب»</strong> اثر رئیس‌الوزرا ابو علی سینا، خصوصیات خلقی و فیزیکی انسان بر پایه شکل‌گیری استخوان‌ها، اندام‌های تنفسی، نحوه نبض، کیفیت خواب و بیداری، و اعراض نفسانی متفاوتی طبقه‌بندی می‌گردد. در جدول زیر، آناتومی تفصیلی طبع شما تشریح شده است:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(data.deep).map(([key, value], idx) => (
                <div key={idx} className="p-4 bg-[#FAF6F0] rounded-xl border border-[#E8D5BC] space-y-1">
                  <h4 className="font-bold text-xs text-[#1B4332] flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#C5A880]" />
                    {key}
                  </h4>
                  <p className="text-xs text-[#5C4A3A] leading-7 pr-3.5">{value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FOODS TAB */}
        {activeTab === 'foods' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-[#FAF6F0] pb-4 gap-4">
              <div>
                <h3 className="text-xl font-bold text-[#1B4332] flex items-center gap-2">
                  <Utensils className="w-5 h-5 text-[#C5A880]" /> رژیم غذایی و مصلحات مفرده
                </h3>
                <p className="text-xs text-[#8B7355] mt-1 font-medium">سفارشات تغذیه‌ای طب سنتی متناسب با کانون هضم شما</p>
              </div>

              {/* Sub-tabs for Helpful vs Harmful */}
              <div className="flex bg-[#FAF6F0] p-1 rounded-xl border border-[#E8D5BC] shrink-0 w-fit">
                <button
                  onClick={() => setFoodType('helpful')}
                  className={`py-1.5 px-4 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    foodType === 'helpful'
                      ? 'bg-white text-[#1B4332] shadow-sm'
                      : 'text-gray-500 hover:text-[#1B4332]'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  مفید و موافق
                </button>
                <button
                  onClick={() => setFoodType('harmful')}
                  className={`py-1.5 px-4 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    foodType === 'harmful'
                      ? 'bg-white text-red-700 shadow-sm'
                      : 'text-gray-500 hover:text-red-700'
                  }`}
                >
                  <XCircle className="w-4 h-4 text-red-600" />
                  مضر و ناسازگار
                </button>
              </div>
            </div>

            {/* Foods Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {(foodType === 'helpful' ? data.helpful : data.harmful).map((food, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border-2 flex items-start gap-3 transition-all hover:scale-[1.01] ${
                    foodType === 'helpful'
                      ? 'bg-green-50/20 border-green-200 hover:border-green-400'
                      : 'bg-red-50/10 border-red-100 hover:border-red-300'
                  }`}
                >
                  <span className="text-2xl mt-0.5">
                    {foodType === 'helpful' ? '🍏' : '🚫'}
                  </span>
                  <div>
                    <h4 className={`font-bold text-sm ${foodType === 'helpful' ? 'text-green-800' : 'text-red-900'}`}>
                      {food.name}
                    </h4>
                    <p className="text-xs text-[#5C4A3A] mt-1 leading-6">{food.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* RECIPES TAB */}
        {activeTab === 'recipes' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="border-b border-[#FAF6F0] pb-4">
              <h3 className="text-xl font-bold text-[#1B4332] flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#C5A880]" /> دستور پخت‌های اصیل و درمانی
              </h3>
              <p className="text-xs text-[#8B7355] mt-1 font-medium">غذاهایی طبخ شده با مصلحات لازم برای حفظ تعادل اخلاط شما</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data.recipes.map((recipe, idx) => (
                <div key={idx} className="bg-[#FAF6F0] rounded-2xl border border-[#E8D5BC] overflow-hidden flex flex-col justify-between hover:border-[#1B4332] transition-all">
                  {/* Card Header */}
                  <div className="p-4 bg-gradient-to-r from-[#1B4332] to-[#2D6A4F] text-white flex justify-between items-center">
                    <div className="flex items-center gap-2.5">
                      <span className="text-3xl">{recipe.emoji}</span>
                      <div>
                        <h4 className="font-bold text-sm">{recipe.name}</h4>
                        <p className="text-[10px] text-[#C5A880] mt-0.5">زمان پخت: {recipe.time} • تعداد: {recipe.serves}</p>
                      </div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 space-y-4 text-xs">
                    {/* Ingredients */}
                    <div>
                      <h5 className="font-bold text-[#1B4332] mb-1.5 flex items-center gap-1">🌿 مواد لازم:</h5>
                      <ul className="grid grid-cols-2 gap-1 pr-3 text-[#5C4A3A]">
                        {recipe.ingredients.map((ing, i) => (
                          <li key={i} className="list-disc">{ing}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Method */}
                    <div>
                      <h5 className="font-bold text-[#1B4332] mb-1.5 flex items-center gap-1">🍳 طرز تهیه طبی:</h5>
                      <ol className="space-y-1.5 pr-4 text-[#5C4A3A] list-decimal leading-6">
                        {recipe.method.map((step, i) => (
                          <li key={i}>{step}</li>
                        ))}
                      </ol>
                    </div>

                    {/* Benefit */}
                    <div className="p-3 bg-white rounded-lg border border-[#E8D5BC] border-r-4 border-r-green-600 text-[#4A3B32] leading-6">
                      <strong>✨ تاثیر دارویی:</strong> {recipe.benefit}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MEAL PLAN TAB */}
        {activeTab === 'mealplan' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="border-b border-[#FAF6F0] pb-4">
              <h3 className="text-xl font-bold text-[#1B4332] flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#C5A880]" /> برنامه تغذیه هفتگی اختصاصی
              </h3>
              <p className="text-xs text-[#8B7355] mt-1 font-medium">برنامه غذایی روزانه معتدل به همراه مصلحات جهت پاک‌سازی کبد و گوارش</p>
            </div>

            <div className="space-y-4">
              {['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه'].map((day, idx) => {
                const meal = data.meals[idx % data.meals.length];
                return (
                  <div key={idx} className="bg-[#FAF6F0] p-4 rounded-xl border border-[#E8D5BC] hover:border-[#1B4332] transition-colors grid grid-cols-1 md:grid-cols-5 gap-3 items-center">
                    <div className="md:col-span-1 border-b md:border-b-0 md:border-l border-[#E8D5BC] pb-2 md:pb-0 md:pl-3">
                      <span className="text-sm font-black text-[#1B4332] flex items-center gap-1.5">
                        📆 {day}
                      </span>
                    </div>
                    
                    <div className="md:col-span-4 grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
                      <div className="p-2 bg-white rounded-lg border border-[#E8D5BC]/50">
                        <strong className="text-[#8B7355] block mb-0.5">🍳 صبحانه</strong>
                        <span className="text-[#1C251F] font-bold">{meal.breakfast}</span>
                      </div>
                      <div className="p-2 bg-white rounded-lg border border-[#E8D5BC]/50">
                        <strong className="text-[#8B7355] block mb-0.5">☀️ ناهار</strong>
                        <span className="text-[#1C251F] font-bold">{meal.lunch}</span>
                      </div>
                      <div className="p-2 bg-white rounded-lg border border-[#E8D5BC]/50">
                        <strong className="text-[#8B7355] block mb-0.5">🌙 شام</strong>
                        <span className="text-[#1C251F] font-bold">{meal.dinner}</span>
                      </div>
                      <div className="p-2 bg-white rounded-lg border border-[#E8D5BC]/50">
                        <strong className="text-[#8B7355] block mb-0.5">🍇 میان‌وعده</strong>
                        <span className="text-[#1C251F] font-bold">{meal.snack}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TREATMENTS TAB */}
        {activeTab === 'treatments' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="border-b border-[#FAF6F0] pb-4">
              <h3 className="text-xl font-bold text-[#1B4332] flex items-center gap-2">
                <Leaf className="w-5 h-5 text-[#C5A880]" /> تدابیر طبیعی و درمان‌های گیاهی ده‌گانه
              </h3>
              <p className="text-xs text-[#8B7355] mt-1 font-medium">کتابچه مصور درمان‌های غیردارویی، روغن‌مالی، دمنوش‌ها و رایحه‌درمانی</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Oils */}
              <div className="bg-[#FAF6F0] p-5 rounded-2xl border border-[#E8D5BC] space-y-3">
                <h4 className="text-sm font-black text-[#1B4332] flex items-center gap-1.5 border-b border-[#E8D5BC] pb-2">
                  🧴 تدابیر دهش (روغن‌مالی موضعی)
                </h4>
                <div className="space-y-2.5 text-xs">
                  {data.treatments.oils.map((o, i) => (
                    <div key={i} className="p-2.5 bg-white rounded-lg border border-[#E8D5BC]/60">
                      <strong className="text-[#1C251F]">{o.name}</strong>
                      <p className="text-[#5C4A3A] mt-1 leading-5">{o.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Teas */}
              <div className="bg-[#FAF6F0] p-5 rounded-2xl border border-[#E8D5BC] space-y-3">
                <h4 className="text-sm font-black text-[#1B4332] flex items-center gap-1.5 border-b border-[#E8D5BC] pb-2">
                  ☕ دمنوش‌ها و مفردات درمانی
                </h4>
                <div className="space-y-2.5 text-xs">
                  {data.treatments.teas.map((t, i) => (
                    <div key={i} className="p-2.5 bg-white rounded-lg border border-[#E8D5BC]/60">
                      <strong className="text-[#1C251F]">{t.name}</strong>
                      <p className="text-[#5C4A3A] mt-1 leading-5">{t.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Aromas */}
              <div className="bg-[#FAF6F0] p-5 rounded-2xl border border-[#E8D5BC] space-y-3">
                <h4 className="text-sm font-black text-[#1B4332] flex items-center gap-1.5 border-b border-[#E8D5BC] pb-2">
                  🌸 استنشاق و رایحه‌درمانی (عطریات و بخور)
                </h4>
                <div className="space-y-2.5 text-xs">
                  {data.treatments.aromas.map((a, i) => (
                    <div key={i} className="p-2.5 bg-white rounded-lg border border-[#E8D5BC]/60">
                      <strong className="text-[#1C251F]">{a.name}</strong>
                      <p className="text-[#5C4A3A] mt-1 leading-5">{a.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Seasons */}
              <div className="bg-[#FAF6F0] p-5 rounded-2xl border border-[#E8D5BC] space-y-3">
                <h4 className="text-sm font-black text-[#1B4332] flex items-center gap-1.5 border-b border-[#E8D5BC] pb-2">
                  📅 تدابیر و تغییرات فصلی
                </h4>
                <div className="space-y-2.5 text-xs">
                  {data.treatments.seasons.map((s, i) => (
                    <div key={i} className="p-2.5 bg-white rounded-lg border border-[#E8D5BC]/60">
                      <strong className="text-[#1C251F]">{s.name}</strong>
                      <p className="text-[#5C4A3A] mt-1 leading-5">{s.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* LIFESTYLE TAB */}
        {activeTab === 'lifestyle' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="border-b border-[#FAF6F0] pb-4">
              <h3 className="text-xl font-bold text-[#1B4332] flex items-center gap-2">
                <Compass className="w-5 h-5 text-[#C5A880]" /> سبک زندگی بر اساس اصول ستّه ضروریه
              </h3>
              <p className="text-xs text-[#8B7355] mt-1 font-medium">شش فاکتور حیاتی برای بقای سلامتی و کارکرد طبیعی بدن در طب سنتی</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {/* Sleep */}
              <div className="p-5 bg-[#FAF6F0] rounded-xl border border-[#E8D5BC] space-y-2">
                <h4 className="font-bold text-sm text-[#1B4332] flex items-center gap-1">🛌 خواب و بیداری</h4>
                <p className="text-xs text-[#5C4A3A] leading-6">{data.lifestyle.sleep}</p>
              </div>

              {/* Bath */}
              <div className="p-5 bg-[#FAF6F0] rounded-xl border border-[#E8D5BC] space-y-2">
                <h4 className="font-bold text-sm text-[#1B4332] flex items-center gap-1">🛁 حمام و پاک‌سازی</h4>
                <p className="text-xs text-[#5C4A3A] leading-6">{data.lifestyle.bath}</p>
              </div>

              {/* Climate */}
              <div className="p-5 bg-[#FAF6F0] rounded-xl border border-[#E8D5BC] space-y-2">
                <h4 className="font-bold text-sm text-[#1B4332] flex items-center gap-1">☁️ هوا و اقلیم مناسب</h4>
                <p className="text-xs text-[#5C4A3A] leading-6">{data.lifestyle.climate}</p>
              </div>

              {/* Clothes */}
              <div className="p-5 bg-[#FAF6F0] rounded-xl border border-[#E8D5BC] space-y-2">
                <h4 className="font-bold text-sm text-[#1B4332] flex items-center gap-1">👕 پوشاک و رنگ‌ها</h4>
                <p className="text-xs text-[#5C4A3A] leading-6">{data.lifestyle.clothes}</p>
              </div>

              {/* Mental */}
              <div className="p-5 bg-[#FAF6F0] rounded-xl border border-[#E8D5BC] space-y-2">
                <h4 className="font-bold text-sm text-[#1B4332] flex items-center gap-1">🧠 اعراض نفسانی (روح و روان)</h4>
                <p className="text-xs text-[#5C4A3A] leading-6">{data.lifestyle.mental}</p>
              </div>

              {/* Seasons */}
              <div className="p-5 bg-[#FAF6F0] rounded-xl border border-[#E8D5BC] space-y-2">
                <h4 className="font-bold text-sm text-[#1B4332] flex items-center gap-1">🍂 سازگاری با فصول</h4>
                <p className="text-xs text-[#5C4A3A] leading-6">{data.lifestyle.seasons}</p>
              </div>
            </div>
          </div>
        )}

        {/* REMEDIES (DIAGNOSIS) TAB */}
        {activeTab === 'remedies' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="border-b border-[#FAF6F0] pb-4">
              <h3 className="text-xl font-bold text-[#1B4332] flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-[#C5A880]" /> سامانه جستجوگر هوشمند درمان عوارض
              </h3>
              <p className="text-xs text-[#8B7355] mt-1 font-medium">سریعاً بیماری مدنظر خود را جستجو کرده و درمان سنتی منطبق بر مزاج خود را بیابید</p>
            </div>

            {/* Search Input */}
            <div className="relative max-w-lg">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="مثلاً: سردرد، یبوست، جوش، چاقی، افسردگی..."
                className="w-full pr-12 pl-4 py-3 bg-[#FAF6F0] border-2 border-[#E8D5BC] rounded-full text-sm focus:outline-none focus:border-[#1B4332] transition-all"
              />
            </div>

            {/* Symptoms Tags/Chips */}
            <div className="flex flex-wrap gap-2">
              {symptoms.map((symptom, idx) => (
                <button
                  key={idx}
                  onClick={() => setSearchQuery(symptom)}
                  className={`py-1.5 px-3.5 rounded-full text-xs font-bold transition-all cursor-pointer border ${
                    searchQuery === symptom
                      ? 'bg-[#1B4332] text-white border-[#1B4332]'
                      : 'bg-white text-[#5C4A3A] border-[#E8D5BC] hover:border-[#1B4332]'
                  }`}
                >
                  {symptom}
                </button>
              ))}
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="py-1.5 px-3.5 rounded-full text-xs font-bold transition-all cursor-pointer bg-red-100 text-red-700 border border-red-200 hover:bg-red-200"
                >
                  پاک کردن فیلتر ×
                </button>
              )}
            </div>

            {/* Remedies Results */}
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
              {filteredSymptoms.length > 0 ? (
                filteredSymptoms.map((symptom, idx) => {
                  const remedy = data.remedies[symptom];
                  return (
                    <div key={idx} className="p-5 bg-[#FAF6F0] rounded-2xl border-2 border-[#E8D5BC] hover:border-[#1B4332] transition-colors space-y-3">
                      <h4 className="font-black text-sm text-[#1B4332] flex items-center gap-1.5 border-b border-[#E8D5BC] pb-1.5">
                        <ShieldAlert className="w-4 h-4 text-amber-600" />
                        علت و درمان {symptom}
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        <div className="p-3 bg-white rounded-lg border border-[#E8D5BC]/50">
                          <strong className="text-[#C0392B] block mb-1">🔍 ریشه‌یابی سنتی عارضه:</strong>
                          <p className="text-[#5C4A3A] leading-6">{remedy.cause}</p>
                        </div>
                        <div className="p-3 bg-white rounded-lg border border-green-100 bg-green-50/10">
                          <strong className="text-green-700 block mb-1">🌿 دستورالعمل درمان خانگی:</strong>
                          <p className="text-[#5C4A3A] leading-6">{remedy.treatment}</p>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-10 bg-[#FAF6F0] rounded-2xl border border-dashed border-[#E8D5BC]">
                  <p className="text-xs text-[#8B7355]">عوارض یا بیماری منطبق بر جستجوی شما یافت نشد.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* SPOUSE TAB */}
        {activeTab === 'spouse' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="border-b border-[#FAF6F0] pb-4">
              <h3 className="text-xl font-bold text-[#1B4332] flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-500 fill-red-500" /> طالع‌بینی و سازگاری همسرگزینی
              </h3>
              <p className="text-xs text-[#8B7355] mt-1 font-medium">تحلیل تعادل اخلاط و ازدواج بر اساس قوانین سنتی طب ایرانی</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              {/* Left Column: Compatible Info */}
              <div className="md:col-span-2 space-y-4">
                <div className="p-5 bg-red-50/10 border-2 border-red-100 rounded-2xl space-y-2">
                  <h4 className="font-bold text-sm text-[#801313] flex items-center gap-1.5">
                    💕 سازگارترین مزاج ازدواج با شما:
                  </h4>
                  <div className="inline-block py-2 px-5 bg-gradient-to-r from-red-600 to-red-800 text-white font-bold rounded-xl text-lg shadow-sm">
                    {data.spouse}
                  </div>
                  <p className="text-xs text-[#5C4A3A] leading-7 text-justify pt-1.5">
                    در روان‌شناسی سنتی و طب‌الائمه، تطابق یا تضاد سازنده مزاجی زوج‌ها عامل بسیار مهمی در ثبات زناشویی است. همسرانی با طبع‌های متضاد (مثلاً گرم و خشک با سرد و تر، یا سرد و خشک با گرم و تر) یکدیگر را تعدیل کرده و کانون گرم خانواده را از افراط و تفریط‌های حرارتی و رفتاری نجات می‌دهند.
                  </p>
                </div>

                {/* Islamic advice */}
                <div className="p-4 bg-[#FAF6F0] rounded-xl border border-[#E8D5BC]">
                  <strong className="text-xs text-[#1B4332] block mb-1">📜 سفارش روایات طب اسلامی:</strong>
                  <p className="text-[11px] text-[#5C4A3A] leading-6 text-justify">
                    مستحب است هنگام همسرگزینی، سردی و خشکی یکی از زوجین با گرمی و تری دیگری پوشش داده شود تا فرزندانی صالح، با بهره هوشی عالی و سلامت جسمی پایدار متولد شوند.
                  </p>
                </div>
              </div>

              {/* Right Column: Compatibility indicators */}
              <div className="bg-[#FAF6F0] p-5 rounded-2xl border-2 border-[#E8D5BC] space-y-4">
                <h4 className="text-xs font-black text-[#1B4332] text-center mb-2 border-b border-[#E8D5BC] pb-2">
                  📊 درصد سازگاری عاطفی با اخلاط
                </h4>
                
                <div className="space-y-3">
                  {/* Sanguine Compatibility */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-bold text-[#4A3B32]">
                      <span>دموی‌ها (گرم و تر)</span>
                      <span className="font-mono text-[#C0392B]">{data.compatibility.damavi}%</span>
                    </div>
                    <div className="w-full h-2 bg-white rounded-full overflow-hidden">
                      <div className="h-full bg-[#C0392B]" style={{ width: `${data.compatibility.damavi}%` }} />
                    </div>
                  </div>

                  {/* Choleric Compatibility */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-bold text-[#4A3B32]">
                      <span>صفراوی‌ها (گرم و خشک)</span>
                      <span className="font-mono text-[#D4A017]">{data.compatibility.safravi}%</span>
                    </div>
                    <div className="w-full h-2 bg-white rounded-full overflow-hidden">
                      <div className="h-full bg-[#D4A017]" style={{ width: `${data.compatibility.safravi}%` }} />
                    </div>
                  </div>

                  {/* Phlegmatic Compatibility */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-bold text-[#4A3B32]">
                      <span>بلغمی‌ها (سرد و تر)</span>
                      <span className="font-mono text-[#2E86AB]">{data.compatibility.balghami}%</span>
                    </div>
                    <div className="w-full h-2 bg-white rounded-full overflow-hidden">
                      <div className="h-full bg-[#2E86AB]" style={{ width: `${data.compatibility.balghami}%` }} />
                    </div>
                  </div>

                  {/* Melancholic Compatibility */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-bold text-[#4A3B32]">
                      <span>سوداوی‌ها (سرد و خشک)</span>
                      <span className="font-mono text-[#5D4E60]">{data.compatibility.sawdawi}%</span>
                    </div>
                    <div className="w-full h-2 bg-white rounded-full overflow-hidden">
                      <div className="h-full bg-[#5D4E60]" style={{ width: `${data.compatibility.sawdawi}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Restart Section Button */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={onRestart}
          className="w-full py-4 px-6 bg-gradient-to-r from-[#1B4332] to-[#2D6A4F] hover:from-[#132A20] hover:to-[#1B4332] text-white font-bold rounded-2xl shadow-md transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
        >
          <RotateCcw className="w-5 h-5" />
          شروع آزمون ارزیابی مجدد
        </button>
      </div>
    </div>
  );
}
