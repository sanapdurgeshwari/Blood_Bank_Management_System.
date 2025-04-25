
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useBloodData, DonationRequest } from '@/contexts/BloodDataContext';
import Layout from '@/components/layout/Layout';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

const DonationHistory: React.FC = () => {
  const { user } = useAuth();
  const { getUserDonationRequests, donationRequests, loading } = useBloodData();
  const { toast } = useToast();
  const [userDonationRequests, setUserDonationRequests] = useState<DonationRequest[]>([]);

  // Get user's donation requests if user exists and whenever donationRequests changes
  useEffect(() => {
    if (user) {
      const requests = getUserDonationRequests(user.id);
      console.log('DonationHistory - User ID:', user.id);
      console.log('DonationHistory - All Donation Requests:', donationRequests);
      console.log('DonationHistory - Filtered Requests:', requests);
      setUserDonationRequests(requests);
    }
  }, [user, getUserDonationRequests, donationRequests]);

  // Sort requests by date, newest first
  const sortedRequests = [...userDonationRequests].sort((a, b) => {
    return new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime();
  });

  // Check for recent status changes and show notifications
  useEffect(() => {
    if (!userDonationRequests.length) return;
    
    // Only show notifications for the most recent requests (last 24 hours)
    const recentRequests = userDonationRequests.filter(request => {
      const requestDate = new Date(request.requestDate);
      const oneDayAgo = new Date();
      oneDayAgo.setDate(oneDayAgo.getDate() - 1);
      return requestDate >= oneDayAgo;
    });

    // Show notifications for approved or rejected requests
    recentRequests.forEach(request => {
      if (request.status === 'approved') {
        toast({
          title: "Donation Approved",
          description: `Your donation of ${request.units} units of ${request.bloodGroup} blood has been approved.`,
          variant: "default",
        });
      } else if (request.status === 'rejected') {
        toast({
          title: "Donation Rejected",
          description: `Your donation of ${request.units} units of ${request.bloodGroup} blood has been rejected.`,
          variant: "destructive",
        });
      }
    });
    // We run this effect only when userDonationRequests changes
  }, [userDonationRequests, toast]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">Pending</Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">Approved</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Layout title="Donation History">
      <Card>
        <CardHeader>
          <CardTitle>My Blood Donation History</CardTitle>
          <CardDescription>
            View the status of all your blood donation requests
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            // Show loading skeleton
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-full" />
                </div>
              ))}
            </div>
          ) : sortedRequests.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Blood Group</TableHead>
                  <TableHead>Units</TableHead>
                  <TableHead>Medical Conditions</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedRequests.map((request) => (
                  <TableRow key={request._id}>
                    <TableCell>
                      {format(new Date(request.requestDate), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell>{request.bloodGroup}</TableCell>
                    <TableCell>{request.units}</TableCell>
                    <TableCell>
                      {request.disease || 'None reported'}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(request.status)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="py-8 text-center text-muted-foreground">
              <p>You haven't made any donation requests yet.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </Layout>
  );
};

export default DonationHistory;
