import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  Check,
  Stethoscope,
  Send,
  Volume2,
  VolumeX,
  RefreshCw,
  HelpCircle,
  AlertCircle,
  CheckCircle2,
  Bookmark,
  MessageSquare,
  ArrowLeft
} from "lucide-react";
import { TemperamentKey } from "../types";

interface HakeemConsultationProps {
  temperamentKey: TemperamentKey;
  scores: {
    damavi: number;
    safravi: number;
    balghami: number;
    sawdawi: number;
  };
}

interface ChatMessage {
  role: "user" | "model";
  text: string;
}

// Map of common symptoms and their client-side traditional remedies
const SYMPTOM_DATABASE: Record<
  string,
  {
    category: string;
    remedy: string;
    moseleh: string; // Mصلح / balancer
    icon: string;
  }
> = {
  "سردرد و گرگرفتگی": {
    category: "صفراوی / دموی (حرارت بالا)",
    remedy: "پاشویه سرکه و آب ولرم، بوییدن گلاب خنک خالص، اسپری گلاب روی صورت پیش از خواب.",
    moseleh: "آلو بخارا، ماءالشعیر طبی بدون الکل، سکنجبین ملس.",
    icon: "🔥",
  },
  "بی‌خوابی و استرس": {
    category: "صفراوی / سوداوی (خشکی بالا)",
    remedy: "چکاندن ۱ قطره روغن بنفشه بادام در بینی پیش از خواب، دمنوش بادرنجبویه شیرین شده با عسل.",
    moseleh: "حریره بادام شیرین، فالوده سیب سرخ با گلاب.",
    icon: "🌙",
  },
  "ریزش مو و خشکی پوست": {
    category: "سوداوی / صفراوی (خشکی مفرط)",
    remedy: "ماساژ ملایم پوست سر با روغن بادام شیرین یا روغن نارگیل طبیعی، شستشو با لعاب کتیرا یا گل ختمی.",
    moseleh: "شیره انگور، روغن زیتون بکر، انجیر تازه.",
    icon: "🍂",
  },
  "ترش کردن و نفخ معده": {
    category: "بلغمی (بردت و رطوبت معده)",
    remedy: "جویدن مقداری نعناع خشک بعد از غذا، خوردن یک قاشق چای‌خوری عسل طبیعی بعد از وعده‌ها بدون نوشیدن آب.",
    moseleh: "چای آویشن، زیره سیاه در پلو، نمک طبیعی سنگ قبل و بعد از غذا.",
    icon: "🤢",
  },
  "کسالت صبحگاهی و ورم مفاصل": {
    category: "بلغمی / سوداوی (سردی مفاصل)",
    remedy: "ماساژ روزانه مفاصل با روغن سیاه‌دانه کوهی، خوردن ترکیب سیاه‌دانه نیم‌کوب و عسل (دوسین) ناشتا.",
    moseleh: "کشمش آفتابی، مویز سیاه، دمنوش زنجبیل.",
    icon: "❄️",
  },
  "جوش و کهیر پوستی": {
    category: "دموی / صفراوی (جوشش خون)",
    remedy: "شستشوی پوست با لعاب اسفرزه یا ماست شیرین محلی مخلوط با سدر، نوشیدن شربت کاسنی و شاه‌تره ناشتا.",
    moseleh: "آب انار ملس، آب زرشک کوهی، خاکشیر ولرم.",
    icon: "🔴",
  },
  "یبوست مزمن و بواسیر": {
    category: "سوداوی (خشکی روده)",
    remedy: "مصرف روزانه ۵ الی ۷ عدد انجیر خشک خیسانده در گلاب، مالیدن روغن زیتون روی شکم در جهت عقربه‌های ساعت.",
    moseleh: "آلو قطره‌طلا، شیر گرم محلی با ترنجبین ناشتا.",
    icon: "📦",
  },
  "تپش قلب و اضطراب سرد": {
    category: "سوداوی / بلغمی (سردی قلب)",
    remedy: "استشمام عطر گل محمدی یا یاس، نوشیدن شربت بهارنارنج یا بیدمشک همراه عسل.",
    moseleh: "فالوده سیب با هل، مربای به یا مربای بالنگ در صبحانه.",
    icon: "💓",
  },
};

const LOADING_TIPS = [
  "حکیم در حال سنجش نبض اخلاط شماست...",
  "برگ‌های شفابخش آویشن و بابونه در هاون کوبیده می‌شوند...",
  "کتاب قانون ابن‌سینا برای یافتن بهترین مصلحات ورق می‌خورد...",
  "طبیبان در حال ترکیب عصاره کاسنی و بهارنارنج هستند...",
  "حرارت غریزی و رطوبت بافتی شما در ترازوی سنجش است...",
];

export default function HakeemConsultation({ temperamentKey, scores }: HakeemConsultationProps) {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [isConsulting, setIsConsulting] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [currentInput, setCurrentInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingTip, setLoadingTip] = useState(LOADING_TIPS[0]);
  const [errorMsg, setErrorMsg] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      synthRef.current = window.speechSynthesis;
    }
    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory, isLoading]);

  // Rotate loading tips every 3 seconds
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      let idx = 0;
      interval = setInterval(() => {
        idx = (idx + 1) % LOADING_TIPS.length;
        setLoadingTip(LOADING_TIPS[idx]);
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptom) ? prev.filter((s) => s !== symptom) : [...prev, symptom]
    );
  };

  const handleStartConsultation = async () => {
    setIsConsulting(true);
    setIsLoading(true);
    setErrorMsg("");
    setChatHistory([]);
    if (synthRef.current) synthRef.current.cancel();
    setIsSpeaking(false);

    try {
      const response = await fetch("/api/consultation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          temperament: temperamentKey,
          scores,
          symptoms: selectedSymptoms,
        }),
      });

      if (!response.ok) {
        throw new Error("خطا در برقراری ارتباط با سرور مطب حکیم.");
      }

      const data = await response.json();
      setChatHistory([{ role: "model", text: data.text }]);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(
        err.message ||
          "مطب حکیم شلوغ است یا کلید ارتباطی متصل نیست. لطفاً مجدداً تلاش نمایید."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!currentInput.trim()) return;

    const userText = currentInput.trim();
    setCurrentInput("");
    setErrorMsg("");

    const updatedHistory = [...chatHistory, { role: "user" as const, text: userText }];
    setChatHistory(updatedHistory);
    setIsLoading(true);

    try {
      const response = await fetch("/api/consultation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          temperament: temperamentKey,
          scores,
          symptoms: selectedSymptoms,
          chatHistory: updatedHistory,
          userMessage: userText,
        }),
      });

      if (!response.ok) {
        throw new Error("خطا در پاسخ‌دهی حکیم.");
      }

      const data = await response.json();
      setChatHistory((prev) => [...prev, { role: "model", text: data.text }]);
    } catch (err: any) {
      console.error(err);
      setErrorMsg("حکیم در نوشتن نسخه تأمل فرمودند. لطفا دوباره پیام خود را بفرستید.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpeech = (text: string) => {
    if (!synthRef.current) return;

    if (isSpeaking) {
      synthRef.current.cancel();
      setIsSpeaking(false);
      return;
    }

    // Strip markdown formatting characters to make speech cleaner
    const cleanText = text
      .replace(/[*#`_\-]/g, "")
      .replace(/[\u200B-\u200D\uFEFF]/g, "");

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = "fa-IR"; // Persian speech synthesis
    utterance.rate = 0.85; // Slightly slower for majestic wise voice

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
    };

    utteranceRef.current = utterance;
    setIsSpeaking(true);
    synthRef.current.speak(utterance);
  };

  const resetConsultation = () => {
    setIsConsulting(false);
    setChatHistory([]);
    setErrorMsg("");
    if (synthRef.current) synthRef.current.cancel();
    setIsSpeaking(false);
  };

  return (
    <div className="bg-white rounded-3xl border-2 border-[#E8D5BC] shadow-md overflow-hidden" id="hakeem-consultation-section">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#8C6239] to-[#5C3F21] text-white p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-2xl border border-white/20">
            🌿
          </div>
          <div>
            <h3 className="text-md sm:text-lg font-black flex items-center gap-1.5">
              طبیب‌خانه اختصاصی حکیم بوعلی سینا <span className="text-[10px] bg-red-600/30 text-red-200 border border-red-500/30 px-1.5 py-0.5 rounded-md font-mono">هوشمند</span>
            </h3>
            <p className="text-xs text-[#E8D5BC] font-medium">سنجش دقیق علائم فعال و تجویز مصلحات و داروهای گیاهی سفارشی</p>
          </div>
        </div>
        {isConsulting && (
          <button
            onClick={resetConsultation}
            className="text-xs bg-white/10 hover:bg-white/20 text-white font-bold py-1.5 px-3 rounded-lg border border-white/20 flex items-center gap-1 cursor-pointer transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> بازگشت
          </button>
        )}
      </div>

      <div className="p-6">
        <AnimatePresence mode="wait">
          {!isConsulting ? (
            <motion.div
              key="setup"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6"
            >
              <div className="bg-[#FAF6F0] p-4 rounded-2xl border border-[#E8D5BC] flex gap-3 items-start">
                <AlertCircle className="w-5 h-5 text-[#8C6239] shrink-0 mt-0.5" />
                <p className="text-xs sm:text-sm text-[#5C3F21] leading-7 font-semibold text-justify">
                  <strong>دستورالعمل تشخیص عوارض:</strong> عیار هوشمندی طب سنتی در این است که بدانیم عوارض شایع بر اساس نسبت اخلاط بدن شکل می‌گیرند. لطفاً اگر در حال حاضر از هر یک از عوارض زیر رنج می‌برید، آن‌ها را علامت بزنید تا تدابیر مصلح برای شما فعال شود.
                </p>
              </div>

              {/* Symptom Selectors Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {Object.entries(SYMPTOM_DATABASE).map(([symptom, info]) => {
                  const isChecked = selectedSymptoms.includes(symptom);
                  return (
                    <button
                      key={symptom}
                      onClick={() => toggleSymptom(symptom)}
                      className={`p-4 rounded-2xl border-2 text-right transition-all flex items-start gap-3.5 cursor-pointer hover:shadow-sm ${
                        isChecked
                          ? "bg-[#FAF6F0] border-[#8C6239] text-[#5C3F21]"
                          : "bg-white border-gray-100 hover:border-gray-200 text-[#4A3B32]"
                      }`}
                    >
                      <div className="text-2xl pt-0.5">{info.icon}</div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sm sm:text-base">{symptom}</span>
                          <div
                            className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                              isChecked
                                ? "bg-[#8C6239] border-[#8C6239] text-white"
                                : "border-gray-300"
                            }`}
                          >
                            {isChecked && <Check className="w-3.5 h-3.5 stroke-[3px]" />}
                          </div>
                        </div>
                        <span className="text-[10px] sm:text-xs text-[#C5A880] font-bold block">
                          دسته عوارض: {info.category}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Instant Client-Side Remedies based on selection */}
              {selectedSymptoms.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-[#FAF6F0] p-5 rounded-2xl border-2 border-dashed border-[#C5A880] space-y-4"
                >
                  <h4 className="text-sm font-bold text-[#5C3F21] flex items-center gap-1.5 border-b border-[#E8D5BC] pb-2">
                    <Stethoscope className="w-4 h-4 text-[#8C6239]" /> تدابیر سریع‌الحکمه (توصیه‌های فوری برای عوارض انتخاب شده)
                  </h4>
                  <div className="space-y-4 divide-y divide-[#E8D5BC]/50">
                    {selectedSymptoms.map((symptom) => {
                      const info = SYMPTOM_DATABASE[symptom];
                      return (
                        <div key={symptom} className="pt-3.5 first:pt-0 space-y-1.5">
                          <span className="text-xs sm:text-sm font-black text-[#8C6239] flex items-center gap-1">
                            🔹 تدبیر عارضه {symptom}:
                          </span>
                          <p className="text-xs sm:text-sm text-[#4A3B32] leading-7 pl-4 text-justify font-semibold">
                            <strong>دستور اورژانسی:</strong> {info.remedy}
                          </p>
                          <p className="text-[11px] sm:text-xs text-green-700 leading-6 pl-4 font-bold flex items-center gap-1">
                            🌿 <span className="opacity-95">مُصلح موافق و تغذیه تعدیل‌کننده: {info.moseleh}</span>
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* Consultation Button */}
              <div className="text-center pt-2">
                <button
                  onClick={handleStartConsultation}
                  className="w-full sm:w-auto bg-[#1B4332] hover:bg-[#143224] text-white font-bold py-3.5 px-10 rounded-2xl cursor-pointer text-sm sm:text-base flex items-center justify-center gap-2 border border-green-800 shadow-md transition-all group hover:scale-[1.01]"
                >
                  <Sparkles className="w-5 h-5 text-yellow-300 group-hover:rotate-12 transition-transform" />
                  دریافت نسخه و مشاوره حکیمانه با هوش مصنوعی (حکیم بوعلی سینا)
                </button>
                <p className="text-[10px] text-gray-400 mt-2">
                  تحلیل درصدی اخلاط و عوارض انتخاب شده توسط مدل پیشرفته هوش مصنوعی طب سنتی اسلامی
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6"
            >
              {/* Ancient Manuscript Style Card */}
              <div className="bg-[#FAF6F0] rounded-2xl border-4 border-double border-[#8C6239] p-4 sm:p-7 relative min-h-[350px] flex flex-col justify-between shadow-inner">
                {/* Vintage Corner Accents */}
                <div className="absolute top-2 right-2 text-[#8C6239]/30 text-xs font-mono">﷽</div>
                <div className="absolute bottom-2 left-2 text-[#8C6239]/30 text-xs font-mono">هو الشافی</div>

                <div className="space-y-6 overflow-y-auto max-h-[500px] pr-2 custom-scrollbar flex-1 pb-4">
                  {chatHistory.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex ${
                        msg.role === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl p-4 sm:p-5 leading-8 text-justify font-semibold text-sm sm:text-base ${
                          msg.role === "user"
                            ? "bg-[#8C6239] text-white rounded-br-none shadow-sm"
                            : "bg-[#FAF6F0] text-[#1C251F] border border-[#E8D5BC]/80 rounded-bl-none relative"
                        }`}
                      >
                        {msg.role === "model" && (
                          <div className="flex items-center justify-between border-b border-[#E8D5BC] pb-2 mb-3">
                            <span className="text-xs font-black text-[#8C6239] flex items-center gap-1.5">
                              ✨ مکتوب حکیم ابوعلی سینا:
                            </span>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleSpeech(msg.text)}
                                title={isSpeaking ? "توقف خوانش صوتی" : "خوانش صوتی نسخه"}
                                className={`p-1.5 rounded-lg border cursor-pointer hover:bg-gray-100 transition-colors ${
                                  isSpeaking
                                    ? "bg-red-50 text-red-600 border-red-200"
                                    : "bg-white text-gray-600 border-gray-200"
                                }`}
                              >
                                {isSpeaking ? (
                                  <VolumeX className="w-4 h-4" />
                                ) : (
                                  <Volume2 className="w-4 h-4" />
                                )}
                              </button>
                            </div>
                          </div>
                        )}
                        <div className="whitespace-pre-line leading-8 tracking-wide font-medium">
                          {msg.text}
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Loading State with Calming Tips */}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-[#FAF6F0] border border-[#E8D5BC] rounded-2xl rounded-bl-none p-5 max-w-[85%] space-y-3">
                        <div className="flex items-center gap-2">
                          <RefreshCw className="w-4 h-4 text-[#8C6239] animate-spin" />
                          <span className="text-xs font-bold text-[#8C6239]">
                            {loadingTip}
                          </span>
                        </div>
                        <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-[#8C6239] rounded-full animate-pulse-width" style={{ width: "65%" }} />
                        </div>
                      </div>
                    </div>
                  )}

                  {errorMsg && (
                    <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl flex items-center gap-2 text-xs sm:text-sm">
                      <AlertCircle className="w-4.5 h-4.5 text-red-600 shrink-0" />
                      <div>{errorMsg}</div>
                    </div>
                  )}

                  <div ref={chatEndRef} />
                </div>

                {/* Question Input form for followups */}
                {!isLoading && (
                  <div className="border-t border-[#E8D5BC] pt-4 mt-4 flex gap-2">
                    <input
                      type="text"
                      value={currentInput}
                      onChange={(e) => setCurrentInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                      placeholder="اگر پرسش دیگری از حکیم دارید اینجا بنویسید (مثلاً: آیا حجامت برایم مناسب است؟)"
                      className="flex-1 bg-white border border-[#E8D5BC] rounded-xl px-4 py-3 text-xs sm:text-sm font-semibold text-[#1C251F] focus:outline-none focus:border-[#8C6239] placeholder:text-gray-400"
                    />
                    <button
                      onClick={handleSendMessage}
                      className="bg-[#8C6239] hover:bg-[#5C3F21] text-white p-3 rounded-xl flex items-center justify-center cursor-pointer transition-colors shrink-0 shadow-sm"
                    >
                      <Send className="w-4 h-4 rtl:rotate-180" />
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
