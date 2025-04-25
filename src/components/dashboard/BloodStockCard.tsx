
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BloodStock } from '@/contexts/BloodDataContext';

interface BloodStockCardProps {
  stock: BloodStock;
}

const BloodStockCard: React.FC<BloodStockCardProps> = ({ stock }) => {
  const { bloodGroup, units } = stock;
  
  // Determine color based on units available
  const getStatusColor = (units: number) => {
    if (units <= 2) return 'bg-red-500';
    if (units <= 5) return 'bg-orange-400';
    return 'bg-green-500';
  };

  const colorClass = getStatusColor(units);

  return (
    <Card className="relative overflow-hidden">
      <div className={`absolute top-0 right-0 w-8 h-8 ${colorClass} blood-drop`}></div>
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl font-bold">{bloodGroup}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{units}</div>
        <p className="text-muted-foreground text-sm">Available Units</p>
      </CardContent>
    </Card>
  );
};

export default BloodStockCard;
