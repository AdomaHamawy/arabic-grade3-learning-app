/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { DramaScene } from '../../types/curriculum';
import { playSound, speakArabic, stopSpeaking } from '../../services/soundEffects';
import { useApp } from '../../context/AppContext';
import { Play, Pause, RotateCcw, Volume2, VolumeX, CheckCircle, HelpCircle, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

interface DramatizedTheaterProps {
  scene: DramaScene;
  onSceneComplete?: () => void;
}

export const DramatizedTheater: React.FC<DramatizedTheaterProps> = ({ scene, onSceneComplete }) => {
  const { progress, addStars, toggleAutoplay } = useApp();
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [quizAnswered, setQuizAnswered] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const currentLine = scene.dialogue[currentLineIndex] || scene.dialogue[0];
  const isLastLine = currentLineIndex >= scene.dialogue.length - 1;

  const isPlayingRef = React.useRef(isPlaying);
  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  // Speak current line when triggered
  const triggerSpeakLine = (index: number) => {
    const line = scene.dialogue[index];
    if (!line) return;
    setIsSpeaking(true);
    let voiceType: 'child_ahmed' | 'child_maryam' | 'male_teacher' = 'male_teacher';
    if (line.character === 'ahmed') voiceType = 'child_ahmed';
    else if (line.character === 'maryam' || line.character === 'heba' || line.character === 'salma') voiceType = 'child_maryam';

    speakArabic(line.audioPrompt || line.text, {
      voiceType,
      onStart: () => {
        setIsSpeaking(true);
      },
      onEnd: () => {
        setIsSpeaking(false);
        if (isPlayingRef.current && index < scene.dialogue.length - 1) {
          setTimeout(() => {
            if (isPlayingRef.current) {
              const nextIdx = index + 1;
              setCurrentLineIndex(nextIdx);
              triggerSpeakLine(nextIdx);
            }
          }, 600);
        } else if (isPlayingRef.current && index >= scene.dialogue.length - 1) {
          setIsPlaying(false);
          isPlayingRef.current = false;
          if (onSceneComplete) onSceneComplete();
        }
      }
    });
  };

  useEffect(() => {
    setCurrentLineIndex(0);
    setQuizAnswered(null);
    setShowExplanation(false);
    setIsPlaying(false);
    isPlayingRef.current = false;
    setIsSpeaking(false);
    stopSpeaking();
    return () => {
      stopSpeaking();
    };
  }, [scene.id]);

  const handleNext = () => {
    stopSpeaking();
    setIsSpeaking(false);
    playSound.click();
    if (currentLineIndex < scene.dialogue.length - 1) {
      const nextIdx = currentLineIndex + 1;
      setCurrentLineIndex(nextIdx);
      if (progress.autoplayAudio || isPlayingRef.current) {
        triggerSpeakLine(nextIdx);
      }
    } else if (onSceneComplete) {
      onSceneComplete();
    }
  };

  const handlePrev = () => {
    stopSpeaking();
    setIsSpeaking(false);
    playSound.click();
    if (currentLineIndex > 0) {
      const prevIdx = currentLineIndex - 1;
      setCurrentLineIndex(prevIdx);
      if (progress.autoplayAudio || isPlayingRef.current) {
        triggerSpeakLine(prevIdx);
      }
    }
  };

  const handlePlayToggle = () => {
    playSound.click();
    if (isPlaying) {
      setIsPlaying(false);
      isPlayingRef.current = false;
      stopSpeaking();
      setIsSpeaking(false);
    } else {
      setIsPlaying(true);
      isPlayingRef.current = true;
      triggerSpeakLine(currentLineIndex);
    }
  };

  const handleReplay = () => {
    playSound.click();
    stopSpeaking();
    setCurrentLineIndex(0);
    setIsPlaying(true);
    isPlayingRef.current = true;
    setQuizAnswered(null);
    setShowExplanation(false);
    triggerSpeakLine(0);
  };

  const handleQuizSelect = (optionIdx: number) => {
    if (quizAnswered !== null || !scene.quickQuestion) return;
    setQuizAnswered(optionIdx);
    setShowExplanation(true);
    if (optionIdx === scene.quickQuestion.correctIndex) {
      playSound.success();
      addStars(3);
    } else {
      playSound.tryAgain();
    }
  };

  // Character Avatar Paths
  const ahmedAvatarPath = '/src/assets/images/ahmed_3d_avatar_1793515761332.jpg';
  const maryamAvatarPath = '/src/assets/images/maryam_3d_avatar_1793515761369.jpg';
  const classroomBackdrop = '/src/assets/images/interactive_classroom_stage_1793515762961.jpg';
  const natureBackdrop = '/src/assets/images/learning_adventure_hero_1793515762923.jpg';

  const backdropImage = scene.locationType === 'classroom' || scene.locationType === 'home'
    ? classroomBackdrop
    : natureBackdrop;

  const isAhmedSpeaking = currentLine.character === 'ahmed';
  const isMaryamSpeaking = currentLine.character === 'maryam' || currentLine.character === 'heba' || currentLine.character === 'salma';
  const isTeacherSpeaking = currentLine.character === 'teacher' || currentLine.character === 'father' || currentLine.character === 'narrator';

  return (
    <div className="bg-white rounded-3xl border-2 border-emerald-200 shadow-xl overflow-hidden mb-8">
      {/* Theater Top Bar */}
      <div className="bg-emerald-800 text-white px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-sm">
            🎬
          </div>
          <div>
            <h3 className="font-bold text-base md:text-lg">{scene.title}</h3>
            <p className="text-emerald-200 text-xs font-medium">المكان: {scene.location}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              playSound.click();
              toggleAutoplay();
            }}
            className={`text-xs px-3 py-1 rounded-full font-bold transition-all cursor-pointer border ${
              progress.autoplayAudio
                ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-xs'
                : 'bg-emerald-900/80 text-emerald-200 border-emerald-700'
            }`}
            title="تبديل التشغيل التلقائي للصوت"
          >
            {progress.autoplayAudio ? '🔊 تشغيل تلقائي: مُفَعَّل' : '🔇 تشغيل تلقائي: يدوي'}
          </button>
          <span className="text-xs bg-emerald-700/80 px-3 py-1 rounded-full text-emerald-100 font-semibold">
            المشهد {currentLineIndex + 1} من {scene.dialogue.length}
          </span>
        </div>
      </div>

      {/* Main 3D Cinema Stage Canvas */}
      <div className="relative h-72 sm:h-96 md:h-[420px] w-full overflow-hidden bg-slate-900 select-none">
        {/* Background Image Scrim */}
        <img
          src={backdropImage}
          alt={scene.location}
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover opacity-85 transition-opacity duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/30" />

        {/* 3D Realistic Character Displays on Stage */}
        <div className="absolute bottom-2 inset-x-4 flex items-end justify-between pointer-events-none">
          {/* Ahmed 3D Actor */}
          <div
            className={`transition-all duration-300 flex flex-col items-center ${
              isAhmedSpeaking ? 'scale-105 opacity-100 z-10' : 'scale-95 opacity-80'
            } ${isSpeaking && isAhmedSpeaking ? 'scale-110 z-20 animate-character-talk' : ''}`}
          >
            {isAhmedSpeaking && (
              <div className="bg-amber-400 text-slate-950 font-black text-xs px-3 py-1 rounded-full mb-1 shadow-md flex items-center gap-1.5">
                <span>أحمد يتحدث 🎙️</span>
                {isSpeaking && (
                  <div className="flex items-end gap-0.5 h-3">
                    <span className="w-1 h-2 bg-slate-950 rounded-full animate-bounce [animation-delay:-0.2s]" />
                    <span className="w-1 h-3.5 bg-slate-950 rounded-full animate-bounce [animation-delay:-0.1s]" />
                    <span className="w-1 h-2 bg-slate-950 rounded-full animate-bounce" />
                  </div>
                )}
              </div>
            )}
            <div className={`relative w-28 sm:w-36 md:w-44 aspect-square rounded-2xl overflow-hidden border-4 transition-all ${
              isSpeaking && isAhmedSpeaking
                ? 'border-amber-400 shadow-2xl ring-4 ring-amber-300'
                : isAhmedSpeaking
                ? 'border-amber-400 shadow-xl'
                : 'border-white/80'
            } bg-emerald-900/40 backdrop-blur-xs`}>
              <img
                src={ahmedAvatarPath}
                alt="أحمد 3D"
                className={`w-full h-full object-cover transition-transform ${isSpeaking && isAhmedSpeaking ? 'animate-mouth-talk' : ''}`}
              />
              <div className="absolute bottom-0 inset-x-0 bg-emerald-950/80 text-white text-center py-1 font-bold text-xs">
                أحمد 👦
              </div>
            </div>
          </div>

          {/* Teacher / Mentor Center Indicator (when teacher speaks) */}
          {isTeacherSpeaking && (
            <div className={`transition-all duration-300 flex flex-col items-center z-20 mb-4 animate-float-soft ${
              isSpeaking ? 'scale-110 ring-4 ring-blue-400 rounded-full' : ''
            }`}>
              <div className="bg-blue-600 text-white font-black text-xs px-3 py-1 rounded-full mb-1 shadow-md flex items-center gap-1.5">
                <span>{currentLine.characterName} 👨‍🏫</span>
                {isSpeaking && (
                  <div className="flex items-end gap-0.5 h-3">
                    <span className="w-1 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.2s]" />
                    <span className="w-1 h-3.5 bg-white rounded-full animate-bounce [animation-delay:-0.1s]" />
                    <span className="w-1 h-2 bg-white rounded-full animate-bounce" />
                  </div>
                )}
              </div>
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border-4 border-blue-400 bg-white shadow-xl overflow-hidden flex items-center justify-center text-3xl">
                {currentLine.character === 'teacher' ? '👨‍🏫' : currentLine.character === 'father' ? '🧔' : '📜'}
              </div>
            </div>
          )}

          {/* Maryam 3D Actor */}
          <div
            className={`transition-all duration-300 flex flex-col items-center ${
              isMaryamSpeaking ? 'scale-105 opacity-100 z-10' : 'scale-95 opacity-80'
            } ${isSpeaking && isMaryamSpeaking ? 'scale-110 z-20 animate-character-talk' : ''}`}
          >
            {isMaryamSpeaking && (
              <div className="bg-emerald-400 text-slate-950 font-black text-xs px-3 py-1 rounded-full mb-1 shadow-md flex items-center gap-1.5">
                <span>مريم تتحدث 🎙️</span>
                {isSpeaking && (
                  <div className="flex items-end gap-0.5 h-3">
                    <span className="w-1 h-2 bg-slate-950 rounded-full animate-bounce [animation-delay:-0.2s]" />
                    <span className="w-1 h-3.5 bg-slate-950 rounded-full animate-bounce [animation-delay:-0.1s]" />
                    <span className="w-1 h-2 bg-slate-950 rounded-full animate-bounce" />
                  </div>
                )}
              </div>
            )}
            <div className={`relative w-28 sm:w-36 md:w-44 aspect-square rounded-2xl overflow-hidden border-4 transition-all ${
              isSpeaking && isMaryamSpeaking
                ? 'border-emerald-400 shadow-2xl ring-4 ring-emerald-300'
                : isMaryamSpeaking
                ? 'border-emerald-400 shadow-xl'
                : 'border-white/80'
            } bg-emerald-900/40 backdrop-blur-xs`}>
              <img
                src={maryamAvatarPath}
                alt="مريم 3D"
                className={`w-full h-full object-cover transition-transform ${isSpeaking && isMaryamSpeaking ? 'animate-mouth-talk' : ''}`}
              />
              <div className="absolute bottom-0 inset-x-0 bg-emerald-950/80 text-white text-center py-1 font-bold text-xs">
                {currentLine.character === 'maryam' ? 'مريم 👧' : currentLine.characterName}
              </div>
            </div>
          </div>
        </div>

        {/* Cinematic Subtitle & Speech Bubble in Stage */}
        <div className="absolute top-4 inset-x-4 md:inset-x-12 z-20">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl p-4 md:p-5 shadow-2xl border-2 border-emerald-300">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2 pb-2 border-b border-emerald-100">
              <span className="font-extrabold text-emerald-800 text-sm md:text-base flex items-center gap-2">
                <span>💬 {currentLine.characterName}</span>
                <span className="text-xs font-normal text-slate-500">({currentLine.expression})</span>
                {isSpeaking && (
                  <span className="inline-flex items-center gap-1.5 text-xs bg-emerald-600 text-white px-2.5 py-0.5 rounded-full font-bold animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                    جارٍ تشغيل الصوت 🔊
                  </span>
                )}
              </span>

              <div className="flex items-center gap-1.5">
                {isSpeaking ? (
                  <button
                    onClick={() => {
                      playSound.click();
                      stopSpeaking();
                      setIsSpeaking(false);
                      setIsPlaying(false);
                      isPlayingRef.current = false;
                    }}
                    className="text-xs bg-rose-600 hover:bg-rose-700 text-white px-3 py-1.5 rounded-xl font-bold flex items-center gap-1 transition-colors cursor-pointer shadow-xs"
                    title="إيقاف الصوت فوراً"
                  >
                    <span>إيقاف الصوت ⏹️</span>
                  </button>
                ) : (
                  <button
                    onClick={() => triggerSpeakLine(currentLineIndex)}
                    className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                    title="سماع الحوار بصوت الشخصية"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>استمع للحوار بصوت واضح 🔊</span>
                  </button>
                )}

                <button
                  onClick={() => triggerSpeakLine(currentLineIndex)}
                  className="text-xs p-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-xl font-bold transition-colors cursor-pointer"
                  title="إعادة نطق هذا الحوار"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <p className="text-slate-900 text-base md:text-xl font-bold leading-relaxed text-right">
              {currentLine.text}
            </p>
            {currentLine.sceneVisualNote && (
              <p className="mt-2 text-xs text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md inline-block">
                🎬 المشهد: {currentLine.sceneVisualNote}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Playback Controls Bar */}
      <div className="bg-emerald-50 p-4 border-t border-emerald-200 flex flex-wrap items-center justify-between gap-3">
        {/* Play / Pause / Stop / Replay Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePlayToggle}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm shadow-md transition-all cursor-pointer ${
              isPlaying
                ? 'bg-amber-500 hover:bg-amber-600 text-white'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4" />
                إيقاف مؤقت
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                تشغيل المشهد التمثيلي
              </>
            )}
          </button>

          {isSpeaking && (
            <button
              onClick={() => {
                playSound.click();
                stopSpeaking();
                setIsSpeaking(false);
                setIsPlaying(false);
                isPlayingRef.current = false;
              }}
              className="px-3 py-2.5 rounded-xl border border-rose-300 bg-rose-50 text-rose-800 hover:bg-rose-100 font-bold text-xs transition-colors cursor-pointer flex items-center gap-1"
              title="إيقاف الصوت فقط"
            >
              <span>كتم 🔇</span>
            </button>
          )}

          <button
            onClick={handleReplay}
            className="p-2.5 rounded-xl border border-emerald-300 bg-white text-emerald-800 hover:bg-emerald-100 transition-colors cursor-pointer flex items-center gap-1"
            title="إعادة المشهد من البداية"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="text-xs font-bold hidden sm:inline">إعادة</span>
          </button>
        </div>

        {/* Step Forward / Backward */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            disabled={currentLineIndex === 0}
            className="flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-semibold border border-emerald-200 bg-white text-emerald-900 hover:bg-emerald-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
            السابق
          </button>

          <span className="text-xs font-bold text-emerald-900 px-2">
            {currentLineIndex + 1} / {scene.dialogue.length}
          </span>

          <button
            onClick={handleNext}
            className="flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-semibold bg-emerald-700 hover:bg-emerald-800 text-white transition-colors cursor-pointer shadow-xs"
          >
            {isLastLine ? 'إنهاء المشهد' : 'التالي'}
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* End of Scene Quick Challenge */}
      {scene.quickQuestion && isLastLine && (
        <div className="p-5 bg-gradient-to-r from-emerald-100/70 to-teal-50 border-t-2 border-dashed border-emerald-300">
          <div className="flex items-center gap-2 mb-2 text-emerald-900 font-black text-sm">
            <Sparkles className="w-5 h-5 text-amber-500" />
            سؤال ذكي من أحمد ومريم حول المشهد:
          </div>
          <p className="font-bold text-slate-800 mb-3 text-base">
            {scene.quickQuestion.question}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {scene.quickQuestion.options.map((opt, idx) => {
              const isCorrect = idx === scene.quickQuestion?.correctIndex;
              const isSelected = quizAnswered === idx;

              let btnStyle = 'bg-white border-2 border-emerald-300 text-slate-800 hover:bg-emerald-50';
              if (quizAnswered !== null) {
                if (isCorrect) {
                  btnStyle = 'bg-emerald-600 text-white border-2 border-emerald-700 font-black';
                } else if (isSelected) {
                  btnStyle = 'bg-red-100 border-2 border-red-400 text-red-900';
                } else {
                  btnStyle = 'bg-slate-100 text-slate-400 border border-slate-200 opacity-60';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleQuizSelect(idx)}
                  disabled={quizAnswered !== null}
                  className={`p-3 rounded-xl text-right text-sm font-bold transition-all cursor-pointer ${btnStyle}`}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {showExplanation && (
            <div className="mt-3 p-3 bg-white rounded-xl border border-emerald-300 text-emerald-900 text-sm font-medium flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{scene.quickQuestion.explanation}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
