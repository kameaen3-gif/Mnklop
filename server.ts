import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

// Set up express middlewares
app.use(express.json());

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// Offline Hakeem Avicenna Style Generator for robust fallback during model rate limits/downtime
function generateOfflineHakeemResponse(
  temperament: string,
  pctDam: number,
  pctSafra: number,
  pctBalgham: number,
  pctSawda: number,
  symptoms: string[],
  userMessage?: string
): string {
  let text = `یاهو. من حکیم ابوعلی سینا هستم. فرزندم، به علت تراکم شدید مراجعین در مطب ماوراءالطبیعه یا اختلال موقت در پیوند کیهانی، این نسخه طلایی را بر اساس دانش طبی و تجربی دیرینه خود، منطبق با ترازوی دقیق اخلاط شما مکتوب می‌کنم تا از بهداشت و عافیت محروم نمانید.\n\n`;

  text += `🟢 **تحلیل طبع و موازنه اخلاط چهارگانه:**\n`;
  text += `طبع و مزاج غالب تشخیصی شما **${temperament}** است. ترازوی دقیق سنجش اخلاط در کالبد شما بدین قرار است:\n`;
  text += `- خلط دم (گرم و تر): ${pctDam}٪\n`;
  text += `- خلط صفرا (گرم و خشک): ${pctSafra}٪\n`;
  text += `- خلط بلغم (سرد و تر): ${pctBalgham}٪\n`;
  text += `- خلط سودا (سرد و خشک): ${pctSawda}٪\n\n`;

  // Provide high-quality custom humor advice
  const maxHumorVal = Math.max(pctDam, pctSafra, pctBalgham, pctSawda);
  if (maxHumorVal === pctDam) {
    text += `عروق شما مالامال از غلبه خلط دم (دموی) است. حرارت و رطوبت غریزی بالا، خون را به جوشش و غلیان درآورده است. شما نیازمند تسکین حرارت خون با مصلحات ملس، میوه‌های خنک و پرهیز شدید از پرخوری و گوشت قرمز مفرط هستید.\n\n`;
  } else if (maxHumorVal === pctSafra) {
    text += `خلط صفرا (گرم و خشک) در بدن شما غلبه یافته است. کبد آتشی مزاج گشته و خشکی بر اعضا سایه افکنده است. مصلح شما شربت‌های لعاب‌دار، عرق کاسنی، خاکشیر ولرم و پرهیز کامل از ادویه‌های تند و تیز است.\n\n`;
  } else if (maxHumorVal === pctBalgham) {
    text += `خلط بلغم (سرد و تر) در زوایای معده و مفاصل شما رسوب کرده است. برودت (سردی) و رطوبت زائد، جریان قوای محرکه را کند ساخته و سستی پدید آورده است. مصرف گرمی‌های لطیف چون عسل مصفا و آویشن کوهی برای شما فرض است.\n\n`;
  } else {
    text += `خلط سودا (سرد و خشک) در عمق اندام‌های شما چیره گشته است. این سوء مزاج سوداوی سبب غلظت خون، خشکی پوست و هجوم افکار مشوش و سرد می‌شود. مصلح شما شربت سکنجبین عسلی، روغن‌مالی‌های مرطوب چون بابونه و بنفشه، و مصرف شیره انگور است.\n\n`;
  }

  if (symptoms && symptoms.length > 0) {
    text += `🔴 **بررسی بالینی علائم فعلی بیمار:**\n`;
    symptoms.forEach((sym) => {
      text += `- **عارضه ${sym}:**\n`;
      if (sym.includes("سردرد") || sym.includes("گرگرفتگی")) {
        text += `  * علت سنتی: صعود بخارات سوداوی یا صفراوی گرم به ام‌الدماغ (مغز).\n  * دستور حکیم: پاشویه با مخلوط سرکه طبیعی انگور و آب ولرم؛ بوییدن مداوم گلاب خنک ناب؛ مالیدن اسانس گشنیز به شقیقه‌ها.\n`;
      } else if (sym.includes("بی‌خوابی") || sym.includes("استرس")) {
        text += `  * علت سنتی: غلبه خشکی و برودت بر مغز که آرامش را می‌رباید.\n  * دستور حکیم: مالیدن ۲ قطره روغن بنفشه بادام به ملاج سر پیش از خواب؛ نوشیدن یک فنجان دمنوش بادرنجبویه یا بهارنارنج شیرین شده با عسل.\n`;
      } else if (sym.includes("ریزش") || sym.includes("پوست")) {
        text += `  * علت سنتی: ضعف رطوبت غریزی پوست و رسوب سودای خشک.\n  * دستور حکیم: ماساژ ملایم ریشه موها با روغن بادام شیرین یا روغن کدو قبل از حمام؛ شستشوی سر با لعاب ختمی سفید.\n`;
      } else if (sym.includes("ترش") || sym.includes("نفخ")) {
        text += `  * علت سنتی: ضعف هاضمه ناشی از رطوبت و برودت زائد معده.\n  * دستور حکیم: جویدن چند دانه انیسون یا زنیان بعد از غذا؛ مصرف یک قاشق عسل خالص بدون آب بلافاصله پس از غذا.\n`;
      } else if (sym.includes("کسالت") || sym.includes("ورم")) {
        text += `  * علت سنتی: تجمع رطوبت غلیظ بلغمی در بافت مفاصل.\n  * دستور حکیم: دمنوش آویشن و دارچین روزانه؛ ماساژ موضعی مفاصل با روغن سیاه‌دانه کوهی خالص؛ پرهیز شدید از لبنیات بدون مصلح.\n`;
      } else if (sym.includes("جوش") || sym.includes("کهیر")) {
        text += `  * علت سنتی: غلیان دم و صفرا در کبد و خروج آن از مسامات پوست.\n  * دستور حکیم: نوشیدن عرق کاسنی و شاه‌تره ناشتا؛ مالیدن سدر محلی مخلوط با ماست ترش به موضع جوش‌ها جهت فرو نشاندن التهاب.\n`;
      } else if (sym.includes("یبوست") || sym.includes("بواسیر")) {
        text += `  * علت سنتی: سوء مزاج سوداوی خشکی روده بزرگ.\n  * دستور حکیم: مصرف روزانه ۵ تا ۷ عدد انجیر خیسانده در گلاب؛ مالیدن روغن زیتون بکر بر شکم در جهت عقربه‌های ساعت دور ناف.\n`;
      } else if (sym.includes("تپش") || sym.includes("اضطراب")) {
        text += `  * علت سنتی: برودت و ضعف حرارت غریزی در عضله قلب.\n  * دستور حکیم: استشمام مدام عطر سیب سرخ یا عطر محمدی؛ شربت جلاب طبی (زعفران، بهارنارنج و گلاب با عسل) به تدریج نوشیده شود.\n`;
      } else {
        text += `  * دستور حکیم: رعایت آداب صحیح غذا خوردن و اصلاح تدابیر سته ضروریه.\n`;
      }
    });
    text += `\n`;
  }

  text += `🧉 **نسخه طلایی و تدابیر تغذیه‌ای موافق:**\n`;
  text += `۱. **ممنوعات کلوخی:** پرهیز کامل از آب یخ در بین غذا، درهم‌خوری، سس‌های فرنگی، فست‌فودهای سودازا، و نان‌های فاقد سبوس.\n`;
  text += `۲. **قانون مصلحات:** سردی‌ها را همیشه با مصلح گرم (زیره، آویشن، زنجبیل یا عسل) و گرمی‌ها را با مصلح سرد (کاهو، سکنجبین یا لیموترش) هماهنگ فرمایید.\n`;
  text += `۳. **معجون تقویت قوا:** دمنوش بابونه شیرازی و بادرنجبویه به همراه چند قطره آبلیمو و یک قاشق مرباخوری عسل را روزانه عصرگاه میل کنید.\n\n`;

  text += `🚶‍♂️ **تدابیر غیرتغذیه (سبک زندگی و اعمال یداوی):**\n`;
  text += `- **زمان خواب:** حتماً قبل از ساعت ده شب به بالین روید تا خلط صالح دم در جگر و طحال تشکیل شود.\n`;
  text += `- **حرکت و ریاضت:** روزانه حداقل بیست دقیقه پیاده‌روی سریع تا مرز عرق کردن برای گداختن اخلاط ردیه لازم است.\n`;
  text += `- **روان و روح:** بوییدن عطر یاس رازقی یا محمدی مغز را گرم و قوی ساخته و خیالات سرد و افکار سوداوی را از شما دور می‌سازد.\n\n`;

  if (userMessage) {
    text += `💬 **پاسخ به سوال خاص شما ("${userMessage}"):**\n`;
    text += `فرزندم، سوال شریف شما را به گوش جان شنیدم. برای رسیدن به پاسخ کامل در این خصوص، بدان که اصل نخست بر صلح اخلاط و پاکسازی بدن است. در باب پرسش شما، اگر در پی مصلحات یا اعمال یداوی (مانند حجامت یا روغن‌مالی) هستید، در صورت عدم غلبه شدید سردی و بلغم، حجامت عام در فصل بهار و پاییز بسیار سودمند است؛ اما اگر بدنتان سرد است ابتدا باید با گرمی‌بخش‌ها بدن را آماده کنید. همواره بر طریق اعتدال گام بردارید که شفادهنده حقیقی ذات پاک یزدان است.`;
  } else {
    text += `شفا از آنِ پروردگار است و طبیب تنها خادم و وسیله است. تندرست و در پناه حق پایدار باشی، فرزندم.`;
  }

  return text;
}

// Hakeem AI Consultation Endpoint
app.post("/api/consultation", async (req, res) => {
  const { temperament, scores, symptoms, chatHistory, userMessage } = req.body;

  if (!temperament || !scores) {
    return res.status(400).json({ error: "اطلاعات مزاج و امتیازات ارسال نشده است." });
  }

  const { damavi, safravi, balghami, sawdawi } = scores;
  const total = damavi + safravi + balghami + sawdawi || 1;
  const pctDam = Math.round((damavi / total) * 100);
  const pctSafra = Math.round((safravi / total) * 100);
  const pctBalgham = Math.round((balghami / total) * 100);
  const pctSawda = Math.round((sawdawi / total) * 100);

  const symptomListText = symptoms && symptoms.length > 0 
    ? symptoms.map((s: string) => ` - ${s}`).join("\n") 
    : "هیچ علامت خاصی ذکر نشده است.";

  // Construct Avicenna System Prompt
  const systemInstruction = `شما "حکیم ابوعلی سینا" بزرگترین پزشک و فیلسوف جهان اسلام و سرآمد طب سنتی ایرانی-اسلامی هستید. 
رسالت شما این است که مراجعین را با لحن بسیار مودبانه، متین، دلسوزانه، حکیمانه و سنتی راهنمایی کنید. 
در گفتار خود از کلمات زیبای طب سنتی مانند "یاهو"، "فرزندم"، "نبض"، "اخلاط صالح"، "حرارت غریزی"، "سوء مزاج"، "تدابیر" و غیره استفاده کنید. 
مخاطب شما یک مراجعه‌کننده است که مزاج او را با سنجش دقیق مشخص کرده‌ایم. اطلاعات مزاجی او بدین شرح است:
مزاج غالب تشخیصی: ${temperament}
امتیازات اخلاط:
- دموی (گرم و تر): ${pctDam}٪
- صفراوی (گرم و خشک): ${pctSafra}٪
- بلغمی (سرد و تر): ${pctBalgham}٪
- سوداوی (سرد و خشک): ${pctSawda}٪

علائم بالینی فعلی بیمار (که هم اکنون از آنها رنج می‌برد):
${symptomListText}

وظیفه شما:
۱. تحلیل حکیمانه: به بیمار بگویید وضعیت اخلاط او چگونه است و چرا این علائم فعلی با طبع او ارتباط مستقیم دارد (مثلا چرا خارش پوست از غلبه دم یا صفرا است، یا چرا نفخ معده از بردت و رطوبت معده ناشی از بلغم است).
۲. تدابیر تغذیه‌ای (غذاهای موافق و مصلحات): دقیقاً مشخص کنید چه غذاهایی را باید ترک کند و چه چاشنی‌ها یا غذاهایی برای او معجزه می‌کند.
۳. نسخه شفابخش گیاهی: یک یا دو دمنوش یا ترکیب گیاهی بسیار ساده و کاربردی با دستور تهیه سنتی (مانند سرکنگبین، دوسین، دمنوش بادرنجبویه یا کاسنی) تجویز کنید.
۴. تدابیر غیرتغذیه‌ای (سبک زندگی و اعمال یداوی): توصیه‌هایی درباره خواب شبانه، حمام، ورزش، روغن‌مالی اعضا، یا حجامت در صورت نیاز بدهید.

نکات بسیار مهم در پاسخ‌دهی:
- از به کار بردن واژگان فرنگی یا پزشکی مدرن غربی مانند "کورتون"، "ویتامین"، "هورمون" یا "آنتی‌بیوتیک" خودداری کنید و به جای آن از مفاهیم سنتی مانند "تقویت قوا"، "دفع اخلاط ردیه"، "تعدیل حرارت" و "رطوبت‌بخشی" استفاده کنید.
- ساختار متن پاسخ باید بسیار منسجم، با عنوان‌بندی‌های سنتی و ظاهری آراسته باشد.
- لحن شما باید آرامش‌بخش، امیددهنده و شفابخش باشد.`;

  // Format chat history for Gemini
  const contents = [];
  if (chatHistory && chatHistory.length > 0) {
    for (const msg of chatHistory) {
      contents.push({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.text }],
      });
    }
  }

  // Append the current message
  let prompt = "";
  if (userMessage) {
    prompt = userMessage;
  } else {
    prompt = `یا حکیم بزرگ، من با مزاج تشخیصی و علائم فوق خدمت شما رسیده‌ام. لطفاً نسخه حکیمانه و تدابیر درمانی مرا بفرمایید و مرا راهنمایی کنید.`;
  }

  contents.push({
    role: "user",
    parts: [{ text: prompt }],
  });

  if (!process.env.GEMINI_API_KEY) {
    const offlineText = generateOfflineHakeemResponse(temperament, pctDam, pctSafra, pctBalgham, pctSawda, symptoms, userMessage);
    return res.json({ text: offlineText });
  }

  // Attempt to call Gemini API with robust candidate models fallback
  const modelCandidates = ["gemini-2.5-flash", "gemini-1.5-flash", "gemini-3.5-flash"];
  let apiResponseText = "";
  let success = false;

  for (const modelName of modelCandidates) {
    try {
      console.log(`[Tabib Hakeem] Contacting Gemini API with model: ${modelName}`);
      const response = await ai.models.generateContent({
        model: modelName,
        contents,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      if (response && response.text) {
        apiResponseText = response.text;
        success = true;
        console.log(`[Tabib Hakeem] API successfully responded using model ${modelName}`);
        break;
      }
    } catch (apiErr: any) {
      console.error(`[Tabib Hakeem] Model ${modelName} threw error:`, apiErr.message || apiErr);
    }
  }

  if (success && apiResponseText) {
    return res.json({ text: apiResponseText });
  }

  // If all models failed (e.g. 503 Service Unavailable), fallback to the intelligent traditional generator
  console.log("[Tabib Hakeem] All API model attempts failed or rate-limited. Serving offline traditional fallback advice.");
  const robustFallbackText = generateOfflineHakeemResponse(temperament, pctDam, pctSafra, pctBalgham, pctSawda, symptoms, userMessage);
  return res.json({ text: robustFallbackText });
});

// Configure Vite middleware in development, static hosting in production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Tabib Hakeem] Server is booting on http://localhost:${PORT}`);
  });
}

startServer();
