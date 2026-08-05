import React from 'react';
import { Award, Lock, CheckCircle2, X, Trophy, Star } from 'lucide-react';
import { Language } from '../types';
import { ProgressionData } from '../utils/progression';

interface AchievementsModalProps {
  progression: ProgressionData;
  language: Language;
  onClose: () => void;
}

export const AchievementsModal: React.FC<AchievementsModalProps> = ({
  progression,
  language,
  onClose,
}) => {
  const isAr = language === 'ar';
  const unlockedCount = progression.achievements.filter((a) => a.unlocked).length;
  const totalCount = progression.achievements.length;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xl select-none animate-in fade-in zoom-in-95 duration-200">
      <div className="max-w-lg w-full bg-slate-900 border border-amber-500/40 rounded-3xl p-5 shadow-2xl text-white flex flex-col max-h-[90dvh] my-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-black text-amber-300">
                {isAr ? 'لوحة الإنجازات والأوسمة' : 'Achievements & Badges'}
              </h2>
              <p className="text-[11px] text-slate-400 font-medium">
                {isAr
                  ? `تم إنجاز ${unlockedCount} من أصل ${totalCount} وسام صيد`
                  : `Unlocked ${unlockedCount} of ${totalCount} hunting badges`}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Overview Bar */}
        <div className="my-3 grid grid-cols-2 gap-2 text-center">
          <div className="bg-slate-950/70 p-2.5 rounded-2xl border border-slate-800">
            <div className="text-[10px] text-slate-400 font-bold uppercase">{isAr ? 'النقاط التراكمية' : 'Total Score'}</div>
            <div className="text-base font-extrabold text-amber-400 font-mono">{progression.totalScore}</div>
          </div>
          <div className="bg-slate-950/70 p-2.5 rounded-2xl border border-slate-800">
            <div className="text-[10px] text-slate-400 font-bold uppercase">{isAr ? 'أعلى مستوى مفتوح' : 'Max Level Unlocked'}</div>
            <div className="text-base font-extrabold text-emerald-400 font-mono">
              {isAr ? `المستوى ${progression.maxUnlockedLevel}` : `Level ${progression.maxUnlockedLevel}`} / 100
            </div>
          </div>
        </div>

        {/* Achievements List */}
        <div className="space-y-2 overflow-y-auto custom-scrollbar pr-1 my-1 flex-1">
          {progression.achievements.map((ach) => {
            const percent = Math.min(100, Math.round((ach.progress / ach.target) * 100));

            return (
              <div
                key={ach.id}
                className={`p-3 rounded-2xl border transition-all flex items-center gap-3 ${
                  ach.unlocked
                    ? 'bg-gradient-to-r from-amber-500/15 to-orange-500/10 border-amber-500/40 text-slate-100 shadow-md'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 opacity-80'
                }`}
              >
                <div className={`text-2xl p-2 rounded-xl ${ach.unlocked ? 'bg-amber-500/20 border border-amber-400/40' : 'bg-slate-800 border border-slate-700'}`}>
                  {ach.icon}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className={`text-xs font-black truncate ${ach.unlocked ? 'text-amber-300' : 'text-slate-300'}`}>
                      {isAr ? ach.titleAr : ach.titleEn}
                    </h3>
                    {ach.unlocked ? (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>{isAr ? 'مكتمل' : 'Unlocked'}</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full">
                        <Lock className="w-3 h-3" />
                        <span>{percent}%</span>
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                    {isAr ? ach.descriptionAr : ach.descriptionEn}
                  </p>

                  {/* Progress bar if not unlocked */}
                  {!ach.unlocked && (
                    <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2 overflow-hidden border border-slate-700/60">
                      <div
                        className="bg-gradient-to-r from-amber-500 to-orange-500 h-full transition-all duration-300"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="mt-3 w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-colors border border-slate-700"
        >
          {isAr ? 'إغلاق' : 'Close'}
        </button>

      </div>
    </div>
  );
};
