/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { HelpCircle, Heart, Sparkles, BookOpen, Volume2, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { playSound } from '../../services/soundEffects';

export const ParentGuide: React.FC = () => {
  const { progress, toggleSound, resetProgress } = useApp();

  const handleReset = () => {
    if (window.confirm('هل أنت متأكد من إعادة تعيين التقدم والبدء من جديد؟')) {
      playSound.click();
      resetProgress();
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-800 rounded-3xl p-6 md:p-8 text-white shadow-lg">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black text-3xl shadow-md">
            🤝
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black">دَلِيلُ الْمُعَلِّمِ وَوَلِيِّ الأَمْرِ</h1>
            <p className="text-emerald-200 text-sm md:text-base font-medium mt-1">
              إرشادات تربوية لتفعيل التعلم بالترفيه (Edutainment) ومصاحبة الطفل في مسيرة التفوق
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Guide 1: Characters & Cinema Theater */}
        <div className="bg-white rounded-3xl p-6 border-2 border-emerald-100 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-emerald-900 font-black text-lg">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <h3>فلسفة المشاهد التمثيلية وشخصيات 3D</h3>
          </div>
          <p className="text-slate-700 text-sm font-medium leading-relaxed">
            تم تصميم أحمد ومريم كشخصيتين بشريتين ثلاثيتي الأبعاد ليمثلا النموذج الصديق للطفل في سن 8–9 سنوات.
            يحوّل المسرح التمثيلي قراءة النصوص المدرسية الجافة إلى مواقف سينمائية حوارية مفعمة بالحيوية والحركة والمشاعر، مستخدمين اللهجة المصرية الصافية في الشرح واللغة العربية الفصحى في قراءة النصوص والآداب.
          </p>
        </div>

        {/* Guide 2: Curriculum Integration */}
        <div className="bg-white rounded-3xl p-6 border-2 border-emerald-100 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-emerald-900 font-black text-lg">
            <BookOpen className="w-5 h-5 text-emerald-600" />
            <h3>الارتباط المباشر بكتاب الوزارة المعتمد</h3>
          </div>
          <p className="text-slate-700 text-sm font-medium leading-relaxed">
            جميع النصوص، والقصص (ازرع نبتة، من فضلك كرر المحاولة، البطل الخفي، الزهرة والصبار، السعادة في المساعدة، أول من رفع يده، العصفور الجريء، صندوق الابتكار، ورقة من التاريخ)، والأناشيد، والتدريبات مستخرجة ومطابقة 100% لكتاب اللغة العربية للصف الثالث الابتدائي (2025/2026).
          </p>
        </div>

        {/* Guide 3: The 10 Educational Games */}
        <div className="bg-white rounded-3xl p-6 border-2 border-emerald-100 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-emerald-900 font-black text-lg">
            <Heart className="w-5 h-5 text-rose-500" />
            <h3>نظام التحفيز والتعزيز الإيجابي</h3>
          </div>
          <p className="text-slate-700 text-sm font-medium leading-relaxed">
            يقوم التطبيق على التحفيز دون عقاب أو إحباط. عند ارتكاب الطفل لخطأ ما، يُظهر التطبيق رسالة تشجيعية دافئة بصوت ونغمات لطيفة مع التفسير العلمي المبسط، ويتيح له المحاولة المتكررة تماماً كما قال الأب لهبة: «من فضلك كرري محاولاتك».
          </p>
        </div>

        {/* Guide 4: Settings & Sound Control */}
        <div className="bg-white rounded-3xl p-6 border-2 border-emerald-100 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-emerald-900 font-black text-lg">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <h3>إعدادات الوصول والتحكم الأبوي</h3>
          </div>

          <div className="flex items-center justify-between p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200">
            <div>
              <div className="font-bold text-sm text-slate-800">المؤثرات الصوتية وقراءة النصوص</div>
              <div className="text-xs text-slate-500">تمكين الأصوات التفاعلية وقراءة الجمل</div>
            </div>
            <button
              onClick={() => {
                playSound.click();
                toggleSound();
              }}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-colors cursor-pointer ${
                progress.soundEnabled ? 'bg-emerald-600 text-white' : 'bg-slate-300 text-slate-700'
              }`}
            >
              {progress.soundEnabled ? 'مُفَعَّلْ 🔊' : 'مُعَطَّلْ 🔇'}
            </button>
          </div>

          <div className="pt-2">
            <button
              onClick={handleReset}
              className="text-xs font-bold text-rose-600 hover:text-rose-800 hover:underline cursor-pointer"
            >
              ⚠️ إعادة تعيين بيانات الطفل والتقدم للبدء من الصفر
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
