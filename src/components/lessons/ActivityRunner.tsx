/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ActivityQuestion } from '../../types/curriculum';
import { playSound } from '../../services/soundEffects';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, XCircle, HelpCircle, Star, Sparkles, RefreshCw } from 'lucide-react';

interface ActivityRunnerProps {
  activities: ActivityQuestion[];
  lessonTitle: string;
  onAllCompleted?: () => void;
}

export const ActivityRunner: React.FC<ActivityRunnerProps> = ({
  activities,
  lessonTitle,
  onAllCompleted
}) => {
  const { progress, addStars, addXP } = useApp();
  const [answers, setAnswers] = useState<Record<string, { userVal: any; isCorrect: boolean; showHint?: boolean }>>({});

  const handleSelectAnswer = (q: ActivityQuestion, selectedVal: any) => {
    playSound.click();
    const isCorrect = String(selectedVal).trim() === String(q.correctAnswer).trim();

    if (isCorrect) {
      playSound.success();
      addStars(2);
      addXP(25);
    } else {
      playSound.tryAgain();
    }

    const updated = {
      ...answers,
      [q.id]: { userVal: selectedVal, isCorrect }
    };
    setAnswers(updated);

    // Check if all answered correctly
    const allAnswered = activities.every((act) => updated[act.id]?.isCorrect);
    if (allAnswered && onAllCompleted) {
      setTimeout(() => {
        onAllCompleted();
      }, 800);
    }
  };

  const handleReset = (qId: string) => {
    playSound.click();
    setAnswers((prev) => {
      const copy = { ...prev };
      delete copy[qId];
      return copy;
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-3 border-b-2 border-emerald-200">
        <h4 className="font-extrabold text-lg text-emerald-900 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-500" />
          <span>تَدْرِيبَاتٌ وَأَنْشِطَةُ كِتَابِ الْوَزَارَةِ ({activities.length} أنشطة تفاعلية)</span>
        </h4>
        <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-full">
          +2 نجوم لكل إجابة صحيحة ⭐
        </span>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {activities.map((q, idx) => {
          const ans = answers[q.id];
          const hasAnswered = ans !== undefined;

          return (
            <div
              key={q.id}
              className={`p-5 rounded-2xl border-2 transition-all ${
                hasAnswered
                  ? ans.isCorrect
                    ? 'bg-emerald-50/80 border-emerald-400'
                    : 'bg-amber-50/70 border-amber-300'
                  : 'bg-white border-emerald-100 hover:border-emerald-300 shadow-sm'
              }`}
            >
              {/* Question Header */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                    {idx + 1}
                  </span>
                  <p className="font-bold text-slate-900 text-base md:text-lg leading-relaxed">
                    {q.prompt}
                  </p>
                </div>

                {hasAnswered && (
                  <button
                    onClick={() => handleReset(q.id)}
                    className="p-1.5 text-slate-400 hover:text-emerald-700 hover:bg-emerald-100 rounded-lg transition-colors cursor-pointer"
                    title="إعادة المحاولة"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Options / Action based on type */}
              {q.type === 'true_false' && (
                <div className="flex items-center gap-4 mt-4">
                  {['صح', 'خطأ'].map((choice) => {
                    const isSelected = ans?.userVal === choice;
                    let style = 'bg-white border-2 border-emerald-200 hover:border-emerald-500 text-slate-800';
                    if (hasAnswered) {
                      if (choice === q.correctAnswer) {
                        style = 'bg-emerald-600 text-white border-2 border-emerald-700 shadow-md font-black';
                      } else if (isSelected) {
                        style = 'bg-red-100 text-red-800 border-2 border-red-300';
                      } else {
                        style = 'bg-slate-50 text-slate-400 border-slate-200 opacity-60';
                      }
                    }

                    return (
                      <button
                        key={choice}
                        onClick={() => handleSelectAnswer(q, choice)}
                        disabled={hasAnswered && ans.isCorrect}
                        className={`flex-1 py-3 px-6 rounded-xl font-bold text-base transition-all cursor-pointer flex items-center justify-center gap-2 ${style}`}
                      >
                        <span>{choice === 'صح' ? '✔️' : '❌'}</span>
                        <span>{choice}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {(q.type === 'multiple_choice' || q.type === 'syllables') && q.options && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mt-4">
                  {q.options.map((opt, optIdx) => {
                    const optionValue = typeof q.correctAnswer === 'number' ? optIdx : opt;
                    const isSelected = ans?.userVal === optionValue;
                    const isCorrectAnswer =
                      typeof q.correctAnswer === 'number'
                        ? optIdx === q.correctAnswer
                        : opt === q.correctAnswer;

                    let style = 'bg-white border-2 border-emerald-200 hover:border-emerald-500 text-slate-800';
                    if (hasAnswered) {
                      if (isCorrectAnswer) {
                        style = 'bg-emerald-600 text-white border-2 border-emerald-700 shadow-md font-black';
                      } else if (isSelected) {
                        style = 'bg-red-100 text-red-800 border-2 border-red-300';
                      } else {
                        style = 'bg-slate-50 text-slate-400 border-slate-200 opacity-60';
                      }
                    }

                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleSelectAnswer(q, optionValue)}
                        disabled={hasAnswered && ans.isCorrect}
                        className={`p-3 rounded-xl text-center font-bold text-sm md:text-base transition-all cursor-pointer ${style}`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Feedback and Explanation */}
              {hasAnswered && (
                <div
                  className={`mt-4 p-3.5 rounded-xl border flex items-start gap-3 ${
                    ans.isCorrect
                      ? 'bg-emerald-100/80 border-emerald-300 text-emerald-950'
                      : 'bg-amber-100/80 border-amber-300 text-amber-950'
                  }`}
                >
                  {ans.isCorrect ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <HelpCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  )}
                  <div className="text-sm">
                    <p className="font-extrabold mb-1">
                      {ans.isCorrect ? 'ممتاز يا بطل! إجابة صحيحة ومتقنة ⭐' : 'فكر مرة أخرى يا صديقي، الخطأ طريق التعلم!'}
                    </p>
                    <p className="text-slate-800 leading-relaxed font-medium">
                      {q.explanation}
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
