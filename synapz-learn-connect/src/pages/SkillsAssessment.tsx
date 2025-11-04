import { Search, FileText, MessageSquare, ClipboardCheck, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import MainLayout from '@/components/layout/MainLayout';

const SkillsAssessment = () => {
  const careerTracks = [
    {
      title: 'Digital Literacy',
      color: 'bg-track-blue',
      textColor: 'text-white',
      progress: 'শুরু করেন',
      icon: '💻',
    },
    {
      title: 'Customer Support Basics',
      color: 'bg-track-green',
      textColor: 'text-white',
      progress: null,
      progressBar: 60,
      icon: '🎧',
    },
    {
      title: 'Customer Support Basics',
      color: 'bg-track-orange',
      textColor: 'text-white',
      progress: 'শুরু করেন',
      icon: '🎧',
    },
    {
      title: 'Data Labeling',
      color: 'bg-track-purple',
      textColor: 'text-white',
      progress: 'শুরু করেন',
      icon: '⌨️',
    },
    {
      title: 'Data Labeling & QA',
      color: 'bg-track-pink',
      textColor: 'text-white',
      progress: 'শুরু করেন',
      icon: '🔍',
    },
    {
      title: 'Accessibility Testing',
      color: 'bg-track-purple',
      textColor: 'text-white',
      progress: 'শুরু করেন',
      icon: '♿',
    },
  ];

  const badges = [
    { icon: '👂', date: 'অভিষ্ট: 15 আবার, 2023', color: 'bg-gray-300' },
    { icon: '⌨️', text: 'বাংলা টাইপিং পরিশ্রান প্রাপ্ত', color: 'bg-badge-bronze' },
    { icon: '🙌', date: 'অভিষ্ট: 02 আগস্ত, 2023', color: 'bg-badge-bronze' },
    { icon: '🏆', text: 'Sign Language Level 1', date: 'মন্তব্য 20 জুন, 2023', color: 'bg-badge-gold' },
  ];

  return (
    <MainLayout>
      <div className="p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">দক্ষতা ও মূল্যায়ন</h1>
          <p className="text-lg text-muted-foreground">আপনি প্রপুর্ববর্তী টাক করেন ও খাজ ও প্রখন করেন!</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Career Tracks */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-6">Career Tracks</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {careerTracks.map((track, index) => (
                <Card 
                  key={index}
                  className={`${track.color} ${track.textColor} p-6 border-none hover:scale-105 transition-transform`}
                >
                  <div className="flex flex-col h-full">
                    <div className="text-4xl mb-3">{track.icon}</div>
                    <h3 className="text-lg font-semibold mb-4">{track.title}</h3>
                    
                    {track.progressBar ? (
                      <div className="mt-auto">
                        <div className="w-full h-2 bg-white/30 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-white rounded-full"
                            style={{ width: `${track.progressBar}%` }}
                          />
                        </div>
                      </div>
                    ) : (
                      <Button 
                        variant="secondary" 
                        className="mt-auto bg-white/20 hover:bg-white/30 text-white border-none"
                      >
                        {track.progress}
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
            </div>

            {/* New Assessment Button */}
            <div className="mt-6 flex justify-center">
              <Button size="lg" className="px-8">
                নতুন অ্যাসেসমেন্ট শুরু করুন
              </Button>
            </div>
          </div>

          {/* Earned Badges */}
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">Your Earned Badges</h2>
              <p className="text-muted-foreground">আপনার ক্ষর্তা পথান করেন।</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {badges.map((badge, index) => (
                <Card key={index} className="p-4 flex flex-col items-center text-center">
                  <div className={`w-20 h-20 rounded-full ${badge.color} flex items-center justify-center text-3xl mb-3`}>
                    {badge.icon}
                  </div>
                  {badge.text && (
                    <p className="text-xs font-medium mb-1">{badge.text}</p>
                  )}
                  {badge.date && (
                    <p className="text-xs text-muted-foreground">{badge.date}</p>
                  )}
                </Card>
              ))}
            </div>

            <Button variant="link" className="w-full mt-4">
              সকল খাজ দেখুন
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default SkillsAssessment;
