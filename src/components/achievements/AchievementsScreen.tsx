/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { playSound } from '../../services/soundEffects';
import {
  Trophy,
  Award,
  Star,
  Printer,
  Sparkles,
  CheckCircle,
  Edit3,
  User,
  ShieldAlert,
  Flame
} from 'lucide-react';

export const AchievementsScreen: React.FC = () => {
  const { progress, updateChildName, setAvatar, currentLevelTitle, triggerCelebration } = useApp();
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(progress.childName);

  const ahmedAvatar = '/src/assets/images/ahmed_3d_avatar_1793515761332.jpg';
  const maryamAvatar = '/src/assets/images/maryam_3d_avatar_1793515761369.jpg';

  const allBadges = [
    {
      id: 'مستكشف_اللغة_الجديد',
      name: 'وسام المستكشف الصغير',
      description: 'البدء في رحلة تعلم اللغة العربية مع أحمد ومريم',
      icon: '🌱',
      unlocked: true
    },
    {
      id: 'بطل_المثابرة_والامل',
      name: 'وسام بطل المثابرة والأمل',
      description: 'إتمام دروس الوحدة الأولى (العمل والأمل)',
      icon: '⭐',
      unlocked: progress.completedLessons.includes('u1-l2')
    },
    {
      id: 'صديق_الخير_والاخلاق',
      name: 'وسام الأخلاق الرفيعة',
      description: 'إتمام دروس الوحدة الثانية ومساعدة الآخرين',
      icon: '💛',
      unlocked: progress.completedLessons.includes('u2-l2')
    },
    {
      id: 'فارس_تاريخ_مصر',
      name: 'وسام مؤرخ المستقبل',
      description: 'استكشاف ورق البردي وحضارة مصر القديمة',
      icon: '📜',
      unlocked: progress.completedLessons.includes('u3-l3')
    },
    {
      id: 'صياد_القواعد',
      name: 'وسام عبقري النحو والإملاء',
      description: 'إتقان أدوات الاستفهام وحروف الجر والتنوين',
      icon: '🎓',
      unlocked: progress.stars >= 20
    },
    {
      id: 'بطل_الالعاب_العشر',
      name: 'وسام ملك الألعاب اللغوية',
      description: 'تحقيق نتائج متقدمة في عالم الألعاب التعليمية',
      icon: '🎮',
      unlocked: Object.keys(progress.gameScores).length >= 3
    }
  ];

  const handleSaveName = () => {
    playSound.click();
    updateChildName(tempName);
    setIsEditingName(false);
  };

  const handlePrintCertificate = () => {
    playSound.click();
    triggerCelebration();
    setTimeout(() => {
      window.print();
    }, 400);
  };

  return (
    <div className="space-y-8">
      {/* Printable Certificate (Visible in print, styled beautifully in screen too) */}
      <div className="bg-white rounded-3xl p-6 md:p-10 border-4 border-amber-300 shadow-xl relative overflow-hidden">
        {/* Certificate Watermark / Header */}
        <div className="text-center space-y-3 pb-6 border-b-2 border-emerald-100">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-2xl">🌿</span>
            <span className="text-xs uppercase tracking-widest font-black text-emerald-800">
              جُمْهُورِيَّةُ مِصْرَ الْعَرَبِيَّةِ – مَادَّةُ اللُّغَةِ الْعَرَبِيَّةِ – الصَّفُّ الثَّالِثُ الابْتِدَائِيُّ
            </span>
            <span className="text-2xl">🌿</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-black text-emerald-950 font-['Cairo']">
            شَهَادَةُ تَقْدِيرٍ وَتَفَوُّقٍ لُغَوِيٍّ
          </h2>

          <p className="text-slate-600 font-bold text-sm md:text-base">
            تَمْنَحُ إِدَارَةُ مَشْرُوعِ (مُغَامَرَاتِ أَحْمَدَ وَمَرْيَمَ – لُغَتِي الْجَمِيلَةِ) هَذِهِ الشَّهَادَةَ لِلْبَطَلِ:
          </p>

          <div className="py-4">
            <span className="text-2xl md:text-4xl font-black text-emerald-700 underline decoration-amber-400 decoration-wavy px-4">
              {progress.childName}
            </span>
          </div>

          <p className="max-w-2xl mx-auto text-slate-800 font-semibold text-sm md:text-base leading-relaxed">
            تَقْدِيرًا لاجْتِهَادِهِ الْمُتَمَيِّزِ، وَحُبِّهِ لِلْقِرَاءَةِ، وَإِتْقَانِهِ لِمَفَاهِيمِ وَحْدَاتِ مَنْهَجِ اللُّغَةِ الْعَرَبِيَّةِ:
            (الْعَمَلُ وَالأَمَلُ – صِفَاتِي الْجَمِيلَةُ – أَدَبُ بَلَدِي)، وَتَحْقِيقِهِ مُسْتَوًى رَائِعًا فِي الأَلْعَابِ وَالتَّقْيِيمَاتِ الْمَدْرَسِيَّةِ.
          </p>
        </div>

        {/* Certificate Bottom Signatures */}
        <div className="grid grid-cols-3 items-center text-center pt-6 gap-4">
          <div className="flex flex-col items-center">
            <img src={ahmedAvatar} alt="أحمد" className="w-16 h-16 rounded-full border-2 border-emerald-500 mb-1 object-cover" />
            <span className="text-xs font-black text-slate-800">صَدِيقُكَ أَحْمَد</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-14 h-14 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center text-2xl font-black shadow-md mb-1">
              🏆
            </div>
            <span className="text-xs font-black text-amber-700">خَاتَمُ التَّمَيُّزِ</span>
          </div>

          <div className="flex flex-col items-center">
            <img src={maryamAvatar} alt="مريم" className="w-16 h-16 rounded-full border-2 border-emerald-500 mb-1 object-cover" />
            <span className="text-xs font-black text-slate-800">صَدِيقَتُكِ مَرْيَم</span>
          </div>
        </div>

        {/* Print Action Button */}
        <div className="mt-6 pt-4 border-t border-emerald-100 flex items-center justify-center no-print">
          <button
            onClick={handlePrintCertificate}
            className="bg-emerald-700 hover:bg-emerald-800 text-white font-black px-6 py-3 rounded-2xl shadow-md transition-transform hover:scale-105 flex items-center gap-2 cursor-pointer"
          >
            <Printer className="w-5 h-5" />
            <span>طباعة شهادة التقدير الآن 🖨️</span>
          </button>
        </div>
      </div>

      {/* Child Profile Customizer */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border-2 border-emerald-100 shadow-sm space-y-6">
        <h3 className="text-xl font-black text-emerald-950 flex items-center gap-2">
          <User className="w-5 h-5 text-emerald-600" />
          <span>تَخْصِيصُ مَلَفِّ التِّلْمِيذِ الْبَطَلِ</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          {/* Avatar Selector */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-3">اختر رفيقك المفضل في التعلم:</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => {
                  playSound.click();
                  setAvatar('ahmed');
                }}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col items-center gap-2 ${
                  progress.avatar === 'ahmed'
                    ? 'border-emerald-600 bg-emerald-50 ring-2 ring-emerald-400'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <img src={ahmedAvatar} alt="أحمد" className="w-20 h-20 rounded-2xl object-cover" />
                <span className="font-extrabold text-sm text-slate-900">أحمد (الباحث المغامر) 👦</span>
              </button>

              <button
                onClick={() => {
                  playSound.click();
                  setAvatar('maryam');
                }}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col items-center gap-2 ${
                  progress.avatar === 'maryam'
                    ? 'border-emerald-600 bg-emerald-50 ring-2 ring-emerald-400'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <img src={maryamAvatar} alt="مريم" className="w-20 h-20 rounded-2xl object-cover" />
                <span className="font-extrabold text-sm text-slate-900">مريم (مكتشفة القواعد) 👧</span>
              </button>
            </div>
          </div>

          {/* Child Name Field */}
          <div className="space-y-3">
            <label className="block text-sm font-bold text-slate-700">اسم التلميذ / التلميذة:</label>
            {isEditingName ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  className="flex-1 p-3 rounded-xl border-2 border-emerald-300 font-bold text-slate-800 text-right focus:outline-none focus:border-emerald-600"
                />
                <button
                  onClick={handleSaveName}
                  className="bg-emerald-600 text-white font-bold px-4 py-3 rounded-xl cursor-pointer"
                >
                  حفظ
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between p-3.5 bg-emerald-50 rounded-xl border border-emerald-200">
                <span className="font-black text-lg text-emerald-950">{progress.childName}</span>
                <button
                  onClick={() => setIsEditingName(true)}
                  className="text-xs text-emerald-700 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  تعديل الاسم
                </button>
              </div>
            )}

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 font-bold">
              الرتبة الحالية: {currentLevelTitle} (المستوى {progress.level}) ⭐
            </div>
          </div>
        </div>
      </div>

      {/* Badges Collection */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border-2 border-emerald-100 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-3 border-b-2 border-emerald-100">
          <h3 className="text-xl font-black text-emerald-950 flex items-center gap-2">
            <Trophy className="w-6 h-6 text-amber-500" />
            <span>لَوْحَةُ الأَوْسِمَةِ وَالشَّارَاتِ</span>
          </h3>
          <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-full">
            {allBadges.filter((b) => b.unlocked).length} من {allBadges.length} مفتوح
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {allBadges.map((badge) => (
            <div
              key={badge.id}
              className={`p-4 rounded-2xl border-2 transition-all flex items-start gap-3.5 ${
                badge.unlocked
                  ? 'bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-300 shadow-xs'
                  : 'bg-slate-50 border-slate-200 opacity-60'
              }`}
            >
              <div className="w-12 h-12 rounded-2xl bg-white shadow-xs flex items-center justify-center text-2xl shrink-0 border border-emerald-100">
                {badge.icon}
              </div>
              <div>
                <h4 className="font-black text-sm text-slate-900">{badge.name}</h4>
                <p className="text-xs text-slate-600 font-medium mt-0.5">{badge.description}</p>
                <div className="mt-1.5">
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                    badge.unlocked ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'
                  }`}>
                    {badge.unlocked ? 'مُكْتَمَلْ ✔️' : 'قيد الإنجاز'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
