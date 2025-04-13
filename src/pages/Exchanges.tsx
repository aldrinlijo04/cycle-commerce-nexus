
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';
import { Exchange } from '../types';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';
import CreateExchangeDialog from '@/components/exchanges/CreateExchangeDialog';

const Exchanges: React.FC = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  // Fetch exchanges with react-query
  const { data: exchanges = [], isLoading } = useQuery({
    queryKey: ['exchanges'],
    queryFn: api.getExchanges
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Exchanges</h1>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Exchange
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Exchange History</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-10">Loading...</div>
          ) : (
            <Table>
              <TableCaption>A list of all exchanges</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {exchanges.length > 0 ? (
                  exchanges.map((exchange) => (
                    <TableRow key={exchange.id}>
                      <TableCell className="font-medium">{exchange.id}</TableCell>
                      <TableCell>{exchange.supply?.product?.name}</TableCell>
                      <TableCell>{exchange.quantity} {exchange.supply?.product?.measurementUnit}</TableCell>
                      <TableCell>${exchange.price.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getStatusColor(exchange.status)}>
                          {exchange.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(exchange.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm">View</Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">
                      No exchanges found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button variant="outline" size="sm">Export Report</Button>
        </CardFooter>
      </Card>
      
      <CreateExchangeDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} />
    </div>
  );
};

export default Exchanges;
