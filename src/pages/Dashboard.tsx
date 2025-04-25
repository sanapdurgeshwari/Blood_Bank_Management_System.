import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useBloodData } from '@/contexts/BloodDataContext';
import Layout from '@/components/layout/Layout';
import DataCard from '@/components/dashboard/DataCard';
import BloodStockCard from '@/components/dashboard/BloodStockCard';
import { useToast } from '@/hooks/use-toast';
import {
  Droplet,
  User,
  FileText,
  CheckCircle,
  Clock,
  XCircle,
  Heart,
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { bloodStock, bloodRequests, donationRequests, getUserBloodRequests, getUserDonationRequests } = useBloodData();
  const { toast } = useToast();
  const [userBloodRequests, setUserBloodRequests] = useState([]);
  const [userDonationRequests, setUserDonationRequests] = useState([]);

  const totalDonors = new Set(donationRequests.map(req => req.donorId)).size;
  const totalPatients = new Set(
    bloodRequests
      .filter(req => req.userRole === 'patient')
      .map(req => req.userId)
  ).size;
  
  const totalDonationRequests = donationRequests.length;
  const pendingDonationRequests = donationRequests.filter(req => req.status === 'pending').length;
  const approvedDonationRequests = donationRequests.filter(req => req.status === 'approved').length;
  const rejectedDonationRequests = donationRequests.filter(req => req.status === 'rejected').length;

  const totalBloodRequests = bloodRequests.length;
  const pendingBloodRequests = bloodRequests.filter(req => req.status === 'pending').length;
  const approvedBloodRequests = bloodRequests.filter(req => req.status === 'approved').length;
  const rejectedBloodRequests = bloodRequests.filter(req => req.status === 'rejected').length;

  const totalBloodUnits = bloodStock.reduce((sum, item) => sum + item.units, 0);

  // Get user-specific requests when user or request data changes
  useEffect(() => {
    if (user) {
      if (user.role === 'donor' || user.role === 'patient') {
        // Get user's blood requests
        const requests = getUserBloodRequests(user.id);
        setUserBloodRequests(requests);
        console.log('Dashboard - User blood requests:', requests);
      }
      
      if (user.role === 'donor') {
        // Get donor's donation requests
        const donations = getUserDonationRequests(user.id);
        setUserDonationRequests(donations);
        console.log('Dashboard - User donation requests:', donations);
      }
    }
  }, [user, getUserBloodRequests, getUserDonationRequests, bloodRequests, donationRequests]);

  // Check for approval/rejection status on dashboard load
  useEffect(() => {
    if (!user) return;

    // For non-admin users, show summary of recent approvals/rejections
    if (user.role !== 'admin') {
      // Count recent approvals/rejections
      let recentApprovals = 0;
      let recentRejections = 0;

      // Check blood requests
      userBloodRequests.forEach(req => {
        // Only consider recent requests (last 7 days)
        const requestDate = new Date(req.requestDate);
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        
        if (requestDate >= sevenDaysAgo) {
          if (req.status === 'approved') recentApprovals++;
          if (req.status === 'rejected') recentRejections++;
        }
      });

      // For donors, also check donation requests
      if (user.role === 'donor') {
        userDonationRequests.forEach(req => {
          // Only consider recent requests (last 7 days)
          const requestDate = new Date(req.requestDate);
          const sevenDaysAgo = new Date();
          sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
          
          if (requestDate >= sevenDaysAgo) {
            if (req.status === 'approved') recentApprovals++;
            if (req.status === 'rejected') recentRejections++;
          }
        });
      }

      // Show summary notification for approvals and rejections
      if (recentApprovals > 0 || recentRejections > 0) {
        let message = '';
        if (recentApprovals > 0) {
          message += `${recentApprovals} request${recentApprovals > 1 ? 's' : ''} approved. `;
        }
        if (recentRejections > 0) {
          message += `${recentRejections} request${recentRejections > 1 ? 's' : ''} rejected.`;
        }
        
        toast({
          title: "Recent Request Updates",
          description: message,
          variant: "default",
        });
      }
    }
  }, [user, userBloodRequests, userDonationRequests, toast]);

  // Function to render dashboard content based on user role
  const renderDashboardContent = () => {
    if (!user) return null;

    // Admin dashboard
    if (user.role === 'admin') {
      return (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Blood Stock Overview</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {bloodStock.map((stock) => (
              <BloodStockCard key={stock.bloodGroup} stock={stock} />
            ))}
          </div>

          <h2 className="text-2xl font-bold">System Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <DataCard
              title="Total Blood Units"
              value={totalBloodUnits}
              icon={<Droplet className="h-5 w-5" />}
            />
            <DataCard
              title="Registered Donors"
              value={totalDonors}
              icon={<User className="h-5 w-5" />}
            />
            <DataCard
              title="Registered Patients"
              value={totalPatients}
              icon={<User className="h-5 w-5" />}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <h2 className="text-xl font-bold">Donation Requests</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <DataCard
                  title="Pending Donations"
                  value={pendingDonationRequests}
                  icon={<Clock className="h-5 w-5" />}
                  className="border-l-4 border-yellow-400"
                />
                <DataCard
                  title="Approved Donations"
                  value={approvedDonationRequests}
                  icon={<CheckCircle className="h-5 w-5" />}
                  className="border-l-4 border-green-500"
                />
              </div>
            </div>
            <div className="space-y-4">
              <h2 className="text-xl font-bold">Blood Requests</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <DataCard
                  title="Pending Requests"
                  value={pendingBloodRequests}
                  icon={<Clock className="h-5 w-5" />}
                  className="border-l-4 border-yellow-400"
                />
                <DataCard
                  title="Approved Requests"
                  value={approvedBloodRequests}
                  icon={<CheckCircle className="h-5 w-5" />}
                  className="border-l-4 border-green-500"
                />
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Donor dashboard
    if (user.role === 'donor') {
      return (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">My Donation Activity</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <DataCard
              title="Total Donations"
              value={userDonationRequests.length}
              icon={<Heart className="h-5 w-5 text-blood" />}
            />
            <DataCard
              title="Pending Donations"
              value={userDonationRequests.filter(d => d.status === 'pending').length}
              icon={<Clock className="h-5 w-5 text-yellow-500" />}
            />
            <DataCard
              title="Approved Donations"
              value={userDonationRequests.filter(d => d.status === 'approved').length}
              icon={<CheckCircle className="h-5 w-5 text-green-500" />}
            />
            <DataCard
              title="Rejected Donations"
              value={userDonationRequests.filter(d => d.status === 'rejected').length}
              icon={<XCircle className="h-5 w-5 text-red-500" />}
            />
          </div>

          <h2 className="text-2xl font-bold mt-6">My Blood Requests</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <DataCard
              title="Total Requests"
              value={userBloodRequests.length}
              icon={<FileText className="h-5 w-5 text-blood" />}
            />
            <DataCard
              title="Pending Requests"
              value={userBloodRequests.filter(r => r.status === 'pending').length}
              icon={<Clock className="h-5 w-5 text-yellow-500" />}
            />
            <DataCard
              title="Approved Requests"
              value={userBloodRequests.filter(r => r.status === 'approved').length}
              icon={<CheckCircle className="h-5 w-5 text-green-500" />}
            />
            <DataCard
              title="Rejected Requests"
              value={userBloodRequests.filter(r => r.status === 'rejected').length}
              icon={<XCircle className="h-5 w-5 text-red-500" />}
            />
          </div>
        </div>
      );
    }

    // Patient dashboard
    if (user.role === 'patient') {
      return (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">My Blood Requests</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <DataCard
              title="Total Requests"
              value={userBloodRequests.length}
              icon={<FileText className="h-5 w-5 text-blood" />}
            />
            <DataCard
              title="Pending Requests"
              value={userBloodRequests.filter(r => r.status === 'pending').length}
              icon={<Clock className="h-5 w-5 text-yellow-500" />}
            />
            <DataCard
              title="Approved Requests"
              value={userBloodRequests.filter(r => r.status === 'approved').length}
              icon={<CheckCircle className="h-5 w-5 text-green-500" />}
            />
            <DataCard
              title="Rejected Requests"
              value={userBloodRequests.filter(r => r.status === 'rejected').length}
              icon={<XCircle className="h-5 w-5 text-red-500" />}
            />
          </div>

          <h2 className="text-2xl font-bold mt-6">Available Blood Stock</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {bloodStock.map((stock) => (
              <BloodStockCard key={stock.bloodGroup} stock={stock} />
            ))}
          </div>
        </div>
      );
    }
  };

  return (
    <Layout title="Dashboard">
      {renderDashboardContent()}
    </Layout>
  );
};

export default Dashboard;
