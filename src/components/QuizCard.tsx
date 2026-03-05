import { useState } from 'react';
import { Check, X, HelpCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { Question } from '../App';

interface QuizCardProps {
  question: Question;
  questionNumber: number;
  selectedAnswers: number[];
  onAnswer: (selectedOptions: number[]) => void;
  showResults: boolean;
}

export function QuizCard({ question, questionNumber, selectedAnswers, onAnswer, showResults }: QuizCardProps) {
  const [showHint, setShowHint] = useState(false);
  const [fillBlankAnswers, setFillBlankAnswers] = useState<string[]>(
    question.blanks ? new Array(question.blanks.length).fill('') : []
  );
  const [matchingAnswers, setMatchingAnswers] = useState<number[]>(
    question.pairs ? new Array(question.pairs.length).fill(-1) : []
  );

  const isMultiSelect = question.multiSelect;
  const correctAnswer = question.correctAnswer;
  
  const isCorrect = showResults ? 
    (Array.isArray(correctAnswer) 
      ? selectedAnswers.length === correctAnswer.length && selectedAnswers.every(a => (correctAnswer as number[]).includes(a))
      : selectedAnswers.length === 1 && selectedAnswers[0] === correctAnswer)
    : false;

  const handleOptionClick = (index: number) => {
    if (showResults) return;

    if (isMultiSelect) {
      const newSelection = selectedAnswers.includes(index)
        ? selectedAnswers.filter(a => a !== index)
        : [...selectedAnswers, index];
      onAnswer(newSelection);
    } else {
      onAnswer([index]);
    }
  };

  const handleFillBlankChange = (index: number, value: string) => {
    if (showResults) return;
    const newAnswers = [...fillBlankAnswers];
    newAnswers[index] = value.toUpperCase();
    setFillBlankAnswers(newAnswers);
    
    // Check if all blanks are filled correctly
    if (question.blanks && question.correctAnswer) {
      const correctStrings = question.correctAnswer as string[];
      const isAllCorrect = newAnswers.every((ans, i) => 
        ans.toUpperCase() === correctStrings[i].toUpperCase()
      );
      onAnswer(isAllCorrect ? [1] : []);
    }
  };

  const handleMatchingChange = (pairIndex: number, selectedOption: number) => {
    if (showResults) return;
    const newMatching = [...matchingAnswers];
    newMatching[pairIndex] = selectedOption;
    setMatchingAnswers(newMatching);
    
    // Check if all matches are correct
    if (question.pairs && question.correctAnswer) {
      const correctIndices = question.correctAnswer as number[];
      const isAllCorrect = newMatching.every((ans, i) => ans === correctIndices[i]);
      onAnswer(isAllCorrect ? [1] : []);
    }
  };

  const getOptionStyle = (index: number) => {
    const isSelected = selectedAnswers.includes(index);
    
    if (!showResults) {
      return isSelected
        ? 'bg-amber-500/20 border-amber-500 text-amber-300'
        : 'bg-neutral-900 border-neutral-700 text-neutral-400 hover:bg-neutral-800 hover:border-amber-500/50 hover:text-amber-400';
    }

    const isCorrectOption = Array.isArray(correctAnswer)
      ? (correctAnswer as number[]).includes(index)
      : correctAnswer === index;

    if (isCorrectOption) {
      return 'bg-emerald-500/20 border-emerald-500 text-emerald-300';
    }
    if (isSelected && !isCorrectOption) {
      return 'bg-rose-500/20 border-rose-500 text-rose-300';
    }
    return 'bg-neutral-900/50 border-neutral-800 text-neutral-600';
  };

  const getOptionIcon = (index: number) => {
    if (!showResults) return null;

    const isCorrectOption = Array.isArray(correctAnswer)
      ? (correctAnswer as number[]).includes(index)
      : correctAnswer === index;
    const isSelected = selectedAnswers.includes(index);

    if (isCorrectOption) {
      return <Check className="w-5 h-5 text-emerald-400" />;
    }
    if (isSelected && !isCorrectOption) {
      return <X className="w-5 h-5 text-rose-400" />;
    }
    return null;
  };

  const getQuestionType = () => {
    if (question.type === 'matching') return 'MATCHING';
    if (question.type === 'fillblank') return 'FILL IN THE BLANKS';
    if (isMultiSelect) return 'MULTI SELECT';
    if (question.options.length === 2) return 'TRUE / FALSE';
    return 'SINGLE CHOICE';
  };

  const renderFillBlank = () => {
    if (!question.template || !question.blanks) return null;
    
    const parts = question.template.split('_____');
    const correctStrings = question.correctAnswer as string[];
    
    return (
      <div className="p-4 space-y-4">
        <div className="text-amber-100 font-['Montserrat'] leading-relaxed">
          {parts.map((part, i) => (
            <span key={i}>
              {part}
              {i < parts.length - 1 && (
                <input
                  type="text"
                  value={fillBlankAnswers[i] || ''}
                  onChange={(e) => handleFillBlankChange(i, e.target.value)}
                  disabled={showResults}
                  className={`
                    mx-1 px-3 py-1 w-28 text-center rounded border-2 
                    font-mono text-sm uppercase
                    ${showResults 
                      ? fillBlankAnswers[i]?.toUpperCase() === correctStrings[i]?.toUpperCase()
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                        : 'bg-rose-500/20 border-rose-500 text-rose-300'
                      : 'bg-neutral-900 border-neutral-700 text-amber-400 focus:border-amber-500'
                    }
                  `}
                  placeholder="???"
                />
              )}
            </span>
          ))}
        </div>
        
        {showResults && (
          <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
            <p className="text-emerald-400 text-sm font-['Poppins'] mb-1">Correct Answer:</p>
            <p className="text-emerald-300 font-mono text-sm">
              {parts.map((part, i) => (
                <span key={i}>
                  {part}
                  {i < parts.length - 1 && (
                    <span className="mx-1 px-2 py-0.5 bg-emerald-500/20 rounded">
                      {correctStrings[i]}
                    </span>
                  )}
                </span>
              ))}
            </p>
          </div>
        )}
      </div>
    );
  };

  const renderMatching = () => {
    if (!question.pairs || !question.options) return null;
    
    return (
      <div className="p-4 space-y-3">
        {question.pairs.map((pair, pairIndex) => (
          <div 
            key={pairIndex} 
            className="flex items-center gap-4 p-3 bg-neutral-900/50 rounded-lg border border-neutral-800"
          >
            <div className="flex-1 text-amber-100 text-sm font-['Montserrat']">
              {pair.description}
            </div>
            <div className="text-amber-500/50">→</div>
            <select
              value={matchingAnswers[pairIndex]}
              onChange={(e) => handleMatchingChange(pairIndex, parseInt(e.target.value))}
              disabled={showResults}
              className={`
                w-48 px-3 py-2 rounded border bg-neutral-900 text-sm font-['Montserrat']
                ${showResults
                  ? matchingAnswers[pairIndex] === (question.correctAnswer as number[])[pairIndex]
                    ? 'border-emerald-500 text-emerald-400'
                    : 'border-rose-500 text-rose-400'
                  : matchingAnswers[pairIndex] >= 0
                    ? 'border-amber-500 text-amber-400'
                    : 'border-neutral-700 text-neutral-400'
                }
              `}
            >
              <option value={-1}>-- Select --</option>
              {question.options.map((opt, optIndex) => (
                <option key={optIndex} value={optIndex}>{opt}</option>
              ))}
            </select>
          </div>
        ))}
        
        {showResults && (
          <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
            <p className="text-emerald-400 text-sm font-['Poppins'] mb-2">Correct Matches:</p>
            <div className="space-y-1">
              {question.pairs.map((pair, i) => (
                <div key={i} className="text-emerald-300 text-sm font-['Montserrat']">
                  {pair.description} → <span className="font-semibold">{question.options[(question.correctAnswer as number[])[i]]}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderOptions = () => {
    return (
      <div className="p-4 space-y-2">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleOptionClick(index)}
            disabled={showResults}
            className={`
              option-button w-full p-3 rounded-lg border text-left transition-all duration-200
              flex items-center justify-between gap-4
              ${getOptionStyle(index)}
              ${showResults ? 'cursor-default' : 'cursor-pointer'}
            `}
          >
            <div className="flex items-start gap-3">
              <span className={`
                flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-medium font-['Poppins']
                ${showResults && (Array.isArray(correctAnswer) 
                  ? (correctAnswer as number[]).includes(index)
                  : correctAnswer === index)
                  ? 'bg-emerald-500/30 text-emerald-400'
                  : showResults && selectedAnswers.includes(index) && !(Array.isArray(correctAnswer) 
                    ? (correctAnswer as number[]).includes(index)
                    : correctAnswer === index)
                  ? 'bg-rose-500/30 text-rose-400'
                  : selectedAnswers.includes(index)
                  ? 'bg-amber-500/30 text-amber-400'
                  : 'bg-neutral-800 text-neutral-500'}
              `}>
                {String.fromCharCode(65 + index)}
              </span>
              <span className="text-sm leading-relaxed pt-0.5 font-['Montserrat']">{option}</span>
            </div>
            {getOptionIcon(index)}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="glass-card rounded-xl overflow-hidden">
      {/* Header with question number, type, and hint */}
      <div className="p-4 border-b border-amber-500/20 bg-neutral-900/50">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-amber-500/20 text-amber-400 text-sm font-semibold rounded font-['Poppins']">
              Q{questionNumber}
            </span>
            <Badge className="bg-amber-500/10 text-amber-400 border border-amber-500/30 font-['Montserrat'] text-xs">
              {getQuestionType()}
            </Badge>
            {question.difficulty && (
              <Badge 
                className={`text-xs font-['Montserrat'] ${
                  question.difficulty === 'easy' 
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                    : question.difficulty === 'hard'
                    ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                    : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                }`}
              >
                {question.difficulty.toUpperCase()}
              </Badge>
            )}
          </div>
          
          {/* Hint button */}
          {question.hint && (
            <div className="relative">
              <button
                onClick={() => setShowHint(!showHint)}
                className="p-2 rounded-full bg-neutral-800 border border-amber-500/30 text-amber-400 hover:bg-amber-500/10 hover:border-amber-400 transition-all"
                title="Show hint"
              >
                <HelpCircle className="w-5 h-5" />
              </button>
              
              {showHint && (
                <div className="absolute right-0 top-full mt-2 w-64 p-3 bg-neutral-900 border border-amber-500/50 rounded-lg shadow-lg z-10">
                  <p className="text-amber-300 text-sm font-['Montserrat']">
                    <span className="text-amber-500 font-semibold">Hint:</span> {question.hint}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
        
        <h2 className="text-lg font-medium text-amber-100 leading-relaxed whitespace-pre-line font-['Montserrat']">
          {question.question}
        </h2>
      </div>

      {/* Table Data Display */}
      {question.tableData && (
        <div className="px-4 py-4 border-b border-amber-500/20 bg-neutral-900/30">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-amber-500/30">
                  {question.tableData.headers.map((header, i) => (
                    <th key={i} className="text-left py-2 px-3 text-amber-400 font-medium font-['Poppins']">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {question.tableData.rows.map((row, i) => (
                  <tr key={i} className="border-b border-neutral-800 last:border-0">
                    {row.map((cell, j) => (
                      <td key={j} className="py-2 px-3 text-neutral-300 font-['Montserrat']">
                        {cell === null || cell === 'null' ? (
                          <span className="text-neutral-500 italic">NULL</span>
                        ) : (
                          cell
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Additional Table */}
          {question.tableData.additionalTable && (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-amber-500/30">
                    {question.tableData.additionalTable.headers.map((header, i) => (
                      <th key={i} className="text-left py-2 px-3 text-amber-400 font-medium font-['Poppins']">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {question.tableData.additionalTable.rows.map((row, i) => (
                    <tr key={i} className="border-b border-neutral-800 last:border-0">
                      {row.map((cell, j) => (
                        <td key={j} className="py-2 px-3 text-neutral-300 font-['Montserrat']">
                          {cell === null || cell === 'null' ? (
                            <span className="text-neutral-500 italic">NULL</span>
                          ) : (
                            cell
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Question Content */}
      {question.type === 'fillblank' && renderFillBlank()}
      {question.type === 'matching' && renderMatching()}
      {(!question.type || question.type === 'single' || question.type === 'multiple') && renderOptions()}

      {/* Results Feedback */}
      {showResults && question.type !== 'fillblank' && question.type !== 'matching' && (
        <div className={`
          px-4 py-3 border-t flex items-start gap-3 mt-4
          ${isCorrect ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-rose-500/5 border-rose-500/20'}
        `}>
          {isCorrect ? (
            <Check className="w-5 h-5 flex-shrink-0 mt-0.5 text-emerald-400" />
          ) : (
            <X className="w-5 h-5 flex-shrink-0 mt-0.5 text-rose-400" />
          )}
          <div>
            <h4 className={`font-medium mb-1 font-['Poppins'] ${isCorrect ? 'text-emerald-400' : 'text-rose-400'}`}>
              {isCorrect ? 'Correct!' : 'Incorrect'}
            </h4>
            <p className="text-neutral-400 text-sm leading-relaxed font-['Montserrat']">
              {question.explanation}
            </p>
            {isMultiSelect && (
              <p className="text-neutral-500 text-xs mt-2 font-['Montserrat']">
                Correct options: {(question.correctAnswer as number[]).map(i => String.fromCharCode(65 + i)).join(', ')}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
