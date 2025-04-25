
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Home, 
  User, 
  Users, 
  Droplet, 
  FileText, 
  Settings,
  Heart,
  List
} from 'lucide-react';
import { cn } from '@/lib/utils';

const Sidebar: React.FC = () => {
  const { user } = useAuth();

  const renderNavLinks = () => {
    // Common links for all users
    const commonLinks = [
      {
        path: '/',
        icon: <Home className="h-5 w-5" />,
        label: 'Dashboard',
      },
    ];

    // Admin-specific links
    const adminLinks = [
      {
        path: '/donors',
        icon: <Users className="h-5 w-5" />,
        label: 'Donors',
      },
      {
        path: '/patients',
        icon: <User className="h-5 w-5" />,
        label: 'Patients',
      },
      {
        path: '/blood-stock',
        icon: <Droplet className="h-5 w-5" />,
        label: 'Blood Stock',
      },
      {
        path: '/donation-requests',
        icon: <Heart className="h-5 w-5" />,
        label: 'Donation Requests',
      },
      {
        path: '/blood-requests',
        icon: <FileText className="h-5 w-5" />,
        label: 'Blood Requests',
      },
    ];

    // Donor-specific links
    const donorLinks = [
      {
        path: '/donate',
        icon: <Heart className="h-5 w-5" />,
        label: 'Donate Blood',
      },
      {
        path: '/donation-history',
        icon: <List className="h-5 w-5" />,
        label: 'Donation History',
      },
      {
        path: '/request-blood',
        icon: <Droplet className="h-5 w-5" />,
        label: 'Request Blood',
      },
      {
        path: '/request-history',
        icon: <FileText className="h-5 w-5" />,
        label: 'Request History',
      },
    ];

    // Patient-specific links
    const patientLinks = [
      {
        path: '/request-blood',
        icon: <Droplet className="h-5 w-5" />,
        label: 'Request Blood',
      },
      {
        path: '/request-history',
        icon: <FileText className="h-5 w-5" />,
        label: 'Request History',
      },
    ];

    // Return links based on user role
    const roleSpecificLinks = {
      admin: adminLinks,
      donor: donorLinks,
      patient: patientLinks,
    };

    // Get the links based on user role
    const links = [...commonLinks, ...(user ? roleSpecificLinks[user.role] : [])];

    return links.map((link) => (
      <NavLink
        key={link.path}
        to={link.path}
        className={({ isActive }) =>
          cn(
            'flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 transition-all hover:bg-gray-100',
            isActive ? 'bg-blood-light/10 text-blood font-medium' : ''
          )
        }
      >
        {link.icon}
        <span>{link.label}</span>
      </NavLink>
    ));
  };

  return (
    <aside className="w-64 border-r border-gray-200 bg-white">
      <div className="flex h-full flex-col">
        <div className="flex items-center gap-2 p-6 border-b border-gray-200">
          <div className="h-8 w-8 bg-blood rounded-full flex items-center justify-center">
            <Droplet className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-lg">Blood Bank Management</h3>
            {/* <p className="text-xs text-gray-500"></p> */}
          </div>
        </div>
        <nav className="flex-1 overflow-auto py-4 px-3 space-y-1">
          {renderNavLinks()}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
