import { Check, X, HelpCircle } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface QuestionNavigatorProps {
  totalQuestions: number;
  currentQuestionIndex: number;
  answers: Record<number, number[]>;
  correctAnswers: Record<number, boolean>;
  onQuestionSelect: (index: number) => void;
  showResults: boolean;
}

export function QuestionNavigator({
  totalQuestions,
  currentQuestionIndex,
  answers,
  correctAnswers,
  onQuestionSelect,
  showResults,
}: QuestionNavigatorProps) {
  const getQuestionStatus = (index: number): 'correct' | 'wrong' | 'current' | 'unanswered' => {
    if (index === currentQuestionIndex) return 'current';
    if (showResults) {
      // Find question at this index
      return correctAnswers[index] === true ? 'correct' : 'wrong';
    }
    return answers[index] && answers[index].length > 0 ? 'correct' : 'unanswered';
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'correct':
        return 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/30';
      case 'wrong':
        return 'bg-rose-500/20 border-rose-500/50 text-rose-400 hover:bg-rose-500/30';
      case 'current':
        return 'bg-amber-500 border-amber-400 text-black font-bold shadow-[0_0_15px_rgba(251,191,36,0.5)]';
      default:
        return 'bg-neutral-900 border-neutral-700 text-neutral-500 hover:bg-neutral-800 hover:border-amber-500/30 hover:text-amber-400';
    }
  };

  const getStatusIcon = (status: string, index: number) => {
    if (status === 'correct') {
      return <Check className="w-3 h-3" />;
    }
    if (status === 'wrong') {
      return <X className="w-3 h-3" />;
    }
    return <span className="text-xs font-medium font-['Poppins']">{index + 1}</span>;
  };

  return (
    <div className="glass-card rounded-xl p-4">
      <h3 className="text-amber-500/70 text-xs font-semibold uppercase tracking-wider mb-3 font-['Poppins']">
        Navigator
      </h3>
      
      {/* Scrollable area for question buttons - more columns */}
      <ScrollArea className="h-[320px] w-full">
        <div className="grid grid-cols-12 gap-1 pr-3">
          {Array.from({ length: totalQuestions }, (_, i) => i).map((index) => {
            const status = getQuestionStatus(index);
            return (
              <button
                key={index}
                onClick={() => onQuestionSelect(index)}
                className={`
                  nav-button relative w-8 h-8 rounded-md border flex items-center justify-center
                  transition-all duration-150
                  ${getStatusStyle(status)}
                `}
                title={`Question ${index + 1}`}
              >
                {getStatusIcon(status, index)}
              </button>
            );
          })}
        </div>
      </ScrollArea>

      {/* Legend */}
      <div className="mt-4 pt-3 border-t border-amber-500/20 grid grid-cols-2 gap-2 text-xs">
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded bg-neutral-900 border border-neutral-700 flex items-center justify-center">
            <HelpCircle className="w-3 h-3 text-neutral-500" />
          </div>
          <span className="text-neutral-500 font-['Montserrat']">Unanswered</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded bg-amber-500 border border-amber-400 flex items-center justify-center">
            <span className="text-[8px] text-black font-bold">1</span>
          </div>
          <span className="text-amber-400 font-['Montserrat']">Current</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center">
            <Check className="w-3 h-3 text-emerald-400" />
          </div>
          <span className="text-emerald-400 font-['Montserrat']">Correct</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded bg-rose-500/20 border border-rose-500/50 flex items-center justify-center">
            <X className="w-3 h-3 text-rose-400" />
          </div>
          <span className="text-rose-400 font-['Montserrat']">Wrong</span>
        </div>
      </div>
    </div>
  );
}
