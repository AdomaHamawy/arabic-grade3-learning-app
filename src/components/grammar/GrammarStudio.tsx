/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { playSound, speakArabic, stopSpeaking } from '../../services/soundEffects';
import { useApp } from '../../context/AppContext';
import { Sparkles, BookOpen, Volume2, VolumeX, CheckCircle2, ArrowRightLeft, Layers, PenTool, HelpCircle } from 'lucide-react';

interface GrammarTopic {
  id: string;
  title: string;
  category: 'أساليب وتراكيب' | 'قواعد إملائية';
  icon: string;
  summary: string;
  interactiveChallenge: {
    instruction: string;
    items: {
      question: string;
      options: string[];
      correct: number;
      explanation: string;
    }[];
  };
}

const GRAMMAR_TOPICS: GrammarTopic[] = [
  {
    id: 'question-tools',
    title: 'أدوات الاستفهام (مَنْ - مَا - هَلْ - لِمَاذَا)',
    category: 'أساليب وتراكيب',
    icon: '❓',
    summary: '• (مَنْ): للسؤال عن العاقل (الإنسان).\n• (مَا): للسؤال عن غير العاقل.\n• (هَلْ): الإجابة عنها بنعم أو لا.\n• (لِمَاذَا): للسؤال عن السبب وتعلل الإجابة بـ (لأنّ / لـِ).',
    interactiveChallenge: {
      instruction: 'اختر أداة الاستفهام الصحيحة لكل جملة:',
      items: [
        {
          question: '..... تُحِبِّينَ السِّبَاحَةَ يَا هِنْدُ؟ - نَعَمْ، أُحِبُّ السِّبَاحَةَ.',
          options: ['مَنْ', 'هَلْ', 'مَا', 'لِمَاذَا'],
          correct: 1,
          explanation: 'لأن الإجابة بدأت بـ (نَعَمْ)، فالأداة الصحيحة هي (هَلْ).'
        },
        {
          question: '..... تَجْلِسُ أَمَامَ الْحَاسُوبِ؟ - لأَبْحَثَ عَنْ مَعْلُومَاتٍ.',
          options: ['مَنْ', 'هَلْ', 'مَا', 'لِمَاذَا'],
          correct: 3,
          explanation: 'لأن الجواب يوضح السبب والعلة (لأبحث..)، فالأداة هي (لِمَاذَا).'
        },
        {
          question: '..... يُشَاهِدُ الْمُبَارَاةَ الآنَ؟ - يُوسُفُ يُشَاهِدُهَا.',
          options: ['مَنْ', 'هَلْ', 'مَا', 'لِمَاذَا'],
          correct: 0,
          explanation: 'يوسف إنسان عاقل، لذا نسأل عنه بـ (مَنْ).'
        }
      ]
    }
  },
  {
    id: 'demonstrative-pronouns',
    title: 'أسماء الإشارة للجمع (هَؤُلَاءِ - أُولَئِكَ)',
    category: 'أساليب وتراكيب',
    icon: '👉',
    summary: '• (هَؤُلَاءِ): اسم إشارة للجمع العاقل (القريب منا).\n• (أُولَئِكَ): اسم إشارة للجمع العاقل (البعيد عنا).\n• تذكّر: لغير العاقل نستخدم دائماً (هَذِهِ) مثل: هَذِهِ أَشْجَارٌ، هَذِهِ كُتُبٌ.',
    interactiveChallenge: {
      instruction: 'اختر اسم الإشارة المناسب:',
      items: [
        {
          question: '..... التَّلَامِيذُ الَّذِينَ بِجَانِبِي فِي الْفَصْلِ.',
          options: ['هَؤُلَاءِ', 'أُولَئِكَ', 'هَذَا'],
          correct: 0,
          explanation: 'التلاميذ بجانبي (قريبون)، لذا نستخدم (هَؤُلَاءِ).'
        },
        {
          question: '..... الْمُسَافِرُونَ الْبَعِيدُونَ قُرْبَ قِمَّةِ الْجَبَلِ.',
          options: ['هَؤُلَاءِ', 'أُولَئِكَ', 'هَذِهِ'],
          correct: 1,
          explanation: 'المسافرون في مكان بعيد، لذا نستخدم (أُولَئِكَ).'
        }
      ]
    }
  },
  {
    id: 'syllables-phonics',
    title: 'تحليل الكلمات إلى مقاطع صوتية',
    category: 'قواعد إملائية',
    icon: '✂️',
    summary: '• الحرف المتحرك مقطع بمفرده (سَـ).\n• الحرف الساكن مع ما قبله (مِلْـ).\n• حرف المد مع الممدود قبله (كِـ / ـتَا / بٌ).\n• الحرف المشدد يفك إلى حرفين: الأول ساكن والثاني متحرك (قِطْ / طَ / ةٌ).',
    interactiveChallenge: {
      instruction: 'حدد التقطيع الصوتي الصحيح للكلمة:',
      items: [
        {
          question: 'الْمَقَاطِعُ الصَّوْتِيَّةُ الصَّحِيحَةُ لِكَلِمَةِ (عُصْفُورٌ):',
          options: ['عُصْ / فُو / رٌ', 'عُ / صْ / فُ / و / رٌ', 'عُصْفُ / ورٌ'],
          correct: 0,
          explanation: 'عُصْ (ساكن مع ما قبله) + فُو (مد مع ممدود) + رٌ (منون).'
        },
        {
          question: 'الْمَقَاطِعُ الصَّوْتِيَّةُ لِكَلِمَةِ (مُعَلِّمٌ):',
          options: ['مُ / عَلْ / لِ / مٌ', 'مُ / عَ / لِّ / مٌ', 'مُعَلْ / لِمٌ'],
          correct: 0,
          explanation: 'اللام مشددة تفك إلى ساكن (عَلْ) ومتحرك (لِ).'
        }
      ]
    }
  },
  {
    id: 'singular-dual-plural',
    title: 'المفرد والمثنى والجمع',
    category: 'أساليب وتراكيب',
    icon: '👥',
    summary: '• الْمُفْرَدُ: ما دل على واحد أو واحدة (قَلَمٌ / تِلْمِيذَةٌ).\n• الْمُثَنَّى: ما دل على اثنين أو اثنتين بزيادة ألف ونون أو ياء ونون (قَلَمَانِ / تِلْمِيذَتَانِ).\n• الْجَمْعُ: ما دل على أكثر من اثنين أو اثنتين (أَقْلَامٌ / تِلْمِيذَاتٌ / مُعَلِّمُونَ).',
    interactiveChallenge: {
      instruction: 'حدد نوع الاسم أو صيغته الصحيحة:',
      items: [
        {
          question: 'حَوِّلْ كَلِمَةَ (زُجَاجَة) إِلَى مُثَنَّى:',
          options: ['زُجَاجَتَانِ', 'زُجَاجَاتٌ', 'زُجَاجٌ'],
          correct: 0,
          explanation: 'مثنى زجاجة هو زُجَاجَتَانِ (بإضافة تانِ).'
        },
        {
          question: 'تَصْنِيفُ كَلِمَةِ (أَطْفَالٌ):',
          options: ['مُفْرَد', 'مُثَنَّى', 'جَمْع'],
          correct: 2,
          explanation: 'أطفال جمع ومفردها طفل.'
        }
      ]
    }
  },
  {
    id: 'negation-style',
    title: 'أسلوب النفي (لَمْ - لَنْ)',
    category: 'أساليب وتراكيب',
    icon: '⛔',
    summary: '• (لَمْ): تدخل على الفعل المضارع وتنفيه في الزمن الماضي (أمس، الأسبوع الماضي، قبل ذلك).\n• (لَنْ): تدخل على الفعل المضارع وتنفيه في المستقبل (غداً، الأسبوع القادم، بعد اليوم).',
    interactiveChallenge: {
      instruction: 'اختر أداة النفي المناسبة للزمن:',
      items: [
        {
          question: '..... أَذْهَبْ إِلَى النَّادِي أَمْسِ.',
          options: ['لَمْ', 'لَنْ', 'لَا'],
          correct: 0,
          explanation: 'الحدث في الماضي بكلمة (أَمْسِ)، لذا نستخدم (لَمْ).'
        },
        {
          question: '..... أُلْقِيَ الْقُمَامَةَ فِي الشَّارِعِ بَعْدَ الْيَوْمِ.',
          options: ['لَنْ', 'لَمْ', 'مَا'],
          correct: 0,
          explanation: 'النفي للمستقبل بكلمة (بَعْدَ الْيَوْمِ)، لذا نستخدم (لَنْ).'
        }
      ]
    }
  },
  {
    id: 'tanween-rules',
    title: 'التنوين (بالضم، بالفتح، بالكسر)',
    category: 'قواعد إملائية',
    icon: '🔔',
    summary: '• التنوين نون ساكنة تلحق آخر الاسم تنطق ولا تكتب.\n• تنوين الضم (ـٌ)، تنوين الكسر (ـٍ).\n• تنوين الفتح (ـً) نضع بعده ألفاً مثل: كِتَابًا، إِلَّا مع التاء المربوطة (شَجَرَةً) فلا نضع ألفاً.',
    interactiveChallenge: {
      instruction: 'اختر الكلمة المنونة بالشكل الصحيح:',
      items: [
        {
          question: 'التَّنْوِينُ بِالْفَتْحِ الصَّحِيحُ لِكَلِمَةِ (كُرَّاسَة):',
          options: ['كُرَّاسَةً', 'كُرَّاسَتًا', 'كُرَّاسَةَن'],
          correct: 0,
          explanation: 'التاء المربوطة تحمل تنوين الفتح فوقها دون زيادة ألف.'
        },
        {
          question: 'التَّنْوِينُ بِالْفَتْحِ لِكَلِمَةِ (قَلَم):',
          options: ['قَلَمًا', 'قَلَمً', 'قَلَمُن'],
          correct: 0,
          explanation: 'تزاد ألف تنوين الفتح بعد الميم: قَلَمًا.'
        }
      ]
    }
  },
  {
    id: 'prepositions-conjunctions',
    title: 'حروف الجر وحروف العطف',
    category: 'أساليب وتراكيب',
    icon: '🔗',
    summary: '• حروف الجر: (عَنْ) للبحث والمجاوزة، (عَلَى) للاستعلاء، (فِي) للظرفية، (مِنْ) و (إِلَى).\n• حروف العطف: (وَ) للمشاركة معاً، (فـَ) للترتيب والسرعة فَوْرًا، (ثُمَّ) للترتيب مع التراخي ومرور وقت، (أَوْ) للتخيير.',
    interactiveChallenge: {
      instruction: 'اختر الحرف المناسب للسياق:',
      items: [
        {
          question: 'وَقَعَ الْكُوبُ الزُّجَاجِيُّ ..... انْكَسَرَ سَرِيعًا.',
          options: ['فـَ', 'ثُمَّ', 'أَوْ'],
          correct: 0,
          explanation: 'الفاء تفيد الترتيب والسرعة الفورية للكسر.'
        },
        {
          question: 'يَبْنِي الْعُصْفُورُ عُشَّهُ ..... غُصْنِ الشَّجَرَةِ.',
          options: ['عَلَى', 'عَنْ', 'فِي'],
          correct: 0,
          explanation: 'على الغصن تدل على الاستعلاء والاستقرار فوقه.'
        }
      ]
    }
  },
  {
    id: 'ta-marbuta-open-ha',
    title: 'التاء المفتوحة والتاء المربوطة والهاء',
    category: 'قواعد إملائية',
    icon: '🌸',
    summary: '• التاء المفتوحة (ت): تنطق تاءً عند الوقف والوصل (بَيْتْ - بَيْتُ).\n• التاء المربوطة (ة / ـة): تنطق هاءً عند الوقف وتاءً عند الوصل (سَمَكَةْ - سَمَكَةُ الْبَحْرِ).\n• الهاء (ه / ـه): تنطق هاءً في الوقف والوصل (مِيَاهْ - مِيَاهُ النَّهْرِ).',
    interactiveChallenge: {
      instruction: 'حدد الحرف الأخير الصحيح:',
      items: [
        {
          question: 'نَشْرَبُ ..... عَذْبَةً نَقِيَّةً:',
          options: ['مِيَاهَ', 'مِيَاةَ', 'مِيَاتَ'],
          correct: 0,
          explanation: 'تنطق هاءً وصلاً ووقفاً (مياه)، لذا تكتب هاءً.'
        },
        {
          question: 'قَرَأْتُ قِصَّـ..... جَمِيلَةً:',
          options: ['ـةَ', 'ـتَ', 'ـهَ'],
          correct: 0,
          explanation: 'تنطق هاء عند الوقف (قِصَّهْ) وتاء عند الوصل (قِصَّةَ)، إذن تاء مربوطة.'
        }
      ]
    }
  }
];

export const GrammarStudio: React.FC = () => {
  const { progress, addStars, addXP, toggleAutoplay } = useApp();
  const [selectedTopicId, setSelectedTopicId] = useState(GRAMMAR_TOPICS[0].id);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [feedback, setFeedback] = useState<Record<string, { isCorrect: boolean; text: string }>>({});
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [activeQuestionAudio, setActiveQuestionAudio] = useState<string | null>(null);

  const activeTopic = GRAMMAR_TOPICS.find((t) => t.id === selectedTopicId) || GRAMMAR_TOPICS[0];

  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, []);

  const handleSpeakRule = (topic: GrammarTopic) => {
    playSound.click();
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
      return;
    }
    setIsSpeaking(true);
    speakArabic(topic.summary, {
      voiceType: 'male_teacher',
      onStart: () => setIsSpeaking(true),
      onEnd: () => setIsSpeaking(false),
    });
  };

  const handleSelectTopic = (topic: GrammarTopic) => {
    playSound.click();
    stopSpeaking();
    setIsSpeaking(false);
    setSelectedTopicId(topic.id);
  };

  const handleSpeakQuestion = (key: string, text: string) => {
    if (activeQuestionAudio === key) {
      stopSpeaking();
      setActiveQuestionAudio(null);
      return;
    }
    playSound.click();
    setActiveQuestionAudio(key);
    speakArabic(text, {
      voiceType: 'male_teacher',
      onStart: () => setActiveQuestionAudio(key),
      onEnd: () => setActiveQuestionAudio(null),
    });
  };

  const handleSelectOption = (itemIdx: number, optionIdx: number) => {
    playSound.click();
    const item = activeTopic.interactiveChallenge.items[itemIdx];
    const isCorrect = optionIdx === item.correct;

    const answerKey = `${activeTopic.id}-${itemIdx}`;
    setUserAnswers((prev) => ({ ...prev, [answerKey]: optionIdx }));

    if (isCorrect) {
      playSound.success();
      addStars(2);
      addXP(20);
      setFeedback((prev) => ({
        ...prev,
        [answerKey]: { isCorrect: true, text: `أحسنت! ${item.explanation}` }
      }));
    } else {
      playSound.tryAgain();
      setFeedback((prev) => ({
        ...prev,
        [answerKey]: { isCorrect: false, text: `حاول مرة أخرى: ${item.explanation}` }
      }));
    }
  };

  return (
    <div className="space-y-8">
      {/* Studio Header */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-800 rounded-3xl p-6 md:p-8 text-white shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black text-3xl shadow-md">
              🎓
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black">مختبر القواعد والأساليب والإملاء</h1>
              <p className="text-emerald-200 text-sm md:text-base font-medium mt-1">
                شرح مبسط وتطبيقات تفاعلية ذكية لجميع قواعد الفصل الدراسي الأول
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              playSound.click();
              toggleAutoplay();
            }}
            className={`text-xs md:text-sm px-4 py-2.5 rounded-2xl font-black transition-all cursor-pointer border flex items-center gap-2 ${
              progress.autoplayAudio
                ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md'
                : 'bg-emerald-950/70 text-emerald-200 border-emerald-600'
            }`}
          >
            <Volume2 className="w-4 h-4" />
            <span>{progress.autoplayAudio ? '🔊 التشغيل التلقائي: مُفَعَّل' : '🔇 التشغيل التلقائي: يدوي'}</span>
          </button>
        </div>
      </div>

      {/* Grid of Grammar Topics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {GRAMMAR_TOPICS.map((topic) => {
          const isSelected = topic.id === activeTopic.id;
          return (
            <button
              key={topic.id}
              onClick={() => handleSelectTopic(topic)}
              className={`p-4 rounded-2xl text-right border-2 transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-emerald-700 text-white border-emerald-800 shadow-md ring-4 ring-emerald-200'
                  : 'bg-white hover:bg-emerald-50 text-slate-800 border-emerald-200'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">{topic.icon}</span>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                  isSelected ? 'bg-emerald-800 text-emerald-100' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {topic.category}
                </span>
              </div>
              <h3 className="font-extrabold text-sm line-clamp-2">
                {topic.title}
              </h3>
            </button>
          );
        })}
      </div>

      {/* Active Topic Detailed Card */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border-2 border-emerald-100 shadow-sm space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b-2 border-emerald-100">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{activeTopic.icon}</span>
            <div>
              <h2 className="text-xl md:text-2xl font-black text-emerald-950">{activeTopic.title}</h2>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 inline-block mt-1">
                {activeTopic.category}
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              if (isSpeaking) {
                stopSpeaking();
                setIsSpeaking(false);
              } else {
                handleSpeakRule(activeTopic);
              }
            }}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs md:text-sm font-black transition-all cursor-pointer shadow-md ${
              isSpeaking
                ? 'bg-amber-400 text-slate-950 animate-pulse ring-4 ring-amber-200'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            {isSpeaking ? <VolumeX className="w-5 h-5 text-slate-950" /> : <Volume2 className="w-5 h-5" />}
            <span>{isSpeaking ? 'يتم الشرح الصوتي الآن (اضغط للإيقاف) ⏹️' : 'استمع لشرح القاعدة بصوت المعلم 🎙️'}</span>
          </button>
        </div>

        {/* Rule Summary Box */}
        <div className={`p-6 rounded-2xl border-2 transition-all space-y-2 ${
          isSpeaking
            ? 'bg-emerald-100/80 border-emerald-500 shadow-sm ring-2 ring-emerald-300'
            : 'bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200'
        }`}>
          <div className="flex items-center justify-between">
            <h3 className="font-black text-emerald-900 text-base flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span>القَاعِدَةُ اللُّغَوِيَّةُ الْمُيَسَّرَةُ:</span>
            </h3>
            {isSpeaking && (
              <span className="text-xs font-black bg-emerald-600 text-white px-3 py-1 rounded-full animate-pulse">
                صوت المعلم يعمل الآن... 🔊
              </span>
            )}
          </div>
          <p className="text-slate-900 font-bold text-base md:text-lg leading-relaxed whitespace-pre-line">
            {activeTopic.summary}
          </p>
        </div>

        {/* Interactive Challenge Section */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-emerald-950 text-lg flex items-center gap-2">
              <span>🎯</span>
              <span>{activeTopic.interactiveChallenge.instruction}</span>
            </h3>
            <span className="text-xs bg-amber-100 text-amber-900 font-bold px-3 py-1 rounded-full">
              تطبيق فوري
            </span>
          </div>

          <div className="space-y-5">
            {activeTopic.interactiveChallenge.items.map((item, itemIdx) => {
              const answerKey = `${activeTopic.id}-${itemIdx}`;
              const selectedOpt = userAnswers[answerKey];
              const fb = feedback[answerKey];
              const isQuestionPlaying = activeQuestionAudio === answerKey;

              return (
                <div key={itemIdx} className="p-5 rounded-2xl border-2 border-emerald-100 bg-emerald-50/20 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <p className="font-bold text-slate-900 text-base md:text-lg">
                      {itemIdx + 1}. {item.question}
                    </p>
                    <button
                      onClick={() => handleSpeakQuestion(answerKey, `${item.question}. الخيارات هي: ${item.options.join('، أو ')}`)}
                      className={`p-2 rounded-xl shrink-0 transition-all cursor-pointer ${
                        isQuestionPlaying
                          ? 'bg-amber-400 text-slate-950 font-black animate-pulse'
                          : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                      }`}
                      title="استمع للسؤال وخياراته"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {item.options.map((opt, optIdx) => {
                      const isChosen = selectedOpt === optIdx;
                      let btnStyle = 'bg-white border-2 border-emerald-200 hover:border-emerald-500 text-slate-800';

                      if (selectedOpt !== undefined) {
                        if (optIdx === item.correct) {
                          btnStyle = 'bg-emerald-600 text-white border-2 border-emerald-700 font-black shadow-md';
                        } else if (isChosen) {
                          btnStyle = 'bg-red-100 text-red-800 border-2 border-red-300';
                        } else {
                          btnStyle = 'bg-slate-50 text-slate-400 border-slate-200 opacity-60';
                        }
                      }

                      return (
                        <button
                          key={optIdx}
                          onClick={() => handleSelectOption(itemIdx, optIdx)}
                          className={`p-3 rounded-xl font-bold text-sm md:text-base transition-all cursor-pointer ${btnStyle}`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>

                  {fb && (
                    <div
                      className={`p-3 rounded-xl text-xs md:text-sm font-bold flex items-center gap-2 ${
                        fb.isCorrect
                          ? 'bg-emerald-100 text-emerald-950 border border-emerald-300'
                          : 'bg-amber-100 text-amber-950 border border-amber-300'
                      }`}
                    >
                      {fb.isCorrect ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : (
                        <HelpCircle className="w-4 h-4 text-amber-600 shrink-0" />
                      )}
                      <span>{fb.text}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
