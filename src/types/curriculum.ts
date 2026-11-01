/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface VocabularyItem {
  id: string;
  word: string;
  meaning: string;
  opposite?: string;
  singularOrPlural?: {
    type: 'جمع' | 'مفرد';
    value: string;
  };
  exampleSentence: string;
}

export interface DramaDialogueLine {
  id: string;
  character: 'ahmed' | 'maryam' | 'teacher' | 'father' | 'uncle_amin' | 'heba' | 'salma' | 'narrator';
  characterName: string;
  text: string;
  audioPrompt?: string; // Egyptian friendly dialogue text
  expression: 'happy' | 'thinking' | 'excited' | 'explaining' | 'encouraging';
  sceneVisualNote?: string;
}

export interface DramaScene {
  id: string;
  title: string;
  location: string;
  locationType: 'classroom' | 'home' | 'school_yard' | 'garden' | 'nile_bank';
  description: string;
  dialogue: DramaDialogueLine[];
  quickQuestion?: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

export interface ActivityQuestion {
  id: string;
  type: 'multiple_choice' | 'true_false' | 'fill_blank' | 'reorder' | 'syllables' | 'connect';
  prompt: string;
  options?: string[];
  correctAnswer: string | number | string[];
  explanation: string;
  hint?: string;
}

export interface Lesson {
  id: string;
  unitId: string;
  unitNumber: number;
  lessonNumber: number;
  type: 'listening' | 'reading' | 'poem' | 'story';
  title: string;
  subtitle: string;
  pageReference: string; // from textbook
  overview: string;
  goals: string[];
  fullText: string[];
  dramaScenes: DramaScene[];
  vocabulary: VocabularyItem[];
  grammarFocus: {
    title: string;
    ruleSummary: string;
    examples: string[];
  };
  spellingFocus: {
    title: string;
    ruleSummary: string;
    examples: string[];
  };
  activities: ActivityQuestion[];
  reflectionPrompt: {
    wordsTitle: string;
    behaviorTitle: string;
    suggestedBehavior: string;
  };
}

export interface Unit {
  id: string;
  number: number;
  title: string;
  theme: string;
  badgeName: string;
  color: string;
  lessons: Lesson[];
  unitAssessment: ActivityQuestion[];
}

export interface UserProgress {
  childName: string;
  avatar: 'ahmed' | 'maryam';
  stars: number;
  xp: number;
  level: number;
  completedLessons: string[];
  completedAssessments: string[];
  earnedBadges: string[];
  gameScores: Record<string, number>;
  savedReflections: Record<string, { words: string; behavior: string }>;
  soundEnabled: boolean;
  autoplayAudio: boolean;
}
