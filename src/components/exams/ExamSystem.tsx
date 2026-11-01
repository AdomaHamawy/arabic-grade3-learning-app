/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { playSound } from '../../services/soundEffects';
import {
  Trophy,
  CheckCircle,
  Clock,
  RotateCcw,
  Sparkles,
  BookOpen,
  Award,
  ChevronLeft,
  ChevronRight,
  FileText
} from 'lucide-react';

interface ExamQuestion {
  id: string;
  section: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

interface ExamPaper {
  id: string;
  title: string;
  period: string;
  durationMinutes: number;
  totalMarks: number;
  questions: ExamQuestion[];
}

const EXAM_PAPERS: ExamPaper[] = [
  {
    id: 'october-exam',
    title: 'امتحان شهر أكتوبر (الوحدة الأولى)',
    period: 'تقييم شهري رسمي',
    durationMinutes: 15,
    totalMarks: 20,
    questions: [
      {
        id: 'q1',
        section: 'أولاً: القراءة المتحررة',
        question: '«النَّاجِحُ رَفِيقُهُ الأَمَلُ، وَهُوَ يَعِيشُ يَوْمَهُ كَنَحْلَةِ الْعَسَلِ فِي النَّشَاطِ». مُرَادِفُ (رَفِيقُهُ):',
        options: ['صَاحِبُهُ', 'جَارُهُ', 'مُعَلِّمُهُ'],
        correct: 0,
        explanation: 'رفيق تعني صاحب وملازم.'
      },
      {
        id: 'q2',
        section: 'ثانياً: المفردات',
        question: 'مُفْرَدُ كَلِمَةِ (جُدْرَان):',
        options: ['جِدَار', 'جَدِيد', 'جَدّ'],
        correct: 0,
        explanation: 'جدار مفرد وجمعه جدران وجدر.'
      },
      {
        id: 'q3',
        section: 'ثالثاً: الأساليب والتراكيب',
        question: 'اخْتَرْ أَدَاةَ الاسْتِفْهَامِ: ..... اشْتَرَكَ مَعَكَ فِي الرِّحْلَةِ؟ - خَالِدٌ.',
        options: ['مَنْ', 'مَا', 'هَلْ'],
        correct: 0,
        explanation: 'خالد إنسان عاقل، لذا نستخدم أداة الاستفهام (مَنْ).'
      },
      {
        id: 'q4',
        section: 'رابعاً: الإملاء والوعي الصوتي',
        question: 'التَّقْطِيعُ الصَّوْتِيُّ لِكَلِمَةِ (شَمْسٌ):',
        options: ['شَمْ / سٌ', 'شَ / مْ / سٌ', 'شَمْ / سُ / نْ'],
        correct: 0,
        explanation: 'الساكن مع ما قبله (شَمْـ) + المنون (سٌ).'
      }
    ]
  },
  {
    id: 'november-exam',
    title: 'امتحان شهر نوفمبر (الوحدة الثانية)',
    period: 'تقييم شهري رسمي',
    durationMinutes: 15,
    totalMarks: 20,
    questions: [
      {
        id: 'nq1',
        section: 'أولاً: القراءة والفهم',
        question: '«مُسَاعَدَةُ الآخَرِينَ تَجْعَلُنَا نَشْعُرُ بِـ..... كَمَا أَجَابَ التَّلَامِيذُ الْمُعَلِّمَةَ».',
        options: ['السَّعَادَةِ', 'الْخَوْفِ', 'التَّعَبِ'],
        correct: 0,
        explanation: 'مساعدة الآخرين تدخل السرور والسعادة على قلوبنا.'
      },
      {
        id: 'nq2',
        section: 'ثانياً: الأساليب والتراكيب',
        question: 'اخْتَرْ أَدَاةَ النَّفْيِ: ..... تُسَافِرِ الأُسْرَةُ الصَّيْفَ الْمَاضِيَ.',
        options: ['لَمْ', 'لَنْ', 'مَا'],
        correct: 0,
        explanation: 'نفي الماضي نستخدم له أداة النفي (لَمْ).'
      },
      {
        id: 'nq3',
        section: 'ثالثاً: المفرد والمثنى',
        question: 'مُثَنَّى كَلِمَةِ (تِلْمِيذَة):',
        options: ['تِلْمِيذَتَانِ', 'تِلْمِيذَاتٌ', 'تِلْمِيذَانِ'],
        correct: 0,
        explanation: 'مثنى مؤنث بإضافة ألف ونون بعد التاء المربوطة المفتوحة: تِلْمِيذَتَانِ.'
      },
      {
        id: 'nq4',
        section: 'رابعاً: القواعد الإملائية',
        question: 'الْكَلِمَةُ الْمَكْتُوبَةُ بِتَنْوِينِ فَتْحٍ صَحِيحٍ:',
        options: ['شَجَرَةً', 'شَجَرَتًا', 'شَجَرَةَن'],
        correct: 0,
        explanation: 'تنتهي بتاء مربوطة، فلا تزاد ألف بعد التاء.'
      }
    ]
  },
  {
    id: 'final-exam',
    title: 'الامتحان الشامل لنهاية الفصل الدراسي الأول (100 درجة)',
    period: 'اختبار نهاية الترم المعتمد',
    durationMinutes: 25,
    totalMarks: 100,
    questions: [
      {
        id: 'fq1',
        section: 'المحور الأول: نصوص القراءة والاستماع',
        question: 'صَنَعَ الْمِصْرِيُّونَ الْقُدَمَاءُ وَرَقَ الْبَرْدِيِّ مِنْ نَبَاتٍ يَنْمُو بِجَانِبِ:',
        options: ['نَهْرِ النِّيلِ', 'الصَّحْرَاءِ', 'الْبَحْرِ'],
        correct: 0,
        explanation: 'ورق البردي كان هدية النيل وحضارة مصر القديمة للعالم.'
      },
      {
        id: 'fq2',
        section: 'المحور الثاني: المعجم اللغوي والمترادفات',
        question: 'مَعْنَى كَلِمَةِ (يَصُونُ) فِي نَشِيدِ أسرار النجاح:',
        options: ['يَحْفَظُ', 'يُضَيِّعُ', 'يَتْرُكُ'],
        correct: 0,
        explanation: 'يصون وقته تعني يحفظه ويدير ساعاته بحكمة.'
      },
      {
        id: 'fq3',
        section: 'المحور الثالث: أدوات الاستفهام والأساليب',
        question: 'اخْتَرْ أَدَاةَ الاسْتِفْهَامِ: ..... كَانَ النَّاسُ يَكْتُبُونَ قَبْلَ اخْتِرَاعِ الْوَرَقِ؟',
        options: ['كَيْفَ', 'مَنْ', 'هَلْ'],
        correct: 0,
        explanation: 'السؤال عن الحال والطريقة نستخدم له (كَيْفَ).'
      },
      {
        id: 'fq4',
        section: 'المحور الرابع: حروف الجر والعطف',
        question: 'وَقَفَ الْعُصْفُورُ ..... الْغُصْنِ، ثُمَّ طَارَ سَرِيعًا.',
        options: ['عَلَى', 'عَنْ', 'إِلَى'],
        correct: 0,
        explanation: 'الاستعلاء فوق الغصن نستخدم معه (عَلَى).'
      },
      {
        id: 'fq5',
        section: 'المحور الخامس: القواعد الإملائية والتاء والهاء',
        question: 'اخْتَرْ كَلِمَةً تَنْتَهِي بِهَاءٍ مَرْبُوطَةٍ (ـه / ه):',
        options: ['مِيَاه', 'فَتَاة', 'بَيْت'],
        correct: 0,
        explanation: 'مياه تنطق هاءً وصلاً ووقفاً، لذا تنتهي بهاء.'
      }
    ]
  }
];

export const ExamSystem: React.FC = () => {
  const { progress, addStars, addXP, triggerCelebration } = useApp();
  const [selectedExamId, setSelectedExamId] = useState<string>(EXAM_PAPERS[0].id);
  const [inExam, setInExam] = useState(false);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [examSubmitted, setExamSubmitted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);

  const activeExam = EXAM_PAPERS.find((e) => e.id === selectedExamId) || EXAM_PAPERS[0];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (inExam && !examSubmitted && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);
    } else if (inExam && !examSubmitted && timeRemaining === 0) {
      handleSubmitExam();
    }
    return () => clearInterval(interval);
  }, [inExam, examSubmitted, timeRemaining]);

  const handleStartExam = () => {
    playSound.click();
    setUserAnswers({});
    setExamSubmitted(false);
    setTimeRemaining(activeExam.durationMinutes * 60);
    setInExam(true);
  };

  const handleSelectAnswer = (qId: string, optIdx: number) => {
    playSound.click();
    setUserAnswers((prev) => ({ ...prev, [qId]: optIdx }));
  };

  const handleSubmitExam = () => {
    playSound.click();
    setExamSubmitted(true);
    setInExam(false);

    // Calculate score
    const correctCount = activeExam.questions.filter((q) => userAnswers[q.id] === q.correct).length;
    const finalScore = Math.round((correctCount / activeExam.questions.length) * activeExam.totalMarks);

    if (finalScore >= activeExam.totalMarks * 0.7) {
      triggerCelebration();
      addStars(10);
      addXP(100);
    } else {
      playSound.success();
      addStars(5);
      addXP(50);
    }
  };

  const correctCount = activeExam.questions.filter((q) => userAnswers[q.id] === q.correct).length;
  const finalScore = Math.round((correctCount / activeExam.questions.length) * activeExam.totalMarks);
  const percentage = Math.round((correctCount / activeExam.questions.length) * 100);

  const formatMinutes = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-800 rounded-3xl p-6 md:p-8 text-white shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black text-3xl shadow-md">
              📝
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black">امْتِحَانَاتِي الدَّوْرِيَّةُ وَالشَّامِلَةُ</h1>
              <p className="text-emerald-200 text-sm md:text-base font-medium mt-1">
                نماذج امتحانات شهرية وامتحان نهاية الترم بنظام البوكليت والتصحيح الدقيق
              </p>
            </div>
          </div>
        </div>
      </div>

      {!inExam && !examSubmitted && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {EXAM_PAPERS.map((exam) => (
            <div
              key={exam.id}
              className="bg-white rounded-3xl p-6 border-2 border-emerald-100 hover:border-emerald-500 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-full">
                    {exam.period}
                  </span>
                  <span className="text-xs text-slate-500 font-semibold flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {exam.durationMinutes} دقيقة
                  </span>
                </div>

                <h3 className="font-black text-lg text-emerald-950 mb-2">{exam.title}</h3>
                <p className="text-slate-600 text-xs font-semibold mb-4">
                  مجموع الدرجات: {exam.totalMarks} درجة · عدد الأسئلة: {exam.questions.length} أسئلة
                </p>
              </div>

              <button
                onClick={() => {
                  setSelectedExamId(exam.id);
                  handleStartExam();
                }}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-3 rounded-2xl transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
              >
                <span>بدء الامتحان الآن</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Active Exam Running */}
      {inExam && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border-2 border-emerald-200 shadow-md space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b-2 border-emerald-100">
            <div>
              <h2 className="text-xl md:text-2xl font-black text-emerald-950">{activeExam.title}</h2>
              <span className="text-xs text-slate-500 font-semibold">
                أجب عن جميع الأسئلة ثم اضغط تسليم الامتحان
              </span>
            </div>

            <div className="flex items-center gap-2 bg-amber-100 text-amber-950 px-4 py-2 rounded-2xl font-black text-base border border-amber-300">
              <Clock className="w-5 h-5 text-amber-600 animate-pulse" />
              <span>الوقت المتبقي: {formatMinutes(timeRemaining)}</span>
            </div>
          </div>

          <div className="space-y-6">
            {activeExam.questions.map((q, idx) => {
              const selectedChoice = userAnswers[q.id];
              return (
                <div key={q.id} className="p-5 rounded-2xl border-2 border-emerald-100 bg-emerald-50/20 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold bg-emerald-200 text-emerald-900 px-2.5 py-0.5 rounded-full">
                      {q.section}
                    </span>
                  </div>
                  <p className="font-bold text-slate-900 text-base md:text-lg">
                    {idx + 1}. {q.question}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {q.options.map((opt, optIdx) => {
                      const isChosen = selectedChoice === optIdx;
                      return (
                        <button
                          key={optIdx}
                          onClick={() => handleSelectAnswer(q.id, optIdx)}
                          className={`p-3.5 rounded-xl font-bold text-sm md:text-base transition-all cursor-pointer border-2 ${
                            isChosen
                              ? 'bg-emerald-600 text-white border-emerald-700 shadow-md scale-102 font-black'
                              : 'bg-white hover:bg-emerald-100 text-slate-800 border-emerald-200'
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-4 flex items-center justify-end">
            <button
              onClick={handleSubmitExam}
              disabled={Object.keys(userAnswers).length === 0}
              className="bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-black text-base px-8 py-3.5 rounded-2xl shadow-lg cursor-pointer transition-transform hover:scale-105"
            >
              تسليم ورقة الإجابة والحصول على النتيجة 🏁
            </button>
          </div>
        </div>
      )}

      {/* Exam Result Report Card */}
      {examSubmitted && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border-2 border-emerald-200 shadow-lg space-y-6 text-center">
          <div className="w-20 h-20 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-black text-4xl mx-auto shadow-md">
            🎓
          </div>

          <div>
            <h2 className="text-2xl md:text-3xl font-black text-emerald-950 mb-1">
              نتيجة {activeExam.title}
            </h2>
            <p className="text-sm text-slate-500 font-bold">
              التلميذ المتميز: {progress.childName} (الصف الثالث الابتدائي)
            </p>
          </div>

          <div className="max-w-md mx-auto p-6 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-3xl border-2 border-emerald-300 space-y-3">
            <div className="text-4xl font-black text-emerald-800">
              {finalScore} / {activeExam.totalMarks}
            </div>
            <div className="text-base font-extrabold text-emerald-950">
              النسبة المئوية: {percentage}% ({percentage >= 85 ? 'ممتاز مرتفع 🌟' : percentage >= 70 ? 'جيد جداً 👍' : 'ناجح ومجتهد 🌱'})
            </div>
            <div className="text-xs text-slate-600">
              عدد الإجابات الصحيحة: {correctCount} من {activeExam.questions.length} أسئلة
            </div>
          </div>

          {/* Question Breakdown and Review */}
          <div className="text-right space-y-4 pt-4 border-t-2 border-emerald-100">
            <h3 className="font-black text-lg text-emerald-950">مراجعة نموذج الإجابة وتفسير الأسئلة:</h3>
            <div className="space-y-3">
              {activeExam.questions.map((q, idx) => {
                const userChoice = userAnswers[q.id];
                const isCorrect = userChoice === q.correct;
                return (
                  <div
                    key={q.id}
                    className={`p-4 rounded-xl border-2 text-right ${
                      isCorrect ? 'bg-emerald-50 border-emerald-300' : 'bg-amber-50 border-amber-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {isCorrect ? (
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <span className="text-amber-600 font-bold">⚠️</span>
                      )}
                      <p className="font-bold text-slate-900 text-sm md:text-base">
                        {idx + 1}. {q.question}
                      </p>
                    </div>
                    <p className="text-xs text-slate-700 font-semibold mr-6">
                      الإجابة الصحيحة: «{q.options[q.correct]}» — {q.explanation}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 flex items-center justify-center gap-4">
            <button
              onClick={() => {
                setExamSubmitted(false);
                setInExam(false);
              }}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 py-3 rounded-2xl cursor-pointer"
            >
              العودة لقائمة الامتحانات
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
