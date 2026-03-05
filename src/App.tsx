import { useState, useEffect, useCallback, useMemo } from 'react';
import { QuizCard } from './components/QuizCard';
import { QuestionNavigator } from './components/QuestionNavigator';
import { ResultsPanel } from './components/ResultsPanel';
import { CategorySuggestions } from './components/CategorySuggestions';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Timer, ChevronLeft, ChevronRight, Github } from 'lucide-react';
import questionsData from './questions.json';
import './App.css';

export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number | number[] | string[];
  explanation: string;
  category: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  multiSelect?: boolean;
  type?: 'single' | 'multiple' | 'matching' | 'fillblank';
  hint?: string;
  // For fill-in-the-blanks
  template?: string;
  blanks?: string[];
  // For matching
  pairs?: { description: string; answer: string }[];
  tableData?: {
    title: string;
    headers: string[];
    rows: (string | number | null)[][];
    additionalTable?: {
      title: string;
      headers: string[];
      rows: (string | number | null)[][];
    };
  };
}

const allQuestions: Question[] = questionsData as Question[];

// Shuffle array using Fisher-Yates algorithm
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Mix questions with simple ones distributed throughout
function prepareQuestions(questions: Question[]): Question[] {
  // Add difficulty to questions that don't have it
  const withDifficulty = questions.map(q => ({
    ...q,
    difficulty: q.difficulty || (q.options?.length <= 2 ? 'easy' : q.question.length > 200 ? 'hard' : 'medium')
  }));
  
  // Separate by difficulty
  const easy = withDifficulty.filter(q => q.difficulty === 'easy');
  const medium = withDifficulty.filter(q => q.difficulty === 'medium');
  const hard = withDifficulty.filter(q => q.difficulty === 'hard');
  
  // Shuffle each group
  const shuffledEasy = shuffleArray(easy);
  const shuffledMedium = shuffleArray(medium);
  const shuffledHard = shuffleArray(hard);
  
  // Mix them: every 5th question is easy, distribute medium and hard
  const result: Question[] = [];
  let easyIdx = 0, mediumIdx = 0, hardIdx = 0;
  
  const total = questions.length;
  for (let i = 0; i < total; i++) {
    if (i % 5 === 0 && easyIdx < shuffledEasy.length) {
      result.push(shuffledEasy[easyIdx++]);
    } else if (hardIdx < shuffledHard.length && Math.random() > 0.6) {
      result.push(shuffledHard[hardIdx++]);
    } else if (mediumIdx < shuffledMedium.length) {
      result.push(shuffledMedium[mediumIdx++]);
    } else if (hardIdx < shuffledHard.length) {
      result.push(shuffledHard[hardIdx++]);
    }
  }
  
  // Add any remaining questions
  while (easyIdx < shuffledEasy.length) result.push(shuffledEasy[easyIdx++]);
  while (mediumIdx < shuffledMedium.length) result.push(shuffledMedium[mediumIdx++]);
  while (hardIdx < shuffledHard.length) result.push(shuffledHard[hardIdx++]);
  
  return result.slice(0, total);
}

function App() {
  const [questions, setQuestions] = useState<Question[]>(() => prepareQuestions(allQuestions));
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number[]>>({});
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState<Record<number, boolean>>({});

  useEffect(() => {
    const timer = setInterval(() => {
      if (!showResults) {
        setTimeElapsed(prev => prev + 1);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [showResults]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswer = useCallback((questionId: number, selectedOptions: number[]) => {
    setAnswers(prev => ({ ...prev, [questionId]: selectedOptions }));
  }, []);

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleQuestionSelect = (index: number) => {
    setCurrentQuestionIndex(index);
  };

  const handleSubmit = () => {
    const results: Record<number, boolean> = {};
    questions.forEach(q => {
      const userAnswer = answers[q.id] || [];
      if (q.type === 'fillblank' || q.type === 'matching') {
        // For fill-in-blanks and matching, the answer is already validated
        results[q.id] = userAnswer.length > 0 && userAnswer[0] === 1;
      } else if (Array.isArray(q.correctAnswer)) {
        const correctArr = q.correctAnswer as number[];
        results[q.id] = userAnswer.length === correctArr.length && 
                       userAnswer.every(a => correctArr.includes(a));
      } else {
        results[q.id] = userAnswer.length === 1 && userAnswer[0] === q.correctAnswer;
      }
    });
    setCorrectAnswers(results);
    setShowResults(true);
  };

  const handleRetake = () => {
    // Reshuffle questions
    setQuestions(prepareQuestions(allQuestions));
    setAnswers({});
    setCorrectAnswers({});
    setShowResults(false);
    setCurrentQuestionIndex(0);
    setTimeElapsed(0);
  };

  const handleReviewMistakes = () => {
    const wrongQuestions = questions.filter(q => !correctAnswers[q.id]);
    if (wrongQuestions.length > 0) {
      const firstWrongIndex = questions.findIndex(q => q.id === wrongQuestions[0].id);
      setCurrentQuestionIndex(firstWrongIndex);
    }
    setShowResults(false);
  };

  const handleReviewAll = () => {
    setCurrentQuestionIndex(0);
    setShowResults(false);
  };

  const currentQ = questions[currentQuestionIndex];
  const answeredCount = Object.keys(answers).length;
  const progress = (answeredCount / questions.length) * 100;

  // Calculate category stats for suggestions
  const categoryStats = useMemo(() => {
    const stats: Record<string, { total: number; correct: number }> = {};
    questions.forEach(q => {
      if (!stats[q.category]) {
        stats[q.category] = { total: 0, correct: 0 };
      }
      stats[q.category].total++;
      if (correctAnswers[q.id]) {
        stats[q.category].correct++;
      }
    });
    return stats;
  }, [questions, correctAnswers]);

  if (showResults) {
    const correctCount = Object.values(correctAnswers).filter(Boolean).length;
    const wrongCount = questions.length - correctCount;
    const unansweredCount = questions.length - Object.keys(answers).length;

    return (
      <div className="min-h-screen bg-[#0a0a0a] text-amber-400 p-4 md:p-8">
        <div className="max-w-5xl mx-auto">
          <header className="mb-8">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-amber-400 font-['Poppins']">
                  ITS Database Reviewer
                </h1>
                <p className="text-amber-500/70 mt-1 font-['Montserrat']">Test your knowledge</p>
              </div>
              <a 
                href="https://github.com/ESHEESH" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-2 bg-neutral-900 border border-amber-500/30 hover:border-amber-400 rounded-lg transition-all hover:shadow-[0_0_10px_rgba(251,191,36,0.2)]"
              >
                <Github className="w-5 h-5 text-amber-400" />
                <span className="text-amber-300 font-medium font-['Montserrat']">Dan Francis</span>
              </a>
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <ResultsPanel
                totalQuestions={questions.length}
                correctCount={correctCount}
                wrongCount={wrongCount}
                unansweredCount={unansweredCount}
                onReviewMistakes={handleReviewMistakes}
                onRetakeQuiz={handleRetake}
                onReviewAll={handleReviewAll}
              />
            </div>
            <div className="lg:col-span-1">
              <CategorySuggestions categoryStats={categoryStats} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-amber-400 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-amber-400 font-['Poppins']">
                ITS Database Reviewer
              </h1>
              <p className="text-amber-500/70 mt-1 font-['Montserrat']">Test your knowledge</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-neutral-900 border border-amber-500/30 rounded-lg">
                <Timer className="w-5 h-5 text-amber-400" />
                <span className="font-mono text-lg text-amber-300">{formatTime(timeElapsed)}</span>
              </div>
              <a 
                href="https://github.com/ESHEESH" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-2 bg-neutral-900 border border-amber-500/30 hover:border-amber-400 rounded-lg transition-all hover:shadow-[0_0_10px_rgba(251,191,36,0.2)]"
              >
                <Github className="w-5 h-5 text-amber-400" />
                <span className="text-amber-300 font-medium font-['Montserrat']">Dan Francis</span>
              </a>
            </div>
          </div>
        </header>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-amber-500/70 font-['Montserrat']">Progress</span>
            <span className="text-sm text-amber-500/70 font-['Montserrat']">{answeredCount} / {questions.length}</span>
          </div>
          <Progress value={progress} className="h-2 bg-neutral-800" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {currentQ && (
              <QuizCard
                question={currentQ}
                questionNumber={currentQuestionIndex + 1}
                selectedAnswers={answers[currentQ.id] || []}
                onAnswer={(opts) => handleAnswer(currentQ.id, opts)}
                showResults={false}
              />
            )}

            <div className="flex items-center justify-center gap-4 pt-2">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
                className="flex items-center gap-2 bg-neutral-900 border-amber-500/30 text-amber-400 hover:bg-amber-500/10 hover:border-amber-400 disabled:opacity-50"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>

              {currentQuestionIndex === questions.length - 1 ? (
                <Button
                  onClick={handleSubmit}
                  className="bg-amber-500 hover:bg-amber-400 text-black font-semibold"
                >
                  Submit Quiz
                </Button>
              ) : (
                <Button
                  variant="outline"
                  onClick={handleNext}
                  className="flex items-center gap-2 bg-neutral-900 border-amber-500/30 text-amber-400 hover:bg-amber-500/10 hover:border-amber-400"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <QuestionNavigator
              totalQuestions={questions.length}
              currentQuestionIndex={currentQuestionIndex}
              answers={answers}
              correctAnswers={correctAnswers}
              onQuestionSelect={handleQuestionSelect}
              showResults={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
