
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogOut, Menu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { cn } from '@/lib/utils';

const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full cc-gradient"></div>
            <span className="font-bold text-xl">CommerceCycle</span>
          </Link>
        </div>

        {/* Mobile menu button */}
        {isAuthenticated && (
          <Button 
            variant="ghost" 
            className="md:hidden" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}

        {/* Desktop navigation */}
        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <span>
                Welcome, {user?.companyName} ({user?.role})
              </span>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate('/login')}
              >
                Login
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      <div 
        className={cn(
          "md:hidden w-full border-b", 
          mobileMenuOpen ? "block" : "hidden"
        )}
      >
        <div className="container py-4 flex flex-col gap-2">
          {isAuthenticated && (
            <>
              <span className="block text-sm mb-2">
                Welcome, {user?.companyName}
              </span>
              <Button 
                variant="ghost" 
                size="sm" 
                className="justify-start"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
