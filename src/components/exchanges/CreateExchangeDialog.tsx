
import React, { useEffect } from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { api } from '@/services/api';
import { Supply, Demand } from '@/types';
import { useAuth } from '@/context/AuthContext';

const formSchema = z.object({
  supplyId: z.string(),
  demandId: z.string(),
  quantity: z.coerce.number().positive({ message: 'Quantity must be positive' }),
  price: z.coerce.number().positive({ message: 'Price must be positive' }),
});

type CreateExchangeDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialSupplyId?: number;
  initialDemandId?: number;
};

const CreateExchangeDialog: React.FC<CreateExchangeDialogProps> = ({ 
  open, 
  onOpenChange,
  initialSupplyId,
  initialDemandId
}) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  // Fetch supplies and demands
  const { data: supplies = [] } = useQuery({
    queryKey: ['supplies'],
    queryFn: api.getSupplies,
  });
  
  const { data: demands = [] } = useQuery({
    queryKey: ['demands'],
    queryFn: api.getDemands,
  });
  
  // Form definition
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      supplyId: initialSupplyId?.toString() || '',
      demandId: initialDemandId?.toString() || '',
      quantity: 0,
      price: 0,
    },
  });
  
  // Update form when initialSupplyId or initialDemandId changes
  useEffect(() => {
    if (initialSupplyId) {
      form.setValue('supplyId', initialSupplyId.toString());
    }
    if (initialDemandId) {
      form.setValue('demandId', initialDemandId.toString());
    }
  }, [initialSupplyId, initialDemandId, form]);
  
  // Find currently selected supply and demand
  const selectedSupplyId = form.watch('supplyId');
  const selectedDemandId = form.watch('demandId');
  
  const selectedSupply = supplies.find(supply => 
    supply.id.toString() === selectedSupplyId
  );
  
  const selectedDemand = demands.find(demand => 
    demand.id.toString() === selectedDemandId
  );
  
  // Update price when supply changes
  useEffect(() => {
    if (selectedSupply) {
      form.setValue('price', selectedSupply.price);
    }
  }, [selectedSupply, form]);
  
  // Create exchange mutation
  const createExchange = useMutation({
    mutationFn: api.createExchange,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exchanges'] });
      toast.success('Exchange created successfully');
      form.reset();
      onOpenChange(false);
    },
    meta: {
      onError: (error: Error) => {
        toast.error('Failed to create exchange: ' + error.message);
      },
    },
  });
  
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (!user) {
      toast.error('You must be logged in to create an exchange');
      return;
    }
    
    createExchange.mutate({
      supplyId: parseInt(values.supplyId),
      demandId: parseInt(values.demandId),
      quantity: values.quantity,
      price: values.price,
      status: 'pending'
    });
  };
  
  // Check if quantities and prices are compatible
  const isCompatible = () => {
    if (!selectedSupply || !selectedDemand) return false;
    
    // Check if the product matches
    if (selectedSupply.productId !== selectedDemand.productId) {
      return false;
    }
    
    // Check if the supply price is less than or equal to the demand max price
    if (selectedSupply.price > selectedDemand.maxPrice) {
      return false;
    }
    
    return true;
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Exchange</DialogTitle>
          <DialogDescription>
            Create a new exchange between supply and demand.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-2">
            <FormField
              control={form.control}
              name="supplyId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Supply</FormLabel>
                  <Select 
                    onValueChange={(value) => {
                      field.onChange(value);
                      // Reset quantity when supply changes
                      form.setValue('quantity', 0);
                    }} 
                    value={field.value} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a supply" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {supplies.map((supply) => (
                        <SelectItem key={supply.id} value={supply.id.toString()}>
                          {supply.product?.name} - {supply.quantity} {supply.product?.measurementUnit} at ${supply.price}/unit
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
              name="demandId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Demand</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    value={field.value} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a demand" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {demands.map((demand) => (
                        <SelectItem key={demand.id} value={demand.id.toString()}>
                          {demand.product?.name} - {demand.quantity} {demand.product?.measurementUnit} up to ${demand.maxPrice}/unit
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {selectedSupply && selectedDemand && !isCompatible() && (
              <div className="rounded-md bg-yellow-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.485 3.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 3.495zM10 6a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 6zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">Incompatible Exchange</h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <p>The selected supply and demand are not compatible:</p>
                      <ul className="list-disc pl-5 space-y-1 mt-2">
                        {selectedSupply.productId !== selectedDemand.productId && (
                          <li>Different products selected</li>
                        )}
                        {selectedSupply.price > selectedDemand.maxPrice && (
                          <li>Supply price (${selectedSupply.price}) exceeds demand max price (${selectedDemand.maxPrice})</li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Exchange Quantity</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="Enter quantity" 
                      {...field}
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                      disabled={!selectedSupply || !selectedDemand || !isCompatible()}
                      max={selectedSupply && selectedDemand ? 
                        Math.min(selectedSupply.quantity, selectedDemand.quantity) : 0}
                    />
                  </FormControl>
                  {selectedSupply && selectedDemand && isCompatible() && (
                    <p className="text-sm text-muted-foreground">
                      Maximum available: {Math.min(selectedSupply.quantity, selectedDemand.quantity)} {selectedSupply.product?.measurementUnit}
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price per Unit</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="0.01"
                      placeholder="Enter price per unit" 
                      {...field}
                      onChange={(e) => field.onChange(e.target.valueAsNumber)} 
                      disabled={!selectedSupply || !selectedDemand || !isCompatible()}
                    />
                  </FormControl>
                  {selectedSupply && selectedDemand && isCompatible() && (
                    <p className="text-sm text-muted-foreground">
                      Supply price: ${selectedSupply.price} | Max accepted: ${selectedDemand.maxPrice}
                    </p>
                  )}
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
                disabled={createExchange.isPending || !isCompatible()}
              >
                {createExchange.isPending ? 'Creating...' : 'Create Exchange'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateExchangeDialog;
