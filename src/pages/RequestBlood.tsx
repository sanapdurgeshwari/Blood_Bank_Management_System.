
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useBloodData } from '@/contexts/BloodDataContext';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

const RequestBlood: React.FC = () => {
  const { user } = useAuth();
  const { createBloodRequest, bloodGroups, bloodStock } = useBloodData();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [bloodGroup, setBloodGroup] = useState('');
  const [units, setUnits] = useState(1);
  const [reason, setReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const selectedBloodStock = bloodStock.find(stock => stock.bloodGroup === bloodGroup);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to request blood.",
        variant: "destructive"
      });
      return;
    }
    
    if (!bloodGroup) {
      toast({
        title: "Blood Group Required",
        description: "Please select a blood group to request.",
        variant: "destructive"
      });
      return;
    }
    
    if (!reason) {
      toast({
        title: "Reason Required",
        description: "Please provide a reason for your blood request.",
        variant: "destructive"
      });
      return;
    }
    
    // Check if requested units are available in stock
    if (selectedBloodStock && selectedBloodStock.units < units) {
      toast({
        title: "Insufficient Stock",
        description: `Only ${selectedBloodStock.units} units of ${bloodGroup} are available.`,
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      createBloodRequest({
        userId: user.id,
        userName: user.name,
        userRole: user.role,
        bloodGroup,
        units,
        reason,
      });
      
      toast({
        title: "Blood Request Submitted",
        description: "Your blood request has been submitted for approval.",
      });
      
      navigate('/request-history');
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your blood request.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Layout title="Request Blood">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Blood Request Form</CardTitle>
            <CardDescription>
              Submit a request for blood. An admin will review and approve your request.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Your Name</Label>
                <Input
                  id="name"
                  value={user?.name || ''}
                  disabled
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bloodGroup">Blood Group Needed</Label>
                <Select
                  value={bloodGroup}
                  onValueChange={setBloodGroup}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select blood group" />
                  </SelectTrigger>
                  <SelectContent>
                    {bloodGroups.map((group) => (
                      <SelectItem key={group} value={group}>
                        {group}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {bloodGroup && selectedBloodStock && (
                  <p className="text-sm text-muted-foreground">
                    Available: {selectedBloodStock.units} units
                  </p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="units">Units Needed</Label>
                <Input
                  id="units"
                  type="number"
                  min={1}
                  max={selectedBloodStock?.units || 10}
                  value={units}
                  onChange={(e) => setUnits(parseInt(e.target.value))}
                />
                <p className="text-xs text-muted-foreground">
                  1 unit equals approximately 450-500 ml of blood.
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="reason">
                  Reason for Request
                </Label>
                <Textarea
                  id="reason"
                  placeholder="Please explain why you need this blood"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  This information helps the admin prioritize blood requests.
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                type="submit" 
                className="w-full bg-blood hover:bg-blood-dark"
                disabled={isLoading || !bloodGroup || !reason}
              >
                {isLoading ? "Submitting..." : "Submit Blood Request"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </Layout>
  );
};

export default RequestBlood;
