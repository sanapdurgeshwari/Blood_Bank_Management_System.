import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useBloodData } from '@/contexts/BloodDataContext';
import { Loader } from 'lucide-react';

const Index = () => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { refreshData } = useBloodData();
  const navigate = useNavigate();

  useEffect(() => {
    const handleInitialLoad = async () => {
      if (!authLoading) {
        if (isAuthenticated) {
          // Refresh data when authenticated
          await refreshData();
          navigate('/dashboard');
        } else {
          navigate('/login');
        }
      }
    };

    handleInitialLoad();
  }, [isAuthenticated, authLoading, navigate, refreshData]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <div className="flex items-center justify-center h-12 w-12 mb-4">
        <Loader className="h-12 w-12 text-blood animate-spin" />
      </div>
      <p className="text-gray-600 font-medium">Loading application...</p>
      <p className="text-sm text-gray-500 mt-2">Please wait while we prepare your dashboard</p>
    </div>
  );
};

export default Index;