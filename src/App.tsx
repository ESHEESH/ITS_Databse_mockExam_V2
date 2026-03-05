import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle, Timer, BookOpen, BarChart3, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { QuestionNavigator } from './components/QuestionNavigator';
import { QuizCard } from './components/QuizCard';
import { ResultsPanel } from './components/ResultsPanel';
import { questions } from './data/questions';
import './App.css';

type QuizMode = 'quiz' | 'results' | 'review-mistakes' | 'review-all';

function App() {
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [answers, setAnswers] = useState<Record<number, number | null>>({});
  const [mode, setMode] = useState<QuizMode>('quiz');
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [mistakeQuestions, setMistakeQuestions] = useState<number[]>([]);

  const totalQuestions = questions.length;

  // Timer
  useEffect(() => {
    if (mode === 'quiz') {
      const interval = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [mode]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = useCallback((questionId: number, answerIndex: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
  }, []);

  const handleNext = useCallback(() => {
    if (currentQuestion < totalQuestions) {
      setCurrentQuestion(prev => prev + 1);
    }
  }, [currentQuestion, totalQuestions]);

  const handlePrevious = useCallback(() => {
    if (currentQuestion > 1) {
      setCurrentQuestion(prev => prev - 1);
    }
  }, [currentQuestion]);

  const handleQuestionSelect = useCallback((questionNum: number) => {
    setCurrentQuestion(questionNum);
  }, []);

  const handleSubmit = useCallback(() => {
    // Calculate mistakes
    const mistakes: number[] = [];
    questions.forEach(q => {
      if (answers[q.id] !== q.correctAnswer) {
        mistakes.push(q.id);
      }
    });
    setMistakeQuestions(mistakes);
    setMode('results');
  }, [answers]);

  const handleReviewMistakes = useCallback(() => {
    if (mistakeQuestions.length > 0) {
      setCurrentQuestion(mistakeQuestions[0]);
      setMode('review-mistakes');
    }
  }, [mistakeQuestions]);

  const handleReviewAll = useCallback(() => {
    setCurrentQuestion(1);
    setMode('review-all');
  }, []);

  const handleRetakeQuiz = useCallback(() => {
    setAnswers({});
    setCurrentQuestion(1);
    setTimeElapsed(0);
    setMode('quiz');
  }, []);

  const getCorrectAnswersMap = useCallback(() => {
    const map: Record<number, boolean> = {};
    questions.forEach(q => {
      map[q.id] = answers[q.id] === q.correctAnswer;
    });
    return map;
  }, [answers]);

  const getCurrentQuestionData = () => {
    if (mode === 'review-mistakes' && mistakeQuestions.length > 0) {
      return questions.find(q => q.id === currentQuestion) || questions[0];
    }
    return questions.find(q => q.id === currentQuestion) || questions[0];
  };



  const getVisibleQuestionsCount = () => {
    if (mode === 'review-mistakes') {
      return mistakeQuestions.length;
    }
    return totalQuestions;
  };

  const getVisibleQuestionIndex = () => {
    if (mode === 'review-mistakes') {
      return mistakeQuestions.indexOf(currentQuestion) + 1;
    }
    return currentQuestion;
  };

  const handleNextVisible = () => {
    if (mode === 'review-mistakes') {
      const currentIndex = mistakeQuestions.indexOf(currentQuestion);
      if (currentIndex < mistakeQuestions.length - 1) {
        setCurrentQuestion(mistakeQuestions[currentIndex + 1]);
      }
    } else {
      handleNext();
    }
  };

  const handlePreviousVisible = () => {
    if (mode === 'review-mistakes') {
      const currentIndex = mistakeQuestions.indexOf(currentQuestion);
      if (currentIndex > 0) {
        setCurrentQuestion(mistakeQuestions[currentIndex - 1]);
      }
    } else {
      handlePrevious();
    }
  };

  const correctCount = questions.filter(q => answers[q.id] === q.correctAnswer).length;
  const wrongCount = questions.filter(q => answers[q.id] !== undefined && answers[q.id] !== null && answers[q.id] !== q.correctAnswer).length;
  const unansweredCount = questions.filter(q => answers[q.id] === undefined || answers[q.id] === null).length;
  const answeredCount = Object.keys(answers).length;

  const currentQ = getCurrentQuestionData();
  const isFirstQuestion = mode === 'review-mistakes' 
    ? mistakeQuestions.indexOf(currentQuestion) === 0
    : currentQuestion === 1;
  const isLastQuestion = mode === 'review-mistakes'
    ? mistakeQuestions.indexOf(currentQuestion) === mistakeQuestions.length - 1
    : currentQuestion === totalQuestions;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Header */}
      <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-500/20 p-2 rounded-lg">
              <BookOpen className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-slate-100">ITS Database Reviewer</h1>
              <p className="text-xs text-slate-500">Test your knowledge</p>
            </div>
          </div>
          
          {mode === 'quiz' && (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-slate-400 bg-slate-800/50 px-3 py-1.5 rounded-lg">
                <Timer className="w-4 h-4" />
                <span className="font-mono text-sm">{formatTime(timeElapsed)}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400 bg-slate-800/50 px-3 py-1.5 rounded-lg">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm">{answeredCount}/{totalQuestions}</span>
              </div>
            </div>
          )}

          {(mode === 'review-mistakes' || mode === 'review-all') && (
            <Button
              onClick={() => setMode('results')}
              variant="outline"
              size="sm"
              className="border-slate-700 text-slate-300 hover:bg-slate-800"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Back to Results
            </Button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Quiz Card */}
          <div className="lg:col-span-2 space-y-6">
            {mode === 'results' ? (
              <ResultsPanel
                totalQuestions={totalQuestions}
                correctCount={correctCount}
                wrongCount={wrongCount}
                unansweredCount={unansweredCount}
                onReviewMistakes={handleReviewMistakes}
                onRetakeQuiz={handleRetakeQuiz}
                onReviewAll={handleReviewAll}
              />
            ) : (
              <>
                <QuizCard
                  question={currentQ}
                  selectedAnswer={answers[currentQ.id] ?? null}
                  showResult={mode === 'review-mistakes' || mode === 'review-all'}
                  onAnswerSelect={(index) => handleAnswerSelect(currentQ.id, index)}
                  questionNumber={getVisibleQuestionIndex()}
                  totalQuestions={getVisibleQuestionsCount()}
                />

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between">
                  <Button
                    onClick={handlePreviousVisible}
                    disabled={isFirstQuestion}
                    variant="outline"
                    className="border-slate-700 text-slate-300 hover:bg-slate-800 disabled:opacity-50"
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Previous
                  </Button>

                  {mode === 'quiz' && (
                    <Button
                      onClick={isLastQuestion ? handleSubmit : handleNextVisible}
                      className="bg-indigo-500 hover:bg-indigo-600 text-white"
                    >
                      {isLastQuestion ? (
                        <><CheckCircle className="w-4 h-4 mr-2" /> Submit</>
                      ) : (
                        <>Next <ChevronRight className="w-4 h-4 ml-2" /></>
                      )}
                    </Button>
                  )}

                  {(mode === 'review-mistakes' || mode === 'review-all') && (
                    <Button
                      onClick={handleNextVisible}
                      disabled={isLastQuestion}
                      variant="outline"
                      className="border-slate-700 text-slate-300 hover:bg-slate-800 disabled:opacity-50"
                    >
                      Next
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  )}
                </div>

                {/* Progress Bar */}
                {mode === 'quiz' && (
                  <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-800">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-slate-400">Progress</span>
                      <span className="text-sm text-slate-400">
                        {Math.round((answeredCount / totalQuestions) * 100)}%
                      </span>
                    </div>
                    <Progress 
                      value={(answeredCount / totalQuestions) * 100} 
                      className="h-2 bg-slate-800"
                    />
                  </div>
                )}
              </>
            )}
          </div>

          {/* Right Column - Navigator */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <QuestionNavigator
                totalQuestions={totalQuestions}
                currentQuestion={currentQuestion}
                answers={answers}
                correctAnswers={getCorrectAnswersMap()}
                onQuestionSelect={handleQuestionSelect}
                showResults={mode === 'review-mistakes' || mode === 'review-all'}
              />

              {/* Category Stats */}
              {mode === 'results' && (
                <div className="bg-slate-900/80 backdrop-blur-sm rounded-xl border border-slate-800 p-4">
                  <h3 className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-3">
                    Performance by Category
                  </h3>
                  <div className="space-y-2">
                    {Object.entries(
                      questions.reduce((acc, q) => {
                        if (!acc[q.category]) acc[q.category] = { total: 0, correct: 0 };
                        acc[q.category].total++;
                        if (answers[q.id] === q.correctAnswer) acc[q.category].correct++;
                        return acc;
                      }, {} as Record<string, { total: number; correct: number }>)
                    ).map(([category, stats]) => (
                      <div key={category} className="flex items-center justify-between text-sm">
                        <span className="text-slate-400 truncate flex-1">{category}</span>
                        <span className={`font-medium ${
                          stats.correct === stats.total ? 'text-emerald-400' : 
                          stats.correct === 0 ? 'text-rose-400' : 'text-yellow-400'
                        }`}>
                          {stats.correct}/{stats.total}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Actions */}
              {mode === 'quiz' && answeredCount > 0 && (
                <Button
                  onClick={handleSubmit}
                  variant="outline"
                  className="w-full border-indigo-500/50 text-indigo-400 hover:bg-indigo-500/10"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Finish Early
                </Button>
              )}

              {(mode === 'review-mistakes' || mode === 'review-all') && (
                <Button
                  onClick={handleRetakeQuiz}
                  variant="outline"
                  className="w-full border-slate-700 text-slate-300 hover:bg-slate-800"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Retake Quiz
                </Button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
