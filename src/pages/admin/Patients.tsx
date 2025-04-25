
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

const Patients: React.FC = () => {
  const { bloodRequests } = useBloodData();
  
  // Get unique patients (users with role 'patient')
  const patientRequests = bloodRequests.filter(req => req.userRole === 'patient');
  
  // Get unique patients
  const uniquePatients = Array.from(
    new Map(
      patientRequests.map(req => [
        req.userId,
        {
          id: req.userId,
          name: req.userName,
          requestCount: patientRequests.filter(r => r.userId === req.userId).length,
          approvedCount: patientRequests.filter(
            r => r.userId === req.userId && r.status === 'approved'
          ).length
        }
      ])
    ).values()
  );
  
  // Sort patients by name
  const sortedPatients = [...uniquePatients].sort((a, b) => a.name.localeCompare(b.name));
  
  return (
    <Layout title="Registered Patients">
      <Card>
        <CardHeader>
          <CardTitle>Patients</CardTitle>
          <CardDescription>
            View all registered patients in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sortedPatients.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Total Requests</TableHead>
                  <TableHead>Approved Requests</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedPatients.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell className="font-medium">{patient.name}</TableCell>
                    <TableCell>{patient.requestCount}</TableCell>
                    <TableCell>{patient.approvedCount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="py-8 text-center text-muted-foreground">
              <p>No patients registered in the system.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </Layout>
  );
};

export default Patients;
