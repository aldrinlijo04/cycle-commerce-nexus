
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { api } from '../services/api';
import { Exchange } from '../types';
import { Badge } from '@/components/ui/badge';

const Exchanges: React.FC = () => {
  const [exchanges, setExchanges] = useState<Exchange[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchExchanges = async () => {
      setIsLoading(true);
      try {
        const data = await api.getExchanges();
        setExchanges(data);
      } catch (error) {
        console.error('Error fetching exchanges:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExchanges();
  }, []);

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
        <Button>Create Exchange</Button>
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
    </div>
  );
};

export default Exchanges;
