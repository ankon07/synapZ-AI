import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { TrendingUp, Clock, Award, MessageSquare, Lightbulb } from 'lucide-react';

const ParentDashboard = () => {
  const { userProfile, logout } = useAuth();

  const weeklyStats = [
    { label: 'Focus Time', value: '45 min', icon: Clock, color: 'text-primary' },
    { label: 'Skills Mastered', value: '3', icon: Award, color: 'text-accent' },
    { label: 'Communication Attempts', value: '+12%', icon: MessageSquare, color: 'text-secondary' },
  ];

  const suggestions = [
    'This week, try practicing greetings. Here is a social story you can read together.',
    'Alex shows strong interest in patterns - consider introducing basic coding concepts.',
    'Great progress on morning routine! Consider adding one more step this week.',
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between animate-gentle-fade-in">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Welcome back, {userProfile?.name}
            </h1>
            <p className="text-lg text-muted-foreground">Here's how Alex is progressing</p>
          </div>
          <Button variant="outline" onClick={logout}>
            Exit
          </Button>
        </div>

        {/* Weekly Stats */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-primary" />
            This Week's Progress
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {weeklyStats.map((stat, index) => (
              <Card
                key={index}
                className="p-6 border-2 border-border animate-gentle-scale"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                    <stat.icon className={`w-8 h-8 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                    <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* AI Suggestions */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
            <Lightbulb className="w-6 h-6 text-accent" />
            Suggestions for Home
          </h2>
          <div className="space-y-4">
            {suggestions.map((suggestion, index) => (
              <Card
                key={index}
                className="p-6 border-2 border-accent/20 bg-accent/5 animate-gentle-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <p className="text-base text-foreground leading-relaxed">{suggestion}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Activities */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-6">Recent Activities</h2>
          <Card className="p-6 border-2 border-border">
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-border">
                <div>
                  <p className="font-semibold text-foreground">Conversation Practice</p>
                  <p className="text-sm text-muted-foreground">Completed 10 minutes ago</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-accent font-semibold">Great job!</p>
                  <p className="text-xs text-muted-foreground">5/5 responses</p>
                </div>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-border">
                <div>
                  <p className="font-semibold text-foreground">Word Practice</p>
                  <p className="text-sm text-muted-foreground">Completed 2 hours ago</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-primary font-semibold">Well done!</p>
                  <p className="text-xs text-muted-foreground">8/10 correct</p>
                </div>
              </div>
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-semibold text-foreground">Morning Routine</p>
                  <p className="text-sm text-muted-foreground">Completed today at 8:30 AM</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-accent font-semibold">Perfect!</p>
                  <p className="text-xs text-muted-foreground">All steps completed</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ParentDashboard;
