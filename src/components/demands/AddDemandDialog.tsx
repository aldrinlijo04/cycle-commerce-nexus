
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { api } from '@/services/api';
import { useAuth } from '@/context/AuthContext';

const formSchema = z.object({
  productId: z.string(),
  quantity: z.coerce.number().positive({ message: 'Quantity must be positive' }),
  maxPrice: z.coerce.number().positive({ message: 'Max price must be positive' }),
  location: z.string().min(2, { message: 'Location is required' }),
  active: z.boolean().default(true),
});

type AddDemandDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const AddDemandDialog: React.FC<AddDemandDialogProps> = ({ open, onOpenChange }) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  // Fetch products
  const { data: products = [] } = useQuery({
    queryKey: ['products'],
    queryFn: api.getProducts,
  });
  
  // Form definition
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productId: '',
      quantity: 0,
      maxPrice: 0,
      location: '',
      active: true,
    },
  });
  
  // Create demand mutation
  const createDemand = useMutation({
    mutationFn: api.createDemand,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['demands'] });
      toast.success('Demand created successfully');
      form.reset();
      onOpenChange(false);
    },
    meta: {
      onError: (error: Error) => {
        toast.error('Failed to create demand: ' + error.message);
      },
    },
  });
  
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (!user) {
      toast.error('You must be logged in to create a demand');
      return;
    }
    
    createDemand.mutate({
      productId: parseInt(values.productId),
      quantity: values.quantity,
      maxPrice: values.maxPrice,
      location: values.location,
      active: values.active,
      createdBy: user.id,
    });
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Demand</DialogTitle>
          <DialogDescription>
            Create a new demand for products you need.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-2">
            <FormField
              control={form.control}
              name="productId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    value={field.value} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a product" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {products.map((product) => (
                        <SelectItem key={product.id} value={product.id.toString()}>
                          {product.name} ({product.measurementUnit})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity Needed</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="Enter quantity" 
                      {...field}
                      onChange={(e) => field.onChange(e.target.valueAsNumber)} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="maxPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Maximum Price per Unit</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="0.01"
                      placeholder="Enter maximum price per unit" 
                      {...field}
                      onChange={(e) => field.onChange(e.target.valueAsNumber)} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter demand location" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Active</FormLabel>
                    <FormDescription>
                      Make this demand immediately visible to suppliers
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={createDemand.isPending}
              >
                {createDemand.isPending ? 'Creating...' : 'Create Demand'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddDemandDialog;
