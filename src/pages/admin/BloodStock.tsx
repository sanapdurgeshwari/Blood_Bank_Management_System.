
import React, { useState } from 'react';
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
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Edit } from 'lucide-react';

const BloodStock: React.FC = () => {
  const { bloodStock, updateBloodStock } = useBloodData();
  const { toast } = useToast();
  
  const [editingGroup, setEditingGroup] = useState<string | null>(null);
  const [editedUnits, setEditedUnits] = useState<number>(0);
  
  const handleEdit = (bloodGroup: string, currentUnits: number) => {
    setEditingGroup(bloodGroup);
    setEditedUnits(currentUnits);
  };
  
  const handleSave = (bloodGroup: string) => {
    // Calculate the change in units
    const currentStock = bloodStock.find(stock => stock.bloodGroup === bloodGroup);
    if (!currentStock) return;
    
    const change = editedUnits - currentStock.units;
    
    // Update the blood stock
    updateBloodStock(bloodGroup, change);
    
    toast({
      title: "Blood Stock Updated",
      description: `${bloodGroup} stock has been updated to ${editedUnits} units.`,
    });
    
    setEditingGroup(null);
  };
  
  const handleCancel = () => {
    setEditingGroup(null);
  };
  
  return (
    <Layout title="Blood Stock Management">
      <Card>
        <CardHeader>
          <CardTitle>Blood Stock Inventory</CardTitle>
          <CardDescription>
            Manage and update the available units of each blood group
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Blood Group</TableHead>
                <TableHead>Available Units</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bloodStock.map((stock) => (
                <TableRow key={stock.bloodGroup}>
                  <TableCell className="font-medium">{stock.bloodGroup}</TableCell>
                  <TableCell>
                    {editingGroup === stock.bloodGroup ? (
                      <Input
                        type="number"
                        value={editedUnits}
                        onChange={(e) => setEditedUnits(parseInt(e.target.value) || 0)}
                        min={0}
                        className="w-24"
                      />
                    ) : (
                      stock.units
                    )}
                  </TableCell>
                  <TableCell>
                    {editingGroup === stock.bloodGroup ? (
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleSave(stock.bloodGroup)}
                        >
                          Save
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={handleCancel}
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(stock.bloodGroup, stock.units)}
                      >
                        <Edit size={16} className="mr-1" />
                        Edit
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </Layout>
  );
};

export default BloodStock;
