import { useState, useEffect, useRef } from 'react';
import { Zap, Clock, Trophy, Play, Pause, RotateCcw, Star, Target, Heart, Brain } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import MainLayout from '@/components/layout/MainLayout';
import StoryGenerator from '@/components/StoryGenerator';
import { useToast } from '@/hooks/use-toast';

const ADHDLearning = () => {
  const { toast } = useToast();
  const [currentSession, setCurrentSession] = useState<'learning' | 'break' | null>(null);
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes (focus time)
  const [breakTimeLeft, setBreakTimeLeft] = useState(60); // 1 minute break
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isBreakTimer, setIsBreakTimer] = useState(false);
  const [points, setPoints] = useState(0);
  const [streak, setStreak] = useState(3);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const categories = [
    { id: 1, name: 'Safety Awareness', icon: '🛡️', color: 'bg-red-100', lessons: 5 },
    { id: 2, name: 'Social Skills', icon: '👥', color: 'bg-blue-100', lessons: 8 },
    { id: 3, name: 'Personal Development', icon: '🌟', color: 'bg-purple-100', lessons: 6 },
    { id: 4, name: 'Science & Nature', icon: '🌿', color: 'bg-green-100', lessons: 7 },
    { id: 5, name: 'Daily Life Skills', icon: '🏠', color: 'bg-orange-100', lessons: 9 },
    { id: 6, name: 'Emotional Intelligence', icon: '❤️', color: 'bg-pink-100', lessons: 6 }
  ];

  const currentStory = {
    title: "The Friendly Robot's Adventure",
    character: "Robo the Helper",
    progress: 45,
    scene: "Learning about saying 'Please' and 'Thank you'",
    choices: [
      { id: 1, text: "Say 'Please' when asking", icon: '😊' },
      { id: 2, text: "Just point at what I want", icon: '👉' },
      { id: 3, text: "Ask Robo for help", icon: '🤖' }
    ]
  };

  const recentAchievements = [
    { id: 1, name: 'Quick Focus!', icon: '⚡', points: 50, new: true },
    { id: 2, name: 'Story Master', icon: '📚', points: 100 },
    { id: 3, name: '3-Day Streak', icon: '🔥', points: 150 }
  ];

  const upcomingBreak = {
    type: 'movement',
    duration: 60,
    activity: 'Jump 10 times!'
  };

  // Timer logic
  useEffect(() => {
    if (isTimerRunning) {
      timerRef.current = setInterval(() => {
        if (isBreakTimer) {
          setBreakTimeLeft((prev) => {
            if (prev <= 1) {
              handleTimerComplete('break');
              return 60;
            }
            return prev - 1;
          });
        } else {
          setTimeLeft((prev) => {
            if (prev <= 1) {
              handleTimerComplete('focus');
              return 180;
            }
            return prev - 1;
          });
        }
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isTimerRunning, isBreakTimer]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleTimerComplete = (type: 'focus' | 'break') => {
    setIsTimerRunning(false);
    if (type === 'focus') {
      const earnedPoints = 50;
      setPoints((prev) => prev + earnedPoints);
      toast({
        title: '🎉 Focus Sprint Complete!',
        description: `Great job! You earned ${earnedPoints} points. Time for a break!`,
      });
    } else {
      toast({
        title: '✅ Break Complete!',
        description: 'Ready to focus again? Start your next sprint!',
      });
    }
  };

  const handleStartFocus = () => {
    setIsBreakTimer(false);
    setIsTimerRunning(true);
    setCurrentSession('learning');
    toast({
      title: '🎯 Focus Sprint Started!',
      description: 'Stay focused for 3 minutes!',
    });
  };

  const handlePauseFocus = () => {
    setIsTimerRunning(false);
    toast({
      title: '⏸️ Timer Paused',
      description: 'Take your time, resume when ready!',
    });
  };

  const handleResetFocus = () => {
    setIsTimerRunning(false);
    setTimeLeft(180);
    setBreakTimeLeft(60);
    setCurrentSession(null);
    setIsBreakTimer(false);
    toast({
      title: '🔄 Timer Reset',
      description: 'Ready for a fresh start!',
    });
  };

  const handleStartBreak = () => {
    setIsBreakTimer(true);
    setIsTimerRunning(true);
    setCurrentSession('break');
    toast({
      title: '🤸 Break Time!',
      description: 'Jump 10 times and stretch!',
    });
  };

  const handleQuickWin = (activity: string, earnedPoints: number) => {
    setPoints((prev) => prev + earnedPoints);
    toast({
      title: '⚡ Quick Win!',
      description: `${activity} completed! +${earnedPoints} points`,
    });
  };

  const handleTopicSelect = (topicName: string) => {
    toast({
      title: '📖 Topic Selected',
      description: `Opening ${topicName} stories!`,
    });
  };

  return (
    <MainLayout>
      <div className="p-8 max-w-7xl mx-auto space-y-6">
        {/* Page Header with Gamification Stats */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-1">🧠 Neurodiverse Focus Learning</h1>
            <p className="text-muted-foreground">AI Story Adventures - Learn Through Play!</p>
          </div>
          <div className="flex items-center gap-4">
            <Card className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50">
              <div className="flex items-center gap-2">
                <Trophy className="w-6 h-6 text-yellow-600" />
                <div>
                  <p className="text-sm font-medium">{points} Points</p>
                  <p className="text-xs text-muted-foreground">Keep going!</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 bg-gradient-to-r from-orange-50 to-red-50">
              <div className="flex items-center gap-2">
                <Zap className="w-6 h-6 text-orange-600" />
                <div>
                  <p className="text-sm font-medium">{streak} Day Streak</p>
                  <p className="text-xs text-muted-foreground">Amazing! 🔥</p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content Area - AI Story Creator in Center */}
          <div className="lg:col-span-2 space-y-6">
            {/* AI Story Generator - Main Focus */}
            <Card className="p-6">
              <div className="mb-4">
                <h2 className="text-2xl font-bold mb-2">🎨 AI Story Creator</h2>
                <p className="text-muted-foreground">Create your own adventure stories!</p>
              </div>
              <StoryGenerator />
            </Card>

            {/* Quick Wins Section */}
            <Card className="p-6 bg-gradient-to-br from-green-50 to-teal-50">
              <h3 className="text-lg font-semibold mb-4">⚡ Quick Wins - Mini Tasks</h3>
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  variant="outline" 
                  className="h-24 flex flex-col gap-2 hover:bg-green-100 transition-colors"
                  onClick={() => handleQuickWin('2-Min Quiz', 25)}
                >
                  <span className="text-3xl">🎯</span>
                  <span className="text-sm font-medium">2-Min Quiz</span>
                  <span className="text-xs text-muted-foreground">+25 points</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-24 flex flex-col gap-2 hover:bg-green-100 transition-colors"
                  onClick={() => handleQuickWin('Draw & Share', 30)}
                >
                  <span className="text-3xl">🎨</span>
                  <span className="text-sm font-medium">Draw & Share</span>
                  <span className="text-xs text-muted-foreground">+30 points</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-24 flex flex-col gap-2 hover:bg-green-100 transition-colors"
                  onClick={() => handleQuickWin('Voice Story', 20)}
                >
                  <span className="text-3xl">🗣️</span>
                  <span className="text-sm font-medium">Voice Story</span>
                  <span className="text-xs text-muted-foreground">+20 points</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-24 flex flex-col gap-2 hover:bg-green-100 transition-colors"
                  onClick={() => handleQuickWin('Sing Along', 15)}
                >
                  <span className="text-3xl">🎵</span>
                  <span className="text-sm font-medium">Sing Along</span>
                  <span className="text-xs text-muted-foreground">+15 points</span>
                </Button>
              </div>
            </Card>
          </div>

          {/* Right Sidebar - Timer and Other Widgets */}
          <div className="space-y-6">
            {/* Focus Timer Card - Moved to Right Sidebar */}
            <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">⏰ Focus Sprint Timer</h2>
                <Badge className={isTimerRunning && !isBreakTimer ? "bg-green-500 text-white" : "bg-gray-400 text-white"}>
                  <Clock className="w-3 h-3 mr-1" />
                  {isTimerRunning && !isBreakTimer ? 'Active' : 'Ready'}
                </Badge>
              </div>

              <div className="text-center mb-6">
                <div className="inline-block relative">
                  <svg className="w-40 h-40">
                    <circle
                      cx="80"
                      cy="80"
                      r="72"
                      stroke="currentColor"
                      strokeWidth="6"
                      fill="none"
                      className="text-gray-200"
                    />
                    <circle
                      cx="80"
                      cy="80"
                      r="72"
                      stroke="currentColor"
                      strokeWidth="6"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 72}`}
                      strokeDashoffset={`${2 * Math.PI * 72 * (1 - timeLeft / 180)}`}
                      className="text-primary transition-all duration-1000"
                      strokeLinecap="round"
                      transform="rotate(-90 80 80)"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <p className="text-3xl font-bold text-primary">{formatTime(timeLeft)}</p>
                    <p className="text-xs text-muted-foreground">Focus Time</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 mb-4">
                {!isTimerRunning ? (
                  <Button size="default" className="gap-2 flex-1" onClick={handleStartFocus}>
                    <Play className="w-4 h-4" />
                    Start Sprint
                  </Button>
                ) : (
                  <Button size="default" variant="secondary" className="gap-2 flex-1" onClick={handlePauseFocus}>
                    <Pause className="w-4 h-4" />
                    Pause
                  </Button>
                )}
                <Button size="default" variant="outline" className="gap-2" onClick={handleResetFocus}>
                  <RotateCcw className="w-4 h-4" />
                  Reset
                </Button>
              </div>

              <div className="p-3 bg-yellow-100 rounded-lg text-center">
                <p className="text-xs font-medium">💡 Next: {upcomingBreak.activity}</p>
              </div>
            </Card>

            {/* Today's Achievements */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">🏆 Today's Wins</h3>
              <div className="space-y-3">
                {recentAchievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`flex items-center gap-3 p-3 rounded-lg ${
                      achievement.new ? 'bg-yellow-100 border-2 border-yellow-300' : 'bg-muted/50'
                    }`}
                  >
                    <span className="text-2xl">{achievement.icon}</span>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{achievement.name}</p>
                      <p className="text-xs text-muted-foreground">+{achievement.points} points</p>
                    </div>
                    {achievement.new && (
                      <Badge className="bg-yellow-500">New!</Badge>
                    )}
                  </div>
                ))}
              </div>
            </Card>

            {/* Learning Categories */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">📖 Story Topics</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant="ghost"
                    className="w-full justify-start h-auto py-3 hover:bg-accent transition-colors"
                    onClick={() => handleTopicSelect(category.name)}
                  >
                    <div className={`w-10 h-10 rounded-lg ${category.color} flex items-center justify-center text-xl mr-3`}>
                      {category.icon}
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-medium text-sm">{category.name}</p>
                      <p className="text-xs text-muted-foreground">{category.lessons} stories</p>
                    </div>
                  </Button>
                ))}
              </div>
            </Card>

            {/* Movement Break Reminder */}
            <Card className="p-6 bg-gradient-to-br from-orange-50 to-red-50">
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-200 rounded-full flex items-center justify-center mx-auto mb-3 text-3xl">
                  🤸
                </div>
                <h3 className="font-semibold mb-2">Time for Movement!</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {isBreakTimer ? `Break time: ${formatTime(breakTimeLeft)}` : 'Ready for a movement break?'}
                </p>
                <Button 
                  className="w-full" 
                  onClick={handleStartBreak}
                  disabled={isTimerRunning && !isBreakTimer}
                >
                  <Play className="w-4 h-4 mr-2" />
                  {isBreakTimer && isTimerRunning ? 'Break Active' : 'Start Break Timer'}
                </Button>
              </div>
            </Card>

            {/* Parent Progress Link */}
            <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50">
              <div className="text-center">
                <Heart className="w-12 h-12 text-purple-600 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Parent Dashboard</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Parents can track progress and celebrate wins!
                </p>
                <Button 
                  variant="outline" 
                  className="w-full hover:bg-purple-100 transition-colors"
                  onClick={() => {
                    window.location.href = '/parent-dashboard';
                  }}
                >
                  View Progress
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ADHDLearning;
