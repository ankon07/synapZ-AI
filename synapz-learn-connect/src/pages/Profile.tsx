import { useState } from 'react';
import { 
  User, Trophy, Target, Flame, Star, Award, BookOpen, Brain, 
  Calendar, TrendingUp, Zap, Crown, Medal, CheckCircle2, Lock,
  Edit, Camera, Settings as SettingsIcon
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import MainLayout from '@/components/layout/MainLayout';
import { toast } from 'sonner';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  progress: number;
  maxProgress: number;
  unlocked: boolean;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  reward: string;
}

interface Skill {
  name: string;
  level: number;
  xp: number;
  maxXp: number;
  icon: string;
}

const Profile = () => {
  const [editingProfile, setEditingProfile] = useState(false);

  // User stats
  const userStats = {
    name: 'Rohan M',
    email: 'rohan@example.com',
    level: 15,
    xp: 3450,
    maxXp: 5000,
    totalPoints: 12750,
    streak: 7,
    lessonsCompleted: 45,
    quizzesCompleted: 32,
    hoursLearned: 87,
    rank: 'Gold Scholar',
    joinDate: 'January 2025',
  };

  // Skills
  const skills: Skill[] = [
    { name: 'English Communication', level: 8, xp: 750, maxXp: 1000, icon: '💬' },
    { name: 'Screen Reader Mastery', level: 9, xp: 890, maxXp: 1000, icon: '🖥️' },
    { name: 'Problem Solving', level: 6, xp: 450, maxXp: 800, icon: '🧩' },
    { name: 'Accessibility Awareness', level: 10, xp: 1000, maxXp: 1000, icon: '♿' },
    { name: 'BDSL Proficiency', level: 5, xp: 320, maxXp: 700, icon: '🤟' },
  ];

  // Achievements
  const achievements: Achievement[] = [
    {
      id: 'first-lesson',
      title: 'First Steps',
      description: 'Complete your first lesson',
      icon: <BookOpen className="w-6 h-6" />,
      progress: 1,
      maxProgress: 1,
      unlocked: true,
      rarity: 'common',
      reward: '50 XP',
    },
    {
      id: 'week-streak',
      title: 'Week Warrior',
      description: 'Maintain a 7-day learning streak',
      icon: <Flame className="w-6 h-6" />,
      progress: 7,
      maxProgress: 7,
      unlocked: true,
      rarity: 'rare',
      reward: '200 XP',
    },
    {
      id: 'perfect-quiz',
      title: 'Perfect Score',
      description: 'Score 100% on any quiz',
      icon: <Star className="w-6 h-6" />,
      progress: 3,
      maxProgress: 5,
      unlocked: false,
      rarity: 'epic',
      reward: '500 XP + Badge',
    },
    {
      id: 'master-learner',
      title: 'Master Learner',
      description: 'Reach Level 20',
      icon: <Crown className="w-6 h-6" />,
      progress: 15,
      maxProgress: 20,
      unlocked: false,
      rarity: 'legendary',
      reward: '1000 XP + Title',
    },
    {
      id: 'speed-demon',
      title: 'Speed Demon',
      description: 'Complete 10 lessons in one day',
      icon: <Zap className="w-6 h-6" />,
      progress: 0,
      maxProgress: 10,
      unlocked: false,
      rarity: 'rare',
      reward: '300 XP',
    },
    {
      id: 'quiz-master',
      title: 'Quiz Master',
      description: 'Complete 50 quizzes',
      icon: <Brain className="w-6 h-6" />,
      progress: 32,
      maxProgress: 50,
      unlocked: false,
      rarity: 'epic',
      reward: '600 XP + Badge',
    },
    {
      id: 'helpful-peer',
      title: 'Helpful Peer',
      description: 'Help 5 other learners',
      icon: <Award className="w-6 h-6" />,
      progress: 2,
      maxProgress: 5,
      unlocked: false,
      rarity: 'rare',
      reward: '250 XP',
    },
    {
      id: 'accessibility-champion',
      title: 'Accessibility Champion',
      description: 'Master all accessibility features',
      icon: <Trophy className="w-6 h-6" />,
      progress: 4,
      maxProgress: 5,
      unlocked: false,
      rarity: 'legendary',
      reward: '1500 XP + Special Title',
    },
  ];

  const getRarityColor = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'common': return 'bg-gray-500';
      case 'rare': return 'bg-blue-500';
      case 'epic': return 'bg-purple-500';
      case 'legendary': return 'bg-yellow-500';
    }
  };

  const getRarityGradient = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'common': return 'from-gray-500/20 to-gray-500/5';
      case 'rare': return 'from-blue-500/20 to-blue-500/5';
      case 'epic': return 'from-purple-500/20 to-purple-500/5';
      case 'legendary': return 'from-yellow-500/20 to-yellow-500/5';
    }
  };

  const levelProgress = (userStats.xp / userStats.maxXp) * 100;

  const handleEditProfile = () => {
    setEditingProfile(!editingProfile);
    if (!editingProfile) {
      toast.info('Edit mode enabled', {
        description: 'You can now update your profile information.',
      });
    }
  };

  return (
    <MainLayout>
      <div className="p-4 md:p-8 max-w-7xl mx-auto">
        {/* Profile Header */}
        <Card className="p-6 mb-6 bg-gradient-to-br from-primary/10 via-purple-500/10 to-pink-500/10 border-2">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="relative">
              <Avatar className="w-24 h-24 border-4 border-background shadow-lg">
                <AvatarImage src="" alt={userStats.name} />
                <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-primary to-purple-500 text-white">
                  {userStats.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary/90 transition-colors">
                <Camera className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold">{userStats.name}</h1>
                <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                  <Crown className="w-3 h-3 mr-1" />
                  {userStats.rank}
                </Badge>
              </div>
              <p className="text-muted-foreground mb-4">{userStats.email}</p>

              {/* Level Progress */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-500" />
                    <span className="font-semibold">Level {userStats.level}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {userStats.xp} / {userStats.maxXp} XP
                  </span>
                </div>
                <Progress value={levelProgress} className="h-3" />
                <p className="text-xs text-muted-foreground">
                  {userStats.maxXp - userStats.xp} XP to next level
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button onClick={handleEditProfile} variant="outline" size="sm">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
                <Button variant="outline" size="sm">
                  <SettingsIcon className="w-4 h-4 mr-2" />
                  Settings
                </Button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-1 gap-3 w-full md:w-auto">
              <div className="bg-background/60 backdrop-blur-sm rounded-lg p-3 text-center">
                <Flame className="w-6 h-6 text-orange-500 mx-auto mb-1" />
                <div className="text-2xl font-bold">{userStats.streak}</div>
                <div className="text-xs text-muted-foreground">Day Streak</div>
              </div>
              <div className="bg-background/60 backdrop-blur-sm rounded-lg p-3 text-center">
                <Trophy className="w-6 h-6 text-yellow-500 mx-auto mb-1" />
                <div className="text-2xl font-bold">{userStats.totalPoints}</div>
                <div className="text-xs text-muted-foreground">Total Points</div>
              </div>
            </div>
          </div>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-4 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold">{userStats.lessonsCompleted}</div>
                <div className="text-sm text-muted-foreground">Lessons</div>
              </div>
            </div>
          </Card>

          <Card className="p-4 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center">
                <Brain className="w-6 h-6 text-purple-500" />
              </div>
              <div>
                <div className="text-2xl font-bold">{userStats.quizzesCompleted}</div>
                <div className="text-sm text-muted-foreground">Quizzes</div>
              </div>
            </div>
          </Card>

          <Card className="p-4 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <div className="text-2xl font-bold">{userStats.hoursLearned}</div>
                <div className="text-sm text-muted-foreground">Hours</div>
              </div>
            </div>
          </Card>

          <Card className="p-4 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <div className="text-2xl font-bold">Level {userStats.level}</div>
                <div className="text-sm text-muted-foreground">Rank</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="achievements" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="achievements">
              <Trophy className="w-4 h-4 mr-2" />
              Achievements
            </TabsTrigger>
            <TabsTrigger value="skills">
              <Target className="w-4 h-4 mr-2" />
              Skills
            </TabsTrigger>
            <TabsTrigger value="activity">
              <Calendar className="w-4 h-4 mr-2" />
              Activity
            </TabsTrigger>
          </TabsList>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Achievements</h2>
              <Badge variant="secondary">
                {achievements.filter(a => a.unlocked).length} / {achievements.length} Unlocked
              </Badge>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {achievements.map((achievement) => (
                <Card
                  key={achievement.id}
                  className={`p-6 relative overflow-hidden transition-all hover:shadow-lg ${
                    achievement.unlocked ? '' : 'opacity-60'
                  }`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${getRarityGradient(achievement.rarity)}`} />
                  
                  <div className="relative">
                    <div className="flex items-start justify-between mb-3">
                      <div
                        className={`w-14 h-14 rounded-xl ${
                          achievement.unlocked
                            ? `${getRarityColor(achievement.rarity)} text-white`
                            : 'bg-muted text-muted-foreground'
                        } flex items-center justify-center shadow-lg`}
                      >
                        {achievement.unlocked ? achievement.icon : <Lock className="w-6 h-6" />}
                      </div>
                      <Badge className={achievement.unlocked ? getRarityColor(achievement.rarity) : 'bg-muted'}>
                        {achievement.rarity}
                      </Badge>
                    </div>

                    <h3 className="font-bold text-lg mb-1">{achievement.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {achievement.description}
                    </p>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-semibold">
                          {achievement.progress} / {achievement.maxProgress}
                        </span>
                      </div>
                      <Progress
                        value={(achievement.progress / achievement.maxProgress) * 100}
                        className="h-2"
                      />
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Reward: {achievement.reward}</span>
                        {achievement.unlocked && (
                          <Badge variant="outline" className="text-xs">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Unlocked
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Skills Tab */}
          <TabsContent value="skills" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Skills Mastery</h2>
              <p className="text-muted-foreground">
                Track your progress across different skill areas
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {skills.map((skill, index) => (
                <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center text-3xl">
                      {skill.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold">{skill.name}</h3>
                        <Badge className="bg-primary">Level {skill.level}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {skill.xp} / {skill.maxXp} XP
                      </p>
                    </div>
                  </div>
                  <Progress value={(skill.xp / skill.maxXp) * 100} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-2">
                    {skill.maxXp - skill.xp} XP to level {skill.level + 1}
                  </p>
                </Card>
              ))}
            </div>

            <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
              <div className="flex items-center gap-3 mb-4">
                <Award className="w-8 h-8 text-primary" />
                <div>
                  <h3 className="font-semibold text-lg">Skill Development Tips</h3>
                  <p className="text-sm text-muted-foreground">
                    Keep practicing to improve your skills!
                  </p>
                </div>
              </div>
              <ul className="space-y-2 text-sm">
                <li className="flex gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <span>Complete daily lessons to earn consistent XP</span>
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <span>Take quizzes to test your knowledge</span>
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <span>Practice with the voice tutor for better communication</span>
                </li>
              </ul>
            </Card>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Recent Activity</h2>
              <p className="text-muted-foreground">
                Your learning journey timeline
              </p>
            </div>

            <div className="space-y-4">
              {/* Activity Timeline */}
              <Card className="p-6">
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      </div>
                      <div className="w-0.5 h-full bg-muted mt-2"></div>
                    </div>
                    <div className="flex-1 pb-6">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold">Completed Quiz: Accessibility Basics</h4>
                        <span className="text-sm text-muted-foreground">2 hours ago</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Score: 95% • +150 XP earned</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-blue-500" />
                      </div>
                      <div className="w-0.5 h-full bg-muted mt-2"></div>
                    </div>
                    <div className="flex-1 pb-6">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold">Started Lesson: Screen Reader Navigation</h4>
                        <span className="text-sm text-muted-foreground">5 hours ago</span>
                      </div>
                      <p className="text-sm text-muted-foreground">In Progress • 60% completed</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
                        <Trophy className="w-5 h-5 text-yellow-500" />
                      </div>
                      <div className="w-0.5 h-full bg-muted mt-2"></div>
                    </div>
                    <div className="flex-1 pb-6">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold">Achievement Unlocked: Week Warrior</h4>
                        <span className="text-sm text-muted-foreground">Yesterday</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Maintained 7-day streak • +200 XP earned
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                        <Star className="w-5 h-5 text-purple-500" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold">Leveled Up to Level 15</h4>
                        <span className="text-sm text-muted-foreground">2 days ago</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        New rank unlocked: Gold Scholar
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Learning Streak Calendar */}
              <Card className="p-6">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <Flame className="w-5 h-5 text-orange-500" />
                  Learning Streak: {userStats.streak} Days
                </h3>
                <div className="grid grid-cols-7 gap-2">
                  {Array.from({ length: 28 }, (_, i) => {
                    const isActive = i >= 28 - userStats.streak;
                    return (
                      <div
                        key={i}
                        className={`aspect-square rounded-lg ${
                          isActive
                            ? 'bg-gradient-to-br from-orange-500 to-red-500'
                            : 'bg-muted'
                        } flex items-center justify-center text-xs font-semibold ${
                          isActive ? 'text-white' : 'text-muted-foreground'
                        }`}
                      >
                        {isActive && <Flame className="w-4 h-4" />}
                      </div>
                    );
                  })}
                </div>
                <p className="text-sm text-muted-foreground mt-4">
                  Keep going! You're on a {userStats.streak}-day streak. Complete a lesson today to continue.
                </p>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Profile;
