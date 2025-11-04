import { Mic, Volume2, HelpCircle, Play, Repeat } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import MainLayout from '@/components/layout/MainLayout';

const BdslTranslator = () => {
  const vocabularyGoal = 75;

  const signs = [
    { id: 1, word: 'Tree', icon: '🌳', bangla: 'গাছ' },
    { id: 2, word: 'Book', icon: '📚', bangla: 'বই' },
    { id: 3, word: 'Pen', icon: '🖊️', bangla: 'কলম' },
  ];

  const achievements = [
    { id: 1, icon: '🎯', title: 'Coame Pesting', date: 'Sima lo nrobr, 2023' },
    { id: 2, icon: '🏆', title: 'Loove Pln', subtitle: 'Sign Language ভাষার পরীক্ষণ' },
  ];

  return (
    <MainLayout>
      <div className="p-8 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Sidebar */}
          <div className="space-y-6">
            {/* Student Info */}
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500" />
                <div>
                  <p className="font-semibold">Student: Rohan M</p>
                </div>
              </div>
            </Card>

            {/* Navigation Buttons */}
            <div className="space-y-2">
              <Button variant="ghost" className="w-full justify-start">
                <Volume2 className="w-4 h-4 mr-2" />
                Start Voice Lesson
              </Button>
              <Button className="w-full justify-start bg-secondary hover:bg-secondary/90">
                <span className="mr-2">👁️</span>
                Visual Schedule
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <span className="mr-2">📚</span>
                Lesson History
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <span className="mr-2">💬</span>
                Action History
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <span className="mr-2">⚙️</span>
                Settings
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <span className="mr-2">👨‍👩‍👧</span>
                Parent Dashboard
              </Button>
            </div>

            {/* AI Tutor Guide */}
            <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-blue-200 flex items-center justify-center mb-3">
                  <span className="text-3xl">🤖</span>
                </div>
                <h3 className="font-semibold mb-2">AI Tutor Guide</h3>
                <p className="text-sm text-muted-foreground mb-4">Meet your companion</p>
                <Button className="w-full bg-secondary hover:bg-secondary/90">
                  Hear Guide
                </Button>
              </div>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Page Header with Voice Status */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-1">BdSL Translator - Digital Sign Language</h1>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-muted rounded-lg">
                <Mic className="w-5 h-5 text-primary animate-pulse" />
                <span className="text-sm">Listening to Bangla...</span>
              </div>
            </div>

            {/* Interactive Practice */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Interactive Practice - প্রশিক্ষন করুন</h2>
              
              {/* Quiz Question */}
              <div className="bg-primary/5 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold mb-4">স্বতঃখেলার কেডি</h3>
                <p className="text-muted-foreground mb-4">এই সনিষ্ট এচটি কি?</p>
                
                <div className="grid grid-cols-3 gap-4 mb-4">
                  {signs.map((sign) => (
                    <Button
                      key={sign.id}
                      variant="outline"
                      className="h-24 flex flex-col items-center justify-center gap-2"
                    >
                      <span className="text-3xl">{sign.icon}</span>
                      <span className="text-sm">{sign.word}</span>
                      <span className="text-xs text-muted-foreground">({sign.bangla})</span>
                    </Button>
                  ))}
                </div>
                
                <Button className="w-full">Submit Answer</Button>
              </div>

              {/* Live Captioning */}
              <div className="space-y-3">
                <h3 className="font-semibold">Live Captioning - স্বাক্ষর ক্যপশন</h3>
                <div className="bg-muted rounded-lg p-4">
                  <p className="text-sm mb-2">
                    খেলক: "হয়ন আবার সাল, "ই-এ" সানামী কোমান?
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Repeat className="w-4 h-4 mr-2" />
                    Repeat
                  </Button>
                  <Button variant="outline" size="sm">
                    এখনি কারুন
                  </Button>
                </div>
              </div>
            </Card>

            {/* Sign Language Practice */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Start Signing Practice</h3>
                <Button variant="outline" size="sm">
                  <Mic className="w-4 h-4 mr-2 text-red-500" />
                  বান্ধব
                </Button>
              </div>
              <Button variant="outline" className="w-full" size="lg">
                <HelpCircle className="w-5 h-5 mr-2" />?
              </Button>
            </Card>

            {/* 3D Avatar Display */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">
                আজ তোরায় নতন সংখ্য প্রিপন এখং সুমিন লায়ুবিছাহ প্রপাশিল করব।
              </h2>
              
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-8 flex items-center justify-center mb-4">
                {/* 3D Avatar Placeholder */}
                <div className="w-64 h-64 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-48 h-48 mx-auto mb-4 rounded-lg bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center">
                      <span className="text-6xl">🧑</span>
                    </div>
                    <p className="text-sm text-muted-foreground">3D Sign Language Avatar</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Bottom Section - Today's Lectures & Achievements */}
        <div className="grid lg:grid-cols-2 gap-6 mt-6">
          {/* Today's Lectures */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Today's Lectures</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center">
                    <Progress value={vocabularyGoal} className="w-12 h-12" />
                  </div>
                  <div>
                    <p className="font-medium">{vocabularyGoal}%</p>
                    <p className="text-sm text-muted-foreground">ভূকজাবলার লোথো</p>
                    <p className="text-xs text-muted-foreground">Vocabulary Goal</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="bg-purple-100">
                  <span className="mr-1">🎨</span>
                </Badge>
                <Badge variant="secondary" className="bg-red-100">
                  <span className="mr-1">📱</span>
                </Badge>
                <Badge variant="secondary" className="bg-blue-100">
                  <span className="mr-1">💬</span>
                </Badge>
                <Badge variant="secondary" className="bg-yellow-100">
                  <span className="mr-1">💡</span>
                </Badge>
                <Badge variant="secondary" className="bg-green-100">
                  <span className="mr-1">🎯</span>
                </Badge>
                <Badge variant="secondary" className="bg-purple-100">
                  <span className="mr-1">🎪</span>
                </Badge>
              </div>
            </div>
          </Card>

          {/* Achievements */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Achievements</h3>
            <div className="space-y-4">
              {achievements.map((achievement) => (
                <div key={achievement.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-2xl">
                    {achievement.icon}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{achievement.title}</p>
                    {achievement.subtitle && (
                      <p className="text-xs text-muted-foreground">{achievement.subtitle}</p>
                    )}
                    {achievement.date && (
                      <p className="text-xs text-muted-foreground">{achievement.date}</p>
                    )}
                  </div>
                  <Button variant="ghost" size="sm">
                    →
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default BdslTranslator;
