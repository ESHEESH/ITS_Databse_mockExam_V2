import { Check, X, HelpCircle, RotateCcw, Eye, List } from 'lucide-react';
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

export function ResultsPanel({
  totalQuestions,
  correctCount,
  wrongCount,
  unansweredCount,
  onReviewMistakes,
  onRetakeQuiz,
  onReviewAll,
}: ResultsPanelProps) {
  const percentage = Math.round((correctCount / totalQuestions) * 100);
  
  const getGradeInfo = () => {
    if (percentage >= 90) return { label: 'Excellent!', color: 'text-emerald-400', bgColor: 'bg-emerald-500/20', borderColor: 'border-emerald-500/30' };
    if (percentage >= 80) return { label: 'Great Job!', color: 'text-amber-400', bgColor: 'bg-amber-500/20', borderColor: 'border-amber-500/30' };
    if (percentage >= 70) return { label: 'Good!', color: 'text-yellow-400', bgColor: 'bg-yellow-500/20', borderColor: 'border-yellow-500/30' };
    if (percentage >= 60) return { label: 'Pass', color: 'text-orange-400', bgColor: 'bg-orange-500/20', borderColor: 'border-orange-500/30' };
    return { label: 'Keep Practicing', color: 'text-rose-400', bgColor: 'bg-rose-500/20', borderColor: 'border-rose-500/30' };
  };

  const grade = getGradeInfo();

  return (
    <div className="glass-card rounded-xl p-6">
      <div className="text-center mb-8">
        <div className={`
          inline-flex items-center justify-center w-24 h-24 rounded-full mb-4
          ${grade.bgColor} border-2 ${grade.borderColor}
        `}>
          <Check className={`w-12 h-12 ${grade.color}`} />
        </div>
        <h2 className={`text-3xl font-bold mb-2 font-['Poppins'] ${grade.color}`}>
          {grade.label}
        </h2>
        <p className="text-amber-500/70 font-['Montserrat']">
          You scored {correctCount} out of {totalQuestions}
        </p>
      </div>

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
              className="text-neutral-800"
            />
            <circle
              cx="80"
              cy="80"
              r="70"
              fill="none"
              stroke="#fbbf24"
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={`${(percentage / 100) * 440} 440`}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-bold font-['Poppins'] text-amber-400">
              {percentage}%
            </span>
            <span className="text-neutral-500 text-sm font-['Montserrat']">Score</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-8">
        <div className="bg-emerald-500/10 rounded-lg p-3 text-center border border-emerald-500/20">
          <Check className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
          <div className="text-xl font-bold text-emerald-400 font-['Poppins']">{correctCount}</div>
          <div className="text-xs text-emerald-400/70 font-['Montserrat']">Correct</div>
        </div>
        <div className="bg-rose-500/10 rounded-lg p-3 text-center border border-rose-500/20">
          <X className="w-5 h-5 text-rose-400 mx-auto mb-1" />
          <div className="text-xl font-bold text-rose-400 font-['Poppins']">{wrongCount}</div>
          <div className="text-xs text-rose-400/70 font-['Montserrat']">Wrong</div>
        </div>
        <div className="bg-neutral-700/30 rounded-lg p-3 text-center border border-neutral-700">
          <HelpCircle className="w-5 h-5 text-neutral-400 mx-auto mb-1" />
          <div className="text-xl font-bold text-neutral-400 font-['Poppins']">{unansweredCount}</div>
          <div className="text-xs text-neutral-400/70 font-['Montserrat']">Unanswered</div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 justify-center">
        {wrongCount > 0 && (
          <Button
            variant="outline"
            onClick={onReviewMistakes}
            className="flex items-center gap-2 bg-neutral-900 border-amber-500/30 text-amber-400 hover:bg-amber-500/10 hover:border-amber-400"
          >
            <Eye className="w-4 h-4" />
            Review Mistakes
          </Button>
        )}
        <Button
          variant="outline"
          onClick={onReviewAll}
          className="flex items-center gap-2 bg-neutral-900 border-amber-500/30 text-amber-400 hover:bg-amber-500/10 hover:border-amber-400"
        >
          <List className="w-4 h-4" />
          Review All
        </Button>
        <Button
          onClick={onRetakeQuiz}
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-black font-semibold"
        >
          <RotateCcw className="w-4 h-4" />
          Retake Quiz
        </Button>
      </div>
    </div>
  );
}
