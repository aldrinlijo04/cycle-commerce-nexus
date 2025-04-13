
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  PackageOpen, 
  Package, 
  ShoppingCart, 
  Truck, 
  Users, 
  Settings 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();
  
  const isAdmin = user?.role === 'admin';
  
  const navItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'Supplies',
      href: '/supplies',
      icon: PackageOpen,
    },
    {
      name: 'Demands',
      href: '/demands',
      icon: ShoppingCart,
    },
    {
      name: 'Exchanges',
      href: '/exchanges',
      icon: Truck,
    },
    {
      name: 'Products',
      href: '/products',
      icon: Package,
    }
  ];
  
  // Admin only menu items
  const adminItems = [
    {
      name: 'Users',
      href: '/users',
      icon: Users,
    },
    {
      name: 'Settings',
      href: '/settings',
      icon: Settings,
    }
  ];
  
  const items = isAdmin 
    ? [...navItems, ...adminItems] 
    : navItems;
  
  return (
    <div className="bg-sidebar h-full min-h-screen w-[220px] md:w-[280px] border-r px-3 py-6 hidden md:block">
      <nav className="flex flex-col gap-2">
        {items.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              location.pathname === item.href 
                ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" 
                : "text-sidebar-foreground"
            )}
          >
            <item.icon className="h-5 w-5" />
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
