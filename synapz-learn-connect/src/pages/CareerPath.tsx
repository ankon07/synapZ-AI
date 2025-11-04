import { Search, MessageSquare, ClipboardList, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import MainLayout from '@/components/layout/MainLayout';

const CareerPath = () => {
  const careerTracks = [
    {
      title: 'নিবি Pheview',
      description: 'আমার নিবি আইটিওভাব্দোঙ্কা এহস BITS-ভালো অবহিমন পরান',
      icon: Search,
      action: 'আবালেট করেন দি',
      date: 'মেজ সবিজেবস: 25 জাজেই, 2023',
    },
    {
      title: 'Interview Simulator',
      description: 'করোএমার মঙুন ও লালাবাকম মক ইনিমা পরাখলম করেন',
      icon: MessageSquare,
      buttons: [
        { label: 'ভভীকম', variant: 'outline' as const },
        { label: 'আরা করান', variant: 'outline' as const },
        { label: 'মান গ্রাহাণ', variant: 'outline' as const },
        { label: 'ঢন করান', variant: 'outline' as const },
      ],
    },
    {
      title: 'Readiness Plan',
      description: 'আমাদার লক্ষহার জমা ভাতকি পাথাপনিবন্য পরাখানন মোর',
      icon: ClipboardList,
      action: 'পরিবন্না দেতম',
      date: 'সবর্তা বাক্তছাল: \'আলবামোত\', 2023',
    },
  ];

  const achievements = [
    {
      title: 'Coame Pesting',
      subtitle: 'Stimә lo rrobr, 2023',
      icon: '🦉',
    },
    {
      title: 'Loove Pln',
      subtitle: 'Sign Language আমার পতিপত',
      icon: '🏅',
    },
  ];

  return (
    <MainLayout>
      <div className="p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">কেরিয়ার চোভ</h1>
          <p className="text-lg text-muted-foreground">Your path to employment</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Career Tracks */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-6">Career Tracks</h2>
            
            <div className="space-y-6">
              {careerTracks.map((track, index) => (
                <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                      <track.icon className="w-8 h-8 text-foreground" />
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2">{track.title}</h3>
                      <p className="text-muted-foreground mb-4">{track.description}</p>
                      
                      {track.buttons ? (
                        <div className="grid grid-cols-2 gap-2">
                          {track.buttons.map((btn, btnIndex) => (
                            <Button key={btnIndex} variant={btn.variant} size="sm">
                              {btn.label}
                            </Button>
                          ))}
                        </div>
                      ) : (
                        <div>
                          <Button className="mb-2">{track.action}</Button>
                          {track.date && (
                            <p className="text-sm text-muted-foreground">{track.date}</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Achievements Sidebar */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Achievement</h2>
            
            <div className="space-y-4">
              {achievements.map((achievement, index) => (
                <Card key={index} className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{achievement.icon}</div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{achievement.title}</h3>
                      <p className="text-sm text-muted-foreground">{achievement.subtitle}</p>
                    </div>
                    <span className="text-muted-foreground">›</span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CareerPath;
