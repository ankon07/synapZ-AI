import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement actual login logic
    login('learner', {
      id: '1',
      name: 'Student',
      avatar: undefined,
      preferredName: 'Student'
    });
    navigate('/modules');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-2">
            SynapZ <span className="text-primary">AI</span>
          </h1>
          <p className="text-xl text-muted-foreground">Voice-First Learning Platform</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-end">
            <Button
              type="button"
              variant="link"
              className="p-0 h-auto text-sm"
              onClick={() => navigate('/forgot-password')}
            >
              Forgot Password?
            </Button>
          </div>

          <Button type="submit" className="w-full" size="lg">
            Sign In
          </Button>

          <div className="text-center text-sm">
            <span className="text-muted-foreground">Don't have an account? </span>
            <Button
              type="button"
              variant="link"
              className="p-0 h-auto"
              onClick={() => navigate('/register')}
            >
              Sign Up
            </Button>
          </div>
        </form>

        <div className="mt-8 pt-6 border-t text-center">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => navigate('/modules')}
          >
            Quick Start Demo
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Login;
