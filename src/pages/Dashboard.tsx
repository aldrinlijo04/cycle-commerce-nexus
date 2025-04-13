
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { api } from '../services/api';
import { Exchange, Product, Supply, Demand } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { PackageOpen, ShoppingCart, RefreshCw, Package } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [supplies, setSupplies] = useState<Supply[]>([]);
  const [demands, setDemands] = useState<Demand[]>([]);
  const [exchanges, setExchanges] = useState<Exchange[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [productsData, suppliesData, demandsData, exchangesData] = await Promise.all([
          api.getProducts(),
          api.getSupplies(),
          api.getDemands(),
          api.getExchanges()
        ]);
        
        setProducts(productsData);
        setSupplies(suppliesData);
        setDemands(demandsData);
        setExchanges(exchangesData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Generate chart data - in a real app, this would be actual time-series data
  const chartData = [
    { name: 'Jan', exchanges: 4, supplies: 8, demands: 7 },
    { name: 'Feb', exchanges: 3, supplies: 12, demands: 10 },
    { name: 'Mar', exchanges: 7, supplies: 15, demands: 9 },
    { name: 'Apr', exchanges: 9, supplies: 18, demands: 15 },
    { name: 'May', exchanges: 11, supplies: 20, demands: 17 },
    { name: 'Jun', exchanges: 14, supplies: 25, demands: 20 },
    { name: 'Jul', exchanges: 16, supplies: 30, demands: 24 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.length}</div>
            <p className="text-xs text-muted-foreground">Available in the marketplace</p>
          </CardContent>
          <CardFooter>
            <Button size="sm" variant="outline" onClick={() => navigate('/products')}>View all</Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Supplies</CardTitle>
            <PackageOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{supplies.length}</div>
            <p className="text-xs text-muted-foreground">Available for exchange</p>
          </CardContent>
          <CardFooter>
            <Button size="sm" variant="outline" onClick={() => navigate('/supplies')}>View all</Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Demands</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{demands.length}</div>
            <p className="text-xs text-muted-foreground">Active requests</p>
          </CardContent>
          <CardFooter>
            <Button size="sm" variant="outline" onClick={() => navigate('/demands')}>View all</Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Exchanges</CardTitle>
            <RefreshCw className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{exchanges.length}</div>
            <p className="text-xs text-muted-foreground">Completed exchanges</p>
          </CardContent>
          <CardFooter>
            <Button size="sm" variant="outline" onClick={() => navigate('/exchanges')}>View all</Button>
          </CardFooter>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Activity Overview</CardTitle>
          <CardDescription>Marketplace activity over time</CardDescription>
        </CardHeader>
        <CardContent className="px-2">
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="supplies" stackId="1" stroke="#1E88E5" fill="#1E88E5" />
                <Area type="monotone" dataKey="demands" stackId="2" stroke="#43A047" fill="#43A047" />
                <Area type="monotone" dataKey="exchanges" stackId="3" stroke="#FFC107" fill="#FFC107" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Exchanges</CardTitle>
            <CardDescription>Latest completed transactions</CardDescription>
          </CardHeader>
          <CardContent>
            {exchanges.length > 0 ? (
              <div className="space-y-4">
                {exchanges.slice(0, 3).map((exchange) => (
                  <div key={exchange.id} className="border-b pb-2 last:border-0">
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium">
                          {exchange.supply?.product?.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Qty: {exchange.quantity}, Price: ${exchange.price.toFixed(2)}
                        </p>
                      </div>
                      <div className="text-sm text-right">
                        <span className="inline-block px-2 py-1 rounded-full bg-secondary/10 text-secondary">
                          {exchange.status}
                        </span>
                        <p className="text-muted-foreground mt-1">
                          {new Date(exchange.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No exchanges yet</p>
            )}
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" onClick={() => navigate('/exchanges')}>View all exchanges</Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
            <CardDescription>Most exchanged materials</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {products.slice(0, 3).map((product) => (
                <div key={product.id} className="border-b pb-2 last:border-0">
                  <p className="font-medium">
                    {product.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Category: {product.category?.name}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" onClick={() => navigate('/products')}>View all products</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
