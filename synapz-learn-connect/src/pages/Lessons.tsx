import { Play, Lock, CheckCircle, Clock } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import MainLayout from '@/components/layout/MainLayout';
import { useNavigate } from 'react-router-dom';

const Lessons = () => {
  const navigate = useNavigate();

  const courses = [
    {
      id: 1,
      title: 'Digital Literacy Basics',
      description: 'Learn the fundamentals of digital technology and computer basics',
      progress: 75,
      totalLessons: 12,
      completedLessons: 9,
      color: 'bg-blue-500',
      lessons: [
        { id: 1, title: 'Introduction to Computers', duration: '15 min', status: 'completed' },
        { id: 2, title: 'Using a Mouse and Keyboard', duration: '20 min', status: 'completed' },
        { id: 3, title: 'Understanding Operating Systems', duration: '25 min', status: 'completed' },
        { id: 4, title: 'File Management Basics', duration: '30 min', status: 'current' },
        { id: 5, title: 'Internet Basics', duration: '20 min', status: 'locked' },
        { id: 6, title: 'Email Communication', duration: '25 min', status: 'locked' },
      ]
    },
    {
      id: 2,
      title: 'Customer Support Essentials',
      description: 'Master the skills needed for effective customer support',
      progress: 45,
      totalLessons: 10,
      completedLessons: 5,
      color: 'bg-green-500',
      lessons: [
        { id: 1, title: 'Customer Service Fundamentals', duration: '20 min', status: 'completed' },
        { id: 2, title: 'Communication Skills', duration: '25 min', status: 'completed' },
        { id: 3, title: 'Active Listening', duration: '15 min', status: 'completed' },
        { id: 4, title: 'Problem Solving Techniques', duration: '30 min', status: 'current' },
        { id: 5, title: 'Handling Difficult Customers', duration: '25 min', status: 'locked' },
      ]
    }
  ];

  const getLessonIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-accent" />;
      case 'current':
        return <Play className="w-5 h-5 text-primary" />;
      case 'locked':
        return <Lock className="w-5 h-5 text-muted-foreground" />;
      default:
        return <Clock className="w-5 h-5 text-muted-foreground" />;
    }
  };

  return (
    <MainLayout>
      <div className="p-8 max-w-7xl mx-auto space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold mb-1">My Lessons</h1>
          <p className="text-muted-foreground">Continue where you left off</p>
        </div>

        {/* Course List */}
        <div className="space-y-8">
          {courses.map((course) => (
            <Card key={course.id} className="overflow-hidden">
              {/* Course Header */}
              <div className="p-6 bg-gradient-to-r from-primary/5 to-secondary/5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-2">{course.title}</h2>
                    <p className="text-muted-foreground mb-4">{course.description}</p>
                    <div className="flex items-center gap-4">
                      <Badge variant="secondary">
                        {course.completedLessons} of {course.totalLessons} lessons
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {course.progress}% Complete
                      </span>
                    </div>
                  </div>
                </div>
                <Progress value={course.progress} className="h-2" />
              </div>

              {/* Lessons List */}
              <div className="p-6">
                <h3 className="font-semibold mb-4">Lessons</h3>
                <div className="space-y-3">
                  {course.lessons.map((lesson) => (
                    <div
                      key={lesson.id}
                      className={`flex items-center justify-between p-4 rounded-lg border transition-all ${
                        lesson.status === 'current'
                          ? 'border-primary bg-primary/5'
                          : lesson.status === 'locked'
                          ? 'border-border bg-muted/30 opacity-60'
                          : 'border-border hover:bg-muted/50'
                      }`}
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          lesson.status === 'current' ? 'bg-primary/10' :
                          lesson.status === 'completed' ? 'bg-accent/10' :
                          'bg-muted'
                        }`}>
                          {getLessonIcon(lesson.status)}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{lesson.title}</h4>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            <span>{lesson.duration}</span>
                          </div>
                        </div>
                      </div>
                      
                      {lesson.status === 'current' && (
                        <Button onClick={() => navigate('/voice-tutor')}>
                          Continue
                        </Button>
                      )}
                      {lesson.status === 'completed' && (
                        <Button variant="outline" onClick={() => navigate('/voice-tutor')}>
                          Review
                        </Button>
                      )}
                      {lesson.status === 'locked' && (
                        <Button variant="ghost" disabled>
                          Locked
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Explore More Courses */}
        <Card className="p-6 text-center bg-gradient-to-br from-purple-50 to-blue-50">
          <h3 className="text-xl font-semibold mb-2">Explore More Courses</h3>
          <p className="text-muted-foreground mb-4">
            Discover new skills and expand your learning journey
          </p>
          <Button onClick={() => navigate('/career')}>
            Browse Career Paths
          </Button>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Lessons;
