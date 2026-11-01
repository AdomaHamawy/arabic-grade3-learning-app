/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CURRICULUM_UNITS } from '../../data/curriculumData';
import { useApp } from '../../context/AppContext';
import { playSound } from '../../services/soundEffects';
import {
  FileCheck,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  BookOpen,
  Calendar,
  Sparkles,
  ClipboardList,
  Home,
  CheckSquare,
  Award
} from 'lucide-react';

interface AssessmentTask {
  id: string;
  type: 'classroom' | 'homework' | 'unit_eval';
  unitTitle: string;
  title: string;
  instruction: string;
  objectiveQuestions: {
    id: string;
    question: string;
    options: string[];
    correct: number;
    explanation: string;
  }[];
  subjectiveQuestion?: {
    prompt: string;
    modelAnswer: string;
    rubricHint: string;
  };
}

const ASSESSMENT_TASKS: AssessmentTask[] = [
  {
    id: 'eval-u1-class',
    type: 'classroom',
    unitTitle: 'الوحدة الأولى: العمل والأمل',
    title: 'الأداء الصفي – الأسبوع الأول والثاني',
    instruction: 'أجب عن أسئلة التطبيق الصفي المباشر لتقييم فهمك لدروس العمل والأمل:',
    objectiveQuestions: [
      {
        id: 'q1',
        question: 'مَعْنَى كَلِمَةِ (جِدَار):',
        options: ['حَائِط', 'بَاب', 'شُبَّاك'],
        correct: 0,
        explanation: 'جدار تعني حائط، وجمعها جدران أو جدر.'
      },
      {
        id: 'q2',
        question: 'اخْتَرْ أَدَاةَ الاسْتِفْهَامِ الْمُنَاسِبَةَ: ..... رَأْيُكَ فِي هَذِهِ الْفِكْرَةِ؟',
        options: ['مَا', 'مَنْ', 'هَلْ'],
        correct: 0,
        explanation: 'الرأي غير عاقل، لذا نستخدم معه أداة الاستفهام (مَا).'
      },
      {
        id: 'q3',
        question: 'اخْتَرْ اسْمَ الإِشَارَةِ لِلْجَمْعِ الْبَعِيدِ: ..... فَلَّاحُونَ نَشِيطُونَ قُرْبَ الْجَبَلِ.',
        options: ['أُولَئِكَ', 'هَؤُلَاءِ', 'هَذَانِ'],
        correct: 0,
        explanation: 'الفلاحون جمع عاقل في مكان بعيد، لذا نستخدم (أُولَئِكَ).'
      }
    ],
    subjectiveQuestion: {
      prompt: 'كَيْفَ تُعَبِّرُ عَنْ تَقْدِيرِكَ لِدَوْرِ (الْعَمِّ أَمِينٍ) حَارِسِ الْمَدْرَسَةِ؟',
      modelAnswer: 'نُعَبِّرُ عَنْ تَقْدِيرِنَا بِإِلْقَاءِ التَّحِيَّةِ وَالابْتِسَامَةِ فِي وَجْهِهِ كُلَّ صَبَاحٍ، وَالْحِفَاظِ عَلَى نَظَافَةِ فِنَاءِ الْمَدْرَسَةِ، وَكِتَابَةِ بِطَاقَةِ شُكْرٍ لَهُ عَلَى إِخْلَاصِهِ.',
      rubricHint: 'معيار التقييم: إظهار الأدب والاحترام والحرص على النظافة والشكر الصادق.'
    }
  },
  {
    id: 'eval-u1-home',
    type: 'homework',
    unitTitle: 'الوحدة الأولى: العمل والأمل',
    title: 'الأداء المنزلي والواجب الأسبوعي',
    instruction: 'تدريبات منزلية لتعزيز الإملاء والوعي الصوتي والقراءة التعبيرية:',
    objectiveQuestions: [
      {
        id: 'hq1',
        question: 'حَلِّلْ كَلِمَةَ (مِلْحٌ) إِلَى مَقَاطِعَ صَوْتِيَّةٍ:',
        options: ['مِلْ / حٌ', 'مِ / لْ / حٌ', 'مِ / لْحٌ'],
        correct: 0,
        explanation: 'الحرف الساكن (اللَّام) يُنْطَقُ مَعَ الْحَرْفِ الْمُتَحَرِّكِ قَبْلَهُ (مِلْـ).'
      },
      {
        id: 'hq2',
        question: 'مُضَادُّ كَلِمَةِ (الأَمَل):',
        options: ['الْيَأْس', 'الْخَوْف', 'الْحُزْن'],
        correct: 0,
        explanation: 'الأمل يقابله ويضاده اليأس والقنوط.'
      }
    ],
    subjectiveQuestion: {
      prompt: 'احْكِ لِزُمَلائِكَ مَوْقِفًا وَاجَهْتَ فِيهِ صُعُوبَةً، وَكَيْفَ كَرَّرْتَ الْمُحَاوَلَةَ حَتَّى نَجَحْتَ؟',
      modelAnswer: 'عِنْدَمَا كُنْتُ أَتَعَلَّمُ رُكُوبَ الدَّرَّاجَةِ، سَقَطْتُ فِي الْمَرَّةِ الأُولَى وَخِفْتُ، لَكِنَّ أَبِي شَجَّعَنِي وَقَالَ: «كَرِّرِ الْمُحَاوَلَةَ»، فَتَدَرَّبْتُ كُلَّ مَسَاءٍ حَتَّى أَتْقَنْتُ رُكُوبَهَا بِمَهَارَةٍ.',
      rubricHint: 'معيار التقييم: وضوح الفكرة وتسلسل الأحداث واستخدام لغة سليمة ومعبرة عن الإصرار.'
    }
  },
  {
    id: 'eval-u2-class',
    type: 'classroom',
    unitTitle: 'الوحدة الثانية: صفاتي الجميلة',
    title: 'الأداء الصفي – قيم المساعدة والشجاعة',
    instruction: 'أسئلة حول المفرد والمثنى وأسلوب النفي والتنوين:',
    objectiveQuestions: [
      {
        id: 'u2q1',
        question: 'حَوِّلْ إِلَى الْمُثَنَّى: (الْفَتَاةُ هَادِئَةٌ):',
        options: ['الْفَتَاتَانِ هَادِئَتَانِ', 'الْفَتَيَاتُ هَادِئَاتٌ', 'الْفَتَاةُ هَادِئَةٌ'],
        correct: 0,
        explanation: 'مثنى مؤنث بإضافة ألف ونون: الْفَتَاتَانِ هَادِئَتَانِ.'
      },
      {
        id: 'u2q2',
        question: 'اخْتَرْ أَدَاةَ النَّفْيِ: ..... يَسْقُطِ الْمَطَرُ أَمْسِ.',
        options: ['لَمْ', 'لَنْ', 'لَا'],
        correct: 0,
        explanation: '(لَمْ) تنفي حدوث الفعل في الزمن الماضي (أمس).'
      },
      {
        id: 'u2q3',
        question: 'اخْتَرْ الْكَلِمَةَ الْمُنَوَّنَةَ بِالْفَتْحِ كِتَابَةً صَحِيحَةً:',
        options: ['قَرِيبًا', 'قَرِيبً', 'قَرِيبُن'],
        correct: 0,
        explanation: 'تزاد ألف تنوين الفتح بعد الباء: قَرِيبًا.'
      }
    ],
    subjectiveQuestion: {
      prompt: 'مَاذَا تَفْعَلُ إِذَا طَلَبَ مِنْكَ مُعَلِّمُكَ أَنْ تُشَارِكَ فِي حَلِّ مَسْأَلَةٍ أَمَامَ زُمَلَائِكَ؟',
      modelAnswer: 'أَرْفَعُ يَدِي بِشَجَاعَةٍ وَأَتَوَجَّهُ إِلَى السَّبُّورَةِ، وَأُحَاوِلُ الْحَلَّ خَطْوَةً بِخَطْوَةٍ دُونَ خَوْفٍ مِنَ الْخَطَأِ؛ لأَنَّ الْمُحَاوَلَةَ هِيَ طَرِيقُ التَّعَلُّمِ.',
      rubricHint: 'معيار التقييم: إظهار الثقة بالنفس، الرغبة في المحاولة، وتطبيق ما تعلمناه من قصة إيمان.'
    }
  },
  {
    id: 'eval-u3-unit',
    type: 'unit_eval',
    unitTitle: 'الوحدة الثالثة: أحب بلدي',
    title: 'التقييم الشامل لنهاية الوحدة الثالثة',
    instruction: 'تقييم مدرسي متكامل على نصوص الاستماع والقراءة وحروف الجر والعطف والتاء والهاء:',
    objectiveQuestions: [
      {
        id: 'u3q1',
        question: 'صَنَعَ الْمِصْرِيُّونَ الْقُدَمَاءُ وَرَقَ الْبَرْدِيِّ مِنْ نَبَاتٍ يَنْمُو بِجِوَارِ:',
        options: ['نَهْرِ النِّيلِ', 'الْبَحْرِ الأَحْمَرِ', 'الصَّحْرَاءِ الْجَافَّةِ'],
        correct: 0,
        explanation: 'نبات البردي المصري ينمو في تربة وادي النيل الرطبة.'
      },
      {
        id: 'u3q2',
        question: 'حَرْفُ الْعَطْفِ الَّذِي يُفِيدُ التَّرْتِيبَ وَالسُّرْعَةَ هُوَ:',
        options: ['فـَ', 'ثُمَّ', 'وَ', 'أَوْ'],
        correct: 0,
        explanation: 'الفاء تفيد الترتيب والسرعة (وَقَعَ الْكُوبُ فَانْكَسَرَ).'
      },
      {
        id: 'u3q3',
        question: 'اخْتَرْ حَرْفَ الْجَرِّ الْمُنَاسِبَ: حَكَى صَدِيقِي ..... مُغَامَرَاتِهِ فِي الرِّحْلَةِ.',
        options: ['عَنْ', 'عَلَى', 'إِلَى'],
        correct: 0,
        explanation: 'حكى عن موضوع، لذا نستخدم حرف الجر (عَنْ).'
      }
    ],
    subjectiveQuestion: {
      prompt: 'كَيْفَ تُعَبِّرُ بِالأَفْعَالِ عَنْ حُبِّكَ لِوَطَنِكَ مِصْرَ كَمَا تَعَلَّمْتَ مِنْ قِصَّةِ آدَمَ؟',
      modelAnswer: 'أُعَبِّرُ عَنْ حُبِّي لِمِصْرَ بِالْمُحَافَظَةِ عَلَى نَظَافَةِ الشَّارِعِ وَالْمَدْرَسَةِ، وَعَدَمِ الرَّسْمِ عَلَى الْجُدْرَانِ، وَمُعَامَلَةِ زُوَّارِ مِصْرَ بِحُبٍّ وَاحْتِرَامٍ، وَالتَّفَوُّقِ فِي دِرَاسَتِي لأُسَاهِمَ فِي بِنَائِهَا.',
      rubricHint: 'معيار التقييم: ذكر أفعال وسلوكيات عملية تعكس الانتماء الحقيقي والمسؤولية.'
    }
  }
];

export const AssessmentBook: React.FC = () => {
  const { progress, addStars, addXP, completeAssessment } = useApp();
  const [selectedTaskId, setSelectedTaskId] = useState(ASSESSMENT_TASKS[0].id);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [subjectiveInput, setSubjectiveInput] = useState<string>('');
  const [showModelAnswer, setShowModelAnswer] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'classroom' | 'homework' | 'unit_eval'>('all');

  const activeTask = ASSESSMENT_TASKS.find((t) => t.id === selectedTaskId) || ASSESSMENT_TASKS[0];

  const handleSelectOption = (qId: string, optIdx: number, correctIdx: number) => {
    playSound.click();
    setAnswers((prev) => ({ ...prev, [qId]: optIdx }));

    if (optIdx === correctIdx) {
      playSound.success();
      addStars(2);
      addXP(25);
    } else {
      playSound.tryAgain();
    }
  };

  const handleReviewSubjective = () => {
    playSound.click();
    setShowModelAnswer(true);
    addStars(3);
    addXP(30);
    completeAssessment(activeTask.id);
  };

  const filteredTasks = filterType === 'all'
    ? ASSESSMENT_TASKS
    : ASSESSMENT_TASKS.filter((t) => t.type === filterType);

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-800 rounded-3xl p-6 md:p-8 text-white shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black text-3xl shadow-md">
              📋
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black">كِتَابُ التَّقْيِيمَاتِ وَالأَدَاءِ الْمَدْرَسِيِّ</h1>
              <p className="text-emerald-200 text-sm md:text-base font-medium mt-1">
                الأداءات الصفية، والواجبات المنزلية، والتقييمات الأسبوعية ونهاية الوحدات المعتمدة
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs bg-emerald-950/60 border border-emerald-400/30 px-3 py-1.5 rounded-xl font-bold text-emerald-200">
              تصحيح فوري موضوعي + نموذج إجابة مقالي
            </span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {[
          { id: 'all', label: 'جميع الأداءات والتقييمات' },
          { id: 'classroom', label: 'الأداءات الصفية 🏫' },
          { id: 'homework', label: 'الأداءات المنزلية 🏠' },
          { id: 'unit_eval', label: 'تقييمات نهاية الوحدات 🏆' },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => {
              playSound.click();
              setFilterType(f.id as any);
            }}
            className={`px-4 py-2 rounded-xl text-xs md:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
              filterType === f.id
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-white border border-emerald-200 text-slate-700 hover:bg-emerald-50'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Task Cards Selector */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {filteredTasks.map((task) => {
          const isSelected = task.id === activeTask.id;
          const isDone = progress.completedAssessments.includes(task.id);

          return (
            <button
              key={task.id}
              onClick={() => {
                playSound.click();
                setSelectedTaskId(task.id);
                setAnswers({});
                setSubjectiveInput('');
                setShowModelAnswer(false);
              }}
              className={`p-4 rounded-2xl text-right border-2 transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-emerald-100 border-emerald-600 shadow-md ring-2 ring-emerald-400'
                  : 'bg-white border-emerald-200 hover:bg-emerald-50'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-black bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full">
                    {task.type === 'classroom' ? 'صفي' : task.type === 'homework' ? 'منزلي' : 'تقييم وحدة'}
                  </span>
                  {isDone && <CheckCircle className="w-4 h-4 text-emerald-600" />}
                </div>
                <h4 className="font-extrabold text-sm text-slate-900 mb-1">{task.title}</h4>
                <p className="text-[11px] text-slate-500 font-medium">{task.unitTitle}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Active Assessment Sheet */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border-2 border-emerald-100 shadow-sm space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b-2 border-emerald-100">
          <div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 mb-2 inline-block">
              {activeTask.unitTitle}
            </span>
            <h2 className="text-xl md:text-2xl font-black text-emerald-950">{activeTask.title}</h2>
            <p className="text-slate-600 text-sm font-medium mt-1">{activeTask.instruction}</p>
          </div>
        </div>

        {/* Part 1: Objective Questions (تصحيح فوري آلي) */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 pb-2 border-b border-emerald-100">
            <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-black text-xs flex items-center justify-center">
              1
            </span>
            <h3 className="font-black text-base text-emerald-900">
              أَوَّلاً: الأَسْئِلَةُ الْمَوْضُوعِيَّةُ (تصحيح تلقائي فوري):
            </h3>
          </div>

          <div className="space-y-5">
            {activeTask.objectiveQuestions.map((q, idx) => {
              const selectedOpt = answers[q.id];
              const answered = selectedOpt !== undefined;

              return (
                <div key={q.id} className="p-5 rounded-2xl border-2 border-emerald-100 bg-emerald-50/20 space-y-3">
                  <p className="font-bold text-slate-900 text-base md:text-lg">
                    {idx + 1}. {q.question}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {q.options.map((opt, optIdx) => {
                      let btnStyle = 'bg-white border-2 border-emerald-200 hover:border-emerald-500 text-slate-800';
                      if (answered) {
                        if (optIdx === q.correct) {
                          btnStyle = 'bg-emerald-600 text-white border-2 border-emerald-700 font-black shadow-md';
                        } else if (optIdx === selectedOpt) {
                          btnStyle = 'bg-red-100 text-red-800 border-2 border-red-300';
                        } else {
                          btnStyle = 'bg-slate-50 text-slate-400 border-slate-200 opacity-60';
                        }
                      }

                      return (
                        <button
                          key={optIdx}
                          onClick={() => handleSelectOption(q.id, optIdx, q.correct)}
                          className={`p-3 rounded-xl font-bold text-sm md:text-base transition-all cursor-pointer ${btnStyle}`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>

                  {answered && (
                    <div
                      className={`p-3 rounded-xl text-xs md:text-sm font-bold flex items-center gap-2 ${
                        selectedOpt === q.correct
                          ? 'bg-emerald-100 text-emerald-950 border border-emerald-300'
                          : 'bg-amber-100 text-amber-950 border border-amber-300'
                      }`}
                    >
                      {selectedOpt === q.correct ? (
                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                      )}
                      <span>
                        {selectedOpt === q.correct ? 'إجابة صحيحة! ' : 'انتبه! '}
                        {q.explanation}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Part 2: Subjective / Constructive Question (سؤال مقالي وتعبيري مع إجابة نموذجية) */}
        {activeTask.subjectiveQuestion && (
          <div className="space-y-4 pt-4 border-t-2 border-emerald-100">
            <div className="flex items-center gap-2 pb-2">
              <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center">
                2
              </span>
              <h3 className="font-black text-base text-emerald-900">
                ثَانِيًا: السُّؤَالُ التَّعْبِيرِيُّ وَالْمَقَالِيُّ (مراجعة نموذجية):
              </h3>
            </div>

            <div className="p-5 rounded-2xl border-2 border-amber-200 bg-amber-50/40 space-y-3">
              <p className="font-black text-slate-900 text-base md:text-lg">
                {activeTask.subjectiveQuestion.prompt}
              </p>

              <textarea
                value={subjectiveInput}
                onChange={(e) => setSubjectiveInput(e.target.value)}
                placeholder="اكتب إجابتك هنا بأسلوبك الجميل وبخط سليم..."
                rows={3}
                className="w-full p-4 rounded-xl border-2 border-amber-300 bg-white font-bold text-slate-800 text-right text-sm md:text-base focus:border-emerald-600 focus:outline-none resize-none"
              />

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <button
                  onClick={handleReviewSubjective}
                  disabled={!subjectiveInput.trim()}
                  className="bg-amber-400 hover:bg-amber-500 disabled:opacity-50 text-slate-950 font-black px-6 py-2.5 rounded-xl text-sm transition-all cursor-pointer flex items-center gap-2 shadow-xs"
                >
                  <CheckSquare className="w-4 h-4" />
                  <span>عرض نموذج الإجابة والمطابقة الذاتية (+3 ⭐)</span>
                </button>

                <span className="text-xs text-slate-500">
                  {activeTask.subjectiveQuestion.rubricHint}
                </span>
              </div>

              {showModelAnswer && (
                <div className="p-4 bg-white rounded-xl border-2 border-emerald-300 text-emerald-950 space-y-2 mt-3 animate-float-soft">
                  <div className="font-black text-sm flex items-center gap-1.5 text-emerald-800">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>النَّمُوذَجُ الْمِثَالِيُّ لِلإِجَابَةِ:</span>
                  </div>
                  <p className="text-sm font-bold text-slate-800 leading-relaxed bg-emerald-50/50 p-3 rounded-lg border border-emerald-200">
                    «{activeTask.subjectiveQuestion.modelAnswer}»
                  </p>
                  <p className="text-xs text-emerald-700 font-semibold">
                    قارن إجابتك بالنموذج، وتأكد من وضوح الفكرة وسلامة الكتابة الإملائية!
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
