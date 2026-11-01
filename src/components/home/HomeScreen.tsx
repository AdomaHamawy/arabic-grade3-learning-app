/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../../context/AppContext';
import { playSound, speakArabic } from '../../services/soundEffects';
import {
  Sparkles,
  BookOpen,
  Trophy,
  Gamepad2,
  FileCheck,
  Award,
  Volume2,
  Star,
  ChevronLeft,
  Flame,
  CheckCircle2
} from 'lucide-react';

interface HomeScreenProps {
  onNavigate: (section: string) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigate }) => {
  const { progress, currentLevelTitle } = useApp();

  const heroImage = '/src/assets/images/learning_adventure_hero_1793515762923.jpg';
  const ahmedAvatar = '/src/assets/images/ahmed_3d_avatar_1793515761332.jpg';
  const maryamAvatar = '/src/assets/images/maryam_3d_avatar_1793515761369.jpg';

  const handleGreetingAudio = () => {
    playSound.click();
    speakArabic(
      `أهلاً وسهلاً بك يا بطل! أنا أحمد ودي مريم.. يلا بينا ننطلق في مغامرات لغتي الجميلة للصف الثالث الابتدائي، نتعلم ونمثل ونلعب سوا ونجمع النجوم!`,
      { voiceType: progress.avatar === 'ahmed' ? 'child_ahmed' : 'child_maryam' }
    );
  };

  return (
    <div className="space-y-8">
      {/* Visual Adventure Hero with 3D Characters */}
      <div className="relative rounded-3xl overflow-hidden shadow-xl border-4 border-emerald-300 bg-emerald-950">
        <img
          src={heroImage}
          alt="مغامرات أحمد ومريم"
          referrerPolicy="no-referrer"
          className="w-full h-80 sm:h-96 md:h-[420px] object-cover opacity-85"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-950/40 to-transparent" />

        {/* Floating Greeting Content */}
        <div className="absolute bottom-6 inset-x-6 md:inset-x-12 flex flex-col md:flex-row md:items-end justify-between gap-6 text-white">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-3">
              <span className="bg-amber-400 text-slate-950 font-black text-xs md:text-sm px-3.5 py-1.5 rounded-full shadow-md">
                الصف الثالث الابتدائي – الترم الأول
              </span>
              <button
                onClick={handleGreetingAudio}
                className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border border-white/30"
              >
                <Volume2 className="w-3.5 h-3.5 text-amber-300" />
                <span>استمع لتحية أحمد ومريم 🎙️</span>
              </button>
            </div>

            <h1 className="text-3xl md:text-5xl font-black drop-shadow-md leading-tight">
              مُغَامَرَاتُ أَحْمَدَ وَمَرْيَمَ <br />
              <span className="text-amber-300">لُغَتِي الْجَمِيلَةُ</span>
            </h1>

            <p className="text-emerald-100 text-sm md:text-base font-medium leading-relaxed drop-shadow-xs">
              مرحباً بك يا <span className="font-bold text-amber-300">{progress.childName}</span>! رفيقاك أحمد ومريم مستعدان لمرافقتك في مشاهد تمثيلية ممتعة، وقواعد لغوية شيقة، و10 ألعاب تعليمية مذهلة!
            </p>
          </div>

          {/* 3D Realistic Companion Badge */}
          <div className="flex items-center gap-3 bg-white/15 backdrop-blur-md p-3.5 rounded-2xl border border-white/25 shrink-0 self-start md:self-auto">
            <div className="flex -space-x-4 rtl:space-x-reverse">
              <img src={ahmedAvatar} alt="أحمد" className="w-14 h-14 rounded-full border-2 border-amber-300 object-cover shadow-md" />
              <img src={maryamAvatar} alt="مريم" className="w-14 h-14 rounded-full border-2 border-emerald-300 object-cover shadow-md" />
            </div>
            <div>
              <div className="text-xs text-emerald-200 font-bold">رفيقاك الدائمان</div>
              <div className="text-sm font-black text-white">أحمد ومريم (3D)</div>
            </div>
          </div>
        </div>
      </div>

      {/* Gamification Quick Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-3xl p-5 border-2 border-emerald-100 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center text-2xl font-black">
            ⭐
          </div>
          <div>
            <div className="text-xs font-bold text-slate-500">النجوم المجمعة</div>
            <div className="text-2xl font-black text-slate-900">{progress.stars} نجمة</div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border-2 border-emerald-100 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-2xl font-black">
            ⚡
          </div>
          <div>
            <div className="text-xs font-bold text-slate-500">نقاط الخبرة XP</div>
            <div className="text-2xl font-black text-slate-900">{progress.xp} XP</div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border-2 border-emerald-100 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-600 flex items-center justify-center text-2xl font-black">
            🏆
          </div>
          <div>
            <div className="text-xs font-bold text-slate-500">الرتبة واللقب</div>
            <div className="text-sm font-black text-teal-900 line-clamp-1">{currentLevelTitle}</div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border-2 border-emerald-100 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center text-2xl font-black">
            📖
          </div>
          <div>
            <div className="text-xs font-bold text-slate-500">الدروس المنجزة</div>
            <div className="text-2xl font-black text-slate-900">{progress.completedLessons.length} دروس</div>
          </div>
        </div>
      </div>

      {/* Main Educational Sections Launchpad */}
      <div className="space-y-4">
        <h2 className="text-xl md:text-2xl font-black text-emerald-950 flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-amber-500" />
          <span>أقسام المدرسة الرقمية التفاعلية</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Section 1: Lessons & Theater */}
          <button
            onClick={() => {
              playSound.click();
              onNavigate('lessons');
            }}
            className="p-6 rounded-3xl bg-white border-2 border-emerald-200 hover:border-emerald-600 hover:shadow-lg transition-all text-right group cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform shadow-md">
                🎬
              </div>
              <h3 className="text-xl font-black text-emerald-950 mb-2">رحلتي مع الدروس والمسرح</h3>
              <p className="text-slate-600 text-sm font-medium leading-relaxed">
                مشاهد تمثيلية ثلاثية الأبعاد، قراءة النصوص المشكولة، معاني الكلمات، وأنشطة كتاب الوزارة.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-emerald-100 flex items-center justify-between text-emerald-700 font-extrabold text-sm">
              <span>افتح الدروس والمسرح</span>
              <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            </div>
          </button>

          {/* Section 2: Grammar & Spelling Studio */}
          <button
            onClick={() => {
              playSound.click();
              onNavigate('grammar');
            }}
            className="p-6 rounded-3xl bg-white border-2 border-emerald-200 hover:border-teal-600 hover:shadow-lg transition-all text-right group cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform shadow-md">
                ✏️
              </div>
              <h3 className="text-xl font-black text-teal-950 mb-2">مختبر القواعد والأساليب</h3>
              <p className="text-slate-600 text-sm font-medium leading-relaxed">
                أدوات الاستفهام، أسماء الإشارة، النفي، حروف الجر والعطف، التنوين، والمقاطع الصوتية.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-teal-100 flex items-center justify-between text-teal-700 font-extrabold text-sm">
              <span>استكشف القواعد اللغوية</span>
              <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            </div>
          </button>

          {/* Section 3: The 10 Games Arcade */}
          <button
            onClick={() => {
              playSound.click();
              onNavigate('games');
            }}
            className="p-6 rounded-3xl bg-white border-2 border-emerald-200 hover:border-amber-500 hover:shadow-lg transition-all text-right group cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform shadow-md">
                🎮
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2">عالم الألعاب التعليمية</h3>
              <p className="text-slate-600 text-sm font-medium leading-relaxed">
                10 ألعاب تفاعلية: ترتيب الجمل، صيد الأخطاء، الذاكرة اللغوية، سباق السرعة، والمقاطع.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-amber-100 flex items-center justify-between text-amber-700 font-extrabold text-sm">
              <span>ابدأ اللعب والمنافسة</span>
              <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            </div>
          </button>

          {/* Section 4: Assessment Notebook */}
          <button
            onClick={() => {
              playSound.click();
              onNavigate('assessments');
            }}
            className="p-6 rounded-3xl bg-white border-2 border-emerald-200 hover:border-emerald-600 hover:shadow-lg transition-all text-right group cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-700 text-white flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform shadow-md">
                📋
              </div>
              <h3 className="text-xl font-black text-emerald-950 mb-2">كتاب التقييمات والأداءات</h3>
              <p className="text-slate-600 text-sm font-medium leading-relaxed">
                الأداءات الصفية والمنزلية وتدريبات نهاية الوحدات مع التصحيح التلقائي الفوري والنموذجي.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-emerald-100 flex items-center justify-between text-emerald-700 font-extrabold text-sm">
              <span>حل الواجبات والتقييمات</span>
              <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            </div>
          </button>

          {/* Section 5: Exams */}
          <button
            onClick={() => {
              playSound.click();
              onNavigate('exams');
            }}
            className="p-6 rounded-3xl bg-white border-2 border-emerald-200 hover:border-rose-500 hover:shadow-lg transition-all text-right group cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform shadow-md">
                🏆
              </div>
              <h3 className="text-xl font-black text-rose-950 mb-2">امتحاناتي الدورية</h3>
              <p className="text-slate-600 text-sm font-medium leading-relaxed">
                اختبارات شهور أكتوبر ونوفمبر وديسمبر وامتحان نهاية الترم الشامل بنظام الدرجات والتقرير.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-rose-100 flex items-center justify-between text-rose-700 font-extrabold text-sm">
              <span>دخول لجان الامتحانات</span>
              <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            </div>
          </button>

          {/* Section 6: Achievements & Certificates */}
          <button
            onClick={() => {
              playSound.click();
              onNavigate('achievements');
            }}
            className="p-6 rounded-3xl bg-white border-2 border-emerald-200 hover:border-amber-400 hover:shadow-lg transition-all text-right group cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform shadow-md">
                🎖️
              </div>
              <h3 className="text-xl font-black text-amber-950 mb-2">إنجازاتي وشهادتي</h3>
              <p className="text-slate-600 text-sm font-medium leading-relaxed">
                شهادة تقدير وتفوق رسمية باسم التلميذ قابلة للطباعة + معرض الأوسمة والشارات المكتسبة.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-amber-100 flex items-center justify-between text-amber-700 font-extrabold text-sm">
              <span>اطبع شهادتك الآن</span>
              <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            </div>
          </button>
        </div>
      </div>

      {/* Motivational Advice Banner from Ahmed and Maryam */}
      <div className="bg-gradient-to-r from-emerald-100 to-teal-100 rounded-3xl p-6 border-2 border-emerald-300 flex items-center gap-5">
        <div className="w-16 h-16 rounded-2xl bg-emerald-600 text-white flex items-center justify-center text-3xl font-black shrink-0 shadow-sm">
          💡
        </div>
        <div className="space-y-1">
          <h4 className="font-black text-emerald-950 text-base md:text-lg">
            حِكْمَةُ الْيَوْمِ مِنْ وَالِدِ هِبَةَ:
          </h4>
          <p className="text-slate-800 font-bold text-sm md:text-base leading-relaxed">
            «الَّذِي يُرِيدُ أَنْ يَنْجَحَ عَلَيْهِ أَنْ يُكَرِّرَ الْمُحَاوَلَاتِ، وَيَتَعَلَّمَ مِنْ أَخْطَائِهِ.. مِنْ فَضْلِكَ كَرِّرْ مُحَاوَلَاتِكَ دَائِمًا حَتَّى تَنْجَحَ!»
          </p>
        </div>
      </div>
    </div>
  );
};
