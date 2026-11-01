/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { CURRICULUM_UNITS } from '../../data/curriculumData';
import { Lesson, Unit } from '../../types/curriculum';
import { useApp } from '../../context/AppContext';
import { playSound, speakArabic, stopSpeaking } from '../../services/soundEffects';
import { DramatizedTheater } from './DramatizedTheater';
import { ActivityRunner } from './ActivityRunner';
import {
  BookOpen,
  Sparkles,
  Volume2,
  VolumeX,
  CheckCircle,
  Award,
  PenTool,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Flame,
  Star
} from 'lucide-react';

export const LessonsHub: React.FC = () => {
  const { progress, completeLesson, addStars, saveReflection } = useApp();
  const [selectedUnitId, setSelectedUnitId] = useState<string>('unit-1');
  const [selectedLessonId, setSelectedLessonId] = useState<string>('u1-l2');
  const [activeTab, setActiveTab] = useState<'theater' | 'text' | 'vocabulary' | 'grammar' | 'activities' | 'reflection'>('theater');

  // Custom reflection state
  const [userWords, setUserWords] = useState('');
  const [userBehavior, setUserBehavior] = useState('');
  const [reflectionSaved, setReflectionSaved] = useState(false);
  const [activeSpeakingText, setActiveSpeakingText] = useState<string | null>(null);
  const [activeVocabId, setActiveVocabId] = useState<string | null>(null);
  const [activeAudioKey, setActiveAudioKey] = useState<string | null>(null);
  const [isReadingFullLesson, setIsReadingFullLesson] = useState(false);
  const fullLessonReadingRef = React.useRef(false);

  useEffect(() => {
    return () => {
      fullLessonReadingRef.current = false;
      stopSpeaking();
    };
  }, []);

  const activeUnit = CURRICULUM_UNITS.find((u) => u.id === selectedUnitId) || CURRICULUM_UNITS[0];
  const activeLesson = activeUnit.lessons.find((l) => l.id === selectedLessonId) || activeUnit.lessons[0];

  const isCompleted = progress.completedLessons.includes(activeLesson.id);

  const buildFullVocabSpeech = (vocab: any) => {
    let speech = `الْكَلِمَةُ: ${vocab.word}. مَعْنَاهَا: ${vocab.meaning}.`;
    if (vocab.opposite) {
      speech += ` وَمُضَادُّهَا: ${vocab.opposite}.`;
    }
    if (vocab.singularOrPlural) {
      speech += ` وَ${vocab.singularOrPlural.type}هَا: ${vocab.singularOrPlural.value}.`;
    }
    if (vocab.exampleSentence) {
      speech += ` مِثَالٌ فِي جُمْلَةٍ: ${vocab.exampleSentence}.`;
    }
    return speech;
  };

  const handleSpeakVocabPart = (partKey: string, textToSpeak: string) => {
    if (isReadingFullLesson) {
      setIsReadingFullLesson(false);
      fullLessonReadingRef.current = false;
    }
    if (activeVocabId === partKey) {
      stopSpeaking();
      setActiveVocabId(null);
      return;
    }
    playSound.click();
    setActiveVocabId(partKey);
    speakArabic(textToSpeak, {
      voiceType: progress.avatar === 'ahmed' ? 'child_ahmed' : 'child_maryam',
      onStart: () => setActiveVocabId(partKey),
      onEnd: () => setActiveVocabId(null),
    });
  };

  const handleLessonSelect = (lesson: Lesson) => {
    playSound.click();
    stopSpeaking();
    fullLessonReadingRef.current = false;
    setIsReadingFullLesson(false);
    setActiveSpeakingText(null);
    setSelectedLessonId(lesson.id);
    setActiveTab('theater');
    setReflectionSaved(false);

    // load saved reflection if exists
    const saved = progress.savedReflections[lesson.id];
    if (saved) {
      setUserWords(saved.words);
      setUserBehavior(saved.behavior);
    } else {
      setUserWords('');
      setUserBehavior('');
    }
  };

  const handleSaveReflection = () => {
    saveReflection(activeLesson.id, {
      words: userWords || activeLesson.vocabulary.map((v) => v.word).join('، '),
      behavior: userBehavior || activeLesson.reflectionPrompt.suggestedBehavior
    });
    setReflectionSaved(true);
    addStars(3);
  };

  const handleReadFullLesson = (paragraphIndex: number = 0) => {
    if (paragraphIndex >= activeLesson.fullText.length) {
      setIsReadingFullLesson(false);
      fullLessonReadingRef.current = false;
      setActiveSpeakingText(null);
      return;
    }
    const para = activeLesson.fullText[paragraphIndex];
    setActiveSpeakingText(para);
    setIsReadingFullLesson(true);
    fullLessonReadingRef.current = true;

    speakArabic(para, {
      voiceType: 'male_teacher',
      onStart: () => setActiveSpeakingText(para),
      onEnd: () => {
        if (fullLessonReadingRef.current) {
          setTimeout(() => {
            if (fullLessonReadingRef.current) {
              handleReadFullLesson(paragraphIndex + 1);
            }
          }, 500);
        } else {
          setActiveSpeakingText(null);
        }
      },
    });
  };

  const handleToggleFullLessonReading = () => {
    playSound.click();
    if (isReadingFullLesson) {
      stopSpeaking();
      setIsReadingFullLesson(false);
      fullLessonReadingRef.current = false;
      setActiveSpeakingText(null);
    } else {
      handleReadFullLesson(0);
    }
  };

  const handleSpeakParagraph = (text: string) => {
    if (isReadingFullLesson) {
      setIsReadingFullLesson(false);
      fullLessonReadingRef.current = false;
    }
    if (activeSpeakingText === text) {
      stopSpeaking();
      setActiveSpeakingText(null);
      return;
    }
    playSound.click();
    setActiveSpeakingText(text);
    speakArabic(text, {
      voiceType: 'male_teacher',
      onStart: () => setActiveSpeakingText(text),
      onEnd: () => setActiveSpeakingText(null),
    });
  };

  const handleToggleSpeech = (
    key: string,
    text: string,
    voiceType: 'child_ahmed' | 'child_maryam' | 'male_teacher' = 'male_teacher'
  ) => {
    if (isReadingFullLesson) {
      setIsReadingFullLesson(false);
      fullLessonReadingRef.current = false;
    }
    if (activeAudioKey === key) {
      stopSpeaking();
      setActiveAudioKey(null);
      return;
    }
    playSound.click();
    setActiveAudioKey(key);
    speakArabic(text, {
      voiceType,
      onStart: () => setActiveAudioKey(key),
      onEnd: () => setActiveAudioKey(null),
    });
  };

  const handleTabChange = (tabId: typeof activeTab) => {
    playSound.click();
    stopSpeaking();
    fullLessonReadingRef.current = false;
    setIsReadingFullLesson(false);
    setActiveSpeakingText(null);
    setActiveVocabId(null);
    setActiveAudioKey(null);
    setActiveTab(tabId);
  };

  return (
    <div className="space-y-8">
      {/* Unit Selector Strip */}
      <div className="bg-white rounded-3xl p-4 md:p-6 border-2 border-emerald-100 shadow-sm">
        <h2 className="text-xl md:text-2xl font-black text-emerald-950 mb-4 flex items-center gap-3">
          <BookOpen className="w-7 h-7 text-emerald-600" />
          <span>رحلتي مع وحدات المنهج الدراسي – الفصل الأول</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {CURRICULUM_UNITS.map((unit) => {
            const isSelected = unit.id === selectedUnitId;
            const completedInUnit = unit.lessons.filter((l) => progress.completedLessons.includes(l.id)).length;

            return (
              <button
                key={unit.id}
                onClick={() => {
                  playSound.click();
                  setSelectedUnitId(unit.id);
                  setSelectedLessonId(unit.lessons[0].id);
                }}
                className={`p-4 rounded-2xl text-right transition-all cursor-pointer relative overflow-hidden border-2 ${
                  isSelected
                    ? 'bg-emerald-700 text-white border-emerald-800 shadow-md ring-4 ring-emerald-200'
                    : 'bg-emerald-50/50 hover:bg-emerald-100 text-slate-800 border-emerald-200'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                    isSelected ? 'bg-emerald-800 text-emerald-100' : 'bg-white text-emerald-800 border border-emerald-200'
                  }`}>
                    الوحدة {unit.number}
                  </span>
                  <span className={`text-xs font-semibold ${isSelected ? 'text-emerald-200' : 'text-slate-500'}`}>
                    {completedInUnit} / {unit.lessons.length} مكتمل
                  </span>
                </div>
                <h3 className="font-extrabold text-lg mb-1">{unit.title}</h3>
                <p className={`text-xs line-clamp-1 ${isSelected ? 'text-emerald-100' : 'text-slate-600'}`}>
                  {unit.theme}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Lessons Navigation Carousel / Strip */}
      <div className="bg-white rounded-3xl p-5 border-2 border-emerald-100 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-extrabold text-base md:text-lg text-emerald-900">
            دروس {activeUnit.title}:
          </h3>
          <span className="text-xs text-slate-500 font-medium">اختر درساً للانطلاق في مغامرته</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {activeUnit.lessons.map((lesson) => {
            const isSelected = lesson.id === activeLesson.id;
            const isDone = progress.completedLessons.includes(lesson.id);

            return (
              <button
                key={lesson.id}
                onClick={() => handleLessonSelect(lesson)}
                className={`p-3.5 rounded-2xl text-right border-2 transition-all cursor-pointer relative ${
                  isSelected
                    ? 'bg-emerald-100 border-emerald-600 shadow-sm ring-2 ring-emerald-400'
                    : 'bg-white hover:bg-emerald-50 border-emerald-200'
                }`}
              >
                {isDone && (
                  <div className="absolute top-2 left-2 text-emerald-600">
                    <CheckCircle className="w-5 h-5 fill-emerald-100" />
                  </div>
                )}
                <div className="text-xs font-bold text-emerald-700 mb-1">
                  الدرس {lesson.lessonNumber} ({lesson.type === 'listening' ? 'استماع' : lesson.type === 'reading' ? 'قراءة' : 'نشيد'})
                </div>
                <h4 className="font-black text-sm md:text-base text-slate-900 line-clamp-1 mb-1">
                  {lesson.title}
                </h4>
                <p className="text-[11px] text-slate-500 line-clamp-1">
                  كتاب الوزارة {lesson.pageReference}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Lesson Header & Tab Navigation */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-800 rounded-3xl p-6 text-white shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-emerald-600/80 text-emerald-100 text-xs px-3 py-1 rounded-full font-bold">
                {activeUnit.title} – الدرس {activeLesson.lessonNumber}
              </span>
              <span className="bg-amber-400 text-slate-950 text-xs px-2.5 py-1 rounded-full font-black">
                {activeLesson.pageReference}
              </span>
              {isCompleted && (
                <span className="bg-emerald-400 text-emerald-950 text-xs px-2.5 py-1 rounded-full font-black flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" />
                  مكتمل
                </span>
              )}
            </div>
            <h1 className="text-2xl md:text-3xl font-black">{activeLesson.title}</h1>
            <p className="text-emerald-200 text-sm md:text-base mt-1 font-medium">{activeLesson.subtitle}</p>
          </div>

          <div className="flex items-center gap-3">
            {!isCompleted ? (
              <button
                onClick={() => completeLesson(activeLesson.id)}
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-5 py-3 rounded-2xl shadow-lg transition-transform hover:scale-105 flex items-center gap-2 cursor-pointer"
              >
                <Award className="w-5 h-5 text-emerald-900" />
                <span>إتمام الدرس والحصول على 5 ⭐</span>
              </button>
            ) : (
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2.5 rounded-2xl font-bold text-sm flex items-center gap-2">
                <span>أحسنت يا بطل، لقد أتقنت هذا الدرس!</span>
                <span>🌟</span>
              </div>
            )}
          </div>
        </div>

        {/* Lesson Sub-Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pt-6 mt-6 border-t border-emerald-700/60 pb-1 scrollbar-none">
          {[
            { id: 'theater', label: 'المسرح التمثيلي 🎬', icon: Sparkles },
            { id: 'text', label: 'نص الدرس المشكول 📖', icon: BookOpen },
            { id: 'vocabulary', label: 'المفردات والمعاني 📚', icon: Bookmark },
            { id: 'grammar', label: 'الأساليب والإملاء ✏️', icon: Award },
            { id: 'activities', label: 'أنشطة وتدريبات 🎯', icon: Flame },
            { id: 'reflection', label: 'رحلتي مع الدرس 📝', icon: PenTool },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id as any)}
                className={`px-4 py-2 rounded-xl font-extrabold text-sm whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
                  isActive
                    ? 'bg-white text-emerald-950 shadow-md font-black'
                    : 'bg-emerald-900/60 text-emerald-100 hover:bg-emerald-900 hover:text-white'
                }`}
              >
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab 1: Dramatized Theater */}
      {activeTab === 'theater' && (
        <div>
          <div className="bg-emerald-100/60 p-4 rounded-2xl mb-4 border border-emerald-300 text-emerald-900 text-sm font-medium flex items-center justify-between">
            <p>
              🌟 <strong>المسرح التعليمي التفاعلي:</strong> شاهد أحمد ومريم وهما يمثلان أحداث الدرس بالحوار الحي، واستمع للشرح الممتع بصوت واضح!
            </p>
            <span className="text-xs bg-white text-emerald-800 font-bold px-3 py-1 rounded-full border border-emerald-200">
              {activeLesson.dramaScenes.length} مشاهد تمثيلية
            </span>
          </div>

          {activeLesson.dramaScenes.map((scene) => (
            <DramatizedTheater
              key={scene.id}
              scene={scene}
              onSceneComplete={() => {
                addStars(2);
              }}
            />
          ))}
        </div>
      )}

      {/* Tab 2: Full Vocalized Lesson Text */}
      {activeTab === 'text' && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border-2 border-emerald-100 shadow-sm space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b-2 border-emerald-100">
            <div>
              <h3 className="text-xl font-black text-emerald-950">النَّصُّ الْقِرَائِيُّ الْمَشْكُولُ</h3>
              <p className="text-xs text-slate-500 font-medium">اضغط للاستماع إلى قراءة النص كاملاً أو كل فقرة على حدة بالتشكيل السليم</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleToggleFullLessonReading}
                className={`px-4 py-2 rounded-2xl text-xs md:text-sm font-black flex items-center gap-2 transition-all cursor-pointer shadow-md ${
                  isReadingFullLesson
                    ? 'bg-rose-500 hover:bg-rose-600 text-white ring-4 ring-rose-200'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                }`}
                title={isReadingFullLesson ? 'إيقاف قراءة الدرس' : 'استمع إلى قراءة النص كاملاً فقرة وراء فقرة'}
              >
                {isReadingFullLesson ? (
                  <>
                    <VolumeX className="w-4 h-4 text-white" />
                    <span>إيقاف قراءة الدرس ⏹️</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4 text-amber-300" />
                    <span>استمع لقراءة الدرس كاملاً 🎙️</span>
                  </>
                )}
              </button>
              <span className="text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-2 rounded-xl">
                الصفحة {activeLesson.pageReference}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            {activeLesson.fullText.map((para, pIdx) => {
              const isCurrentlyPlaying = activeSpeakingText === para;
              return (
                <div
                  key={pIdx}
                  className={`p-5 rounded-2xl border-2 transition-all flex items-start gap-4 ${
                    isCurrentlyPlaying
                      ? 'bg-emerald-100/70 border-emerald-500 shadow-md ring-2 ring-emerald-300'
                      : 'border-emerald-100 hover:border-emerald-300 bg-emerald-50/20 hover:bg-emerald-50/50'
                  }`}
                >
                  <button
                    onClick={() => handleSpeakParagraph(para)}
                    className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-all cursor-pointer shadow-xs ${
                      isCurrentlyPlaying
                        ? 'bg-rose-500 hover:bg-rose-600 text-white font-black ring-4 ring-rose-200'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    }`}
                    title={isCurrentlyPlaying ? 'إيقاف الصوت' : 'استمع للفقرة'}
                  >
                    {isCurrentlyPlaying ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                  </button>
                  <div className="flex-1 space-y-1">
                    {isCurrentlyPlaying && (
                      <span className="text-xs bg-emerald-600 text-white px-2.5 py-0.5 rounded-full font-bold inline-block mb-1">
                        جارٍ القراءة الصوتية الآن... 🔊
                      </span>
                    )}
                    <p className="text-slate-900 text-lg md:text-xl font-bold leading-loose select-text">
                      {para}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Goals Box */}
          <div className="p-5 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border-2 border-dashed border-emerald-300">
            <h4 className="font-extrabold text-emerald-900 text-base mb-2 flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-500 fill-amber-400" />
              أَهْدَافُ التَّعَلُّمِ الَّتِي حَقَّقْنَاهَا مَعَ أَحْمَدَ وَمَرْيَمَ:
            </h4>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-slate-800 font-semibold">
              {activeLesson.goals.map((g, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>{g}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Tab 3: Vocabulary and Meaning */}
      {activeTab === 'vocabulary' && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border-2 border-emerald-100 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-3 border-b-2 border-emerald-100">
            <div>
              <h3 className="text-xl font-black text-emerald-950">قَامُوسُ الْمُفْرَدَاتِ وَالْمَعَانِي الْمَنْطُوقَةِ</h3>
              <p className="text-xs text-slate-500 font-medium">اضغط على أي زر صوت للاستماع إلى نطق الكلمة أو معناها أو مضادها أو جمعها وجملتها</p>
            </div>
            <span className="text-xs bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full font-bold">
              {activeLesson.vocabulary.length} مفردات أساسية
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeLesson.vocabulary.map((vocab) => {
              const fullKey = `${vocab.id}-full`;
              const wordKey = `${vocab.id}-word`;
              const meaningKey = `${vocab.id}-meaning`;
              const oppKey = `${vocab.id}-opposite`;
              const pluralKey = `${vocab.id}-plural`;
              const exampleKey = `${vocab.id}-example`;

              const isFullSpeaking = activeVocabId === fullKey;

              return (
                <div
                  key={vocab.id}
                  className={`p-5 rounded-2xl border-2 transition-all space-y-3.5 ${
                    isFullSpeaking || (activeVocabId && activeVocabId.startsWith(vocab.id))
                      ? 'bg-emerald-50/90 border-emerald-500 shadow-md ring-2 ring-emerald-300'
                      : 'bg-white border-emerald-100 hover:border-emerald-300 shadow-xs'
                  }`}
                >
                  {/* Card Header: Word & Full Pronunciation Button */}
                  <div className="flex items-center justify-between gap-2 pb-2 border-b border-emerald-100">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-black text-emerald-800">{vocab.word}</span>
                      <button
                        onClick={() => handleSpeakVocabPart(wordKey, vocab.word)}
                        className={`p-1.5 rounded-xl transition-all cursor-pointer ${
                          activeVocabId === wordKey
                            ? 'bg-amber-400 text-slate-950 font-black animate-pulse'
                            : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                        }`}
                        title="نطق الكلمة فقط"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>

                    <button
                      onClick={() => handleSpeakVocabPart(fullKey, buildFullVocabSpeech(vocab))}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-xs ${
                        isFullSpeaking
                          ? 'bg-amber-400 text-slate-950 font-black animate-pulse'
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      }`}
                      title="قراءة الكلمة وشرحها ومثالها كاملة"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>{isFullSpeaking ? 'يتم الشرح...' : 'نطق البطاقة كاملة 🔊'}</span>
                    </button>
                  </div>

                  {/* Word Details: Meaning, Opposite, Singular/Plural */}
                  <div className="space-y-2 text-sm font-semibold">
                    {/* Meaning */}
                    <div className="flex items-center justify-between bg-white/70 p-2.5 rounded-xl border border-emerald-100">
                      <p className="text-slate-800">
                        <strong className="text-emerald-900">الْمَعْنَى:</strong> {vocab.meaning}
                      </p>
                      <button
                        onClick={() => handleSpeakVocabPart(meaningKey, `مَعْنَى كَلِمَةِ ${vocab.word} هُوَ: ${vocab.meaning}`)}
                        className={`p-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 ${
                          activeVocabId === meaningKey
                            ? 'bg-amber-300 text-slate-950'
                            : 'text-emerald-700 hover:bg-emerald-100'
                        }`}
                        title="نطق المعنى"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>نطق المعنى</span>
                      </button>
                    </div>

                    {/* Opposite if exists */}
                    {vocab.opposite && (
                      <div className="flex items-center justify-between bg-rose-50/60 p-2.5 rounded-xl border border-rose-100">
                        <p className="text-slate-800">
                          <strong className="text-rose-700">الْمُضَادّ (الْعَكْس):</strong> {vocab.opposite}
                        </p>
                        <button
                          onClick={() => handleSpeakVocabPart(oppKey, `مُضَادُّ كَلِمَةِ ${vocab.word} هُوَ: ${vocab.opposite}`)}
                          className={`p-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 ${
                            activeVocabId === oppKey
                              ? 'bg-amber-300 text-slate-950'
                              : 'text-rose-700 hover:bg-rose-100'
                          }`}
                          title="نطق المضاد"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>نطق المضاد</span>
                        </button>
                      </div>
                    )}

                    {/* Singular or Plural if exists */}
                    {vocab.singularOrPlural && (
                      <div className="flex items-center justify-between bg-amber-50/70 p-2.5 rounded-xl border border-amber-200">
                        <p className="text-amber-950">
                          <strong>{vocab.singularOrPlural.type}:</strong> {vocab.singularOrPlural.value}
                        </p>
                        <button
                          onClick={() =>
                            handleSpeakVocabPart(
                              pluralKey,
                              `${vocab.singularOrPlural?.type} كَلِمَةِ ${vocab.word} هُوَ: ${vocab.singularOrPlural?.value}`
                            )
                          }
                          className={`p-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 ${
                            activeVocabId === pluralKey
                              ? 'bg-amber-300 text-slate-950'
                              : 'text-amber-800 hover:bg-amber-100'
                          }`}
                          title={`نطق ${vocab.singularOrPlural.type}`}
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>نطق {vocab.singularOrPlural.type}</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Example Sentence with Audio */}
                  <div className="bg-emerald-50/80 p-3 rounded-xl border border-emerald-200 flex items-center justify-between gap-2">
                    <p className="text-xs text-emerald-950 font-bold leading-relaxed">
                      💡 مثال في جملة: «{vocab.exampleSentence}»
                    </p>
                    <button
                      onClick={() => handleSpeakVocabPart(exampleKey, vocab.exampleSentence)}
                      className={`p-1.5 rounded-lg shrink-0 transition-colors cursor-pointer ${
                        activeVocabId === exampleKey
                          ? 'bg-amber-400 text-slate-950'
                          : 'text-emerald-700 hover:bg-emerald-200'
                      }`}
                      title="سماع الجملة"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 4: Grammar & Phonics Focus */}
      {activeTab === 'grammar' && (
        <div className="space-y-6">
          {/* Grammar Card */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border-2 border-emerald-100 shadow-sm">
            <div className="flex items-center gap-3 mb-4 pb-3 border-b-2 border-emerald-100">
              <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black">
                نحو
              </div>
              <div>
                <h3 className="text-xl font-black text-emerald-950">{activeLesson.grammarFocus.title}</h3>
                <p className="text-xs text-slate-500 font-medium">الأساليب والتراكيب اللغوية للصف الثالث</p>
              </div>
            </div>

            <div className="flex items-center justify-between mb-5 bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200">
              <p className="text-base font-bold text-slate-800 leading-relaxed flex-1">
                {activeLesson.grammarFocus.ruleSummary}
              </p>
              <button
                onClick={() =>
                  handleToggleSpeech(
                    'grammar-rule',
                    activeLesson.grammarFocus.ruleSummary,
                    'male_teacher'
                  )
                }
                className={`mr-3 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer shadow-xs ${
                  activeAudioKey === 'grammar-rule'
                    ? 'bg-rose-600 text-white ring-2 ring-rose-300'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                }`}
                title={activeAudioKey === 'grammar-rule' ? 'إيقاف الصوت' : 'استمع لشرح القاعدة'}
              >
                {activeAudioKey === 'grammar-rule' ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                <span>{activeAudioKey === 'grammar-rule' ? 'إيقاف ⏹️' : 'استمع 🔊'}</span>
              </button>
            </div>

            <h4 className="font-extrabold text-sm text-emerald-900 mb-2">أَمْثِلَةٌ تَوْضِيحِيَّةٌ مِنَ الْكِتَابِ:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {activeLesson.grammarFocus.examples.map((ex, i) => (
                <div key={i} className="p-3.5 bg-white border-2 border-emerald-200 rounded-xl font-bold text-slate-800 text-sm flex items-center justify-between">
                  <span>{ex}</span>
                  <button
                    onClick={() => handleToggleSpeech(`grammar-ex-${i}`, ex, 'male_teacher')}
                    className={`p-1.5 rounded-lg cursor-pointer transition-colors ${
                      activeAudioKey === `grammar-ex-${i}`
                        ? 'text-rose-600 bg-rose-50 ring-1 ring-rose-300'
                        : 'text-emerald-600 hover:bg-emerald-50'
                    }`}
                    title={activeAudioKey === `grammar-ex-${i}` ? 'إيقاف' : 'استمع للمثال'}
                  >
                    {activeAudioKey === `grammar-ex-${i}` ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Spelling Card */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border-2 border-emerald-100 shadow-sm">
            <div className="flex items-center gap-3 mb-4 pb-3 border-b-2 border-emerald-100">
              <div className="w-10 h-10 rounded-2xl bg-teal-600 text-white flex items-center justify-center font-black">
                إملاء
              </div>
              <div>
                <h3 className="text-xl font-black text-emerald-950">{activeLesson.spellingFocus.title}</h3>
                <p className="text-xs text-slate-500 font-medium">الوعي الصوتي والقواعد الإملائية السليمة</p>
              </div>
            </div>

            <div className="flex items-center justify-between mb-5 bg-teal-50/70 p-4 rounded-2xl border border-teal-200">
              <p className="text-base font-bold text-slate-800 leading-relaxed flex-1">
                {activeLesson.spellingFocus.ruleSummary}
              </p>
              <button
                onClick={() =>
                  handleToggleSpeech(
                    'spelling-rule',
                    activeLesson.spellingFocus.ruleSummary,
                    'male_teacher'
                  )
                }
                className={`mr-3 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer shadow-xs ${
                  activeAudioKey === 'spelling-rule'
                    ? 'bg-rose-600 text-white ring-2 ring-rose-300'
                    : 'bg-teal-600 hover:bg-teal-700 text-white'
                }`}
                title={activeAudioKey === 'spelling-rule' ? 'إيقاف الصوت' : 'استمع للقاعدة الإملائية'}
              >
                {activeAudioKey === 'spelling-rule' ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                <span>{activeAudioKey === 'spelling-rule' ? 'إيقاف ⏹️' : 'استمع 🔊'}</span>
              </button>
            </div>

            <h4 className="font-extrabold text-sm text-teal-900 mb-2">أَمْثِلَةُ التَّحْلِيلِ الصَّوْتِيِّ:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {activeLesson.spellingFocus.examples.map((ex, i) => (
                <div key={i} className="p-3.5 bg-white border-2 border-teal-200 rounded-xl font-bold text-slate-800 text-sm flex items-center justify-between">
                  <span>{ex}</span>
                  <button
                    onClick={() => handleToggleSpeech(`spelling-ex-${i}`, ex, 'male_teacher')}
                    className={`p-1.5 rounded-lg cursor-pointer transition-colors ${
                      activeAudioKey === `spelling-ex-${i}`
                        ? 'text-rose-600 bg-rose-50 ring-1 ring-rose-300'
                        : 'text-teal-600 hover:bg-teal-50'
                    }`}
                    title={activeAudioKey === `spelling-ex-${i}` ? 'إيقاف' : 'استمع للكلمة'}
                  >
                    {activeAudioKey === `spelling-ex-${i}` ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Activities Runner */}
      {activeTab === 'activities' && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border-2 border-emerald-100 shadow-sm">
          <ActivityRunner
            activities={activeLesson.activities}
            lessonTitle={activeLesson.title}
            onAllCompleted={() => {
              completeLesson(activeLesson.id);
            }}
          />
        </div>
      )}

      {/* Tab 6: My Journey With the Lesson (رحلتي مع الدرس) */}
      {activeTab === 'reflection' && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border-2 border-emerald-100 shadow-sm space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b-2 border-emerald-100">
            <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black text-2xl">
              ✍️
            </div>
            <div>
              <h3 className="text-xl font-black text-emerald-950">رِحْلَتِي مَعَ الدَّرْسِ</h3>
              <p className="text-xs text-slate-500 font-medium">صفحة الطفل المخصصة لكتابة الكلمات الجديدة والسلوكيات الجميلة</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* New Words Box */}
            <div className="space-y-3">
              <label className="block font-black text-emerald-900 text-sm">
                💬 {activeLesson.reflectionPrompt.wordsTitle}:
              </label>
              <textarea
                value={userWords}
                onChange={(e) => setUserWords(e.target.value)}
                placeholder="اكتب هنا الكلمات الجميلة التي تعلمتها لتستخدمها في كلامك وكتابتك..."
                rows={4}
                className="w-full p-4 rounded-2xl border-2 border-emerald-200 focus:border-emerald-500 focus:outline-none font-bold text-slate-800 bg-emerald-50/30 text-right leading-relaxed resize-none"
              />
              <p className="text-xs text-slate-500">
                مقترح: {activeLesson.vocabulary.map((v) => v.word).join('، ')}
              </p>
            </div>

            {/* Admired Behavior Box */}
            <div className="space-y-3">
              <label className="block font-black text-emerald-900 text-sm">
                🌱 {activeLesson.reflectionPrompt.behaviorTitle}:
              </label>
              <textarea
                value={userBehavior}
                onChange={(e) => setUserBehavior(e.target.value)}
                placeholder="اكتب تصرفاً نبيلاً أعجبك في الدرس وتريد أن تفعله في حياتك..."
                rows={4}
                className="w-full p-4 rounded-2xl border-2 border-emerald-200 focus:border-emerald-500 focus:outline-none font-bold text-slate-800 bg-emerald-50/30 text-right leading-relaxed resize-none"
              />
              <p className="text-xs text-emerald-700 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                💡 فكرة من مريم: {activeLesson.reflectionPrompt.suggestedBehavior}
              </p>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between">
            <button
              onClick={handleSaveReflection}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-black px-6 py-3 rounded-2xl shadow-md transition-all cursor-pointer flex items-center gap-2"
            >
              <CheckCircle className="w-5 h-5" />
              <span>حفظ في كراستي وسجل إنجازاتي (+3 ⭐)</span>
            </button>

            {reflectionSaved && (
              <span className="text-emerald-700 font-bold text-sm flex items-center gap-1.5 animate-bounce">
                <span>تم حفظ مدخلاتك بنجاح في ملفك التعليمي!</span>
                <span>🎉</span>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
