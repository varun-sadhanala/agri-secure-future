
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormDescription,
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import DashboardLayout from "@/components/layout/DashboardLayout";

// Mock insurance data
const INSURANCE_TYPES = [
  { id: 1, name: "Drought Protection", coverage: "Insufficient rainfall", premium: 2000, maxCoverage: 50000 },
  { id: 2, name: "Flood Protection", coverage: "Excessive rainfall", premium: 3000, maxCoverage: 75000 },
  { id: 3, name: "Pest Protection", coverage: "Specific pest outbreaks", premium: 1500, maxCoverage: 40000 },
  { id: 4, name: "Comprehensive", coverage: "Multiple risks", premium: 5000, maxCoverage: 100000 },
];

const formSchema = z.object({
  insuranceType: z.string().min(1, { message: "Please select an insurance type" }),
  cropArea: z.string()
    .min(1, { message: "Please enter the crop area" })
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Area must be a positive number",
    }),
  coverageDuration: z.string().min(1, { message: "Please select a coverage duration" }),
});

const Insurance = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedInsuranceType, setSelectedInsuranceType] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [weatherData, setWeatherData] = useState<{rainfall: number; forecast: string} | null>(null);
  const [activeTab, setActiveTab] = useState("buy");
  const [userInsurances, setUserInsurances] = useState<any[]>([]);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      insuranceType: "",
      cropArea: "",
      coverageDuration: "",
    },
  });
  
  useEffect(() => {
    // Load existing insurance policies
    const storedInsurances = localStorage.getItem("agrifin_insurances");
    if (storedInsurances) {
      setUserInsurances(JSON.parse(storedInsurances));
    }
    
    // Simulate loading weather data
    setTimeout(() => {
      // Mock weather data
      setWeatherData({
        rainfall: Math.floor(Math.random() * 400) + 100, // 100-500mm
        forecast: Math.random() > 0.5 ? "Below average rainfall expected" : "Normal rainfall expected",
      });
      setLoading(false);
    }, 1000);
  }, []);
  
  // Update selected insurance type when the form value changes
  const onInsuranceTypeChange = (value: string) => {
    const insuranceId = parseInt(value, 10);
    setSelectedInsuranceType(insuranceId);
    form.setValue("insuranceType", value);
  };
  
  // Get the currently selected insurance
  const selectedInsurance = selectedInsuranceType
    ? INSURANCE_TYPES.find((insurance) => insurance.id === selectedInsuranceType)
    : null;
    
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      console.log("Insurance application values:", values);
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // Find the selected insurance details
      const insuranceDetails = INSURANCE_TYPES.find(
        (ins) => ins.id === parseInt(values.insuranceType, 10)
      );
      
      if (!insuranceDetails) {
        throw new Error("Insurance type not found");
      }
      
      // Calculate total premium based on crop area
      const cropArea = parseFloat(values.cropArea);
      const totalPremium = insuranceDetails.premium * cropArea;
      
      // Generate a random policy number
      const policyNumber = "POL-" + Math.random().toString(36).substring(2, 9).toUpperCase();
      
      // Create new policy
      const newPolicy = {
        id: Math.random().toString(36).substring(2, 9),
        policyNumber,
        ...values,
        insuranceName: insuranceDetails.name,
        premium: totalPremium,
        maxCoverage: insuranceDetails.maxCoverage * cropArea,
        status: "active",
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000).toISOString(), // 6 months
        txHash: "0x" + Math.random().toString(36).substring(2, 15),
      };
      
      // Save policy to localStorage
      const existingPolicies = JSON.parse(localStorage.getItem("agrifin_insurances") || "[]");
      const updatedPolicies = [...existingPolicies, newPolicy];
      localStorage.setItem("agrifin_insurances", JSON.stringify(updatedPolicies));
      
      // Update local state
      setUserInsurances(updatedPolicies);
      
      toast.success("Insurance policy purchased successfully!");
      setActiveTab("policies");
    } catch (error) {
      toast.error("Failed to purchase insurance. Please try again.");
      console.error("Insurance purchase error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Calculate premium based on selected insurance and crop area
  const calculatePremium = () => {
    if (!selectedInsurance || !form.getValues("cropArea")) return null;
    
    const cropArea = parseFloat(form.getValues("cropArea"));
    if (isNaN(cropArea) || cropArea <= 0) return null;
    
    return {
      premium: selectedInsurance.premium * cropArea,
      coverage: selectedInsurance.maxCoverage * cropArea,
    };
  };
  
  const premiumInfo = calculatePremium();
  
  if (loading) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h2 className="text-xl mb-4">Loading insurance options...</h2>
        </div>
      </DashboardLayout>
    );
  }
  
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Crop Insurance</h1>
        <p className="text-muted-foreground">
          Protect your crops against weather risks with smart contract insurance
        </p>
      </div>
      
      {weatherData && weatherData.rainfall < 300 && (
        <Alert className="mb-6 border-amber-500 bg-amber-50 text-amber-800">
          <AlertTitle>Low Rainfall Warning</AlertTitle>
          <AlertDescription>
            Current rainfall levels ({weatherData.rainfall}mm) are below the optimal level. Consider drought protection insurance.
          </AlertDescription>
        </Alert>
      )}
      
      <Tabs defaultValue="buy" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="buy">Buy Insurance</TabsTrigger>
          <TabsTrigger value="policies">My Policies {userInsurances.length > 0 && `(${userInsurances.length})`}</TabsTrigger>
          <TabsTrigger value="claims">Claims History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="buy">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Purchase Crop Insurance</CardTitle>
                  <CardDescription>
                    Choose an insurance plan to protect your crops
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <FormField
                        control={form.control}
                        name="insuranceType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Insurance Type</FormLabel>
                            <Select onValueChange={onInsuranceTypeChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select insurance type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {INSURANCE_TYPES.map((insurance) => (
                                  <SelectItem key={insurance.id} value={insurance.id.toString()}>
                                    {insurance.name} - ₹{insurance.premium}/acre
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            {selectedInsurance && (
                              <FormDescription>
                                Coverage: {selectedInsurance.coverage}
                              </FormDescription>
                            )}
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="cropArea"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Crop Area (acres)</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Enter total crop area" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="coverageDuration"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Coverage Duration</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select coverage duration" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="3months">3 months</SelectItem>
                                <SelectItem value="6months">6 months</SelectItem>
                                <SelectItem value="12months">12 months</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      {premiumInfo && (
                        <div className="mt-6 p-4 bg-secondary/30 rounded-md">
                          <h3 className="font-semibold mb-2">Premium Calculation</h3>
                          <div className="grid grid-cols-2 gap-2">
                            <div>Total Premium:</div>
                            <div className="font-semibold text-right">₹{premiumInfo.premium}</div>
                            <div>Maximum Coverage:</div>
                            <div className="font-semibold text-right">₹{premiumInfo.coverage}</div>
                          </div>
                        </div>
                      )}
                      
                      <Button type="submit" className="mt-4" disabled={isSubmitting}>
                        {isSubmitting ? "Processing..." : "Purchase Insurance"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card className="bg-accent/10">
                <CardHeader>
                  <CardTitle>Weather Risk Assessment</CardTitle>
                  <CardDescription>Current conditions for your area</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Current Rainfall</p>
                      <p className="text-2xl font-bold">
                        {weatherData?.rainfall} mm
                        {weatherData && weatherData.rainfall < 300 && (
                          <span className="text-amber-600 text-sm ml-2">(Below average)</span>
                        )}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-muted-foreground">Seasonal Forecast</p>
                      <p className="font-medium">{weatherData?.forecast}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-muted-foreground">Recommended Insurance</p>
                      <p className="font-medium">
                        {weatherData && weatherData.rainfall < 300 
                          ? "Drought Protection" 
                          : weatherData && weatherData.rainfall > 450
                            ? "Flood Protection"
                            : "Comprehensive Coverage"
                        }
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Insurance Benefits</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                    <p>Smart contract-based automatic payouts</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                    <p>Real-time weather data monitoring</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                    <p>No paperwork for claims</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                    <p>Transparent coverage terms</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="policies">
          {userInsurances.length === 0 ? (
            <div className="text-center py-16">
              <h3 className="text-xl font-medium mb-2">No Insurance Policies Yet</h3>
              <p className="text-muted-foreground mb-6">
                Protect your crops against weather risks by purchasing insurance
              </p>
              <Button onClick={() => setActiveTab("buy")}>Buy Insurance</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userInsurances.map((policy) => (
                <Card key={policy.id} className="overflow-hidden">
                  <div className="insurance-card-gradient p-4 text-white">
                    <h3 className="font-semibold">{policy.insuranceName}</h3>
                    <p className="text-sm opacity-90">Policy #{policy.policyNumber}</p>
                  </div>
                  <CardContent className="pt-4">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Status:</span>
                        <span className="font-medium capitalize">{policy.status}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Area covered:</span>
                        <span className="font-medium">{policy.cropArea} acres</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Premium paid:</span>
                        <span className="font-medium">₹{policy.premium}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Max coverage:</span>
                        <span className="font-medium">₹{policy.maxCoverage}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Start date:</span>
                        <span className="font-medium">{new Date(policy.startDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">End date:</span>
                        <span className="font-medium">{new Date(policy.endDate).toLocaleDateString()}</span>
                      </div>
                      <div className="pt-2 text-xs text-muted-foreground">
                        <p>Blockchain TX: {policy.txHash}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="claims">
          <div className="text-center py-16">
            <h3 className="text-xl font-medium mb-2">No Claims History</h3>
            <p className="text-muted-foreground">
              When weather conditions trigger automatic payouts, they will appear here
            </p>
            <div className="mt-8 p-4 max-w-md mx-auto border rounded-md">
              <h4 className="font-medium mb-2">How Claims Work</h4>
              <p className="text-sm text-muted-foreground mb-4">
                AgriFin uses smart contracts that automatically process claims based on verified weather data:
              </p>
              <ul className="text-sm text-left space-y-2">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0"></div>
                  <span>Weather stations record rainfall, temperature, and other data</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0"></div>
                  <span>Data is verified and sent to our blockchain network</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0"></div>
                  <span>Smart contracts automatically trigger payouts when conditions meet criteria</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0"></div>
                  <span>Funds are transferred directly to your linked account</span>
                </li>
              </ul>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default Insurance;
