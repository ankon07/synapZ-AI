import { Bell, Globe } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const AppHeader = () => {
  const { user, userProfile } = useAuth();

  const displayName = userProfile?.displayName || user?.displayName || "User";
  const photoURL = userProfile?.photoURL || user?.photoURL || "";
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-card">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Logo */}
        <Link
          to="/modules"
          className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer"
        >
          <div className="flex items-center gap-1.5">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-cyan-500"
            >
              <path
                d="M12 2C10.3431 2 9 3.34315 9 5C9 6.30622 9.83481 7.41746 11 7.82929V9H7C5.34315 9 4 10.3431 4 12C4 13.3062 4.83481 14.4175 6 14.8293V16.1707C4.83481 16.5825 4 17.6938 4 19C4 20.6569 5.34315 22 7 22C8.65685 22 10 20.6569 10 19C10 17.6938 9.16519 16.5825 8 16.1707V14.8293C9.16519 14.4175 10 13.3062 10 12C10 11.4477 10.4477 11 11 11H13V16.1707C11.8348 16.5825 11 17.6938 11 19C11 20.6569 12.3431 22 14 22C15.6569 22 17 20.6569 17 19C17 17.6938 16.1652 16.5825 15 16.1707V11H17C17.5523 11 18 11.4477 18 12C18 13.3062 18.8348 14.4175 20 14.8293V16.1707C18.8348 16.5825 18 17.6938 18 19C18 20.6569 19.3431 22 21 22C22.6569 22 24 20.6569 24 19C24 17.6938 23.1652 16.5825 22 16.1707V14.8293C23.1652 14.4175 24 13.3062 24 12C24 10.3431 22.6569 9 21 9H17V7.82929C18.1652 7.41746 19 6.30622 19 5C19 3.34315 17.6569 2 16 2C14.3431 2 13 3.34315 13 5C13 6.30622 13.8348 7.41746 15 7.82929V9H13C12.4477 9 12 8.55228 12 8V7.82929C13.1652 7.41746 14 6.30622 14 5C14 3.34315 12.6569 2 11 2H12Z"
                fill="currentColor"
              />
            </svg>
            <h1 className="text-xl font-bold tracking-tight">
              <span className="text-cyan-500">S</span>
              <span className="text-gray-900 dark:text-white">YNAPZ</span>
            </h1>
          </div>
        </Link>

        {/* Voice Indicator */}
        <div className="flex-1 flex justify-center">
          <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-muted">
            <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
            <span className="text-sm text-muted-foreground">
              Listening for commands...
            </span>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-3">
          {/* Language Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2">
                <Globe className="w-4 h-4" />
                <span className="text-sm">Bangla / English</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>English</DropdownMenuItem>
              <DropdownMenuItem>বাংলা (Bangla)</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-5 h-5" />
            <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 bg-destructive text-xs">
              1
            </Badge>
          </Button>

          {/* User Profile Button */}
          <Link to="/profile">
            <Button variant="ghost" className="gap-3 px-4 hover:bg-muted">
              <Avatar className="w-8 h-8 border-2 border-primary">
                <AvatarImage src={photoURL} alt={displayName} />
                <AvatarFallback className="text-xs font-semibold bg-gradient-to-br from-primary to-purple-500 text-white">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="text-left">
                <div className="text-sm font-medium">
                  Student: {displayName}
                </div>
              </div>
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
