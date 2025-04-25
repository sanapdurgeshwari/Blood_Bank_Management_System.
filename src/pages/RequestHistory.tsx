
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useBloodData } from '@/contexts/BloodDataContext';
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

const RequestHistory: React.FC = () => {
  const { user } = useAuth();
  const { getUserBloodRequests, bloodRequests } = useBloodData();
  const { toast } = useToast();
  const [userBloodRequests, setUserBloodRequests] = useState([]);

  // Get user's blood requests if user exists
  useEffect(() => {
    if (user) {
      const requests = getUserBloodRequests(user.id);
      console.log('RequestHistory - User ID:', user.id);
      console.log('RequestHistory - All Blood Requests:', bloodRequests);
      console.log('RequestHistory - Filtered Requests:', requests);
      setUserBloodRequests(requests);
    }
  }, [user, getUserBloodRequests, bloodRequests]);

  // Sort requests by date, newest first
  const sortedRequests = [...userBloodRequests].sort((a, b) => {
    return new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime();
  });

  // Check for recent status changes and show notifications
  useEffect(() => {
    if (!userBloodRequests.length) return;
    
    // Only show notifications for the most recent requests (last 24 hours)
    const recentRequests = userBloodRequests.filter(request => {
      const requestDate = new Date(request.requestDate);
      const oneDayAgo = new Date();
      oneDayAgo.setDate(oneDayAgo.getDate() - 1);
      return requestDate >= oneDayAgo;
    });

    // Show notifications for approved or rejected requests
    recentRequests.forEach(request => {
      if (request.status === 'approved') {
        toast({
          title: "Request Approved",
          description: `Your request for ${request.units} units of ${request.bloodGroup} blood has been approved.`,
          variant: "default",
        });
      } else if (request.status === 'rejected') {
        toast({
          title: "Request Rejected",
          description: `Your request for ${request.units} units of ${request.bloodGroup} blood has been rejected.`,
          variant: "destructive",
        });
      }
    });
    // We run this effect only when userBloodRequests changes
  }, [userBloodRequests, toast]);

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
    <Layout title="Blood Request History">
      <Card>
        <CardHeader>
          <CardTitle>My Blood Request History</CardTitle>
          <CardDescription>
            View the status of all your blood requests
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sortedRequests.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Blood Group</TableHead>
                  <TableHead>Units</TableHead>
                  <TableHead>Reason</TableHead>
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
                      {request.reason}
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
              <p>You haven't made any blood requests yet.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </Layout>
  );
};

export default RequestHistory;
