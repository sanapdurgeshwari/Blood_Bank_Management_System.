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
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, XCircle } from 'lucide-react';

const BloodRequests: React.FC = () => {
  const { bloodRequests, approveBloodRequest, rejectBloodRequest, bloodStock } = useBloodData();
  const { toast } = useToast();
  
  // Sort requests by date, newest first
  const sortedRequests = [...bloodRequests].sort((a, b) => {
    return new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime();
  });
  
  const handleApprove = (requestId: string, userName: string, bloodGroup: string, units: number) => {
    // Check if there's enough blood stock
    const currentStock = bloodStock.find(stock => stock.bloodGroup === bloodGroup);
    if (!currentStock || currentStock.units < units) {
      toast({
        title: "Insufficient Stock",
        description: `Not enough ${bloodGroup} units available for this request.`,
        variant: "destructive"
      });
      return;
    }
    
    approveBloodRequest(requestId)
      .then(() => {
        toast({
          title: "Request Approved",
          description: `${userName}'s blood request has been approved.`,
        });
      })
      .catch(err => {
        toast({
          title: "Error Approving Request",
          description: err.message || "An error occurred while approving the request.",
          variant: "destructive"
        });
      });
  };
  
  const handleReject = (requestId: string, userName: string) => {
    rejectBloodRequest(requestId)
      .then(() => {
        toast({
          title: "Request Rejected",
          description: `${userName}'s blood request has been rejected.`,
          variant: "destructive"
        });
      })
      .catch(err => {
        toast({
          title: "Error",
          description: err.message || "An error occurred while rejecting the request.",
          variant: "destructive"
        });
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
  
  const getUserTypeBadge = (userRole: string) => {
    switch (userRole) {
      case 'donor':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-300">Donor</Badge>;
      case 'patient':
        return <Badge className="bg-purple-100 text-purple-800 border-purple-300">Patient</Badge>;
      default:
        return <Badge>{userRole}</Badge>;
    }
  };
  
  return (
    <Layout title="Blood Requests">
      <Card>
        <CardHeader>
          <CardTitle>Blood Requests</CardTitle>
          <CardDescription>
            Review and manage blood requests from donors and patients
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sortedRequests.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Requester</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Blood Group</TableHead>
                  <TableHead>Units</TableHead>
                  <TableHead>Reason</TableHead>
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
                    <TableCell>{request.userName}</TableCell>
                    <TableCell>{getUserTypeBadge(request.userRole)}</TableCell>
                    <TableCell>{request.bloodGroup}</TableCell>
                    <TableCell>{request.units}</TableCell>
                    <TableCell>
                      {request.reason}
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
                            onClick={() => handleApprove(
                              request._id, 
                              request.userName,
                              request.bloodGroup,
                              request.units
                            )}
                          >
                            <CheckCircle size={16} className="mr-1" />
                            Approve
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 border-red-600 hover:bg-red-50"
                            onClick={() => handleReject(request._id, request.userName)}
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
              <p>No blood requests to display.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </Layout>
  );
};

export default BloodRequests;