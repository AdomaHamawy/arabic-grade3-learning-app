/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { playSound } from '../../services/soundEffects';
import {
  Menu,
  X,
  Home,
  BookOpen,
  Award,
  Gamepad2,
  FileCheck,
  Trophy,
  User,
  Volume2,
  VolumeX,
  HelpCircle,
  Sparkles,
  Star
} from 'lucide-react';

interface AppLayoutProps {
  currentSection: string;
  onNavigate: (section: string) => void;
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  currentSection,
  onNavigate,
  children
}) => {
  const { progress, toggleSound } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const ahmedAvatar = '/src/assets/images/ahmed_3d_avatar_1793515761332.jpg';
  const maryamAvatar = '/src/assets/images/maryam_3d_avatar_1793515761369.jpg';

  const navItems = [
    { id: 'home', label: 'الرئيسية', icon: Home },
    { id: 'lessons', label: 'رحلتي مع الدروس', icon: BookOpen },
    { id: 'grammar', label: 'شرح القواعد', icon: Award },
    { id: 'games', label: 'عالم الألعاب', icon: Gamepad2 },
    { id: 'assessments', label: 'كتاب التقييمات', icon: FileCheck },
    { id: 'exams', label: 'امتحاناتي', icon: Trophy },
    { id: 'achievements', label: 'إنجازاتي وشهادتي', icon: Sparkles },
    { id: 'help', label: 'المساعدة', icon: HelpCircle },
  ];

  const handleNavClick = (sectionId: string) => {
    playSound.click();
    onNavigate(sectionId);
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-emerald-50/40 text-slate-800">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b-2 border-emerald-100 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          {/* Brand & Companion Area */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl border border-emerald-200 text-emerald-800 hover:bg-emerald-50 cursor-pointer"
              title="القائمة الرئيسية"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <button
              onClick={() => handleNavClick('home')}
              className="flex items-center gap-3 cursor-pointer text-right group"
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center text-2xl shadow-md border-2 border-emerald-400 group-hover:scale-105 transition-transform shrink-0">
                🌱
              </div>
              <div>
                <span className="text-lg md:text-xl font-black text-emerald-950 block leading-tight">
                  مُغَامَرَاتُ أَحْمَدَ وَمَرْيَمَ
                </span>
                <span className="text-xs font-bold text-emerald-700 block">
                  لُغَتِي الْجَمِيلَةُ – الصَّفُّ الثَّالِثُ الابْتِدَائِيُّ
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navItems.map((item) => {
              const isActive = currentSection === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-3 py-2 rounded-xl text-xs xl:text-sm font-extrabold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-emerald-700 text-white shadow-xs font-black'
                      : 'text-slate-700 hover:text-emerald-800 hover:bg-emerald-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Area: Audio toggle + Star Badge + Child Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Audio Toggle */}
            <button
              onClick={() => {
                playSound.click();
                toggleSound();
              }}
              className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
                progress.soundEnabled
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
                  : 'bg-slate-100 border-slate-200 text-slate-400 hover:bg-slate-200'
              }`}
              title={progress.soundEnabled ? 'كتم الصوت' : 'تشغيل الصوت'}
            >
              {progress.soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>

            {/* Stars Counter */}
            <button
              onClick={() => handleNavClick('achievements')}
              className="flex items-center gap-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-3.5 py-2 rounded-xl text-xs sm:text-sm shadow-xs transition-transform hover:scale-105 cursor-pointer"
            >
              <Star className="w-4 h-4 fill-slate-950" />
              <span>{progress.stars} ⭐</span>
            </button>

            {/* Child Avatar Mini Badge */}
            <button
              onClick={() => handleNavClick('achievements')}
              className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-emerald-50 transition-colors cursor-pointer"
              title="ملف التلميذ"
            >
              <img
                src={progress.avatar === 'ahmed' ? ahmedAvatar : maryamAvatar}
                alt={progress.childName}
                className="w-10 h-10 rounded-xl object-cover border-2 border-emerald-500 shadow-xs"
              />
              <span className="hidden sm:inline-block font-extrabold text-xs text-slate-800 max-w-24 truncate">
                {progress.childName}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex justify-end">
          <div className="w-4/5 max-w-sm bg-white h-full p-6 shadow-2xl flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-emerald-100 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xl">
                    🌱
                  </div>
                  <div>
                    <span className="font-black text-sm text-emerald-950 block">مغامرات أحمد ومريم</span>
                    <span className="text-[11px] text-emerald-700 font-bold block">لغتي الجميلة 3ب</span>
                  </div>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 cursor-pointer"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Mobile Nav Item List */}
              <div className="space-y-1.5">
                {navItems.map((item) => {
                  const isActive = currentSection === item.id;
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`w-full p-3.5 rounded-2xl text-right font-extrabold text-sm flex items-center gap-3 transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-emerald-600 text-white shadow-xs font-black'
                          : 'text-slate-800 hover:bg-emerald-50'
                      }`}
                    >
                      <Icon className="w-5 h-5 shrink-0" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Child Profile Footer in Mobile Drawer */}
            <div className="pt-4 border-t border-emerald-100 flex items-center gap-3">
              <img
                src={progress.avatar === 'ahmed' ? ahmedAvatar : maryamAvatar}
                alt={progress.childName}
                className="w-12 h-12 rounded-2xl object-cover border-2 border-emerald-500"
              />
              <div>
                <div className="font-black text-sm text-slate-900">{progress.childName}</div>
                <div className="text-xs text-emerald-700 font-bold">{progress.stars} نجوم · {progress.xp} XP</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Page Body Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t-2 border-emerald-100 py-6 text-center text-xs text-slate-500 space-y-2 no-print">
        <div className="flex items-center justify-center gap-2 font-bold text-emerald-900 text-sm">
          <span>مغامرات أحمد ومريم – لغتي الجميلة</span>
          <span>·</span>
          <span>الصف الثالث الابتدائي (الفصل الدراسي الأول)</span>
          <span>·</span>
          <span>جمهورية مصر العربية</span>
        </div>
        <p className="text-slate-400">
          تطبيق تعليمي تفاعلي متكامل يجمع بين المشاهد التمثيلية والألعاب والتقييمات المدرسية المعتمدة
        </p>
      </footer>
    </div>
  );
};
