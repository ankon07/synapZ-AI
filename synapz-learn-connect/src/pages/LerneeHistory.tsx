import { BookOpen, ExternalLink, Clock, User } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import MainLayout from '@/components/layout/MainLayout';

interface GrameenphoneCourse {
  id: string;
  title: string;
  category: string;
  image: string;
  url: string;
  students: string;
  duration: string;
}

const LerneeHistory = () => {
  const grameenphoneCourses: GrameenphoneCourse[] = [
    {
      id: '1',
      title: 'Adobe Premiere Pro',
      category: 'Digital Skills',
      image: 'https://s3.ap-south-1.amazonaws.com/live.grameenphone.academy/course/01K6SXP31BPN86TR6FNCEXVN2Z.jpeg',
      url: 'https://www.grameenphone.academy/courses/adobe-premiere-pro',
      students: '2330',
      duration: '9 hr 29 min',
    },
    {
      id: '2',
      title: 'Career with AI',
      category: 'Advanced Tech Skills',
      image: 'https://s3.ap-south-1.amazonaws.com/live.grameenphone.academy/course/01K184425GAFMA3F2JHEHKBWMR.png',
      url: 'https://www.grameenphone.academy/courses/career-with-ai',
      students: '6138',
      duration: '3 hr 11 min',
    },
    {
      id: '3',
      title: 'Sharpen Your Interview Skills',
      category: 'Career Readiness',
      image: 'https://s3.ap-south-1.amazonaws.com/live.grameenphone.academy/course/01JZ77C2WN66FP15N9AV0RQE0X.png',
      url: 'https://www.grameenphone.academy/courses/sharpen-your-interview-skills',
      students: '2959',
      duration: '55 min',
    },
    {
      id: '4',
      title: 'Canva for Presentations',
      category: 'Digital Skills',
      image: 'https://s3.ap-south-1.amazonaws.com/live.grameenphone.academy/course/01JZ50TCEYJC3RVE4DC4YXANC1.png',
      url: 'https://www.grameenphone.academy/courses/canva-for-presentations',
      students: '3293',
      duration: '1 hr 28 min',
    },
    {
      id: '5',
      title: 'Project-Based Excel',
      category: 'Digital Skills',
      image: 'https://s3.ap-south-1.amazonaws.com/live.grameenphone.academy/course/01JZ7AAK9D34H2FD3HDYT4N3DZ.png',
      url: 'https://www.grameenphone.academy/courses/project-based-excel',
      students: '3905',
      duration: '58 min',
    },
    {
      id: '6',
      title: 'Introduction to 2D Animation',
      category: 'Digital Skills',
      image: 'https://s3.ap-south-1.amazonaws.com/live.grameenphone.academy/course/course_thumbnail_default_194.jpg',
      url: 'https://www.grameenphone.academy/courses/introduction-to-2d-animation',
      students: '11269',
      duration: '2 hr 5 min',
    },
    {
      id: '7',
      title: 'LinkedIn 101',
      category: 'Career Readiness',
      image: 'https://s3.ap-south-1.amazonaws.com/live.grameenphone.academy/course/course_thumbnail_default_193.jpg',
      url: 'https://www.grameenphone.academy/courses/linkedin-101',
      students: '3507',
      duration: '51 min',
    },
    {
      id: '8',
      title: 'Smart CV',
      category: 'Career Readiness',
      image: 'https://s3.ap-south-1.amazonaws.com/live.grameenphone.academy/course/course_thumbnail_default_192.jpg',
      url: 'https://www.grameenphone.academy/courses/smart-cv',
      students: '3507',
      duration: '1 hr 18 min',
    },
    {
      id: '9',
      title: 'Art of Communication',
      category: 'Career Readiness',
      image: 'https://s3.ap-south-1.amazonaws.com/live.grameenphone.academy/course/course_thumbnail_default_188.jpg',
      url: 'https://www.grameenphone.academy/courses/art-of-communication',
      students: '1770',
      duration: '1 hr 10 min',
    },
    {
      id: '10',
      title: 'Programming Fundamental',
      category: 'Advanced Tech Skills',
      image: 'https://s3.ap-south-1.amazonaws.com/live.grameenphone.academy/course/course_thumbnail_default_178.jpg',
      url: 'https://www.grameenphone.academy/courses/programming-fundamental',
      students: '5528',
      duration: '3 hr 17 min',
    },
    {
      id: '11',
      title: 'Full Stack Development with MERN',
      category: 'Advanced Tech Skills',
      image: 'https://s3.ap-south-1.amazonaws.com/live.grameenphone.academy/course/course_thumbnail_default_167.jpg',
      url: 'https://www.grameenphone.academy/courses/full-stack-development-with-mern',
      students: '2885',
      duration: '8 hr 14 min',
    },
    {
      id: '12',
      title: 'Artificial Intelligence & Machine Learning Fundamentals',
      category: 'Advanced Tech Skills',
      image: 'https://s3.ap-south-1.amazonaws.com/live.grameenphone.academy/course/course_thumbnail_default_161.webp',
      url: 'https://www.grameenphone.academy/courses/artificial-intelligence-and-machine-learning-fundamentals',
      students: '4443',
      duration: '6 hr 2 min',
    },
    {
      id: '13',
      title: 'AWS Cloud Technical Essentials',
      category: 'Freelancing Skill',
      image: 'https://s3.ap-south-1.amazonaws.com/live.grameenphone.academy/course/course_thumbnail_default_155.webp',
      url: 'https://www.grameenphone.academy/courses/aws-cloud-technical-essentials',
      students: '2670',
      duration: '2 hr 31 min',
    },
    {
      id: '14',
      title: 'Digital Accounting with QuickBooks',
      category: 'Digital Skills',
      image: 'https://s3.ap-south-1.amazonaws.com/live.grameenphone.academy/course/course_thumbnail_default_150.webp',
      url: 'https://www.grameenphone.academy/courses/digital-accounting-with-quickbooks',
      students: '6511',
      duration: '7 hr 40 min',
    },
  ];

  return (
    <MainLayout>
      <div className="p-8 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
          <BookOpen className="w-8 h-8" />
          Learning History
        </h1>

        {/* Grameenphone Academy Courses Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-6">Grameenphone Academy Courses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {grameenphoneCourses.map((course) => (
              <Card
                key={course.id}
                className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 group cursor-pointer"
                onClick={() => window.open(course.url, '_blank')}
              >
                {/* Course Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <Badge className="absolute top-3 left-3 bg-primary/90 text-white">
                    {course.category}
                  </Badge>
                </div>

                {/* Course Details */}
                <div className="p-4 space-y-3">
                  <h3 className="font-semibold text-lg min-h-[3.5rem] line-clamp-2 group-hover:text-primary transition-colors">
                    {course.title}
                  </h3>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      <span>{course.students}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{course.duration}</span>
                    </div>
                  </div>

                  {/* Enroll Button */}
                  <Button
                    className="w-full group-hover:bg-primary group-hover:text-white transition-all"
                    variant="outline"
                  >
                    Enroll Now
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Learning History Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-6">Your Learning History</h2>
          <Card className="p-8">
            <p className="text-center text-muted-foreground">
              Your completed lessons and activities will appear here
            </p>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default LerneeHistory;
