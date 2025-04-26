
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardLayout from "@/components/layout/DashboardLayout";

// Simplified insurance types
const INSURANCE_TYPES = [
  { id: 1, name: "फसल सुरक्षा - Crop Protection", premium: 2000, coverage: 50000 },
  { id: 2, name: "मौसम सुरक्षा - Weather Protection", premium: 3000, coverage: 75000 },
];

const formSchema = z.object({
  insuranceType: z.string().min(1, { message: "कृपया बीमा प्रकार चुनें - Please select insurance type" }),
  cropArea: z.string()
    .min(1, { message: "कृपया खेत का क्षेत्रफल दर्ज करें - Please enter crop area" })
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "क्षेत्रफल एक सकारात्मक संख्या होनी चाहिए - Area must be a positive number",
    }),
});

const Insurance = () => {
  const [selectedInsurance, setSelectedInsurance] = useState<number | null>(null);
  const [userInsurances, setUserInsurances] = useState<any[]>([]);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      insuranceType: "",
      cropArea: "",
    },
  });
  
  useEffect(() => {
    const storedInsurances = localStorage.getItem("agrifin_insurances");
    if (storedInsurances) {
      setUserInsurances(JSON.parse(storedInsurances));
    }
  }, []);
  
  const onInsuranceTypeChange = (value: string) => {
    const insuranceId = parseInt(value, 10);
    setSelectedInsurance(insuranceId);
    form.setValue("insuranceType", value);
  };
  
  const selectedInsuranceType = selectedInsurance
    ? INSURANCE_TYPES.find((insurance) => insurance.id === selectedInsurance)
    : null;
  
  const calculatePremium = () => {
    if (!selectedInsuranceType || !form.getValues("cropArea")) return null;
    
    const cropArea = parseFloat(form.getValues("cropArea"));
    if (isNaN(cropArea) || cropArea <= 0) return null;
    
    return {
      premium: selectedInsuranceType.premium * cropArea,
      coverage: selectedInsuranceType.maxCoverage * cropArea,
    };
  };
  
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const insuranceType = INSURANCE_TYPES.find(
        (ins) => ins.id === parseInt(values.insuranceType, 10)
      );
      
      if (!insuranceType) throw new Error("Invalid insurance type");
      
      const cropArea = parseFloat(values.cropArea);
      const totalPremium = insuranceType.premium * cropArea;
      const policyNumber = "POL-" + Math.random().toString(36).substring(2, 9).toUpperCase();
      
      const newPolicy = {
        id: Math.random().toString(36).substring(2, 9),
        policyNumber,
        insuranceName: insuranceType.name,
        cropArea: values.cropArea,
        premium: totalPremium,
        maxCoverage: insuranceType.coverage * cropArea,
        status: "active",
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000).toISOString(),
      };
      
      const existingPolicies = JSON.parse(localStorage.getItem("agrifin_insurances") || "[]");
      const updatedPolicies = [...existingPolicies, newPolicy];
      localStorage.setItem("agrifin_insurances", JSON.stringify(updatedPolicies));
      setUserInsurances(updatedPolicies);
      
      toast.success("बीमा सफलतापूर्वक खरीदा गया! - Insurance purchased successfully!");
    } catch (error) {
      toast.error("बीमा खरीदने में त्रुटि - Failed to purchase insurance");
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-center">फसल बीमा - Crop Insurance</h1>
        
        {userInsurances.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle className="text-center">बीमा खरीदें - Buy Insurance</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="insuranceType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>बीमा प्रकार - Insurance Type</FormLabel>
                        <Select onValueChange={onInsuranceTypeChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="बीमा प्रकार चुनें - Select insurance type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {INSURANCE_TYPES.map((insurance) => (
                              <SelectItem key={insurance.id} value={insurance.id.toString()}>
                                {insurance.name} - ₹{insurance.premium}/एकड़
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
                    name="cropArea"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>खेत का क्षेत्रफल (एकड़ में) - Crop Area (in acres)</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="क्षेत्रफल दर्ज करें - Enter area" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {selectedInsuranceType && form.getValues("cropArea") && (
                    <div className="p-4 bg-secondary/30 rounded-md">
                      <h3 className="font-semibold mb-2">बीमा विवरण - Insurance Details</h3>
                      <div className="grid grid-cols-2 gap-2">
                        <div>कुल प्रीमियम - Total Premium:</div>
                        <div className="font-semibold text-right">₹{selectedInsuranceType.premium * parseFloat(form.getValues("cropArea"))}</div>
                        <div>कवरेज - Coverage:</div>
                        <div className="font-semibold text-right">₹{selectedInsuranceType.coverage * parseFloat(form.getValues("cropArea"))}</div>
                      </div>
                    </div>
                  )}
                  
                  <Button type="submit" className="w-full">
                    बीमा खरीदें - Buy Insurance
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-center mb-4">मेरा बीमा - My Insurance</h2>
            {userInsurances.map((policy) => (
              <Card key={policy.id}>
                <CardHeader>
                  <CardTitle>{policy.insuranceName}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>पॉलिसी संख्या - Policy Number:</span>
                      <span className="font-medium">{policy.policyNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>क्षेत्रफल - Area:</span>
                      <span className="font-medium">{policy.cropArea} एकड़</span>
                    </div>
                    <div className="flex justify-between">
                      <span>प्रीमियम - Premium:</span>
                      <span className="font-medium">₹{policy.premium}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>कवरेज - Coverage:</span>
                      <span className="font-medium">₹{policy.maxCoverage}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>समाप्ति तिथि - End Date:</span>
                      <span className="font-medium">{new Date(policy.endDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Insurance;
