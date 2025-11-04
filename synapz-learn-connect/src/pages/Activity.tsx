import { Calendar, Trophy, BookOpen, CheckCircle, Clock, TrendingUp, Award, Target } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MainLayout from '@/components/layout/MainLayout';

const Activity = () => {
  const activities = [
    {
      id: 1,
      type: 'lesson',
      title: 'Completed: Introduction to Digital Literacy',
      description: 'Finished lesson with 95% score',
      time: '2 hours ago',
      icon: <BookOpen className="w-5 h-5 text-blue-600" />,
      color: 'bg-blue-100'
    },
    {
      id: 2,
      type: 'achievement',
      title: 'Earned Badge: Quick Learner',
      description: 'Completed 5 lessons in one day',
      time: '5 hours ago',
      icon: <Trophy className="w-5 h-5 text-yellow-600" />,
      color: 'bg-yellow-100'
    },
    {
      id: 3,
      type: 'quiz',
      title: 'Quiz Completed: Customer Support Basics',
      description: 'Score: 85/100',
      time: '1 day ago',
      icon: <CheckCircle className="w-5 h-5 text-green-600" />,
      color: 'bg-green-100'
    },
    {
      id: 4,
      type: 'milestone',
      title: 'Reached 10 Hour Learning Milestone',
      description: 'Keep up the great work!',
      time: '1 day ago',
      icon: <Target className="w-5 h-5 text-purple-600" />,
      color: 'bg-purple-100'
    },
    {
      id: 5,
      type: 'lesson',
      title: 'Started: Email Communication Course',
      description: 'Progress: 25%',
      time: '2 days ago',
      icon: <BookOpen className="w-5 h-5 text-blue-600" />,
      color: 'bg-blue-100'
    },
    {
      id: 6,
      type: 'achievement',
      title: 'Earned Badge: Week Streak',
      description: 'Learned for 7 consecutive days',
      time: '3 days ago',
      icon: <Award className="w-5 h-5 text-orange-600" />,
      color: 'bg-orange-100'
    }
  ];

  const weeklyStats = [
    { day: 'Mon', hours: 2.5 },
    { day: 'Tue', hours: 1.8 },
    { day: 'Wed', hours: 3.2 },
    { day: 'Thu', hours: 2.0 },
    { day: 'Fri', hours: 2.8 },
    { day: 'Sat', hours: 1.5 },
    { day: 'Sun', hours: 2.2 }
  ];

  const maxHours = Math.max(...weeklyStats.map(s => s.hours));

  const recentAchievements = [
    { id: 1, name: 'Quick Learner', icon: '⚡', date: '2 days ago' },
    { id: 2, name: 'Perfect Score', icon: '⭐', date: '5 days ago' },
    { id: 3, name: 'Week Streak', icon: '🔥', date: '1 week ago' },
    { id: 4, name: 'First Steps', icon: '🎯', date: '2 weeks ago' }
  ];

  const courses = [
    { name: 'Digital Literacy', progress: 75, lessons: 12, completed: 9 },
    { name: 'Customer Support', progress: 60, lessons: 10, completed: 6 },
    { name: 'Communication Skills', progress: 90, lessons: 8, completed: 7 }
  ];

  return (
    <MainLayout>
      <div className="p-8 max-w-7xl mx-auto space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold mb-1">Activity History</h1>
          <p className="text-muted-foreground">Track your learning journey and achievements</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Hours</p>
                <p className="text-3xl font-bold mt-1">48.5</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Lessons Done</p>
                <p className="text-3xl font-bold mt-1">22</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Badges Earned</p>
                <p className="text-3xl font-bold mt-1">12</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                <Trophy className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Current Streak</p>
                <p className="text-3xl font-bold mt-1">7</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Activity Feed */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="lessons">Lessons</TabsTrigger>
                <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
                <TabsTrigger value="achievements">Achievements</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-4 mt-6">
                {activities.map((activity) => (
                  <Card key={activity.id} className="p-4 hover:shadow-md transition-shadow">
                    <div className="flex gap-4">
                      <div className={`w-12 h-12 rounded-full ${activity.color} flex items-center justify-center flex-shrink-0`}>
                        {activity.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{activity.title}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{activity.description}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          <span>{activity.time}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="lessons" className="space-y-4 mt-6">
                {activities.filter(a => a.type === 'lesson').map((activity) => (
                  <Card key={activity.id} className="p-4">
                    <div className="flex gap-4">
                      <div className={`w-12 h-12 rounded-full ${activity.color} flex items-center justify-center flex-shrink-0`}>
                        {activity.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{activity.title}</h3>
                        <p className="text-sm text-muted-foreground">{activity.description}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="quizzes" className="space-y-4 mt-6">
                {activities.filter(a => a.type === 'quiz').map((activity) => (
                  <Card key={activity.id} className="p-4">
                    <div className="flex gap-4">
                      <div className={`w-12 h-12 rounded-full ${activity.color} flex items-center justify-center flex-shrink-0`}>
                        {activity.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{activity.title}</h3>
                        <p className="text-sm text-muted-foreground">{activity.description}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="achievements" className="space-y-4 mt-6">
                {activities.filter(a => a.type === 'achievement' || a.type === 'milestone').map((activity) => (
                  <Card key={activity.id} className="p-4">
                    <div className="flex gap-4">
                      <div className={`w-12 h-12 rounded-full ${activity.color} flex items-center justify-center flex-shrink-0`}>
                        {activity.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{activity.title}</h3>
                        <p className="text-sm text-muted-foreground">{activity.description}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Weekly Activity Chart */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">This Week</h3>
              <div className="space-y-3">
                {weeklyStats.map((stat) => (
                  <div key={stat.day} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{stat.day}</span>
                      <span className="text-muted-foreground">{stat.hours}h</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-primary rounded-full h-2 transition-all"
                        style={{ width: `${(stat.hours / maxHours) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Total</span>
                  <span className="text-sm font-semibold text-primary">
                    {weeklyStats.reduce((sum, s) => sum + s.hours, 0).toFixed(1)}h
                  </span>
                </div>
              </div>
            </Card>

            {/* Recent Achievements */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Recent Achievements</h3>
              <div className="space-y-3">
                {recentAchievements.map((achievement) => (
                  <div key={achievement.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-xl">
                      {achievement.icon}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{achievement.name}</p>
                      <p className="text-xs text-muted-foreground">{achievement.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Course Progress */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Course Progress</h3>
              <div className="space-y-4">
                {courses.map((course, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{course.name}</span>
                      <span className="text-muted-foreground">{course.progress}%</span>
                    </div>
                    <Progress value={course.progress} className="h-2" />
                    <p className="text-xs text-muted-foreground">
                      {course.completed} of {course.lessons} lessons
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Activity;
