import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { Home, PenTool, User, LogOut, LogIn } from "lucide-react";

interface NavigationProps {
  isAuthenticated: boolean;
  onLogout: () => void;
}

export const Navigation = ({ isAuthenticated, onLogout }: NavigationProps) => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-lg border-b border-primary/20">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="relative">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg glow-subtle transition-glow group-hover:glow-primary"></div>
              <PenTool className="absolute inset-1 w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              BlogTracker
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-4">
            <Button
              variant={isActive("/") ? "neon" : "ghost"}
              size="sm"
              asChild
            >
              <Link to="/">
                <Home className="w-4 h-4" />
                Home
              </Link>
            </Button>

            {isAuthenticated && (
              <>
                <Button
                  variant={isActive("/my-blogs") ? "neon" : "ghost"}
                  size="sm"
                  asChild
                >
                  <Link to="/my-blogs">
                    <User className="w-4 h-4" />
                    My Blogs
                  </Link>
                </Button>

                <Button
                  variant={isActive("/create") ? "neon" : "ghost"}
                  size="sm"
                  asChild
                >
                  <Link to="/create">
                    <PenTool className="w-4 h-4" />
                    Create
                  </Link>
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={onLogout}
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              </>
            )}

            {!isAuthenticated && (
              <Button
                variant="neon"
                size="sm"
                asChild
              >
                <Link to="/auth">
                  <LogIn className="w-4 h-4" />
                  Login
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};