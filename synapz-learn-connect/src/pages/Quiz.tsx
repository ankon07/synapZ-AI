import { useState } from 'react';
import { CheckCircle, XCircle, Clock, Trophy } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import MainLayout from '@/components/layout/MainLayout';
import { useNavigate } from 'react-router-dom';

const Quiz = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [answers, setAnswers] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds

  const quiz = {
    title: 'Digital Literacy Assessment',
    description: 'Test your knowledge of basic computer skills',
    questions: [
      {
        id: 1,
        question: 'What does "OS" stand for in computing?',
        options: [
          'Online System',
          'Operating System',
          'Optical Scanner',
          'Open Source'
        ],
        correctAnswer: 1
      },
      {
        id: 2,
        question: 'Which key combination is used to copy text?',
        options: [
          'Ctrl + V',
          'Ctrl + X',
          'Ctrl + C',
          'Ctrl + Z'
        ],
        correctAnswer: 2
      },
      {
        id: 3,
        question: 'What is the main purpose of a web browser?',
        options: [
          'To create documents',
          'To access the internet',
          'To edit photos',
          'To play games'
        ],
        correctAnswer: 1
      },
      {
        id: 4,
        question: 'Which of the following is a cloud storage service?',
        options: [
          'Microsoft Word',
          'Google Drive',
          'Adobe Photoshop',
          'Windows Media Player'
        ],
        correctAnswer: 1
      }
    ]
  };

  const handleNext = () => {
    if (selectedAnswer) {
      setAnswers([...answers, selectedAnswer]);
      setSelectedAnswer('');
      
      if (currentQuestion < quiz.questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        setShowResults(true);
      }
    }
  };

  const calculateScore = () => {
    let correct = 0;
    answers.forEach((answer, index) => {
      if (parseInt(answer) === quiz.questions[index].correctAnswer) {
        correct++;
      }
    });
    return Math.round((correct / quiz.questions.length) * 100);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (showResults) {
    const score = calculateScore();
    return (
      <MainLayout>
        <div className="p-8 max-w-4xl mx-auto">
          <Card className="p-8 text-center">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trophy className="w-12 h-12 text-primary" />
            </div>
            <h2 className="text-3xl font-bold mb-2">Quiz Complete!</h2>
            <p className="text-muted-foreground mb-8">
              Great job completing the {quiz.title}
            </p>
            
            <div className="bg-muted rounded-lg p-8 mb-8">
              <div className="text-6xl font-bold text-primary mb-2">{score}%</div>
              <p className="text-lg text-muted-foreground">Your Score</p>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="text-center">
                <p className="text-2xl font-bold">{answers.length}</p>
                <p className="text-sm text-muted-foreground">Questions</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-accent">
                  {answers.filter((a, i) => parseInt(a) === quiz.questions[i].correctAnswer).length}
                </p>
                <p className="text-sm text-muted-foreground">Correct</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-destructive">
                  {answers.filter((a, i) => parseInt(a) !== quiz.questions[i].correctAnswer).length}
                </p>
                <p className="text-sm text-muted-foreground">Incorrect</p>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <Button onClick={() => window.location.reload()}>
                Retake Quiz
              </Button>
              <Button variant="outline" onClick={() => navigate('/progress')}>
                View Progress
              </Button>
            </div>
          </Card>
        </div>
      </MainLayout>
    );
  }

  const question = quiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;

  return (
    <MainLayout>
      <div className="p-8 max-w-4xl mx-auto space-y-6">
        {/* Quiz Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-1">{quiz.title}</h1>
            <p className="text-muted-foreground">{quiz.description}</p>
          </div>
          <Card className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              <span className="text-lg font-semibold">{formatTime(timeLeft)}</span>
            </div>
          </Card>
        </div>

        {/* Progress */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">
              Question {currentQuestion + 1} of {quiz.questions.length}
            </span>
            <span className="text-sm text-muted-foreground">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </Card>

        {/* Question Card */}
        <Card className="p-8">
          <h2 className="text-2xl font-semibold mb-8">{question.question}</h2>

          <RadioGroup value={selectedAnswer} onValueChange={setSelectedAnswer}>
            <div className="space-y-4">
              {question.options.map((option, index) => (
                <div
                  key={index}
                  className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer ${
                    selectedAnswer === index.toString()
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => setSelectedAnswer(index.toString())}
                >
                  <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                  <Label
                    htmlFor={`option-${index}`}
                    className="flex-1 cursor-pointer text-base"
                  >
                    {option}
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>

          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
              disabled={currentQuestion === 0}
            >
              Previous
            </Button>
            <Button
              onClick={handleNext}
              disabled={!selectedAnswer}
            >
              {currentQuestion === quiz.questions.length - 1 ? 'Submit' : 'Next'}
            </Button>
          </div>
        </Card>

        {/* Help Card */}
        <Card className="p-6 bg-muted/50">
          <p className="text-sm text-center text-muted-foreground">
            💡 Tip: Take your time and read each question carefully before selecting your answer
          </p>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Quiz;
