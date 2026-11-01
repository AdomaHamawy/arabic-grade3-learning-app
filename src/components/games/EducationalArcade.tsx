/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { GAMES_CATALOG, GameDefinition } from '../../data/curriculumData';
import { playSound, speakArabic, stopSpeaking } from '../../services/soundEffects';
import { useApp } from '../../context/AppContext';
import {
  Gamepad2,
  Sparkles,
  Trophy,
  RotateCcw,
  CheckCircle,
  Clock,
  ArrowRight,
  Star,
  Volume2,
  VolumeX,
  Shuffle
} from 'lucide-react';

export const EducationalArcade: React.FC = () => {
  const { progress, addStars, addXP, updateGameScore, unlockBadge, triggerCelebration } = useApp();
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);

  const activeGameDef = GAMES_CATALOG.find((g) => g.id === selectedGameId);

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-800 rounded-3xl p-6 md:p-8 text-white shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black text-3xl shadow-md">
              🎮
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black">عَالَمُ الأَلْعَابِ التَّعْلِيمِيَّةِ</h1>
              <p className="text-emerald-200 text-sm md:text-base font-medium mt-1">
                10 ألعاب وتحديات لغوية تفاعلية تثبّت المنهج بالمتعة والمغامرة
              </p>
            </div>
          </div>

          <div className="bg-emerald-950/60 border border-emerald-500/30 px-4 py-2.5 rounded-2xl flex items-center gap-3">
            <Trophy className="w-5 h-5 text-amber-400" />
            <div>
              <div className="text-xs text-emerald-200 font-bold">أعلى نتيجة محققة:</div>
              <div className="text-base font-black text-white">
                {Object.values(progress.gameScores).reduce((a, b) => a + b, 0)} نقطة لعب
              </div>
            </div>
          </div>
        </div>
      </div>

      {!selectedGameId ? (
        /* Games Selection Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {GAMES_CATALOG.map((game) => {
            const bestScore = progress.gameScores[game.id] || 0;
            return (
              <div
                key={game.id}
                className="bg-white rounded-3xl p-6 border-2 border-emerald-100 hover:border-emerald-400 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 font-black flex items-center justify-center text-lg">
                      {game.number}
                    </span>
                    <span className="text-xs bg-emerald-50 text-emerald-800 font-bold px-3 py-1 rounded-full border border-emerald-200">
                      {game.targetSkill}
                    </span>
                  </div>

                  <h3 className="font-black text-lg text-emerald-950 mb-2">{game.title}</h3>
                  <p className="text-slate-600 text-sm font-medium leading-relaxed mb-4">
                    {game.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-emerald-100 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600">
                    <Trophy className="w-4 h-4" />
                    <span>أفضل نتيجة: {bestScore}</span>
                  </div>

                  <button
                    onClick={() => {
                      playSound.click();
                      setSelectedGameId(game.id);
                    }}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-black px-4 py-2 rounded-xl text-sm transition-transform hover:scale-105 flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <span>العب الآن</span>
                    <ArrowRight className="w-4 h-4 rotate-180" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Active Game Sandbox View */
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-white p-4 rounded-2xl border-2 border-emerald-100 shadow-xs">
            <button
              onClick={() => {
                playSound.click();
                setSelectedGameId(null);
              }}
              className="flex items-center gap-2 text-emerald-800 hover:text-emerald-950 font-bold text-sm bg-emerald-50 hover:bg-emerald-100 px-4 py-2 rounded-xl transition-colors cursor-pointer"
            >
              <ArrowRight className="w-4 h-4" />
              <span>العودة لقائمة الألعاب</span>
            </button>

            <h2 className="text-lg md:text-xl font-black text-emerald-950 flex items-center gap-2">
              <span>🎮</span>
              <span>{activeGameDef?.title}</span>
            </h2>

            <span className="text-xs bg-amber-100 text-amber-900 font-bold px-3 py-1.5 rounded-full">
              وسام: {activeGameDef?.badgeReward}
            </span>
          </div>

          {/* Render Specific Game Component */}
          {selectedGameId === 'game-1' && <GameSentenceBuilder />}
          {selectedGameId === 'game-2' && <GameWordChoice />}
          {selectedGameId === 'game-3' && <GameSpellingHunter />}
          {selectedGameId === 'game-4' && <GameWordMatching />}
          {selectedGameId === 'game-5' && <GameFillBlank />}
          {selectedGameId === 'game-6' && <GameGrammarChallenge />}
          {selectedGameId === 'game-7' && <GameListeningQuiz />}
          {selectedGameId === 'game-8' && <GameSyllablesAssembler />}
          {selectedGameId === 'game-9' && <GameMemoryCards />}
          {selectedGameId === 'game-10' && <GameTimeAttack />}
        </div>
      )}
    </div>
  );
};

// ==========================================
// 1. GAME: Sentence Builder (ترتيب الكلمات لتكوين جملة)
// ==========================================
function GameSentenceBuilder() {
  const { addStars, addXP, updateGameScore, triggerCelebration } = useApp();
  const sentences = [
    {
      target: 'مَرْيَمُ تُحِبُّ النَّبَاتَاتِ وَالْوَرْدَ فِي حَدِيقَتِهَا',
      words: ['فِي', 'تُحِبُّ', 'مَرْيَمُ', 'حَدِيقَتِهَا', 'وَالْوَرْدَ', 'النَّبَاتَاتِ']
    },
    {
      target: 'الْعَمُّ أَمِينٌ حَارِسُ الْمَدْرَسَةِ الأَمِينُ يُنَظِّفُ الْفِنَاءَ',
      words: ['حَارِسُ', 'الْفِنَاءَ', 'الْعَمُّ', 'الْمَدْرَسَةِ', 'يُنَظِّفُ', 'أَمِينٌ', 'الأَمِينُ']
    },
    {
      target: 'اخْتَرَعَ الْمِصْرِيُّونَ الْقُدَمَاءُ وَرَقَ الْبَرْدِيِّ لِلْكِتَابَةِ',
      words: ['وَرَقَ', 'الْقُدَمَاءُ', 'الْمِصْرِيُّونَ', 'لِلْكِتَابَةِ', 'اخْتَرَعَ', 'الْبَرْدِيِّ']
    }
  ];

  const [levelIdx, setLevelIdx] = useState(0);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [availableWords, setAvailableWords] = useState<string[]>(sentences[0].words);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    setAvailableWords(sentences[levelIdx].words);
    setSelectedWords([]);
    setIsSuccess(false);
  }, [levelIdx]);

  const handlePickWord = (word: string, index: number) => {
    playSound.click();
    setSelectedWords([...selectedWords, word]);
    const updated = [...availableWords];
    updated.splice(index, 1);
    setAvailableWords(updated);
  };

  const handleRemoveWord = (word: string, index: number) => {
    playSound.click();
    const updated = [...selectedWords];
    updated.splice(index, 1);
    setSelectedWords(updated);
    setAvailableWords([...availableWords, word]);
  };

  const handleCheck = () => {
    const built = selectedWords.join(' ');
    if (built === sentences[levelIdx].target) {
      playSound.success();
      setIsSuccess(true);
      addStars(3);
      addXP(50);
      updateGameScore('game-1', (levelIdx + 1) * 100);
      triggerCelebration();
    } else {
      playSound.tryAgain();
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 border-2 border-emerald-100 shadow-sm space-y-6">
      <div className="flex items-center justify-between">
        <span className="font-extrabold text-emerald-900">المرحلة {levelIdx + 1} من {sentences.length}</span>
        <button
          onClick={() => {
            playSound.click();
            setAvailableWords(sentences[levelIdx].words);
            setSelectedWords([]);
            setIsSuccess(false);
          }}
          className="text-xs flex items-center gap-1 text-slate-500 hover:text-emerald-700 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          إعادة ترتيب الكلمات
        </button>
      </div>

      <div className="text-center">
        <p className="text-sm font-bold text-slate-500 mb-2">اضغط على الكلمات بالترتيب الصحيح لتكوين الجملة المفيدة:</p>
      </div>

      {/* Target Construction Zone */}
      <div className="min-h-24 p-5 rounded-2xl border-2 border-dashed border-emerald-300 bg-emerald-50/50 flex flex-wrap items-center justify-center gap-2.5">
        {selectedWords.length === 0 ? (
          <span className="text-slate-400 font-bold text-sm">الجملة ستظهر هنا عند اختيار الكلمات...</span>
        ) : (
          selectedWords.map((word, idx) => (
            <button
              key={idx}
              onClick={() => handleRemoveWord(word, idx)}
              className="bg-emerald-600 text-white font-extrabold text-base md:text-lg px-4 py-2 rounded-xl shadow-xs hover:bg-red-600 transition-colors cursor-pointer"
              title="اضغط لإلغاء الاختيار"
            >
              {word}
            </button>
          ))
        )}
      </div>

      {/* Available Word Bank */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        {availableWords.map((word, idx) => (
          <button
            key={idx}
            onClick={() => handlePickWord(word, idx)}
            className="bg-white border-2 border-emerald-300 hover:border-emerald-600 text-emerald-950 font-black text-base md:text-lg px-5 py-2.5 rounded-xl shadow-xs transition-transform hover:scale-105 cursor-pointer"
          >
            {word}
          </button>
        ))}
      </div>

      {/* Submit / Next */}
      <div className="pt-4 flex items-center justify-center gap-4">
        {!isSuccess ? (
          <button
            onClick={handleCheck}
            disabled={selectedWords.length === 0}
            className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-black text-base px-8 py-3 rounded-2xl shadow-md cursor-pointer transition-transform hover:scale-105"
          >
            تحقق من صحة الجملة ⭐
          </button>
        ) : (
          <button
            onClick={() => {
              if (levelIdx < sentences.length - 1) {
                setLevelIdx(levelIdx + 1);
              } else {
                setLevelIdx(0);
              }
            }}
            className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-base px-8 py-3 rounded-2xl shadow-md cursor-pointer animate-bounce"
          >
            {levelIdx < sentences.length - 1 ? 'الجملة التالية 🌟' : 'أعد من البداية 🔄'}
          </button>
        )}
      </div>
    </div>
  );
}

// ==========================================
// 2. GAME: Pick Correct Word (اكتشف الكلمة الصحيحة)
// ==========================================
function GameWordChoice() {
  const { addStars, addXP, updateGameScore } = useApp();
  const items = [
    {
      q: 'قَرَأَ آدَمُ ..... عَنْ تَارِيخِ الْكِتَابَةِ فِي مِصْرَ.',
      options: ['كِتَابًا', 'كِتَابٍ', 'كِتَابٌ'],
      correct: 0,
      note: 'مفعول به منصوب بتنوين الفتح (كِتَابًا).'
    },
    {
      q: 'الزَّهْرَةُ الْمَغْرُورَةُ شَعَرَتْ بِـ..... بَعْدَمَا سَاعَدَهَا الصَّبَّارُ.',
      options: ['النَّدَمِ', 'الْفَرَحِ', 'الْغُرُورِ'],
      correct: 0,
      note: 'ندمت الزهرة واعتذرت للصبار الطيب.'
    },
    {
      q: 'يَجِبُ أَنْ نُحَافِظَ ..... نَظَافَةِ مَدْرَسَتِنَا.',
      options: ['عَلَى', 'عَنْ', 'فِي'],
      correct: 0,
      note: 'يحافظ على الشيء.'
    }
  ];

  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);

  const cur = items[index];

  const handleSelect = (idx: number) => {
    setSelected(idx);
    if (idx === cur.correct) {
      playSound.success();
      addStars(2);
      addXP(25);
      updateGameScore('game-2', (index + 1) * 50);
    } else {
      playSound.tryAgain();
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 border-2 border-emerald-100 shadow-sm space-y-6">
      <div className="flex items-center justify-between">
        <span className="font-extrabold text-emerald-900">السؤال {index + 1} من {items.length}</span>
      </div>

      <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-200 text-center">
        <p className="text-xl md:text-2xl font-black text-slate-900 leading-relaxed">
          {cur.q}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {cur.options.map((opt, idx) => {
          let btnStyle = 'bg-white border-2 border-emerald-200 hover:border-emerald-500 text-slate-800';
          if (selected !== null) {
            if (idx === cur.correct) {
              btnStyle = 'bg-emerald-600 text-white border-2 border-emerald-700 font-black shadow-md';
            } else if (idx === selected) {
              btnStyle = 'bg-red-100 text-red-800 border-2 border-red-300';
            } else {
              btnStyle = 'bg-slate-50 text-slate-400 border-slate-200 opacity-60';
            }
          }
          return (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              disabled={selected !== null}
              className={`p-4 rounded-2xl font-bold text-lg transition-all cursor-pointer ${btnStyle}`}
            >
              {opt}
            </button>
          );
        })}
      </div>

      {selected !== null && (
        <div className="flex items-center justify-between pt-4">
          <p className="text-sm font-bold text-emerald-800">💡 {cur.note}</p>
          <button
            onClick={() => {
              setSelected(null);
              setIndex((index + 1) % items.length);
            }}
            className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-6 py-2.5 rounded-xl cursor-pointer"
          >
            التالي
          </button>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 3. GAME: Spelling Bug Hunter (صيد الأخطاء الإملائية)
// ==========================================
function GameSpellingHunter() {
  const { addStars, addXP, triggerCelebration } = useApp();
  const bugs = [
    {
      sentence: 'اشْتَرَى أَبِي قَلَمً جَدِيدًا وَكُرَّاسَتًا لِلهِبَةِ.',
      wrongWord: 'كُرَّاسَتًا',
      correction: 'كُرَّاسَةً',
      reason: 'التاء المربوطة لا تزاد بعدها ألف عند تنوين الفتح، بل يوضع التنوين عليها مباشرة: كُرَّاسَةً.'
    },
    {
      sentence: 'شَرِبَ الأَطْفَالُ مِيَاةَ النَّهْرِ الصَّافِيَةِ.',
      wrongWord: 'مِيَاةَ',
      correction: 'مِيَاهَ',
      reason: 'تنطق هاءً في الوقف والوصل (مياه)، لذا تكتب هاءً وليست تاء مربوطة.'
    },
    {
      sentence: 'رَأَيْتُ حَدِيقَت مُمْتَلِئَةً بِالْوُرُودِ.',
      wrongWord: 'حَدِيقَت',
      correction: 'حَدِيقَةً',
      reason: 'حديقة تنتهي بتاء مربوطة لأنها تنطق هاء عند الوقف (حديقة) وتنوين الفتح (حديقةً).'
    }
  ];

  const [idx, setIdx] = useState(0);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);

  const cur = bugs[idx];
  const words = cur.sentence.split(' ');

  const handleWordClick = (w: string) => {
    setSelectedWord(w);
    if (w.includes(cur.wrongWord)) {
      playSound.success();
      addStars(3);
      addXP(40);
      triggerCelebration();
    } else {
      playSound.tryAgain();
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 border-2 border-emerald-100 shadow-sm space-y-6">
      <div className="flex items-center justify-between">
        <span className="font-extrabold text-emerald-900">التحدي {idx + 1} من {bugs.length}</span>
        <span className="text-xs bg-amber-100 text-amber-900 font-bold px-3 py-1 rounded-full">
          ابحث عن الكلمة المكتوبة بخطأ إملائي واضغط عليها 🐛
        </span>
      </div>

      <div className="p-6 bg-amber-50/60 rounded-2xl border-2 border-amber-200 flex flex-wrap items-center justify-center gap-3">
        {words.map((w, wIdx) => {
          const isTargetWrong = w.includes(cur.wrongWord);
          const isClicked = selectedWord === w;

          let btnStyle = 'bg-white border-2 border-emerald-200 hover:border-amber-400 text-slate-800';
          if (selectedWord !== null) {
            if (isTargetWrong) {
              btnStyle = 'bg-red-500 text-white border-2 border-red-700 animate-pulse font-black';
            } else if (isClicked) {
              btnStyle = 'bg-slate-200 text-slate-500 border-slate-300';
            }
          }

          return (
            <button
              key={wIdx}
              onClick={() => handleWordClick(w)}
              className={`text-lg md:text-xl font-bold px-4 py-2 rounded-xl transition-all cursor-pointer ${btnStyle}`}
            >
              {w}
            </button>
          );
        })}
      </div>

      {selectedWord && selectedWord.includes(cur.wrongWord) && (
        <div className="p-5 bg-emerald-50 rounded-2xl border-2 border-emerald-300 space-y-2">
          <div className="flex items-center gap-2 text-emerald-900 font-black text-base">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
            <span>صيد ممتاز! الكلمة الصحيحة هي: «{cur.correction}»</span>
          </div>
          <p className="text-sm font-semibold text-slate-700">
            {cur.reason}
          </p>
          <div className="pt-2 text-left">
            <button
              onClick={() => {
                setSelectedWord(null);
                setIdx((idx + 1) % bugs.length);
              }}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-2 rounded-xl cursor-pointer"
            >
              التحدي التالي
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 4. GAME: Word & Meaning Matching (توصيل الكلمات بمعانيها)
// ==========================================
function GameWordMatching() {
  const { addStars, addXP } = useApp();
  const pairs = [
    { word: 'جِدَار', meaning: 'حَائِط' },
    { word: 'يَصُونُ', meaning: 'يَحْفَظُ' },
    { word: 'الْجَرِيءُ', meaning: 'الشُّجَاعُ' },
    { word: 'يُنْصِتُونَ', meaning: 'يَسْتَمِعُونَ بِاهْتِمَامٍ' }
  ];

  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [matched, setMatched] = useState<string[]>([]);

  const handleWordClick = (w: string) => {
    playSound.click();
    setSelectedWord(w);
  };

  const handleMeaningClick = (m: string) => {
    if (!selectedWord) return;
    const pair = pairs.find((p) => p.word === selectedWord);
    if (pair && pair.meaning === m) {
      playSound.success();
      setMatched([...matched, selectedWord]);
      setSelectedWord(null);
      addStars(2);
      addXP(20);
    } else {
      playSound.tryAgain();
      setSelectedWord(null);
    }
  };

  const isAllMatched = matched.length === pairs.length;

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 border-2 border-emerald-100 shadow-sm space-y-6">
      <div className="flex items-center justify-between">
        <span className="font-extrabold text-emerald-900">طابق الكلمة بمعناها الصحيح:</span>
        <button
          onClick={() => {
            playSound.click();
            setMatched([]);
            setSelectedWord(null);
          }}
          className="text-xs text-slate-500 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          إعادة
        </button>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Words Column */}
        <div className="space-y-3">
          <h4 className="font-extrabold text-sm text-emerald-900 mb-2">الْكَلِمَاتُ:</h4>
          {pairs.map((p) => {
            const isDone = matched.includes(p.word);
            const isCurSelected = selectedWord === p.word;
            return (
              <button
                key={p.word}
                disabled={isDone}
                onClick={() => handleWordClick(p.word)}
                className={`w-full p-4 rounded-xl text-center font-black text-lg transition-all cursor-pointer border-2 ${
                  isDone
                    ? 'bg-emerald-100 text-emerald-400 border-emerald-200 line-through'
                    : isCurSelected
                    ? 'bg-amber-400 text-slate-950 border-amber-500 scale-105 shadow-md'
                    : 'bg-white text-slate-900 border-emerald-200 hover:border-emerald-500'
                }`}
              >
                {p.word}
              </button>
            );
          })}
        </div>

        {/* Meanings Column */}
        <div className="space-y-3">
          <h4 className="font-extrabold text-sm text-teal-900 mb-2">الْمَعَانِي:</h4>
          {pairs.map((p) => {
            const isDone = matched.includes(p.word);
            return (
              <button
                key={p.meaning}
                disabled={isDone}
                onClick={() => handleMeaningClick(p.meaning)}
                className={`w-full p-4 rounded-xl text-center font-bold text-base transition-all cursor-pointer border-2 ${
                  isDone
                    ? 'bg-teal-100 text-teal-400 border-teal-200 line-through'
                    : 'bg-white text-slate-900 border-teal-200 hover:border-teal-500'
                }`}
              >
                {p.meaning}
              </button>
            );
          })}
        </div>
      </div>

      {isAllMatched && (
        <div className="p-4 bg-emerald-100 rounded-2xl text-center text-emerald-900 font-black text-lg animate-bounce">
          🎉 أحسنت صنعاً! طابقت جميع الكلمات بمعانيها بنجاح تام!
        </div>
      )}
    </div>
  );
}

// ==========================================
// 5. GAME: Fill Blank (أكمل الجملة)
// ==========================================
function GameFillBlank() {
  const { addStars, addXP } = useApp();
  const sentences = [
    {
      prefix: 'قَالَ الأَبُ لِهَبَةَ: «مِنْ فَضْلِكِ كَرِّرِي',
      suffix: 'حَتَّى تَنْجَحِي».',
      options: ['مُحَاوَلَاتِكِ', 'كِتَابَاتِكِ', 'أَلْعَابَكِ'],
      correct: 'مُحَاوَلَاتِكِ'
    },
    {
      prefix: 'شَبَّهَ الشَّاعِرُ الأَخْلَاقَ الْجَمِيلَةَ بِـ',
      suffix: 'فِي السَّمَاءِ تَنِيرُ كُلَّ شَيْءٍ.',
      options: ['الشَّمْسِ', 'الْغَيْمَةِ', 'الرِّيَاحِ'],
      correct: 'الشَّمْسِ'
    }
  ];

  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);

  const cur = sentences[idx];

  const handleSelect = (choice: string) => {
    setSelected(choice);
    if (choice === cur.correct) {
      playSound.success();
      addStars(2);
      addXP(20);
    } else {
      playSound.tryAgain();
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 border-2 border-emerald-100 shadow-sm space-y-6">
      <span className="font-extrabold text-emerald-900">الجملة {idx + 1} من {sentences.length}</span>

      <div className="p-6 bg-emerald-50 rounded-2xl border-2 border-emerald-200 text-center text-lg md:text-xl font-bold leading-loose text-slate-900">
        <span>{cur.prefix} </span>
        <span className="px-3 py-1 bg-amber-300 text-slate-950 rounded-lg underline font-black">
          {selected || '..........'}
        </span>
        <span> {cur.suffix}</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {cur.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => handleSelect(opt)}
            className="p-3.5 rounded-xl border-2 border-emerald-300 bg-white hover:bg-emerald-100 font-bold text-base cursor-pointer transition-all"
          >
            {opt}
          </button>
        ))}
      </div>

      {selected === cur.correct && (
        <div className="pt-2 text-left">
          <button
            onClick={() => {
              setSelected(null);
              setIdx((idx + 1) % sentences.length);
            }}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-2.5 rounded-xl cursor-pointer"
          >
            الجملة التالية
          </button>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 6. GAME: Grammar Challenge (تحدي النحو والأساليب)
// ==========================================
function GameGrammarChallenge() {
  const { addStars, addXP, triggerCelebration } = useApp();
  const questions = [
    {
      q: 'حَدِّدِ الْجُمْلَةَ الَّتِي تَدُلُّ عَلَى النَّفْيِ فِي الْمُسْتَقْبَلِ:',
      options: [
        'لَنْ أُهْمِلَ مُذَاكَرَتِي غَدًا.',
        'لَمْ أَقْرَأِ الْقِصَّةَ أَمْسِ.',
        'لَا تُسْرِفْ فِي الْمَاءِ.'
      ],
      correct: 0
    },
    {
      q: 'اخْتَرْ اسْمَ الإِشَارَةِ الصَّحِيحَ: ..... سَفِينَتَانِ فِي الْبَحْرِ.',
      options: ['هَاتَانِ', 'هَذَانِ', 'هَؤُلَاءِ'],
      correct: 0
    }
  ];

  const [qIdx, setQIdx] = useState(0);
  const [ans, setAns] = useState<number | null>(null);

  const cur = questions[qIdx];

  const handlePick = (i: number) => {
    setAns(i);
    if (i === cur.correct) {
      playSound.success();
      addStars(3);
      addXP(30);
      triggerCelebration();
    } else {
      playSound.tryAgain();
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 border-2 border-emerald-100 shadow-sm space-y-6">
      <div className="flex items-center justify-between">
        <span className="font-extrabold text-emerald-900">سؤال {qIdx + 1} من {questions.length}</span>
      </div>

      <div className="p-6 bg-teal-50 rounded-2xl border-2 border-teal-200">
        <p className="text-xl font-black text-slate-900 text-center">{cur.q}</p>
      </div>

      <div className="space-y-3">
        {cur.options.map((opt, i) => {
          let btn = 'bg-white border-2 border-teal-200 hover:border-teal-500 text-slate-800';
          if (ans !== null) {
            if (i === cur.correct) btn = 'bg-emerald-600 text-white border-2 border-emerald-700 font-black';
            else if (i === ans) btn = 'bg-red-100 text-red-800 border-2 border-red-300';
            else btn = 'bg-slate-50 text-slate-400 border-slate-200 opacity-60';
          }
          return (
            <button
              key={i}
              onClick={() => handlePick(i)}
              disabled={ans !== null}
              className={`w-full p-4 rounded-xl text-right font-bold text-base transition-all cursor-pointer ${btn}`}
            >
              {opt}
            </button>
          );
        })}
      </div>

      {ans !== null && (
        <div className="pt-2 text-left">
          <button
            onClick={() => {
              setAns(null);
              setQIdx((qIdx + 1) % questions.length);
            }}
            className="bg-teal-700 hover:bg-teal-800 text-white font-bold px-6 py-2.5 rounded-xl cursor-pointer"
          >
            السؤال التالي
          </button>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 7. GAME: Listening Quiz (الاستماع واختيار الإجابة)
// ==========================================
function GameListeningQuiz() {
  const { addStars, addXP } = useApp();
  const audioQuizzes = [
    {
      audioText: 'عُصْفُورٌ صَغِيرٌ بَنَى عُشَّهُ فَوْقَ شَجَرَةٍ أَمَامَ بَيْتِي، وَدَافَعَ عَنْهُ بِشَجَاعَةٍ ضِدَّ طَائِرٍ غَرِيبٍ.',
      question: 'أين بنى العصفور عشه الصغير؟',
      options: ['فوق شجرة أمام البيت', 'داخل قفص حديدي', 'فوق سطح المدرسة'],
      correct: 0
    },
    {
      audioText: 'جَلَسَ وَالِدُ هِبَةَ بِجِوَارِهَا وَشَجَّعَهَا، وَكَتَبَ لَهَا: مِنْ فَضْلِكِ كَرِّرِي مُحَاوَلَاتِكِ.',
      question: 'ما العبارة التي كتبها الوالد على كراسة هبة؟',
      options: ['من فضلك كرري محاولاتك', 'لا ترسمي مرة أخرى', 'اشتري لوحة جاهزة'],
      correct: 0
    }
  ];

  const [idx, setIdx] = useState(0);
  const [ans, setAns] = useState<number | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, []);

  const cur = audioQuizzes[idx];

  const handlePlayVoice = () => {
    playSound.click();
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
      return;
    }
    setIsSpeaking(true);
    speakArabic(cur.audioText, {
      voiceType: 'male_teacher',
      onStart: () => setIsSpeaking(true),
      onEnd: () => setIsSpeaking(false),
    });
  };

  const handlePick = (i: number) => {
    setAns(i);
    if (i === cur.correct) {
      playSound.success();
      addStars(3);
      addXP(30);
    } else {
      playSound.tryAgain();
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 border-2 border-emerald-100 shadow-sm space-y-6">
      <div className="text-center space-y-3">
        <button
          onClick={handlePlayVoice}
          className={`${
            isSpeaking
              ? 'bg-rose-500 hover:bg-rose-600 text-white ring-4 ring-rose-200'
              : 'bg-amber-400 hover:bg-amber-500 text-slate-950'
          } font-black px-6 py-3 rounded-2xl shadow-md inline-flex items-center gap-2 cursor-pointer transition-transform hover:scale-105`}
        >
          {isSpeaking ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
          <span>{isSpeaking ? 'إيقاف الاستماع ⏹️' : 'اضغط هنا للاستماع إلى النص المسموع 🎙️'}</span>
        </button>
        <p className="text-xs text-slate-500">استمع بتركيز جيد ثم أجب عن السؤال</p>
      </div>

      <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-200">
        <h3 className="font-black text-lg text-emerald-950 text-center">{cur.question}</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {cur.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => handlePick(i)}
            className="p-4 rounded-2xl border-2 border-emerald-200 bg-white hover:bg-emerald-100 font-bold text-base cursor-pointer transition-all"
          >
            {opt}
          </button>
        ))}
      </div>

      {ans !== null && (
        <div className="pt-2 text-left">
          <button
            onClick={() => {
              setAns(null);
              setIdx((idx + 1) % audioQuizzes.length);
            }}
            className="bg-emerald-600 text-white font-bold px-6 py-2 rounded-xl cursor-pointer"
          >
            السؤال التالي
          </button>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 8. GAME: Syllables Assembler (تكوين الكلمات والمقاطع)
// ==========================================
function GameSyllablesAssembler() {
  const { addStars, addXP } = useApp();
  const puzzles = [
    {
      syllables: ['أَلْـ', 'ـبَـ', 'ـطَـ', 'ـلُ'],
      result: 'الأَبْطَالُ'
    },
    {
      syllables: ['مُـ', 'ـسَا', 'بَـ', 'ـقَـ', 'ـةٌ'],
      result: 'مُسَابَقَةٌ'
    },
    {
      syllables: ['تَـ', 'ـعَلْـ', 'ـلَـ', 'ـمْـ', 'ـتُ'],
      result: 'تَعَلَّمْتُ'
    }
  ];

  const [idx, setIdx] = useState(0);
  const cur = puzzles[idx];
  const [clicked, setClicked] = useState<string[]>([]);

  const handleSyllable = (s: string) => {
    playSound.click();
    setClicked([...clicked, s]);
  };

  const isComplete = clicked.length === cur.syllables.length;

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 border-2 border-emerald-100 shadow-sm space-y-6">
      <div className="flex items-center justify-between">
        <span className="font-extrabold text-emerald-900">ركّب المقاطع لتكوين الكلمة:</span>
        <button
          onClick={() => setClicked([])}
          className="text-xs text-slate-500 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          إعادة
        </button>
      </div>

      <div className="p-6 bg-emerald-50 rounded-2xl border-2 border-dashed border-emerald-300 min-h-24 flex items-center justify-center gap-2">
        {clicked.map((s, i) => (
          <span key={i} className="text-2xl font-black text-emerald-800 bg-white px-3 py-1.5 rounded-xl border border-emerald-200">
            {s}
          </span>
        ))}
        {clicked.length === 0 && <span className="text-slate-400 font-bold text-sm">اختر المقاطع بالترتيب</span>}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        {cur.syllables.map((s, i) => {
          const used = clicked.includes(s);
          return (
            <button
              key={i}
              disabled={used}
              onClick={() => handleSyllable(s)}
              className="bg-white border-2 border-emerald-300 hover:border-emerald-600 disabled:opacity-40 text-emerald-950 font-black text-xl px-5 py-3 rounded-2xl shadow-xs transition-all cursor-pointer"
            >
              {s}
            </button>
          );
        })}
      </div>

      {isComplete && (
        <div className="pt-4 text-center space-y-3">
          <p className="text-lg font-black text-emerald-700">🎉 رائع! الكلمة المكتملة هي: «{cur.result}»</p>
          <button
            onClick={() => {
              setClicked([]);
              setIdx((idx + 1) % puzzles.length);
              addStars(2);
              addXP(25);
            }}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-2.5 rounded-xl cursor-pointer"
          >
            الكلمة التالية
          </button>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 9. GAME: Memory Cards (الذاكرة اللغوية)
// ==========================================
function GameMemoryCards() {
  const { addStars, addXP, triggerCelebration } = useApp();
  const rawCards = [
    { id: '1a', text: 'سَعَى', matchKey: '1' },
    { id: '1b', text: 'اجْتَهَدَ', matchKey: '1' },
    { id: '2a', text: 'الأَمَل', matchKey: '2' },
    { id: '2b', text: 'الْيَأْس (مضاد)', matchKey: '2' },
    { id: '3a', text: 'جِدَار', matchKey: '3' },
    { id: '3b', text: 'حَائِط', matchKey: '3' }
  ];

  const [cards, setCards] = useState(() => [...rawCards].sort(() => Math.random() - 0.5));
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<string[]>([]);

  const handleCardClick = (index: number) => {
    if (flipped.length === 2 || flipped.includes(index)) return;
    playSound.click();

    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      const card1 = cards[newFlipped[0]];
      const card2 = cards[newFlipped[1]];
      if (card1.matchKey === card2.matchKey) {
        playSound.success();
        setMatched([...matched, card1.matchKey]);
        setFlipped([]);
        addStars(2);
        addXP(20);
        if (matched.length + 1 === rawCards.length / 2) {
          triggerCelebration();
        }
      } else {
        setTimeout(() => {
          setFlipped([]);
        }, 1000);
      }
    }
  };

  const handleRestart = () => {
    playSound.click();
    setCards([...rawCards].sort(() => Math.random() - 0.5));
    setFlipped([]);
    setMatched([]);
  };

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 border-2 border-emerald-100 shadow-sm space-y-6">
      <div className="flex items-center justify-between">
        <span className="font-extrabold text-emerald-900">اقلب البطاقات وطابق الكلمات بمعانيها أو مضاداتها:</span>
        <button
          onClick={handleRestart}
          className="text-xs text-slate-500 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          إعادة خلط البطاقات
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {cards.map((c, i) => {
          const isFlipped = flipped.includes(i) || matched.includes(c.matchKey);
          return (
            <button
              key={c.id}
              onClick={() => handleCardClick(i)}
              className={`h-28 rounded-2xl font-black text-base md:text-lg transition-all duration-300 cursor-pointer border-2 shadow-xs ${
                isFlipped
                  ? 'bg-emerald-600 text-white border-emerald-700 shadow-md scale-102'
                  : 'bg-emerald-100 text-emerald-800 border-emerald-300 hover:bg-emerald-200'
              }`}
            >
              {isFlipped ? c.text : '❓ اضغط للقلب'}
            </button>
          );
        })}
      </div>

      {matched.length === rawCards.length / 2 && (
        <div className="p-4 bg-emerald-100 rounded-2xl text-center text-emerald-950 font-black text-lg animate-bounce">
          🎉 ذاكرة خارقة وممتازة يا بطل!
        </div>
      )}
    </div>
  );
}

// ==========================================
// 10. GAME: Time Attack (سباق الزمن للأبطال)
// ==========================================
function GameTimeAttack() {
  const { addStars, addXP, updateGameScore, triggerCelebration } = useApp();
  const speedQuestions = [
    { q: 'مفرد (جُدْرَان):', ans: 'جِدَار', choices: ['جِدَار', 'جَدِيد', 'جَدّ'] },
    { q: 'أداة نفي للمستقبل:', ans: 'لَنْ', choices: ['لَنْ', 'لَمْ', 'مَا'] },
    { q: 'أداة استفهام للسبب:', ans: 'لِمَاذَا', choices: ['لِمَاذَا', 'مَنْ', 'هَلْ'] },
    { q: 'حرف جر يفيد الاستعلاء:', ans: 'عَلَى', choices: ['عَلَى', 'عَنْ', 'فِي'] },
    { q: 'مثنى (شَجَرَة):', ans: 'شَجَرَتَانِ', choices: ['شَجَرَتَانِ', 'أَشْجَار', 'شَجِيرَة'] }
  ];

  const [timeLeft, setTimeLeft] = useState(30);
  const [isRunning, setIsRunning] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      setIsRunning(false);
      setIsFinished(true);
      updateGameScore('game-10', score * 20);
      triggerCelebration();
    }
    return () => clearTimeout(timer);
  }, [isRunning, timeLeft, score]);

  const handleStart = () => {
    playSound.click();
    setTimeLeft(30);
    setScore(0);
    setCurrentIdx(0);
    setIsRunning(true);
    setIsFinished(false);
  };

  const handleAnswer = (choice: string) => {
    const cur = speedQuestions[currentIdx];
    if (choice === cur.ans) {
      playSound.success();
      setScore((s) => s + 1);
      addStars(1);
      addXP(15);
    } else {
      playSound.tryAgain();
    }
    if (currentIdx < speedQuestions.length - 1) {
      setCurrentIdx((c) => c + 1);
    } else {
      setCurrentIdx(0); // loop
    }
  };

  const curQ = speedQuestions[currentIdx];

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 border-2 border-emerald-100 shadow-sm space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-amber-500 animate-pulse" />
          <span className="font-black text-lg text-slate-800">الوقت المتبقي: {timeLeft} ثانية</span>
        </div>
        <div className="font-black text-lg text-emerald-800">
          النقاط: {score} ⚡
        </div>
      </div>

      {!isRunning && !isFinished && (
        <div className="text-center py-8 space-y-4">
          <p className="text-slate-600 font-bold text-base">لديك 30 ثانية للإجابة على أكبر عدد ممكن من الأسئلة السريعة!</p>
          <button
            onClick={handleStart}
            className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-lg px-8 py-3.5 rounded-2xl shadow-lg cursor-pointer transition-transform hover:scale-105"
          >
            انطلاق السباق ⏱️
          </button>
        </div>
      )}

      {isRunning && (
        <div className="space-y-5">
          <div className="p-6 bg-emerald-50 rounded-2xl border-2 border-emerald-300 text-center">
            <h3 className="text-2xl font-black text-slate-900">{curQ.q}</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {curQ.choices.map((c, i) => (
              <button
                key={i}
                onClick={() => handleAnswer(c)}
                className="p-4 rounded-xl border-2 border-emerald-300 bg-white hover:bg-emerald-100 font-black text-lg transition-all cursor-pointer"
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      )}

      {isFinished && (
        <div className="text-center py-6 space-y-4">
          <div className="w-16 h-16 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-black text-3xl mx-auto shadow-md">
            🏆
          </div>
          <h3 className="text-2xl font-black text-emerald-950">انتهى الوقت يا بطل!</h3>
          <p className="text-lg font-bold text-slate-700">لقد حققت: {score} إجابات صحيحة في 30 ثانية!</p>
          <button
            onClick={handleStart}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-2.5 rounded-xl cursor-pointer"
          >
            حاول كسر رقمك القياسي 🔄
          </button>
        </div>
      )}
    </div>
  );
}
