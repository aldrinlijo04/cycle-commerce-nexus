
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { api } from '../services/api';
import { Demand } from '../types';
import { Search } from 'lucide-react';

const Demands: React.FC = () => {
  const [demands, setDemands] = useState<Demand[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDemands = async () => {
      setIsLoading(true);
      try {
        const data = await api.getDemands();
        setDemands(data);
      } catch (error) {
        console.error('Error fetching demands:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDemands();
  }, []);

  // Filter demands by search query
  const filteredDemands = demands.filter(demand => 
    demand.product?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    demand.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Active Demands</h1>
        <Button>Add New Demand</Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-end">
        <div className="w-full md:w-1/2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search demands..."
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
          {filteredDemands.length > 0 ? (
            filteredDemands.map((demand) => (
              <Card key={demand.id} className="cc-card">
                <CardHeader>
                  <CardTitle>{demand.product?.name}</CardTitle>
                  <CardDescription>
                    {demand.product?.category?.name}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Quantity Needed:</span>
                      <span className="font-medium">{demand.quantity} {demand.product?.measurementUnit}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Max Price:</span>
                      <span className="font-medium">${demand.maxPrice.toFixed(2)} per {demand.product?.measurementUnit}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Location:</span>
                      <span className="font-medium">{demand.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Created:</span>
                      <span className="font-medium">{new Date(demand.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" size="sm">View Details</Button>
                  <Button size="sm">Offer Supply</Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-10">
              <p>No demands found.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Demands;
