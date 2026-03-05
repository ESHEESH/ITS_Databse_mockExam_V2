import { Check, X, Minus } from 'lucide-react';

export type QuestionStatus = 'unanswered' | 'correct' | 'wrong' | 'current';

interface QuestionNavigatorProps {
  totalQuestions: number;
  currentQuestion: number;
  answers: Record<number, number | null>;
  correctAnswers: Record<number, boolean>;
  onQuestionSelect: (questionNum: number) => void;
  showResults?: boolean;
}

export const QuestionNavigator: React.FC<QuestionNavigatorProps> = ({
  totalQuestions,
  currentQuestion,
  answers,
  correctAnswers,
  onQuestionSelect,
  showResults = false
}) => {
  const getQuestionStatus = (questionNum: number): QuestionStatus => {
    if (questionNum === currentQuestion) return 'current';
    if (!showResults) {
      return answers[questionNum] !== null && answers[questionNum] !== undefined ? 'correct' : 'unanswered';
    }
    if (correctAnswers[questionNum] === true) return 'correct';
    if (correctAnswers[questionNum] === false) return 'wrong';
    return 'unanswered';
  };

  const getStatusStyles = (status: QuestionStatus) => {
    switch (status) {
      case 'correct':
        return 'bg-emerald-500/20 border-emerald-500 text-emerald-400 hover:bg-emerald-500/30';
      case 'wrong':
        return 'bg-rose-500/20 border-rose-500 text-rose-400 hover:bg-rose-500/30';
      case 'current':
        return 'bg-indigo-500 border-indigo-400 text-white shadow-lg shadow-indigo-500/50 scale-110';
      default:
        return 'bg-slate-800/50 border-slate-700 text-slate-400 hover:bg-slate-700/50 hover:border-slate-600';
    }
  };

  const getStatusIcon = (status: QuestionStatus, num: number) => {
    if (status === 'correct') return <Check className="w-3 h-3" />;
    if (status === 'wrong') return <X className="w-3 h-3" />;
    return <span className="text-xs font-medium">{num}</span>;
  };

  // Generate array of question numbers
  const questionNumbers = Array.from({ length: totalQuestions }, (_, i) => i + 1);

  return (
    <div className="bg-slate-900/80 backdrop-blur-sm rounded-xl border border-slate-800 p-4">
      <h3 className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-3">
        Navigator
      </h3>
      
      <div className="grid grid-cols-10 gap-1.5">
        {questionNumbers.map((num) => {
          const status = getQuestionStatus(num);
          return (
            <button
              key={num}
              onClick={() => onQuestionSelect(num)}
              className={`
                relative w-8 h-8 rounded-lg border flex items-center justify-center
                transition-all duration-200 ease-out
                ${getStatusStyles(status)}
              `}
              title={`Question ${num}`}
            >
              {getStatusIcon(status, num)}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 pt-3 border-t border-slate-800 flex flex-wrap gap-3 text-xs">
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded bg-slate-800/50 border border-slate-700 flex items-center justify-center">
            <Minus className="w-2.5 h-2.5 text-slate-500" />
          </div>
          <span className="text-slate-500">Unanswered</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded bg-emerald-500/20 border border-emerald-500 flex items-center justify-center">
            <Check className="w-2.5 h-2.5 text-emerald-400" />
          </div>
          <span className="text-emerald-400">Correct</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded bg-rose-500/20 border border-rose-500 flex items-center justify-center">
            <X className="w-2.5 h-2.5 text-rose-400" />
          </div>
          <span className="text-rose-400">Wrong</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded bg-indigo-500 border border-indigo-400 flex items-center justify-center">
            <span className="text-[8px] text-white font-bold">1</span>
          </div>
          <span className="text-indigo-400">Current</span>
        </div>
      </div>
    </div>
  );
};
