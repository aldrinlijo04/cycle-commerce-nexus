
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import { Supply } from '@/types';
import { Search, Plus } from 'lucide-react';
import AddSupplyDialog from '@/components/supplies/AddSupplyDialog';

const Supplies: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // Fetch supplies with react-query
  const { data: supplies = [], isLoading } = useQuery({
    queryKey: ['supplies'],
    queryFn: api.getSupplies
  });

  // Filter supplies by search query
  const filteredSupplies = supplies.filter(supply => 
    supply.product?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    supply.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Available Supplies</h1>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add New Supply
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-end">
        <div className="w-full md:w-1/2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search supplies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-10">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSupplies.length > 0 ? (
            filteredSupplies.map((supply) => (
              <Card key={supply.id} className="cc-card">
                <CardHeader>
                  <CardTitle>{supply.product?.name}</CardTitle>
                  <CardDescription>
                    {supply.product?.category?.name}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Quantity:</span>
                      <span className="font-medium">{supply.quantity} {supply.product?.measurementUnit}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Price:</span>
                      <span className="font-medium">${supply.price.toFixed(2)} per {supply.product?.measurementUnit}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Location:</span>
                      <span className="font-medium">{supply.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Created:</span>
                      <span className="font-medium">{new Date(supply.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" size="sm">View Details</Button>
                  <Button size="sm">Request Exchange</Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-10">
              <p>No supplies found.</p>
            </div>
          )}
        </div>
      )}
      
      <AddSupplyDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} />
    </div>
  );
};

export default Supplies;
