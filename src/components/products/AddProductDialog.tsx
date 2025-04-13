
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
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { api } from '@/services/api';
import { useAuth } from '@/context/AuthContext';

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Product name must be at least 2 characters.',
  }),
  description: z.string().min(5, {
    message: 'Description must be at least 5 characters.',
  }),
  categoryId: z.string(),
  measurementUnit: z.string().min(1, {
    message: 'Measurement unit is required.',
  }),
});

type AddProductDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const AddProductDialog: React.FC<AddProductDialogProps> = ({ open, onOpenChange }) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  // Fetch categories
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: api.getCategories,
  });
  
  // Form definition
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      categoryId: '',
      measurementUnit: '',
    },
  });
  
  // Create product mutation
  const createProduct = useMutation({
    mutationFn: api.createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product created successfully');
      form.reset();
      onOpenChange(false);
    },
    meta: {
      onError: (error: Error) => {
        toast.error('Failed to create product: ' + error.message);
      },
    },
  });
  
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (!user) {
      toast.error('You must be logged in to create a product');
      return;
    }
    
    createProduct.mutate({
      name: values.name,
      description: values.description,
      categoryId: parseInt(values.categoryId),
      measurementUnit: values.measurementUnit,
    });
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
          <DialogDescription>
            Create a new product that can be used in supplies and demands.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter product name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Provide a description of the product" 
                      className="resize-none" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    value={field.value} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          {category.name}
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
              name="measurementUnit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Measurement Unit</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., kg, liters, pieces" {...field} />
                  </FormControl>
                  <FormMessage />
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
                disabled={createProduct.isPending}
              >
                {createProduct.isPending ? 'Creating...' : 'Create Product'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddProductDialog;
