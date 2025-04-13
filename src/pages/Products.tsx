
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import { Product, ProductCategory } from '@/types';
import { Search, Plus } from 'lucide-react';
import AddProductDialog from '@/components/products/AddProductDialog';

const Products: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // Fetch products and categories with react-query
  const { data: products = [], isLoading: isLoadingProducts } = useQuery({
    queryKey: ['products'],
    queryFn: api.getProducts
  });
  
  const { data: categories = [], isLoading: isLoadingCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: api.getCategories
  });
  
  // Filter products by search query and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         (product.description?.toLowerCase().includes(searchQuery.toLowerCase()) || false);
    
    const matchesCategory = selectedCategory === 'all' || product.categoryId.toString() === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Products</h1>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add New Product
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-end">
        <div className="w-full md:w-1/2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
        <div className="w-full md:w-1/4">
          <Select
            value={selectedCategory}
            onValueChange={setSelectedCategory}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id.toString()}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {(isLoadingProducts || isLoadingCategories) ? (
        <div className="text-center py-10">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <Card key={product.id} className="cc-card">
                <CardHeader>
                  <CardTitle>{product.name}</CardTitle>
                  <CardDescription>
                    {product.category?.name}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>{product.description}</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Measurement unit: {product.measurementUnit}
                  </p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" size="sm">View Details</Button>
                  <Button size="sm">Use in Exchange</Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-10">
              <p>No products found.</p>
            </div>
          )}
        </div>
      )}
      
      <AddProductDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} />
    </div>
  );
};

export default Products;
