import { Book, Users, FileText, TrendingUp, Award, Calendar } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import MainLayout from '@/components/layout/MainLayout';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  const courses = [
    { id: 1, title: 'Introduction to Programming', progress: 75, lessons: 12, completed: 9 },
    { id: 2, title: 'Digital Literacy Basics', progress: 45, lessons: 10, completed: 5 },
    { id: 3, title: 'Communication Skills', progress: 90, lessons: 8, completed: 7 },
    { id: 4, title: 'Customer Support Basics', progress: 60, lessons: 15, completed: 9 },
  ];

  const achievements = [
    { id: 1, title: 'First Steps', icon: '🎯', date: 'Jan 15, 2024' },
    { id: 2, title: 'Perfect Score', icon: '⭐', date: 'Jan 20, 2024' },
    { id: 3, title: 'Week Streak', icon: '🔥', date: 'Jan 25, 2024' },
  ];

  const recentActivities = [
    { id: 1, text: 'Completed Lesson: Basic Programming', time: '2 hours ago', icon: '📚' },
    { id: 2, text: 'Earned Badge: Quick Learner', time: '5 hours ago', icon: '🏆' },
    { id: 3, text: 'Quiz Score: 95%', time: '1 day ago', icon: '✅' },
  ];

  return (
    <MainLayout>
      <div className="p-8 max-w-7xl mx-auto space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold mb-1">Welcome Back!</h1>
          <p className="text-muted-foreground">Continue your learning journey</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Progress</p>
                <p className="text-3xl font-bold mt-1">75%</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Courses</p>
                <p className="text-3xl font-bold mt-1">4</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
                <Book className="w-6 h-6 text-secondary" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Achievements</p>
                <p className="text-3xl font-bold mt-1">12</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                <Award className="w-6 h-6 text-accent" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Hours Learned</p>
                <p className="text-3xl font-bold mt-1">48</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content - Courses */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">My Courses</h2>
              <Button variant="outline" onClick={() => navigate('/lessons')}>
                View All
              </Button>
            </div>

            <div className="grid gap-4">
              {courses.map((course) => (
                <Card key={course.id} className="p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">{course.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {course.completed} of {course.lessons} lessons completed
                      </p>
                    </div>
                    <Button size="sm">Continue</Button>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-semibold">{course.progress}%</span>
                    </div>
                    <Progress value={course.progress} className="h-2" />
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Achievements */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Recent Achievements</h3>
              <div className="space-y-4">
                {achievements.map((achievement) => (
                  <div key={achievement.id} className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-2xl">
                      {achievement.icon}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{achievement.title}</p>
                      <p className="text-xs text-muted-foreground">{achievement.date}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="link" className="w-full mt-4" onClick={() => navigate('/progress')}>
                View All Achievements
              </Button>
            </Card>

            {/* Activity Feed */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-lg flex-shrink-0">
                      {activity.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">{activity.text}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/voice-tutor')}>
                  <Book className="w-4 h-4 mr-2" />
                  Start Voice Lesson
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/quiz')}>
                  <FileText className="w-4 h-4 mr-2" />
                  Take Quiz
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/schedule')}>
                  <Calendar className="w-4 h-4 mr-2" />
                  View Schedule
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
