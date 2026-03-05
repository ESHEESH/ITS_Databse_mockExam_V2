import React from 'react';
import { Trophy, Target, RotateCcw, Eye, CheckCircle, XCircle, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ResultsPanelProps {
  totalQuestions: number;
  correctCount: number;
  wrongCount: number;
  unansweredCount: number;
  onReviewMistakes: () => void;
  onRetakeQuiz: () => void;
  onReviewAll: () => void;
}

export const ResultsPanel: React.FC<ResultsPanelProps> = ({
  totalQuestions,
  correctCount,
  wrongCount,
  unansweredCount,
  onReviewMistakes,
  onRetakeQuiz,
  onReviewAll
}) => {
  const percentage = Math.round((correctCount / totalQuestions) * 100);
  
  const getGrade = () => {
    if (percentage >= 90) return { label: 'Excellent!', color: 'text-emerald-400', bgColor: 'bg-emerald-500/20' };
    if (percentage >= 80) return { label: 'Great Job!', color: 'text-blue-400', bgColor: 'bg-blue-500/20' };
    if (percentage >= 70) return { label: 'Good!', color: 'text-yellow-400', bgColor: 'bg-yellow-500/20' };
    if (percentage >= 60) return { label: 'Pass', color: 'text-orange-400', bgColor: 'bg-orange-500/20' };
    return { label: 'Keep Practicing', color: 'text-rose-400', bgColor: 'bg-rose-500/20' };
  };

  const grade = getGrade();

  return (
    <div className="bg-slate-900/80 backdrop-blur-sm rounded-xl border border-slate-800 p-6">
      <div className="text-center mb-8">
        <div className={`
          inline-flex items-center justify-center w-24 h-24 rounded-full mb-4
          ${grade.bgColor}
        `}>
          <Trophy className={`w-12 h-12 ${grade.color}`} />
        </div>
        <h2 className={`text-3xl font-bold mb-2 ${grade.color}`}>{grade.label}</h2>
        <p className="text-slate-400">You scored {correctCount} out of {totalQuestions}</p>
      </div>

      {/* Score Circle */}
      <div className="flex justify-center mb-8">
        <div className="relative">
          <svg className="w-40 h-40 transform -rotate-90">
            <circle
              cx="80"
              cy="80"
              r="70"
              fill="none"
              stroke="currentColor"
              strokeWidth="12"
              className="text-slate-800"
            />
            <circle
              cx="80"
              cy="80"
              r="70"
              fill="none"
              stroke="currentColor"
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={`${(percentage / 100) * 440} 440`}
              className={grade.color}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-4xl font-bold ${grade.color}`}>{percentage}%</span>
            <span className="text-slate-500 text-sm">Score</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-emerald-500/10 rounded-lg p-4 text-center border border-emerald-500/20">
          <CheckCircle className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-emerald-400">{correctCount}</div>
          <div className="text-xs text-emerald-400/70">Correct</div>
        </div>
        <div className="bg-rose-500/10 rounded-lg p-4 text-center border border-rose-500/20">
          <XCircle className="w-6 h-6 text-rose-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-rose-400">{wrongCount}</div>
          <div className="text-xs text-rose-400/70">Wrong</div>
        </div>
        <div className="bg-slate-700/30 rounded-lg p-4 text-center border border-slate-700">
          <HelpCircle className="w-6 h-6 text-slate-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-slate-400">{unansweredCount}</div>
          <div className="text-xs text-slate-500">Skipped</div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        {wrongCount > 0 && (
          <Button
            onClick={onReviewMistakes}
            className="w-full bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 border border-rose-500/50 h-12"
          >
            <Eye className="w-4 h-4 mr-2" />
            Review Mistakes ({wrongCount})
          </Button>
        )}
        
        <Button
          onClick={onReviewAll}
          variant="outline"
          className="w-full border-slate-700 text-slate-300 hover:bg-slate-800 h-12"
        >
          <Target className="w-4 h-4 mr-2" />
          Review All Questions
        </Button>
        
        <Button
          onClick={onRetakeQuiz}
          variant="outline"
          className="w-full border-slate-700 text-slate-300 hover:bg-slate-800 h-12"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Retake Quiz
        </Button>
      </div>
    </div>
  );
};
