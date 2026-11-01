/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider } from './context/AppContext';
import { AppLayout } from './components/layout/AppLayout';
import { HomeScreen } from './components/home/HomeScreen';
import { LessonsHub } from './components/lessons/LessonsHub';
import { GrammarStudio } from './components/grammar/GrammarStudio';
import { EducationalArcade } from './components/games/EducationalArcade';
import { AssessmentBook } from './components/assessments/AssessmentBook';
import { ExamSystem } from './components/exams/ExamSystem';
import { AchievementsScreen } from './components/achievements/AchievementsScreen';
import { ParentGuide } from './components/help/ParentGuide';

function MainApp() {
  const [currentSection, setCurrentSection] = useState<string>('home');

  return (
    <AppLayout currentSection={currentSection} onNavigate={setCurrentSection}>
      {currentSection === 'home' && <HomeScreen onNavigate={setCurrentSection} />}
      {currentSection === 'lessons' && <LessonsHub />}
      {currentSection === 'grammar' && <GrammarStudio />}
      {currentSection === 'games' && <EducationalArcade />}
      {currentSection === 'assessments' && <AssessmentBook />}
      {currentSection === 'exams' && <ExamSystem />}
      {currentSection === 'achievements' && <AchievementsScreen />}
      {currentSection === 'help' && <ParentGuide />}
    </AppLayout>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
