import { Check, X, AlertCircle, BookOpen } from 'lucide-react';
import type { Question } from '../data/questions';

interface QuizCardProps {
  question: Question;
  selectedAnswer: number | null;
  showResult: boolean;
  onAnswerSelect: (answerIndex: number) => void;
  questionNumber: number;
  totalQuestions: number;
}

export const QuizCard: React.FC<QuizCardProps> = ({
  question,
  selectedAnswer,
  showResult,
  onAnswerSelect,
  questionNumber,
  totalQuestions
}) => {
  const isCorrect = selectedAnswer === question.correctAnswer;

  const getOptionStyles = (optionIndex: number) => {
    if (!showResult) {
      return selectedAnswer === optionIndex
        ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300'
        : 'bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-700/50 hover:border-slate-600';
    }

    // Show results mode
    if (optionIndex === question.correctAnswer) {
      return 'bg-emerald-500/20 border-emerald-500 text-emerald-300';
    }
    if (selectedAnswer === optionIndex && optionIndex !== question.correctAnswer) {
      return 'bg-rose-500/20 border-rose-500 text-rose-300';
    }
    return 'bg-slate-800/30 border-slate-800 text-slate-500';
  };

  const getOptionIcon = (optionIndex: number) => {
    if (!showResult) return null;
    
    if (optionIndex === question.correctAnswer) {
      return <Check className="w-5 h-5 text-emerald-400" />;
    }
    if (selectedAnswer === optionIndex && optionIndex !== question.correctAnswer) {
      return <X className="w-5 h-5 text-rose-400" />;
    }
    return null;
  };

  return (
    <div className="bg-slate-900/80 backdrop-blur-sm rounded-xl border border-slate-800 overflow-hidden">
      {/* Header */}
      <div className="bg-slate-800/50 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="bg-indigo-500/20 text-indigo-400 px-3 py-1 rounded-full text-sm font-medium">
            Question {questionNumber} of {totalQuestions}
          </span>
          <span className="text-slate-500 text-sm">|</span>
          <span className="text-slate-400 text-sm flex items-center gap-1.5">
            <BookOpen className="w-4 h-4" />
            {question.category}
          </span>
        </div>
        {showResult && (
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
            isCorrect ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
          }`}>
            {isCorrect ? (
              <><Check className="w-4 h-4" /> Correct</>
            ) : (
              <><X className="w-4 h-4" /> Incorrect</>
            )}
          </div>
        )}
      </div>

      {/* Question */}
      <div className="p-6">
        <h2 className="text-lg text-slate-100 font-medium leading-relaxed whitespace-pre-line">
          {question.question}
        </h2>
      </div>

      {/* Options */}
      <div className="px-6 pb-6 space-y-3">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => !showResult && onAnswerSelect(index)}
            disabled={showResult}
            className={`
              w-full p-4 rounded-lg border text-left transition-all duration-200
              flex items-center justify-between gap-4
              ${getOptionStyles(index)}
              ${showResult ? 'cursor-default' : 'cursor-pointer'}
            `}
          >
            <div className="flex items-start gap-3">
              <span className={`
                flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-medium
                ${showResult && index === question.correctAnswer 
                  ? 'bg-emerald-500/30 text-emerald-400' 
                  : showResult && selectedAnswer === index && index !== question.correctAnswer
                    ? 'bg-rose-500/30 text-rose-400'
                    : 'bg-slate-700/50 text-slate-400'
                }
              `}>
                {String.fromCharCode(65 + index)}
              </span>
              <span className="text-sm leading-relaxed pt-0.5">{option}</span>
            </div>
            {getOptionIcon(index)}
          </button>
        ))}
      </div>

      {/* Explanation - Only show in review mode */}
      {showResult && (
        <div className={`
          px-6 py-4 border-t flex items-start gap-3
          ${isCorrect ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-rose-500/5 border-rose-500/20'}
        `}>
          <AlertCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${isCorrect ? 'text-emerald-400' : 'text-rose-400'}`} />
          <div>
            <h4 className={`font-medium mb-1 ${isCorrect ? 'text-emerald-400' : 'text-rose-400'}`}>
              {isCorrect ? 'Correct Answer' : 'Correct Answer'}
            </h4>
            <p className="text-slate-400 text-sm leading-relaxed">
              {question.explanation}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
