
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
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

const DonateBlood: React.FC = () => {
  const { user } = useAuth();
  const { createDonationRequest } = useBloodData();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [units, setUnits] = useState(1);
  const [disease, setDisease] = useState(user?.disease || '');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to donate blood.",
        variant: "destructive"
      });
      return;
    }
    
    if (!user.bloodGroup) {
      toast({
        title: "Blood Group Missing",
        description: "You must specify your blood group to donate.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      createDonationRequest({
        donorId: user.id,
        donorName: user.name,
        bloodGroup: user.bloodGroup,
        units,
        disease,
      });
      
      toast({
        title: "Donation Request Submitted",
        description: "Your blood donation request has been submitted for approval.",
      });
      
      navigate('/donation-history');
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your donation request.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Layout title="Donate Blood">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Blood Donation Request</CardTitle>
            <CardDescription>
              Submit a request to donate blood. An admin will review and approve your donation.
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
                <Label htmlFor="bloodGroup">Blood Group</Label>
                <Input
                  id="bloodGroup"
                  value={user?.bloodGroup || ''}
                  disabled
                />
                {!user?.bloodGroup && (
                  <p className="text-sm text-destructive">
                    Blood group not specified. Update your profile to donate.
                  </p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="units">Units to Donate</Label>
                <Input
                  id="units"
                  type="number"
                  min={1}
                  max={2}
                  value={units}
                  onChange={(e) => setUnits(parseInt(e.target.value))}
                />
                <p className="text-xs text-muted-foreground">
                  1 unit equals approximately 450-500 ml of blood.
                  You can donate up to 2 units.
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="disease">
                  Medical Conditions (if any)
                </Label>
                <Textarea
                  id="disease"
                  placeholder="List any medical conditions or diseases you have, or type 'None'"
                  value={disease}
                  onChange={(e) => setDisease(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  This information is required for blood donation approval.
                  Be honest about your medical history for safety reasons.
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                type="submit" 
                className="w-full bg-blood hover:bg-blood-dark"
                disabled={isLoading || !user?.bloodGroup}
              >
                {isLoading ? "Submitting..." : "Submit Donation Request"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </Layout>
  );
};

export default DonateBlood;
