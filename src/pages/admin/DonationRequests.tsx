
import React from 'react';
import Layout from '@/components/layout/Layout';
import { useBloodData } from '@/contexts/BloodDataContext';
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
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { useToast } from '@/components/ui/use-toast';
import { CheckCircle, XCircle } from 'lucide-react';

const DonationRequests: React.FC = () => {
  const { donationRequests, approveDonationRequest, rejectDonationRequest } = useBloodData();
  const { toast } = useToast();
  
  // Sort requests by date, newest first
  const sortedRequests = [...donationRequests].sort((a, b) => {
    return new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime();
  });
  
  const handleApprove = (requestId: string, donorName: string) => {
    approveDonationRequest(requestId);
    toast({
      title: "Donation Approved",
      description: `${donorName}'s blood donation has been approved.`,
    });
  };
  
  const handleReject = (requestId: string, donorName: string) => {
    rejectDonationRequest(requestId);
    toast({
      title: "Donation Rejected",
      description: `${donorName}'s blood donation has been rejected.`,
      variant: "destructive"
    });
  };
  
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
    <Layout title="Donation Requests">
      <Card>
        <CardHeader>
          <CardTitle>Blood Donation Requests</CardTitle>
          <CardDescription>
            Review and manage blood donation requests from donors
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sortedRequests.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Donor</TableHead>
                  <TableHead>Blood Group</TableHead>
                  <TableHead>Units</TableHead>
                  <TableHead>Medical Conditions</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedRequests.map((request) => (
                  <TableRow key={request._id}>
                    <TableCell>
                      {format(new Date(request.requestDate), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell>{request.donorName}</TableCell>
                    <TableCell>{request.bloodGroup}</TableCell>
                    <TableCell>{request.units}</TableCell>
                    <TableCell>
                      {request.disease || 'None reported'}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(request.status)}
                    </TableCell>
                    <TableCell>
                      {request.status === 'pending' && (
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-green-600 border-green-600 hover:bg-green-50"
                            onClick={() => handleApprove(request._id, request.donorName)}
                          >
                            <CheckCircle size={16} className="mr-1" />
                            Approve
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 border-red-600 hover:bg-red-50"
                            onClick={() => handleReject(request._id, request.donorName)}
                          >
                            <XCircle size={16} className="mr-1" />
                            Reject
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="py-8 text-center text-muted-foreground">
              <p>No donation requests to display.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </Layout>
  );
};

export default DonationRequests;
