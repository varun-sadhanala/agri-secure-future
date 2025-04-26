
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import DashboardLayout from "@/components/layout/DashboardLayout";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  aadhaar: z.string().regex(/^\d{12}$/, { message: "Aadhaar number must be 12 digits" }),
  mobile: z.string().regex(/^\d{10}$/, { message: "Mobile number must be 10 digits" }),
  location: z.string().min(2, { message: "Location must be at least 2 characters" }),
  cropType: z.string().min(1, { message: "Please select a crop type" }),
  farmSize: z.string().regex(/^\d+(\.\d+)?$/, { message: "Please enter a valid farm size" }),
  soilType: z.string().optional(),
  irrigationType: z.string().optional(),
});

const Profile = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      aadhaar: "",
      mobile: "",
      location: "",
      cropType: "",
      farmSize: "",
      soilType: "",
      irrigationType: "",
    },
  });

  useEffect(() => {
    // Load user data from localStorage
    const userData = localStorage.getItem("agrifin_user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      
      // Set form default values
      form.reset({
        name: parsedUser.name || "",
        aadhaar: parsedUser.aadhaar || "",
        mobile: parsedUser.mobile || "",
        location: parsedUser.location || "",
        cropType: parsedUser.cropType || "",
        farmSize: parsedUser.farmSize || "",
        soilType: parsedUser.soilType || "",
        irrigationType: parsedUser.irrigationType || "",
      });
    }
    setLoading(false);
  }, [form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      // In a real app, this would be an API call
      console.log("Updated profile values:", values);
      
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Update user data in localStorage
      localStorage.setItem("agrifin_user", JSON.stringify({
        ...user,
        ...values,
        updated: new Date().toISOString(),
      }));
      
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile. Please try again.");
      console.error("Profile update error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[calc(100vh-6rem)]">
          <div className="text-center">
            <h2 className="text-xl font-medium">Loading your profile...</h2>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Your Profile</h1>
        <p className="text-muted-foreground">
          Manage your farmer profile and account information
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Update your profile details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="mobile"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mobile Number</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="aadhaar"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Aadhaar Number</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormDescription>
                            For demonstration purposes only
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Farm Location</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="border-t pt-6 mt-6">
                    <h3 className="text-lg font-medium mb-4">Farm Details</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="cropType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Primary Crop</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select your main crop" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="rice">Rice</SelectItem>
                                <SelectItem value="wheat">Wheat</SelectItem>
                                <SelectItem value="maize">Maize</SelectItem>
                                <SelectItem value="pulses">Pulses</SelectItem>
                                <SelectItem value="cotton">Cotton</SelectItem>
                                <SelectItem value="sugarcane">Sugarcane</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="farmSize"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Farm Size (in acres)</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                      <FormField
                        control={form.control}
                        name="soilType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Soil Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select soil type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="clayey">Clayey</SelectItem>
                                <SelectItem value="loamy">Loamy</SelectItem>
                                <SelectItem value="sandy">Sandy</SelectItem>
                                <SelectItem value="silty">Silty</SelectItem>
                                <SelectItem value="peaty">Peaty</SelectItem>
                                <SelectItem value="chalky">Chalky</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              Helps determine suitable crops and irrigation needs
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="irrigationType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Irrigation Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select irrigation method" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="drip">Drip Irrigation</SelectItem>
                                <SelectItem value="sprinkler">Sprinkler System</SelectItem>
                                <SelectItem value="flood">Flood Irrigation</SelectItem>
                                <SelectItem value="rainfed">Rainfed (No Irrigation)</SelectItem>
                                <SelectItem value="subsurface">Subsurface Irrigation</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  <Button type="submit" className="mt-4" disabled={isSubmitting}>
                    {isSubmitting ? "Saving Changes..." : "Save Changes"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Account Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Member Since</p>
                  <p className="font-medium">{user?.registered ? new Date(user.registered).toLocaleDateString() : "N/A"}</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Active Insurance Policies</p>
                  <p className="font-medium">{JSON.parse(localStorage.getItem("agrifin_insurances") || "[]").length}</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Loan Applications</p>
                  <p className="font-medium">{JSON.parse(localStorage.getItem("agrifin_loans") || "[]").length}</p>
                </div>
                
                <div className="pt-2">
                  <Button variant="outline" className="w-full mb-2">
                    Connect Wallet
                  </Button>
                  <p className="text-xs text-muted-foreground text-center">
                    Connect MetaMask to enable blockchain transactions
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Complete Your Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Adding more details helps us provide better financial options for you
              </p>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span>Personal Information</span>
                  <span className="text-primary">Complete</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Farm Details</span>
                  <span className={form.watch("soilType") ? "text-primary" : "text-muted-foreground"}>
                    {form.watch("soilType") ? "Complete" : "Incomplete"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Wallet Connection</span>
                  <span className="text-muted-foreground">Not Connected</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
