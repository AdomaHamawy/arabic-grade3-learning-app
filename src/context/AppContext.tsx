/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { playSound } from '../services/soundEffects';
import { UserProgress } from '../types/curriculum';

interface AppContextType {
  progress: UserProgress;
  updateChildName: (name: string) => void;
  setAvatar: (avatar: 'ahmed' | 'maryam') => void;
  toggleSound: () => void;
  toggleAutoplay: () => void;
  addStars: (count: number) => void;
  addXP: (amount: number) => void;
  completeLesson: (lessonId: string) => void;
  completeAssessment: (assessmentId: string) => void;
  unlockBadge: (badgeId: string) => void;
  updateGameScore: (gameId: string, score: number) => void;
  saveReflection: (lessonId: string, reflection: { words: string; behavior: string }) => void;
  triggerCelebration: () => void;
  resetProgress: () => void;
  currentLevelTitle: string;
}

const STORAGE_KEY = 'ahmed_maryam_arabic_progress_v1';

const INITIAL_PROGRESS: UserProgress = {
  childName: 'بطل لغتي الجميلة',
  avatar: 'ahmed',
  stars: 15,
  xp: 150,
  level: 1,
  completedLessons: ['u1-l1'],
  completedAssessments: [],
  earnedBadges: ['مستكشف_اللغة_الجديد'],
  gameScores: {},
  savedReflections: {},
  soundEnabled: true,
  autoplayAudio: true,
};

const LEVEL_TITLES = [
  'المستكشف الصغير',
  'القارئ الذكي',
  'بطل الإملاء والمقاطع',
  'عبقري النحو والأساليب',
  'فارس الكلمات والقصص',
  'أمير الفصاحة العربية'
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [progress, setProgress] = useState<UserProgress>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // ignore
    }
    return INITIAL_PROGRESS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
      // storage unavailable
    }
  }, [progress]);

  const updateChildName = (name: string) => {
    setProgress((prev) => ({ ...prev, childName: name || 'بطل اللغة العربية' }));
  };

  const setAvatar = (avatar: 'ahmed' | 'maryam') => {
    setProgress((prev) => ({ ...prev, avatar }));
  };

  const toggleSound = () => {
    setProgress((prev) => ({ ...prev, soundEnabled: !prev.soundEnabled }));
  };

  const toggleAutoplay = () => {
    setProgress((prev) => ({ ...prev, autoplayAudio: !prev.autoplayAudio }));
  };

  const triggerCelebration = () => {
    if (progress.soundEnabled) {
      playSound.fanfare();
    }
    try {
      confetti({
        particleCount: 75,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#22c55e', '#16a34a', '#eab308', '#38bdf8', '#f97316']
      });
    } catch {
      // confetti fallback
    }
  };

  const addStars = (count: number) => {
    if (progress.soundEnabled) {
      playSound.star();
    }
    setProgress((prev) => {
      const newStars = prev.stars + count;
      const newXP = prev.xp + count * 20;
      const newLevel = Math.min(6, Math.floor(newXP / 200) + 1);
      return {
        ...prev,
        stars: newStars,
        xp: newXP,
        level: newLevel
      };
    });
  };

  const addXP = (amount: number) => {
    setProgress((prev) => {
      const newXP = prev.xp + amount;
      const newLevel = Math.min(6, Math.floor(newXP / 200) + 1);
      return {
        ...prev,
        xp: newXP,
        level: newLevel
      };
    });
  };

  const completeLesson = (lessonId: string) => {
    if (progress.completedLessons.includes(lessonId)) return;
    triggerCelebration();
    setProgress((prev) => {
      const completed = [...prev.completedLessons, lessonId];
      const newStars = prev.stars + 5;
      const newXP = prev.xp + 100;
      const newLevel = Math.min(6, Math.floor(newXP / 200) + 1);
      return {
        ...prev,
        completedLessons: completed,
        stars: newStars,
        xp: newXP,
        level: newLevel
      };
    });
  };

  const completeAssessment = (assessmentId: string) => {
    if (progress.completedAssessments.includes(assessmentId)) return;
    triggerCelebration();
    setProgress((prev) => {
      const completed = [...prev.completedAssessments, assessmentId];
      const newStars = prev.stars + 10;
      const newXP = prev.xp + 150;
      const newLevel = Math.min(6, Math.floor(newXP / 200) + 1);
      return {
        ...prev,
        completedAssessments: completed,
        stars: newStars,
        xp: newXP,
        level: newLevel
      };
    });
  };

  const unlockBadge = (badgeId: string) => {
    if (progress.earnedBadges.includes(badgeId)) return;
    triggerCelebration();
    setProgress((prev) => ({
      ...prev,
      earnedBadges: [...prev.earnedBadges, badgeId]
    }));
  };

  const updateGameScore = (gameId: string, score: number) => {
    setProgress((prev) => {
      const currentHigh = prev.gameScores[gameId] || 0;
      if (score > currentHigh) {
        return {
          ...prev,
          gameScores: {
            ...prev.gameScores,
            [gameId]: score
          }
        };
      }
      return prev;
    });
  };

  const saveReflection = (lessonId: string, reflection: { words: string; behavior: string }) => {
    if (progress.soundEnabled) {
      playSound.success();
    }
    setProgress((prev) => ({
      ...prev,
      savedReflections: {
        ...prev.savedReflections,
        [lessonId]: reflection
      }
    }));
  };

  const resetProgress = () => {
    setProgress(INITIAL_PROGRESS);
  };

  const currentLevelTitle = LEVEL_TITLES[Math.min(progress.level - 1, LEVEL_TITLES.length - 1)];

  return (
    <AppContext.Provider
      value={{
        progress,
        updateChildName,
        setAvatar,
        toggleSound,
        toggleAutoplay,
        addStars,
        addXP,
        completeLesson,
        completeAssessment,
        unlockBadge,
        updateGameScore,
        saveReflection,
        triggerCelebration,
        resetProgress,
        currentLevelTitle
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
