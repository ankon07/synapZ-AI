import {
  Bell,
  Globe,
  Volume2,
  Moon,
  Sun,
  User,
  Lock,
  Palette,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import MainLayout from "@/components/layout/MainLayout";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

const Settings = () => {
  const { user, userProfile } = useAuth();
  const displayName = userProfile?.displayName || user?.displayName || "User";
  const email = userProfile?.email || user?.email || "";
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);
  const [voiceSpeed, setVoiceSpeed] = useState([1]);
  const [fontSize, setFontSize] = useState([16]);

  return (
    <MainLayout>
      <div className="p-8 max-w-4xl mx-auto space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold mb-1">Settings</h1>
          <p className="text-muted-foreground">
            Customize your learning experience
          </p>
        </div>

        {/* Account Settings */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-xl font-semibold">Account Settings</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Full Name</Label>
                <p className="text-sm text-muted-foreground">{displayName}</p>
              </div>
              <Button variant="outline" size="sm">
                Edit
              </Button>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Email</Label>
                <p className="text-sm text-muted-foreground">{email}</p>
              </div>
              <Button variant="outline" size="sm">
                Edit
              </Button>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Password</Label>
                <p className="text-sm text-muted-foreground">••••••••</p>
              </div>
              <Button variant="outline" size="sm">
                <Lock className="w-4 h-4 mr-2" />
                Change
              </Button>
            </div>
          </div>
        </Card>

        {/* Accessibility Settings */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
              <Volume2 className="w-5 h-5 text-secondary" />
            </div>
            <h2 className="text-xl font-semibold">Accessibility</h2>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-base font-medium">Voice Speed</Label>
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground w-12">Slow</span>
                <Slider
                  value={voiceSpeed}
                  onValueChange={setVoiceSpeed}
                  min={0.5}
                  max={2}
                  step={0.1}
                  className="flex-1"
                />
                <span className="text-sm text-muted-foreground w-12 text-right">
                  Fast
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                Current: {voiceSpeed[0]}x
              </p>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label className="text-base font-medium">Font Size</Label>
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground w-12">
                  Small
                </span>
                <Slider
                  value={fontSize}
                  onValueChange={setFontSize}
                  min={12}
                  max={24}
                  step={2}
                  className="flex-1"
                />
                <span className="text-sm text-muted-foreground w-12 text-right">
                  Large
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                Current: {fontSize[0]}px
              </p>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Voice Gender</Label>
                <p className="text-sm text-muted-foreground">
                  Choose voice preference
                </p>
              </div>
              <Select defaultValue="female">
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">
                  High Contrast Mode
                </Label>
                <p className="text-sm text-muted-foreground">
                  Improve visual clarity
                </p>
              </div>
              <Switch />
            </div>
          </div>
        </Card>

        {/* Language & Region */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
              <Globe className="w-5 h-5 text-accent" />
            </div>
            <h2 className="text-xl font-semibold">Language & Region</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">
                  Primary Language
                </Label>
                <p className="text-sm text-muted-foreground">
                  Interface language
                </p>
              </div>
              <Select defaultValue="en">
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="bn">বাংলা (Bangla)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">
                  Learning Language
                </Label>
                <p className="text-sm text-muted-foreground">
                  Language for lessons
                </p>
              </div>
              <Select defaultValue="en">
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="bn">বাংলা (Bangla)</SelectItem>
                  <SelectItem value="both">Both</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Appearance */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
              <Palette className="w-5 h-5 text-purple-600" />
            </div>
            <h2 className="text-xl font-semibold">Appearance</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Dark Mode</Label>
                <p className="text-sm text-muted-foreground">Use dark theme</p>
              </div>
              <Switch checked={darkMode} onCheckedChange={setDarkMode} />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Theme</Label>
                <p className="text-sm text-muted-foreground">
                  Choose color scheme
                </p>
              </div>
              <Select defaultValue="default">
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="sensory">Sensory Friendly</SelectItem>
                  <SelectItem value="high-contrast">High Contrast</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Notifications */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
              <Bell className="w-5 h-5 text-orange-600" />
            </div>
            <h2 className="text-xl font-semibold">Notifications</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">
                  Push Notifications
                </Label>
                <p className="text-sm text-muted-foreground">
                  Receive learning reminders
                </p>
              </div>
              <Switch
                checked={notifications}
                onCheckedChange={setNotifications}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Sound Effects</Label>
                <p className="text-sm text-muted-foreground">
                  Play audio feedback
                </p>
              </div>
              <Switch
                checked={soundEffects}
                onCheckedChange={setSoundEffects}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">
                  Email Notifications
                </Label>
                <p className="text-sm text-muted-foreground">
                  Receive progress updates
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </Card>

        {/* Save Button */}
        <div className="flex gap-4">
          <Button size="lg" className="flex-1">
            Save Changes
          </Button>
          <Button size="lg" variant="outline">
            Reset to Defaults
          </Button>
        </div>
      </div>
    </MainLayout>
  );
};

export default Settings;
