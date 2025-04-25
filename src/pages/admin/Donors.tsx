
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

const Donors: React.FC = () => {
  const { donationRequests } = useBloodData();
  
  // Get unique donors
  const uniqueDonors = Array.from(
    new Map(
      donationRequests.map(req => [
        req.donorId,
        {
          id: req.donorId,
          name: req.donorName,
          bloodGroup: req.bloodGroup,
          lastDonation: req.requestDate,
          disease: req.disease,
          donationCount: donationRequests.filter(
            r => r.donorId === req.donorId && r.status === 'approved'
          ).length
        }
      ])
    ).values()
  );
  
  // Sort donors by name
  const sortedDonors = [...uniqueDonors].sort((a, b) => a.name.localeCompare(b.name));
  
  return (
    <Layout title="Registered Donors">
      <Card>
        <CardHeader>
          <CardTitle>Donors</CardTitle>
          <CardDescription>
            View all registered donors in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sortedDonors.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Blood Group</TableHead>
                  <TableHead>Successful Donations</TableHead>
                  <TableHead>Medical Conditions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedDonors.map((donor) => (
                  <TableRow key={donor.id}>
                    <TableCell className="font-medium">{donor.name}</TableCell>
                    <TableCell>{donor.bloodGroup}</TableCell>
                    <TableCell>{donor.donationCount}</TableCell>
                    <TableCell>{donor.disease || 'None reported'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="py-8 text-center text-muted-foreground">
              <p>No donors registered in the system.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </Layout>
  );
};

export default Donors;
